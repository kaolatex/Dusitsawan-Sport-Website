const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data: sData, error: sErr } = await supabase.from('sports').select('*').order('sort_order');
  console.log('sports error:', sErr);

  const { data: subData, error: subErr } = await supabase.from('sport_subcategories').select('*').order('sort_order');
  console.log('subs error:', subErr);

  const { data: athData, error: athErr } = await supabase.from('athletes').select('*');
  console.log('athletes error:', athErr);
}
run();
