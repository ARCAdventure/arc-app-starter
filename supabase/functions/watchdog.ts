import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (_req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: rules, error } = await supabase
    .from("escalation_rules")
    .select("id, adventure_id, timer_deadline_at, window_mins, level1, level2");
  if (error) return new Response(error.message, { status: 500 });

  const overdue = (rules || []).filter((r: any) => {
    const deadline = new Date(r.timer_deadline_at).getTime();
    const windowMs = (r.window_mins ?? 15) * 60 * 1000;
    return Date.now() > deadline + windowMs;
  });

  for (const r of overdue) {
    await supabase.from("adventures").update({ status: "overdue" }).eq("id", r.adventure_id);
    await supabase.from("audit_logs").insert({
      adventure_id: r.adventure_id,
      action: "escalation.level1.enqueued",
      details: { rule_id: r.id, at: new Date().toISOString() }
    });
  }

  return new Response(JSON.stringify({ checked: rules?.length || 0, overdue: overdue.length }), {
    headers: { "content-type": "application/json" }
  });
});
