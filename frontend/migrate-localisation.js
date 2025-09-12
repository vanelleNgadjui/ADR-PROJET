import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agendaduroyaume.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZW5kYWR1cm95YXVtZSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MzQ5NzQ4NzQsImV4cCI6MjA1MDU1MDg3NH0.8K8vK8vK8vK8vK8vK8vK8vK8vK8vK8vK8vK8vK8vK8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function extendLocalisationLength() {
  try {
    console.log('🔧 Extension de la longueur du champ localisation...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.users ALTER COLUMN localisation TYPE character varying(255);'
    });
    
    if (error) {
      console.error('❌ Erreur:', error);
    } else {
      console.log('✅ Migration réussie !');
    }
  } catch (err) {
    console.error('❌ Erreur inattendue:', err);
  }
}

extendLocalisationLength();
