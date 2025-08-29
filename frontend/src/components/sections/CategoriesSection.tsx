import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../ui/CategoryCard';
import HorizontalScrollContainer from '../ui/HorizontalScrollContainer';
import { supabase } from '../../lib/supabaseClient';

interface Category {
  id: number;
  nom: string;
  description?: string;
}

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les catégories depuis la base de données
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Récupérer les catégories depuis Supabase
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, nom, description')
          .order('nom');
          
        if (categoriesError) {
          console.error('Erreur récupération catégories:', categoriesError);
        } else {
          setCategories(categoriesData || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number, title: string) => {
    console.log(`Catégorie cliquée: ${title} (ID: ${categoryId})`);
    // Navigation vers la page de catégorie
    window.location.href = `/category/${categoryId}`;
  };

  if (loading) {
    return (
      <section className="mb-4 sm:mb-6">
        <div className="mb-2 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Catégories
          </h2>
        </div>
        <HorizontalScrollContainer gap="0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[10rem] w-[10rem] bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
          ))}
        </HorizontalScrollContainer>
      </section>
    );
  }

  return (
    <section className="mb-4 sm:mb-6">
      {/* Titre de la section */}
      <div className="mb-2 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Catégories
        </h2>
      </div>

      {/* Scroll horizontal des cartes de catégories */}
      <HorizontalScrollContainer gap="0">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            title={category.nom}
            cardNumber={((index % 4) + 1) as 1 | 2 | 3 | 4} // Cycle entre les 4 images Card-edit
            onClick={() => handleCategoryClick(category.id, category.nom)}
            className="flex-shrink-0"
          />
        ))}
      </HorizontalScrollContainer>
    </section>
  );
};

export default CategoriesSection;
