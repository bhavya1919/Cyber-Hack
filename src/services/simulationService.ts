import { supabase } from "../lib/supabase";

export const simulationService = {
  async startSimulation(scenario: string, speed: number): Promise<string | null> {
    const id = `sim-${Date.now()}`;
    const { error } = await supabase.from("simulations").insert({
      id,
      scenario,
      speed,
      started_at: new Date().toISOString(),
      threat_count: 0,
    });

    if (error) {
      console.error("Error starting simulation:", error);
      return null;
    }
    return id;
  },

  async endSimulation(id: string, durationSec: number, threatCount: number) {
    const { error } = await supabase
      .from("simulations")
      .update({
        ended_at: new Date().toISOString(),
        duration: durationSec,
        threat_count: threatCount,
      })
      .eq("id", id);

    if (error) {
      console.error("Error ending simulation:", error);
    }
  },
};
