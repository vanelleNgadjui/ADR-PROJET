import React, { useState } from 'react';
import type { EventFormData } from '../EventWizard';
import type { Ticket, TicketCategorie } from '../../../../types/database';
import { DollarSign, CreditCard, Plus, Trash2 } from 'lucide-react';
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
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [editingTicketIndex, setEditingTicketIndex] = useState<number | null>(null);

  const pricingOptions = [
    {
      value: 'gratuit',
      label: 'Gratuit',
      description: 'Accès libre sans frais',
      icon: '🎉',
      color: 'bg-green-100 text-green-800 border-green-200',
      activeColor: 'bg-green-500 text-white border-green-500',
    },
    {
      value: 'payant',
      label: 'Payant',
      description: 'Billets avec prix fixe',
      icon: '💰',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      activeColor: 'bg-blue-500 text-white border-blue-500',
    },
    {
      value: 'don_libre',
      label: 'Don libre',
      description: 'Contribution volontaire',
      icon: '❤️',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      activeColor: 'bg-purple-500 text-white border-purple-500',
    },
    {
      value: 'mixte',
      label: 'Mixte',
      description: 'Gratuit + options payantes',
      icon: '🔄',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      activeColor: 'bg-orange-500 text-white border-orange-500',
    },
  ];

  const handlePricingChange = (pricing: EventFormData['tarification']) => {
    onFormDataChange({ 
      tarification: pricing,
      tickets: pricing === 'gratuit' ? [] : formData.tickets
    });
    setError('');
  };

  const addTicket = () => {
    const newTicket: Partial<Ticket> = {
      nom: '',
      description: '',
      prix: 0,
      quantite: undefined,
      date_debut_vente: '',
      date_fin_vente: '',
      type_billet: '',
      conditions: '',
      image_url: '',
      is_visible: true,
    };

    onFormDataChange({
      tickets: [...formData.tickets, newTicket as Ticket]
    });
    setEditingTicketIndex(formData.tickets.length);
    setShowTicketForm(true);
  };

  const updateTicket = (index: number, updates: Partial<Ticket>) => {
    const updatedTickets = [...formData.tickets];
    updatedTickets[index] = { ...updatedTickets[index], ...updates };
    onFormDataChange({ tickets: updatedTickets });
  };

  const removeTicket = (index: number) => {
    const updatedTickets = formData.tickets.filter((_, i) => i !== index);
    onFormDataChange({ tickets: updatedTickets });
  };

  const addTicketCategory = () => {
    const newCategory: Partial<TicketCategorie> = {
      nom: '',
      description: '',
      ordre: formData.tickets_categories.length,
    };

    onFormDataChange({
      tickets_categories: [...formData.tickets_categories, newCategory as TicketCategorie]
    });
  };

  const updateTicketCategory = (index: number, updates: Partial<TicketCategorie>) => {
    const updatedCategories = [...formData.tickets_categories];
    updatedCategories[index] = { ...updatedCategories[index], ...updates };
    onFormDataChange({ tickets_categories: updatedCategories });
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
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Type de tarification *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingOptions.map((option) => {
            const isActive = formData.tarification === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => handlePricingChange(option.value as any)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isActive 
                    ? option.activeColor 
                    : `${option.color} hover:border-gray-300`
                }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <h4 className="font-semibold">{option.label}</h4>
                <p className="text-sm opacity-80">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration des billets pour les événements payants */}
      {(formData.tarification === 'payant' || formData.tarification === 'mixte') && (
        <div className="space-y-6">
          {/* Catégories de billets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Catégories de billets
              </label>
                             <button
                 onClick={addTicketCategory}
                 className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
               >
                 <Plus className="w-4 h-4" />
                 Ajouter une catégorie
               </button>
            </div>

            {formData.tickets_categories.length > 0 ? (
              <div className="space-y-3">
                {formData.tickets_categories.map((category, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={category.nom}
                      onChange={(e) => updateTicketCategory(index, { nom: e.target.value })}
                      placeholder="Nom de la catégorie"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={category.description || ''}
                      onChange={(e) => updateTicketCategory(index, { description: e.target.value })}
                      placeholder="Description (optionnel)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                                         <button
                       onClick={() => removeTicketCategory(index)}
                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
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
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Billets disponibles
              </label>
                             <button
                 onClick={addTicket}
                 className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
               >
                 <Plus className="w-4 h-4" />
                 Ajouter un billet
               </button>
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
                        <button
                          onClick={() => {
                            setEditingTicketIndex(index);
                            setShowTicketForm(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          ✏️
                        </button>
                                                 <button
                           onClick={() => removeTicket(index)}
                           className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
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
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">💝 Don libre</h4>
          <p className="text-sm text-purple-800">
            Les participants pourront contribuer selon leurs moyens. 
            Vous pouvez définir un montant suggéré ou laisser le choix libre.
          </p>
        </div>
      )}

      {/* Configuration pour les événements gratuits */}
      {formData.tarification === 'gratuit' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">🎉 Événement gratuit</h4>
          <p className="text-sm text-green-800">
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

      {/* Aperçu de la tarification */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Aperçu de la tarification</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Type:</strong> {pricingOptions.find(opt => opt.value === formData.tarification)?.label}
          </p>
          {formData.tarification === 'payant' && (
            <p>
              <strong>Billets:</strong> {formData.tickets.length} billet(s) disponible(s)
            </p>
          )}
          {formData.tarification === 'mixte' && (
            <p>
              <strong>Options:</strong> Gratuit + {formData.tickets.length} billet(s) payant(s)
            </p>
          )}
        </div>
      </div>

      {/* Modal d'édition de ticket */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTicketIndex !== null ? 'Modifier le billet' : 'Ajouter un billet'}
              </h3>
              <button
                onClick={() => {
                  setShowTicketForm(false);
                  setEditingTicketIndex(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <TicketForm
              ticket={editingTicketIndex !== null ? formData.tickets[editingTicketIndex] : undefined}
              categories={formData.tickets_categories}
              onSave={(ticketData) => {
                if (editingTicketIndex !== null) {
                  updateTicket(editingTicketIndex, ticketData);
                } else {
                  onFormDataChange({
                    tickets: [...formData.tickets, ticketData]
                  });
                }
                setShowTicketForm(false);
                setEditingTicketIndex(null);
              }}
              onCancel={() => {
                setShowTicketForm(false);
                setEditingTicketIndex(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Composant formulaire de ticket
interface TicketFormProps {
  ticket?: Ticket;
  categories: TicketCategorie[];
  onSave: (ticket: Ticket) => void;
  onCancel: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ ticket, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Ticket>>(
    ticket || {
      nom: '',
      description: '',
      prix: 0,
      quantite: undefined,
      date_debut_vente: '',
      date_fin_vente: '',
      type_billet: '',
      conditions: '',
      image_url: '',
      is_visible: true,
    }
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `ticket-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error('Erreur upload image:', error);
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom?.trim()) {
      setError('Le nom du billet est obligatoire');
      return;
    }
    onSave(formData as Ticket);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {/* Nom du billet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom du billet *
        </label>
        <input
          type="text"
          value={formData.nom || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: Billet Standard"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Description du billet..."
          rows={3}
        />
      </div>

      {/* Prix */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prix (€) *
        </label>
        <input
          type="number"
          value={formData.prix || 0}
          onChange={(e) => setFormData(prev => ({ ...prev, prix: parseFloat(e.target.value) || 0 }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
          step="0.01"
          required
        />
      </div>

      {/* Quantité */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantité disponible
        </label>
        <input
          type="number"
          value={formData.quantite || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, quantite: e.target.value ? parseInt(e.target.value) : undefined }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="1"
          placeholder="Illimitée si vide"
        />
      </div>

      {/* Catégorie */}
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={formData.category_id || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value ? parseInt(e.target.value) : undefined }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Aucune catégorie</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>
        </div>
      )}

      {/* Image du billet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image du billet (optionnel)
        </label>
        {formData.image_url ? (
          <div className="relative">
            <img
              src={formData.image_url}
              alt="Image du billet"
              className="w-full h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="ticket-image-upload"
            />
            <label htmlFor="ticket-image-upload" className="cursor-pointer">
              <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">
                {uploadingImage ? 'Upload en cours...' : 'Cliquez pour ajouter une image'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG ou WebP • Max 2MB
              </p>
            </label>
          </div>
        )}
      </div>

      {/* Dates de vente */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Début de vente
          </label>
          <input
            type="datetime-local"
            value={formData.date_debut_vente || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, date_debut_vente: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fin de vente
          </label>
          <input
            type="datetime-local"
            value={formData.date_fin_vente || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, date_fin_vente: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Conditions spéciales
        </label>
        <textarea
          value={formData.conditions || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Conditions particulières pour ce billet..."
          rows={2}
        />
      </div>

      {/* Visible */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="ticket-visible"
          checked={formData.is_visible !== false}
          onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="ticket-visible" className="ml-2 block text-sm text-gray-900">
          Rendre ce billet visible aux participants
        </label>
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {ticket ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default Step4Pricing;
