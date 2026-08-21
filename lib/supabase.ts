import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;https://njcxqgnywzjwgoxeiugp.supabase.co
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;sb_publishable_32PQ06jk9Ip1bysGYaY2uQ_bW4LN_Sh

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
