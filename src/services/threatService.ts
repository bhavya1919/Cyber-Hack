import { supabase } from "../lib/supabase";
import { Threat } from "../core/store/dashboardTypes";

export const threatService = {
  async fetchThreats(limit = 50): Promise<Threat[]> {
    const { data, error } = await supabase
      .from("threats")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching threats:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      // Map DB value 'medium' back to frontend value 'med'
      severity: (row.severity === 'medium' ? 'med' : row.severity) as any,
      category: row.category,
      sourceCountry: row.source_country,
      targetCountry: row.target_country,
      targetIndustry: row.target_industry,
      sector: row.target_industry, // UI fallback
      attackVector: row.attack_vector,
      affectedAssets: row.affected_assets || [],
      status: row.status,
      confidence: row.confidence,
      attackerActor: row.attacker_actor,
      summary: row.summary,
      time: new Date(row.created_at).toTimeString().split(" ")[0],
    } as any));
  },

  async saveThreat(threat: Partial<Threat>): Promise<string | null> {
    const severityMap: Record<string, string> = {
      crit: "crit",
      critical: "crit",
      high: "high",
      medium: "medium",
      med: "medium",
      low: "low",
    };
    const dbSeverity = severityMap[String(threat.severity).toLowerCase()] ?? "medium";

    console.log("Saving threat", {
      severity: dbSeverity,
      original_severity: threat.severity,
      category: threat.category,
      status: threat.status,
      summary: threat.summary,
    });

    // Never send the frontend mock id (t-xxxx) to the DB.
    // Let Supabase generate a real UUID and return it.
    const { data, error } = await supabase
      .from("threats")
      .insert({
        // Map frontend severity 'med' → DB value 'medium'
        severity: dbSeverity,
        category: threat.category,
        source_country: threat.sourceCountry,
        target_country: threat.targetCountry,
        target_industry: threat.targetIndustry || threat.sector,
        attack_vector: threat.attackVector,
        affected_assets: threat.affectedAssets,
        status: threat.status,
        confidence: threat.confidence,
        attacker_actor: threat.attackerActor,
        summary: threat.summary || "Threat activity detected. Analysis in progress.",
        is_simulated: true,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving threat:", error);
      return null;
    }

    // Return the real UUID so the store can update the local threat's id
    return data?.id ?? null;
  },

  async updateThreatStatus(id: string, status: string) {
    // Guard: only call Supabase if id is a real UUID (not a mock t-xxxx id)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.warn("updateThreatStatus skipped — not a valid UUID:", id);
      return;
    }

    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (status === 'Resolved') {
      updateData.resolved_at = new Date().toISOString();
    } else {
      updateData.resolved_at = null;
    }

    const { error } = await supabase
      .from("threats")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating threat status:", error);
    }
  },

  subscribeToThreats(onUpdate: (payload: any) => void) {
    // Use unique channel name to avoid 'cannot add callbacks after subscribe' error
    const channelName = `threats-feed-${Date.now()}`;
    const channel = supabase.channel(channelName);
    
    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'threats' },
        (payload) => onUpdate(payload)
      )
      .subscribe();
      
    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  },
};
