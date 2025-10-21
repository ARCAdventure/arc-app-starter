import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const body = await req.json();
  const { adventure_id } = body;

  if (!adventure_id) return new Response("adventure_id required", { status: 400 });

  const { error } = await supabase.from("adventures").update({ status: "completed" }).eq("id", adventure_id);
  if (error) return new Response(error.message, { status: 500 });

  await supabase.from("audit_logs").insert({
    adventure_id,
    action: "checkin.safe",
    details: { via: "edge-function" }
  });

  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
});
