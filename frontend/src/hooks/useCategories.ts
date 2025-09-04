import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Category, SousCategorie, CategoryWithSousCategories } from '../types/database';

interface UseCategoriesReturn {
  categories: CategoryWithSousCategories[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryWithSousCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les catégories avec leurs sous-catégories
      const { data, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          *,
          sous_categories (*)
        `)
        .order('nom');

      if (categoriesError) {
        throw categoriesError;
      }

      setCategories(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des catégories:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

// Hook pour récupérer une seule catégorie par ID
export const useCategory = (categoryId: number) => {
  const [category, setCategory] = useState<CategoryWithSousCategories | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error: categoryError } = await supabase
          .from('categories')
          .select(`
            *,
            sous_categories (*)
          `)
          .eq('id', categoryId)
          .single();

        if (categoryError) {
          throw categoryError;
        }

        setCategory(data);
      } catch (err) {
        console.error('Erreur lors de la récupération de la catégorie:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return { category, loading, error };
};

// Hook pour récupérer les sous-catégories d'une catégorie
export const useSousCategories = (categoryId: number) => {
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSousCategories = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error: sousCategoriesError } = await supabase
          .from('sous_categories')
          .select('*')
          .eq('categorie_id', categoryId)
          .order('nom');

        if (sousCategoriesError) {
          throw sousCategoriesError;
        }

        setSousCategories(data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des sous-catégories:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchSousCategories();
  }, [categoryId]);

  return { sousCategories, loading, error };
};
