import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { adventure_id, points } = await req.json();

  if (!adventure_id || !Array.isArray(points)) return new Response("bad payload", { status: 400 });

  const rows = points.map((p: any, i: number) => ({
    adventure_id,
    seq: p.seq ?? i,
    geom: `SRID=4326;POINT(${p.lng} ${p.lat})`,
    recorded_at: p.recorded_at || new Date().toISOString(),
    source: "gps"
  }));

  const { error } = await supabase.from("waypoints").insert(rows);
  if (error) return new Response(error.message, { status: 500 });

  return new Response(JSON.stringify({ inserted: rows.length }), { headers: { "content-type": "application/json" } });
});
