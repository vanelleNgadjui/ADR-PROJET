import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { 
  Heart, 
  Users, 
  Calendar, 
  Clock, 
  DollarSign,
  Tag,
  Loader2
} from 'lucide-react';

interface PreferencesManagerProps {
  profile: {
    preferences_categories?: number[];
    preferences_audiences?: string[];
    preferences_format?: string[];
    preferences_frequence?: string[];
    preferences_tarification?: string[];
    types_evenements_crees?: string[];
  };
  editData: {
    preferences_categories?: number[];
    preferences_audiences?: string[];
    preferences_format?: string[];
    preferences_frequence?: string[];
    preferences_tarification?: string[];
    types_evenements_crees?: string[];
  };
  setEditData: (data: any) => void;
  editing: boolean;
  role: string;
}

export default function PreferencesManager({ 
  profile, 
  editData, 
  setEditData, 
  editing, 
  role 
}: PreferencesManagerProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  const [activeSection, setActiveSection] = useState<string>('categories');

  // Valeurs d'enum statiques
  const enums = {
    audience_enum: ['familles', 'jeunes', 'serviteurs de Dieu', 'etudiants', 'seniors', 'enfants', 'couples', 'ministères', 'tout_public', 'femmes', 'hommes'],
    format_enum: ['en_presentiel', 'en_ligne', 'hybride'],
    frequence_enum: ['ponctuel', 'quotidien', 'hebdomadaire', 'bi_hebdomadaire', 'mensuel', 'trimestriel', 'annuel'],
    tarification_enum: ['gratuit', 'payant', 'don_libre', 'mixte'],
    type_evenement_specifique_enum: ['seminaire', 'conference', 'atelier', 'culte', 'concert', 'retreat', 'formation', 'webinar']
  };

  // Fonction pour formater les labels des enums
  const formatEnumLabel = (value: string) => {
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fonction pour gérer la sélection multiple
  const handleMultiSelect = (field: string, value: string | number) => {
    if (!editing) return;
    
    const currentValues = editData[field as keyof typeof editData] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: any) => v !== value)
      : [...currentValues, value];
    
    setEditData({ ...editData, [field]: newValues });
  };

  const sections = [
    {
      id: 'categories',
      label: 'Catégories',
      icon: Tag,
      description: 'Types d\'événements qui vous intéressent',
      data: categories || [],
      field: 'preferences_categories',
      getLabel: (item: any) => item.nom,
      getValue: (item: any) => item.id
    },
    {
      id: 'audiences',
      label: 'Publics',
      icon: Users,
      description: 'Publics cibles des événements',
      data: enums?.audience_enum || [],
      field: 'preferences_audiences',
      getLabel: (item: string) => formatEnumLabel(item),
      getValue: (item: string) => item
    },
    {
      id: 'formats',
      label: 'Formats',
      icon: Calendar,
      description: 'Formats d\'événements préférés',
      data: enums?.format_enum || [],
      field: 'preferences_format',
      getLabel: (item: string) => formatEnumLabel(item),
      getValue: (item: string) => item
    },
    {
      id: 'frequences',
      label: 'Fréquences',
      icon: Clock,
      description: 'Fréquences d\'événements',
      data: enums?.frequence_enum || [],
      field: 'preferences_frequence',
      getLabel: (item: string) => formatEnumLabel(item),
      getValue: (item: string) => item
    },
    {
      id: 'tarification',
      label: 'Tarification',
      icon: DollarSign,
      description: 'Types de tarification préférés',
      data: enums?.tarification_enum || [],
      field: 'preferences_tarification',
      getLabel: (item: string) => formatEnumLabel(item),
      getValue: (item: string) => item
    }
  ];

  // Ajouter la section types d'événements créés pour les organisateurs
  if (role === 'organisateur') {
    sections.push({
      id: 'types_crees',
      label: 'Types créés',
      icon: Heart,
      description: 'Types d\'événements que vous créez',
      data: enums?.type_evenement_specifique_enum || [],
      field: 'types_evenements_crees',
      getLabel: (item: string) => formatEnumLabel(item),
      getValue: (item: string) => item
    });
  }

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary-blue" />
          <span className="text-gray-600">Chargement des préférences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation des sections */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const currentValues = editData[section.field as keyof typeof editData] || [];
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isActive
                  ? 'border-primary-blue bg-primary-blue/10 text-primary-blue'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{section.label}</span>
              {currentValues.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary-blue text-white text-xs rounded-full">
                  {currentValues.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Contenu de la section active */}
      {sections.map((section) => {
        if (activeSection !== section.id) return null;
        
        const currentValues = editData[section.field as keyof typeof editData] || [];
        
        return (
          <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <section.icon className="w-5 h-5 text-primary-blue" />
                {section.label}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{section.description}</p>
            </div>

            {section.data.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <section.icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune donnée disponible</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.data.map((item: any) => {
                  const label = section.getLabel(item);
                  const value = section.getValue(item);
                  const isSelected = currentValues.includes(value);
                  
                  return (
                    <button
                      key={value}
                      onClick={() => handleMultiSelect(section.field, value)}
                      disabled={!editing}
                      className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-primary-blue bg-primary-blue/5 text-primary-blue'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                      } ${!editing ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{label}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-primary-blue flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Statistiques de sélection */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{currentValues.length} sélectionné{currentValues.length > 1 ? 's' : ''}</span>
                {currentValues.length > 0 && (
                  <button
                    onClick={() => setEditData({ ...editData, [section.field]: [] })}
                    disabled={!editing}
                    className="text-secondary-coral hover:text-secondary-coral/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tout désélectionner
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
