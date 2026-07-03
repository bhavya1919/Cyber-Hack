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
      severity: row.severity as any,
      category: row.category,
      sourceCountry: row.source_country,
      targetCountry: row.target_country,
      sector: row.sector,
      attackVector: row.attack_vector,
      affectedAssets: row.affected_assets || [],
      status: row.status,
      confidence: row.confidence,
      attackerActor: row.attacker_actor,
      summary: row.summary,
      time: new Date(row.created_at).toTimeString().split(" ")[0],
    } as any));
  },

  async saveThreat(threat: Partial<Threat>) {
    const { error } = await supabase.from("threats").upsert({
      id: threat.id,
      severity: threat.severity,
      category: threat.category,
      source_country: threat.sourceCountry,
      target_country: threat.targetCountry,
      sector: threat.sector || threat.targetIndustry,
      attack_vector: threat.attackVector,
      affected_assets: threat.affectedAssets,
      status: threat.status,
      confidence: threat.confidence,
      attacker_actor: threat.attackerActor,
      summary: threat.summary,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving threat:", error);
    }
  },

  async updateThreatStatus(id: string, status: string) {
    const { error } = await supabase
      .from("threats")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error updating threat status:", error);
    }
  },
};
