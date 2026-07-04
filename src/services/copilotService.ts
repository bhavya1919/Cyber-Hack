import { supabase } from "../lib/supabase";
import { Message } from "../core/copilot"; // ensure this imports Message type

export const copilotService = {
  async fetchSessions() {
    const { data, error } = await supabase
      .from("copilot_sessions")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching copilot sessions:", error);
      return [];
    }

    return data || [];
  },

  async createSession(title: string) {
    const { data, error } = await supabase
      .from("copilot_sessions")
      .insert({ title, is_demo: true })
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      return null;
    }

    return data;
  },

  async fetchMessages(sessionId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from("copilot_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      sender: row.sender as "analyst" | "copilot",
      text: row.text,
      timestamp: new Date(row.created_at).toTimeString().split(" ")[0],
    }));
  },

  async saveMessage(sessionId: string, message: Message, intentType?: string, confidence?: number) {
    const { error } = await supabase.from("copilot_messages").insert({
      session_id: sessionId,
      sender: message.sender,
      text: message.text,
      intent_type: intentType || null,
      confidence: confidence || null,
      is_demo: true,
    });

    if (error) {
      console.error("Error saving message:", error);
    }
  },

  async updateSessionIntent(sessionId: string, lastIntent: string, messageCount: number) {
    const { error } = await supabase
      .from("copilot_sessions")
      .update({ last_intent: lastIntent, message_count: messageCount })
      .eq("id", sessionId);

    if (error) {
      console.error("Error updating session intent:", error);
    }
  },
};
