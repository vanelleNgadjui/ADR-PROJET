import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANT: Ne jamais commiter ce fichier avec des vraies clés !
// Utilisez les variables d'environnement ou copiez ce fichier vers check-categories-local.js

const supabaseUrl = 'YOUR_SUPABASE_URL_HERE';
const supabaseKey = 'YOUR_SUPABASE_SERVICE_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCurrentCategories() {
  try {
    console.log('🔍 Vérification des catégories actuelles...\n');
    
    // Récupérer toutes les catégories avec leurs sous-catégories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        *,
        sous_categories (*)
      `)
      .order('nom');

    if (categoriesError) {
      throw categoriesError;
    }

    console.log('📊 CATÉGORIES ACTUELLES:');
    console.log('========================\n');

    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.nom}`);
      console.log(`   ID: ${category.id}`);
      console.log(`   Description: ${category.description || 'Aucune'}`);
      console.log(`   Créée le: ${category.created_at}`);
      
      if (category.sous_categories && category.sous_categories.length > 0) {
        console.log(`   Sous-catégories (${category.sous_categories.length}):`);
        category.sous_categories.forEach(sub => {
          console.log(`     - ${sub.nom} (ID: ${sub.id})`);
        });
      } else {
        console.log('   Aucune sous-catégorie');
      }
      console.log('');
    });

    console.log(`\n📈 STATISTIQUES:`);
    console.log(`Total catégories: ${categories.length}`);
    console.log(`Total sous-catégories: ${categories.reduce((acc, cat) => acc + (cat.sous_categories?.length || 0), 0)}`);

    // Analyser les noms trop longs
    const longNames = categories.filter(cat => cat.nom.length > 20);
    if (longNames.length > 0) {
      console.log(`\n⚠️  NOMS TROP LONGS (>20 caractères):`);
      longNames.forEach(cat => {
        console.log(`   - "${cat.nom}" (${cat.nom.length} caractères)`);
      });
    }

    // Analyser les catégories sans sous-catégories
    const withoutSubs = categories.filter(cat => !cat.sous_categories || cat.sous_categories.length === 0);
    if (withoutSubs.length > 0) {
      console.log(`\n📝 CATÉGORIES SANS SOUS-CATÉGORIES:`);
      withoutSubs.forEach(cat => {
        console.log(`   - ${cat.nom}`);
      });
    }

  } catch (err) {
    console.error('❌ Erreur:', err);
  }
}

checkCurrentCategories();
