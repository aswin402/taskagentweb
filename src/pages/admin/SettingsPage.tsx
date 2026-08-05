import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, KeyRound } from 'lucide-react';

export function SettingsPage() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_settings')
        .select('*');
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const [rolloverTime, setRolloverTime] = useState('22:00');
  const [reminderInterval, setReminderInterval] = useState('60');

  const syncStates = () => {
    const data = settingsQuery.data || [];
    const rollover = data.find((s) => s.setting_key === 'eod_rollover_time');
    const interval = data.find((s) => s.setting_key === 'reminder_interval_mins');

    if (rollover) setRolloverTime((rollover.setting_value as any)?.value || '22:00');
    if (interval) setReminderInterval(String((interval.setting_value as any)?.value || '60'));
  };

  const [synced, setSynced] = useState(false);
  if (settingsQuery.data && !synced) {
    syncStates();
    setSynced(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payloads = [
        { setting_key: 'eod_rollover_time', setting_value: { value: rolloverTime } },
        { setting_key: 'reminder_interval_mins', setting_value: { value: parseInt(reminderInterval) } },
      ];

      const { error } = await (supabase.from('agent_settings') as any)
        .upsert(payloads, { onConflict: 'setting_key' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save settings');
    },
  });

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent & System Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure end-of-day rollover timings and AI agent parameters.
        </p>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>AI Agent Triggers</CardTitle>
          <CardDescription>
            Modify parameters governing Hermes AI agent rollover and polling intervals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rollover-time">End of Day Rollover Time</Label>
            <Input
              id="rollover-time"
              type="time"
              value={rolloverTime}
              onChange={(e) => setRolloverTime(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Uncompleted checklist items will automatically roll over to the next day at this hour.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-interval">Reminder Checking Interval (Minutes)</Label>
            <Input
              id="reminder-interval"
              type="number"
              min="15"
              max="1440"
              value={reminderInterval}
              onChange={(e) => setReminderInterval(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              AI agent poll frequency to notify employees who have unchecked tasks.
            </p>
          </div>

          <Button
            className="w-full mt-4"
            disabled={saveMutation.isPending || settingsQuery.isLoading}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Settings...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configurations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-4 w-4 text-primary" />
            Hermes Integration
          </CardTitle>
          <CardDescription>
            Connection specifications for the background AI agent daemon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
          <p>
            The Hermes AI agent daemon connects directly to this Supabase database. It listens to insert
            events on <code className="bg-muted px-1 py-0.5 rounded text-primary">reminders</code> and runs cron scripts for rollovers.
          </p>
          <p>
            Ensure database replication settings are set to <code className="bg-muted px-1 py-0.5 rounded text-primary">FULL</code> on public schemas
            to allow realtime socket connections from the external agent script.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
