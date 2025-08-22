import React, { useState, useEffect } from 'react';
import type { EventFormData } from '../EventWizard';
import type { Ticket, TicketCategorie } from '../../../../types/database';
import MultiSelect from '../../../form/MultiSelect';
import CategoryModal from '../modals/CategoryModal';
import TicketModal from '../modals/TicketModal';
import { useModal } from '../../../../hooks/useModal';
import { DollarSign, CreditCard, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { supabase } from '../../../../lib/supabaseClient';

interface Step4PricingProps {
  formData: EventFormData;
  onFormDataChange: (updates: Partial<EventFormData>) => void;
  error: string;
  setError: (error: string) => void;
}

const Step4Pricing: React.FC<Step4PricingProps> = ({
  formData,
  onFormDataChange,
  error,
  setError,
}) => {
  // Hooks pour les modales
  const { isOpen: showCategoryModal, openModal: openCategoryModal, closeModal: closeCategoryModal } = useModal();
  const { isOpen: showTicketModal, openModal: openTicketModal, closeModal: closeTicketModal } = useModal();
  
  const [editingTicketIndex, setEditingTicketIndex] = useState<number | null>(null);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<string[]>(
    formData.tarification ? [formData.tarification] : []
  );

  // Synchroniser l'état local avec formData.tarification
  useEffect(() => {
    if (formData.tarification) {
      setSelectedPricing([formData.tarification]);
    } else {
      setSelectedPricing([]);
    }
  }, [formData.tarification]);

  const pricingOptions = [
    { value: 'gratuit', text: 'Gratuit' },
    { value: 'payant', text: 'Payant' },
    { value: 'don_libre', text: 'Don libre' },
    { value: 'mixte', text: 'Mixte' }
  ];

  // Logique fluide pour les combinaisons de tarification
  const handlePricingChange = (selected: string[]) => {
    let finalSelection = [...selected];
    
    // Règle 1: Gratuit ↔ Payant (mutuellement exclusifs)
    if (selected.includes('gratuit') && selected.includes('payant')) {
      // Garder le dernier sélectionné
      const lastSelected = selected[selected.length - 1];
      finalSelection = [lastSelected];
    }
    
    // Règle 2: Mixte est exclusif (incompatible avec tout le reste)
    if (selected.includes('mixte')) {
      finalSelection = ['mixte'];
    } else if (selected.length > 1 && selected.includes('mixte')) {
      // Si on sélectionne autre chose avec mixte, enlever mixte
      finalSelection = selected.filter(s => s !== 'mixte');
    }
    
    // Règle 3: Don libre compatible avec tout sauf mixte
    if (finalSelection.includes('mixte') && finalSelection.includes('don_libre')) {
      finalSelection = finalSelection.filter(s => s !== 'don_libre');
    }
    
    // Si aucune sélection finale, on garde la valeur actuelle
    if (finalSelection.length === 0) {
      return;
    }
    
    // Pour l'instant, on prend la première sélection comme tarification principale
    // Plus tard, on pourra adapter le type EventFormData pour supporter les multiples
    const tarification = finalSelection[0] as EventFormData['tarification'];
    
    // Mettre à jour l'état local pour l'affichage
    setSelectedPricing(finalSelection);
    
    onFormDataChange({ 
      tarification,
      tickets: finalSelection.includes('gratuit') && finalSelection.length === 1 ? [] : formData.tickets
    });
    setError('');
  };

  const addTicket = () => {
    setEditingTicketIndex(null);
    openTicketModal();
  };

  const handleSaveTicket = (ticketData: Partial<Ticket>) => {
    if (editingTicketIndex !== null) {
      const updatedTickets = [...formData.tickets];
      updatedTickets[editingTicketIndex] = { ...updatedTickets[editingTicketIndex], ...ticketData };
      onFormDataChange({ tickets: updatedTickets });
    } else {
      onFormDataChange({
        tickets: [...formData.tickets, ticketData as Ticket]
      });
    }
  };

  const removeTicket = (index: number) => {
    const updatedTickets = formData.tickets.filter((_, i) => i !== index);
    onFormDataChange({ tickets: updatedTickets });
  };

  const addTicketCategory = () => {
    setEditingCategoryIndex(null);
    openCategoryModal();
  };

  const handleSaveCategory = (categoryData: Partial<TicketCategorie>) => {
    if (editingCategoryIndex !== null) {
      // Modifier une catégorie existante
      const updatedCategories = [...formData.tickets_categories];
      updatedCategories[editingCategoryIndex] = { ...updatedCategories[editingCategoryIndex], ...categoryData };
      onFormDataChange({ tickets_categories: updatedCategories });
    } else {
      // Ajouter une nouvelle catégorie
      onFormDataChange({
        tickets_categories: [...formData.tickets_categories, categoryData as TicketCategorie]
      });
    }
  };

  const removeTicketCategory = (index: number) => {
    const updatedCategories = formData.tickets_categories.filter((_, i) => i !== index);
    onFormDataChange({ tickets_categories: updatedCategories });
  };

  return (
    <div className="space-y-6">
      {/* En-tête de l'étape */}
      <div className="text-left lg:text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Tarification et billets
        </h3>
        <p className="text-gray-600">
          Définissez comment les participants accéderont à votre événement
        </p>
      </div>

      {/* Sélection du type de tarification */}
      <div>
        <MultiSelect
          label="Type de tarification *"
          options={pricingOptions}
          selected={selectedPricing}
          onChange={handlePricingChange}
          placeholder="Sélectionnez le type de tarification"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Choisissez comment les participants accéderont à votre événement
        </p>
      </div>

      {/* Configuration des billets pour les événements payants */}
      {(formData.tarification === 'payant' || formData.tarification === 'mixte') && (
        <div className="space-y-6">
          {/* Catégories de billets */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Catégories de billets
              </label>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addTicketCategory();
                }}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Plus className="w-4 h-4" />
                Ajouter une catégorie
              </Button>
            </div>

            {formData.tickets_categories.length > 0 ? (
              <div className="space-y-3">
                {formData.tickets_categories.map((category, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{category.nom}</h4>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setEditingCategoryIndex(index);
                          openCategoryModal();
                        }}
                        variant="ghost"
                        size="sm"
                        className="p-1 text-primary-blue hover:bg-primary-blue/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => removeTicketCategory(index)}
                        variant="ghost"
                        size="sm"
                        className="p-1 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Aucune catégorie de billets définie. Ajoutez-en une pour organiser vos billets.
              </p>
            )}
          </div>

          {/* Billets individuels */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Billets disponibles
              </label>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addTicket();
                }}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Plus className="w-4 h-4" />
                Ajouter un billet
              </Button>
            </div>

            {formData.tickets.length > 0 ? (
              <div className="space-y-3">
                {formData.tickets.map((ticket, index) => (
                  <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Billet {index + 1}: {ticket.nom || 'Sans nom'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Button
                                                  onClick={() => {
                          setEditingTicketIndex(index);
                          openTicketModal();
                        }}
                        variant="ghost"
                        size="sm"
                        className="p-1 text-primary-blue hover:bg-primary-blue/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removeTicket(index)}
                          variant="ghost"
                          size="sm"
                          className="p-1 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Prix:</span>
                        <span className="ml-1 font-medium">{ticket.prix}€</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantité:</span>
                        <span className="ml-1 font-medium">{ticket.quantite || 'Illimitée'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Visible:</span>
                        <span className="ml-1 font-medium">{ticket.is_visible ? 'Oui' : 'Non'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Catégorie:</span>
                        <span className="ml-1 font-medium">
                          {formData.tickets_categories.find(cat => cat.id === ticket.category_id)?.nom || 'Aucune'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Aucun billet défini. Ajoutez des billets pour permettre les inscriptions.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Configuration pour les dons libres */}
      {formData.tarification === 'don_libre' && (
        <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-lg p-4">
          <h4 className="font-medium text-primary-blue mb-2">💝 Don libre</h4>
          <p className="text-sm text-primary-blue">
            Les participants pourront contribuer selon leurs moyens. 
            Vous pouvez définir un montant suggéré ou laisser le choix libre.
          </p>
        </div>
      )}

      {/* Configuration pour les événements gratuits */}
      {formData.tarification === 'gratuit' && (
        <div className="bg-secondary-mint/10 border border-secondary-mint/20 rounded-lg p-4">
          <h4 className="font-medium text-secondary-mint mb-2">🎉 Événement gratuit</h4>
          <p className="text-sm text-secondary-mint">
            L'accès à votre événement sera gratuit. Les participants pourront s'inscrire sans frais.
          </p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}



      {/* Modales */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={closeCategoryModal}
        category={editingCategoryIndex !== null ? formData.tickets_categories[editingCategoryIndex] : undefined}
        onSave={handleSaveCategory}
      />

      <TicketModal
        isOpen={showTicketModal}
        onClose={closeTicketModal}
        ticket={editingTicketIndex !== null ? formData.tickets[editingTicketIndex] : undefined}
        categories={formData.tickets_categories}
        onSave={handleSaveTicket}
      />
    </div>
  );
};

export default Step4Pricing;
