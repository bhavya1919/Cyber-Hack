import { supabase } from "../lib/supabase";

export interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  classification: "TLP:CLEAR" | "TLP:GREEN" | "TLP:AMBER" | "TLP:RED";
  summary: string;
}

export const reportService = {
  async fetchReports(): Promise<Report[]> {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("generated_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      date: row.generated_at ? new Date(row.generated_at).toISOString().split("T")[0] : "",
      type: row.type,
      classification: row.classification,
      summary: row.summary,
      markdown_content: row.markdown_content,
    }));
  },

  async saveReport(report: Report): Promise<string | null> {
    const { data, error } = await supabase.from("reports").insert({
      title: report.title,
      type: report.type,
      classification: report.classification,
      summary: report.summary,
      is_demo: true, // Mark frontend-generated as demo for now
      generated_at: new Date().toISOString(),
    }).select("id").single();

    if (error) {
      console.error("Error saving report:", error);
      return null;
    }
    
    return data?.id ?? null;
  },
};
