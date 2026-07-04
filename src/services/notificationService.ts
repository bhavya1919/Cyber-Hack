import { supabase } from "../lib/supabase";
import { Notification } from "../core/store/notificationStore";

export const notificationService = {
  async fetchNotifications(limit = 100): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      severity: row.severity,
      category: row.category,
      timestamp: new Date(row.created_at).getTime(),
      isRead: row.is_read,
      source: row.source,
    }));
  },

  async markAsRead(id: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
      
    if (error) console.error("Error marking notification as read:", error);
  },

  async markAllAsRead() {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) console.error("Error marking all notifications as read:", error);
  },

  async dismissNotification(id: string) {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);
      
    if (error) console.error("Error dismissing notification:", error);
  },

  subscribeToNotifications(onInsert: (notif: Notification) => void, onUpdate: (notif: Partial<Notification>) => void, onDelete: (id: string) => void) {
    const channelName = `notifications-${Date.now()}`;
    const channel = supabase.channel(channelName);
    
    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const row = payload.new;
          onInsert({
            id: row.id,
            title: row.title,
            message: row.message,
            severity: row.severity,
            category: row.category,
            timestamp: new Date(row.created_at).getTime(),
            isRead: row.is_read,
            source: row.source,
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications' },
        (payload) => {
          const row = payload.new;
          onUpdate({
            id: row.id,
            isRead: row.is_read,
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'notifications' },
        (payload) => {
          onDelete(payload.old.id);
        }
      )
      .subscribe();

    // Return an unsubscribe wrapper that cleans up the channel properly
    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  },
};
