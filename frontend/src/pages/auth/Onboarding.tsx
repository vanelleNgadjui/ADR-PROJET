import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { useAllEnums, formatEnumLabel } from '../../hooks/useEnums';
import { supabase } from '../../lib/supabaseClient';
import { User, Calendar, Phone, MapPinned, Camera, ChevronLeft, ChevronRight, PartyPopper, UserCircle } from 'lucide-react';
import { LocationAutocomplete } from '../../components/ui/LocationAutocomplete';
import CustomCalendar from '../../components/ui/CustomCalendar';
import adrBg from '../../assets/ADR-BG.png';
import { 
  uploadProfilePhoto, 
  deleteProfilePhoto, 
  createPreviewUrl, 
  cleanupPreviewUrl, 
  isTemporaryUrl,
  getDefaultAvatarUrl 
} from '../../utils/imageOptimization';

export default function Onboarding() {
  const { role } = useParams<{ role: 'participant' | 'organisateur' }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // TOUS LES HOOKS DOIVENT ÊTRE AU DÉBUT
  const [currentStep, setCurrentStep] = useState(1);
  
  // Pré-remplir les données depuis Google OAuth
  const getInitialFormData = () => {
    if (!user) return {
      nom: '',
      prenom: '',
      dateNaissance: '',
      telephone: '',
      localisation: '',
      latitude: null as number | null,
      longitude: null as number | null,
      photo_profil_url: '',
      genre: '',
      mission: '',
      mission_autre: '',
      preferences_categories: [] as number[],
      preferences_audiences: [] as string[],
      preferences_format: [] as string[],
      preferences_frequence: [] as string[],
      preferences_tarification: [] as string[],
      types_evenements_crees: [] as number[]
    };

    // Extraire nom et prénom depuis full_name
    const fullName = user.user_metadata?.full_name || '';
    const nameParts = fullName.split(' ');
    const prenom = nameParts[0] || '';
    const nom = nameParts.slice(1).join(' ') || '';

    // Nettoyer l'URL de la photo Google si elle existe
    let cleanAvatarUrl = user.user_metadata?.avatar_url || '';
    
    if (cleanAvatarUrl && cleanAvatarUrl.includes('googleusercontent.com')) {
      // Supprimer les paramètres de taille pour avoir une image plus grande et éviter les problèmes CORS
      cleanAvatarUrl = cleanAvatarUrl.replace(/=s\d+-c/, '=s400-c');
      console.log('🔄 URL Google nettoyée:', {
        original: user.user_metadata?.avatar_url,
        cleaned: cleanAvatarUrl
      });
    }

    return {
      nom: nom,
      prenom: prenom,
      dateNaissance: '',
      telephone: '',
      localisation: '',
      latitude: null as number | null,
      longitude: null as number | null,
      photo_profil_url: cleanAvatarUrl,
      genre: '',
      mission: '',
      mission_autre: '',
      preferences_categories: [] as number[],
      preferences_audiences: [] as string[],
      preferences_format: [] as string[],
      preferences_frequence: [] as string[],
      preferences_tarification: [] as string[],
      types_evenements_crees: [] as number[]
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Référence pour l'input file
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Données dynamiques depuis la base
  const [categories, setCategories] = useState<Array<{id: number, nom: string, description: string}>>([]);
  const [sousCategories, setSousCategories] = useState<Array<{id: number, categorie_id: number, nom: string, description: string}>>([]);
  
  // Utiliser le hook optimisé pour tous les enums
  const { enums, loading: loadingEnums, error: enumsError } = useAllEnums();

  // Classes de focus selon le rôle
  const focusClasses = role === 'participant' 
    ? 'focus:ring-primary-orange focus:border-primary-orange' 
    : 'focus:ring-primary-blue focus:border-primary-blue';
  
  // Extraire les enums spécifiques
  const audiences = enums.audience_enum || [];
  const formats = enums.format_enum || [];
  const frequences = enums.frequence_enum || [];
  const tarifications = enums.tarification_enum || [];
  const typesEvenements = enums.type_evenement_specifique_enum || [];
  
  // État de chargement global
  const loadingData = loadingEnums;

  // Nettoyer les URLs temporaires lors du démontage du composant
  React.useEffect(() => {
    return () => {
      if (formData.photo_profil_url && isTemporaryUrl(formData.photo_profil_url)) {
        cleanupPreviewUrl(formData.photo_profil_url);
      }
    };
  }, [formData.photo_profil_url]);

    // Récupérer les données dynamiques depuis la base
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les catégories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, nom, description')
          .order('nom');
          
        if (categoriesError) {
          console.error('Erreur récupération catégories:', categoriesError);
        } else {
          setCategories(categoriesData || []);
        }
        
        // Récupérer les sous-catégories
        const { data: sousCategoriesData, error: sousCategoriesError } = await supabase
          .from('sous_categories')
          .select('id, categorie_id, nom, description')
          .order('nom');
          
        if (sousCategoriesError) {
          console.error('Erreur récupération sous-catégories:', sousCategoriesError);
        } else {
          setSousCategories(sousCategoriesData || []);
        }
      } catch (err) {
        console.error('Erreur récupération données:', err);
      }
    };

    fetchData();
  }, []);

  // Rediriger si pas connecté et mettre à jour les données Google
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/connexion');
    } else if (user) {
      // Mettre à jour les données si elles viennent de Google
      const fullName = user.user_metadata?.full_name || '';
      if (fullName && (!formData.nom || !formData.prenom)) {
        const nameParts = fullName.split(' ');
        const prenom = nameParts[0] || '';
        const nom = nameParts.slice(1).join(' ') || '';
        
        setFormData(prev => ({
          ...prev,
          nom: nom,
          prenom: prenom,
          photo_profil_url: user.user_metadata?.avatar_url || prev.photo_profil_url
        }));
      }
    }
  }, [user, authLoading, navigate, formData.nom, formData.prenom]);
  
  // Afficher un loader pendant la vérification
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // Rediriger si pas connecté
  if (!user) {
    return null; // La redirection se fait dans le useEffect
  }

  const totalSteps = role === 'participant' ? 6 : 6; // À ajuster selon le parcours final

  const roleConfig = {
    participant: {
      title: 'Complète ton profil participant',
      subtitle: 'Aide-nous à personnaliser ton expérience',
          color: 'text-[#FFA500]',
    bgColor: 'bg-[#FFA500]/5',
    borderColor: 'border-[#FFA500]'
    },
    organisateur: {
      title: 'Complète ton profil organisateur',
      subtitle: 'Configure ton profil pour créer des événements',
      color: 'text-[#00008B]',
      bgColor: 'bg-[#00008B]/5',
      borderColor: 'border-[#00008B]'
    }
  };

  const config = roleConfig[role || 'participant'];



  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction pour ouvrir le sélecteur de fichier
  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  // Fonction pour gérer la sélection de fichier
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Créer une URL temporaire pour l'aperçu immédiat
        const previewUrl = createPreviewUrl(file);
        setFormData({ ...formData, photo_profil_url: previewUrl });
        setError('');
        
        // Upload et optimisation en arrière-plan
        if (user?.id) {
          const result = await uploadProfilePhoto(file, user.id);
          if (result.success && result.url) {
            // Nettoyer l'URL temporaire
            cleanupPreviewUrl(previewUrl);
            // Mettre à jour avec l'URL optimisée
            setFormData({ ...formData, photo_profil_url: result.url });
          } else {
            setError(result.error || 'Erreur lors de l\'upload de l\'image');
            // Nettoyer l'URL temporaire en cas d'erreur
            cleanupPreviewUrl(previewUrl);
            setFormData({ ...formData, photo_profil_url: '' });
          }
        }
      } catch (error) {
        console.error('Erreur lors du traitement de l\'image:', error);
        setError('Erreur lors du traitement de l\'image');
      }
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Debug pour voir ce qui est sauvegardé
              console.log('Onboarding Debug:', {
          role_from_url: role,
          mission_from_form: formData.mission,
          what_will_be_saved: role
        });

      // 1. Mettre à jour les user_metadata avec le rôle
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          role: role, // Sauvegarder le rôle dans les métadonnées
          full_name: `${formData.prenom} ${formData.nom}`.trim(),
          avatar_url: formData.photo_profil_url || user?.user_metadata?.avatar_url
        }
      });

      if (metadataError) {
        console.error('Erreur mise à jour métadonnées:', metadataError);
        setError('Erreur lors de la mise à jour des métadonnées');
        return;
      }

      // 2. Mettre à jour le profil utilisateur dans la table users
      const { error } = await supabase
        .from('users')
        .update({
          nom: formData.nom,
          prenom: formData.prenom,
          date_naissance: formData.dateNaissance || null,
          telephone: formData.telephone || null,
          genre: formData.genre || null,
          localisation: formData.localisation,
          latitude: formData.latitude,
          longitude: formData.longitude,
          photo_profil_url: formData.photo_profil_url || null,
          role: role, // Mettre à jour le rôle principal (enum)
          mission: formData.mission || null,
          mission_autre: formData.mission_autre || null,
          preferences_categories: formData.preferences_categories.length > 0 ? formData.preferences_categories : null,
          preferences_audiences: formData.preferences_audiences.length > 0 ? formData.preferences_audiences : null,
          preferences_format: formData.preferences_format.length > 0 ? formData.preferences_format : null,
          preferences_frequence: formData.preferences_frequence.length > 0 ? formData.preferences_frequence : null,
          preferences_tarification: formData.preferences_tarification.length > 0 ? formData.preferences_tarification : null,
          types_evenements_crees: formData.types_evenements_crees.length > 0 ? formData.types_evenements_crees : null,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Erreur mise à jour profil:', error);
        setError('Erreur lors de la mise à jour du profil');
      } else {
        console.log('Profil mis à jour avec succès');
        // Rediriger vers la page d'accueil
        navigate('/');
      }
    } catch (err) {
      console.error('Erreur inattendue:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Informations de base
              </h2>
              <p className="text-gray-600">
                Commençons par vos informations personnelles
              </p>
            </div>
            
            {/* Indication Google OAuth - Simple */}
            {user?.user_metadata?.full_name && (
              <div className="p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Données pré-remplies depuis votre compte Google
                  </span>
                </div>
              </div>
            )}
            
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Prénom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white text-gray-900 transition-colors ${
                      role === 'participant' 
                        ? 'focus:ring-primary-orange focus:border-primary-orange' 
                        : 'focus:ring-primary-blue focus:border-primary-blue'
                    }`}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white text-gray-900 transition-colors ${
                      role === 'participant' 
                        ? 'focus:ring-primary-orange focus:border-primary-orange' 
                        : 'focus:ring-primary-blue focus:border-primary-blue'
                    }`}
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Date de naissance */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date de naissance
              </label>
              <CustomCalendar
                value={formData.dateNaissance}
                onChange={(date) => setFormData({ ...formData, dateNaissance: date })}
                role={role}
                placeholder="Sélectionnez votre date de naissance"
              />
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white transition-colors appearance-none ${
                    !formData.genre ? 'text-gray-400' : 'text-gray-900'
                  } ${
                    role === 'participant' 
                      ? 'focus:ring-primary-orange focus:border-primary-orange' 
                      : 'focus:ring-primary-blue focus:border-primary-blue'
                  }`}
                >
                  <option value="" disabled className="text-gray-400">Sélectionnez votre genre</option>
                  {enums.genre_enum?.map((genre) => (
                    <option key={genre} value={genre} className="text-gray-900">
                      {formatEnumLabel(genre)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {loadingEnums && (
                <p className="text-xs text-gray-500">Chargement des options...</p>
              )}
              {enumsError && (
                <p className="text-xs text-[#EE6239]">Erreur de chargement des options</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Téléphone {role === 'organisateur' ? '*' : ''}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white text-gray-900 transition-colors ${
                    role === 'participant' 
                      ? 'focus:ring-primary-orange focus:border-primary-orange' 
                      : 'focus:ring-primary-blue focus:border-primary-blue'
                  }`}
                  placeholder="Votre numéro de téléphone"
                  required={role === 'organisateur'}
                />
              </div>
              

            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Header avec icône */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-1">
                <MapPinned className="w-6 h-6 text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Où êtes-vous situé ?
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                {role === 'participant' 
                  ? 'Nous vous proposerons des événements près de chez vous'
                  : 'Définissez votre zone d\'activité pour toucher votre audience'
                }
              </p>
            </div>

            {/* Zone de recherche */}
            <div className="max-w-lg mx-auto">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Ville ou région *
                </label>
                
                <div className="relative">
                  <LocationAutocomplete
                    value={formData.localisation}
                    onChange={(location) => setFormData({ ...formData, localisation: location })}
                    onLocationSelect={(location) => {
                      setFormData({
                        ...formData,
                        localisation: location.display_name,
                        latitude: parseFloat(location.lat),
                        longitude: parseFloat(location.lon)
                      });
                    }}
                    placeholder="Ex: Paris, France ou New York, USA..."
                    required
                    role={role}
                  />
                </div>

                {/* Informations contextuelles */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1 text-gray-700">
                        {role === 'participant' ? 'Pourquoi cette information ?' : 'Zone d\'activité'}
                      </p>
                      <p>
                        {role === 'participant' 
                          ? 'Nous utilisons votre localisation pour vous proposer des événements pertinents dans votre région et vous connecter avec votre communauté locale.'
                          : 'Cette information aide les participants à trouver vos événements et définit votre zone d\'influence géographique.'
                        }
                      </p>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Header avec icône */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mb-3">
                <UserCircle className="w-6 h-6 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Photo de profil
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Ajoutez une photo pour personnaliser votre profil et faciliter la reconnaissance
              </p>
            </div>

            {/* Input file caché */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Zone de photo */}
            <div className="max-w-sm mx-auto">
              <div className="text-center">
                {/* Photo actuelle ou placeholder */}
                <div className="mb-6">
                  {formData.photo_profil_url ? (
                    <div className="relative inline-block group cursor-pointer" onClick={handlePhotoUpload}>
                      <img 
                        src={formData.photo_profil_url} 
                        alt="Photo de profil" 
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg transition-all duration-200 group-hover:border-gray-300"
                        onError={(e) => {
                          console.error('❌ Erreur de chargement de l\'image:', {
                            url: formData.photo_profil_url,
                            isGooglePhoto: formData.photo_profil_url?.includes('googleusercontent.com'),
                            timestamp: new Date().toISOString()
                          });
                          
                          // Fallback vers un avatar par défaut
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://ui-avatars.com/api/?name=U&background=3B82F6&color=fff&size=200&bold=true';
                        }}
                        onLoad={() => {
                          console.log('✅ Image chargée avec succès:', formData.photo_profil_url);
                        }}
                      />
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const currentUrl = formData.photo_profil_url;
                          
                          // Supprimer du storage si ce n'est pas une URL temporaire
                          if (currentUrl && !isTemporaryUrl(currentUrl)) {
                            try {
                              await deleteProfilePhoto(currentUrl);
                            } catch (error) {
                              console.error('Erreur lors de la suppression:', error);
                            }
                          }
                          
                          // Nettoyer l'URL temporaire si nécessaire
                          if (currentUrl && isTemporaryUrl(currentUrl)) {
                            cleanupPreviewUrl(currentUrl);
                          }
                          
                          setFormData({ ...formData, photo_profil_url: '' });
                        }}
                        className="absolute -top-2 -right-2 bg-[#EE6239] text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-[#EE6239]/80 transition-all duration-200 shadow-lg hover:scale-110"
                        title="Supprimer la photo"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {/* Overlay pour indiquer que c'est cliquable */}
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={handlePhotoUpload}
                    >
                      <div className="text-center">
                        <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 hidden sm:block">Cliquez pour ajouter</p>
                        <p className="text-xs text-gray-400 hidden sm:block">JPG, PNG, WebP • Max 5MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  {formData.photo_profil_url ? (
                    <>
                      {user?.user_metadata?.avatar_url && formData.photo_profil_url === user.user_metadata.avatar_url ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-600">
                              Photo récupérée depuis votre compte Google
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#62BF92]/10 border border-[#62BF92]/20 rounded-lg p-3">
                          <div className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 text-[#62BF92]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-[#62BF92]">
                              Photo de profil configurée
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-row gap-3 justify-center">
                        <button
                          type="button"
                          onClick={handlePhotoUpload}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-sm border border-gray-200 hover:border-gray-300"
                        >
                          <Camera className="w-4 h-4" />
                          Modifier la photo
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const currentUrl = formData.photo_profil_url;
                            
                            // Supprimer du storage si ce n'est pas une URL temporaire
                            if (currentUrl && !isTemporaryUrl(currentUrl)) {
                              try {
                                await deleteProfilePhoto(currentUrl);
                              } catch (error) {
                                console.error('Erreur lors de la suppression:', error);
                              }
                            }
                            
                            // Nettoyer l'URL temporaire si nécessaire
                            if (currentUrl && isTemporaryUrl(currentUrl)) {
                              cleanupPreviewUrl(currentUrl);
                            }
                            
                            setFormData({ ...formData, photo_profil_url: '' });
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 font-medium text-sm border border-red-200 hover:border-red-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handlePhotoUpload}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base border border-gray-200 hover:border-gray-300"
                      >
                        <Camera className="w-4 h-4" />
                        Ajouter une photo
                      </button>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Optionnel - Vous pourrez l'ajouter plus tard depuis votre profil
                      </p>
                    </>
                  )}
                </div>
                
                {/* Message d'erreur pour la photo */}
                {error && (
                  <div className="text-[#EE6239] text-xs sm:text-sm bg-[#EE6239]/10 border border-[#EE6239]/20 p-3 rounded-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#EE6239]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

                        case 4:
        if (role === 'participant') {
          return (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Vos centres d'intérêt
                </h2>
                <p className="text-gray-600">
                  Sélectionnez les types d'événements qui vous intéressent
                </p>
              </div>

              {/* Bulle d'information */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Ces informations nous permettent de personnaliser votre expérience en vous proposant des événements qui vous intéressent et nourrissent votre foi.
                  </span>
                </div>
              </div>

              {/* Types d'événements */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Types d'événements préférés</h3>
                 
                  {loadingData ? (
                    <div className="text-center py-6">
                      <div className="w-6 h-6 border-2 border-[#FFA500] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chargement des types d'événements préférés...</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {sousCategories.map((sousCategory) => (
                        <button
                          key={sousCategory.id}
                          type="button"
                          onClick={() => {
                            if (formData.preferences_categories.includes(sousCategory.id)) {
                              setFormData({
                                ...formData,
                                preferences_categories: formData.preferences_categories.filter(id => id !== sousCategory.id)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                preferences_categories: [...formData.preferences_categories, sousCategory.id]
                              });
                            }
                          }}
                          className={`px-2 py-1.5 sm:px-3 sm:py-2 border rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                            formData.preferences_categories.includes(sousCategory.id)
                              ? 'border-[#FFA500] bg-[#FFA500]/10 text-[#FFA500]'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {sousCategory.nom}
                        </button>
                      ))}
                    </div>
                  )}
                </div>


              </div>
            </div>
          );
        } else {
          // ÉTAPE 4B : ORGANISATEUR - Rôle/Mission
          return (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Votre rôle/mission
                </h2>
                <p className="text-gray-600">
                  Choisissez le rôle ou la mission qui vous correspond le plus afin de personnaliser votre expérience
                </p>
              </div>



              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Quelle est votre mission ? *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={formData.mission}
                      onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white transition-colors appearance-none ${
                        !formData.mission ? 'text-gray-400' : 'text-gray-900'
                      } ${focusClasses}`}
                      required
                    >
                      <option value="" disabled className="text-gray-400">Sélectionnez votre mission</option>
                      <option value="eglise_locale">Église locale</option>
                      <option value="reseau_eglises">Réseau d'églises</option>
                      <option value="ministere_individuel">Ministère individuel</option>
                      <option value="association_chretienne">Association chrétienne</option>
                      <option value="ong_chretienne">ONG chrétienne</option>
                      <option value="groupe_jeunesse">Groupe de jeunesse</option>
                      <option value="pasteur">Pasteur</option>
                      <option value="evangeliste">Évangéliste</option>
                      <option value="missionnaire">Missionnaire</option>
                      <option value="formateur">Formateur</option>
                      <option value="conference_orateur">Conférencier/Orateur</option>
                      <option value="artiste_gospel">Artiste gospel</option>
                      <option value="label_musical_chretien">Label musical chrétien</option>
                      <option value="compagnie_artistique">Compagnie artistique</option>
                      <option value="maison_dedition">Maison d'édition</option>
                      <option value="organisateur_festival">Organisateur de festival</option>
                      <option value="organisateur_concert">Organisateur de concert</option>
                      <option value="ecole_biblique">École biblique</option>
                      <option value="autre">Autre</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {formData.mission === 'autre' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Précisez votre rôle
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PartyPopper className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.mission_autre}
                        onChange={(e) => setFormData({ ...formData, mission_autre: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white text-gray-900 transition-colors ${focusClasses}`}
                        placeholder="Décrivez votre rôle..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }

      case 5:
        if (role === 'participant') {
          return (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Préférences avancées
                </h2>
                <p className="text-gray-600">
                  Personnalisez vos préférences pour des recommandations plus précises
                </p>
              </div>

              {/* Publics intéressés */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Publics intéressés</h3>
                  
                  {loadingData ? (
                    <div className="text-center py-6">
                      <div className="w-6 h-6 border-2 border-[#FFA500] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chargement des publics...</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {audiences.map((audience: string) => (
                        <button
                          key={audience}
                          type="button"
                          onClick={() => {
                            if (formData.preferences_audiences.includes(audience)) {
                              setFormData({
                                ...formData,
                                preferences_audiences: formData.preferences_audiences.filter(a => a !== audience)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                preferences_audiences: [...formData.preferences_audiences, audience]
                              });
                            }
                          }}
                          className={`px-3 py-2 sm:px-3 sm:py-2 border rounded-lg transition-all duration-200 text-sm sm:text-sm font-medium ${
                            formData.preferences_audiences.includes(audience)
                              ? 'border-[#FFA500] bg-[#FFA500]/10 text-[#FFA500]'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {formatEnumLabel(audience)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Format préféré */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Format d'événements préféré</h3>
                  {loadingData ? (
                    <div className="text-center py-6">
                      <div className="w-6 h-6 border-2 border-[#FFA500] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chargement des formats...</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formats.map((format) => (
                        <button
                          key={format}
                          type="button"
                          onClick={() => {
                            if (formData.preferences_format.includes(format)) {
                              setFormData({
                                ...formData,
                                preferences_format: formData.preferences_format.filter(f => f !== format)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                preferences_format: [...formData.preferences_format, format]
                              });
                            }
                          }}
                          className={`px-3 py-2 sm:px-3 sm:py-2 border rounded-lg transition-all duration-200 text-sm sm:text-sm font-medium ${
                            formData.preferences_format.includes(format)
                              ? 'border-[#FFA500] bg-[#FFA500]/10 text-[#FFA500]'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {formatEnumLabel(format)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fréquence d'activité */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Fréquence d'activité préférée</h3>
                  {loadingData ? (
                    <div className="text-center py-6">
                      <div className="w-6 h-6 border-2 border-[#FFA500] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chargement des fréquences...</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {frequences.map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => {
                            if (formData.preferences_frequence.includes(freq)) {
                              setFormData({
                                ...formData,
                                preferences_frequence: formData.preferences_frequence.filter(f => f !== freq)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                preferences_frequence: [...formData.preferences_frequence, freq]
                              });
                            }
                          }}
                          className={`px-3 py-2 sm:px-3 sm:py-2 border rounded-lg transition-all duration-200 text-sm sm:text-sm font-medium ${
                            formData.preferences_frequence.includes(freq)
                              ? 'border-[#FFA500] bg-[#FFA500]/10 text-[#FFA500]'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {formatEnumLabel(freq)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
                } else {
          // ÉTAPE 5B : ORGANISATEUR - Spécialisation
          return (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Spécialisation
                </h2>
                <p className="text-gray-600">
                  Décrivez les types d'événements que vous créez pour optimiser votre expérience
                </p>
              </div>

              {/* Catégories d'événements créés */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Types d'événements que vous créez</h3>
                  {loadingData ? (
                    <div className="text-center py-6">
                      <div className="w-6 h-6 border-2 border-[#00008B] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chargement des catégories...</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            if (formData.types_evenements_crees.includes(category.id)) {
                              setFormData({
                                ...formData,
                                types_evenements_crees: formData.types_evenements_crees.filter(t => t !== category.id)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                types_evenements_crees: [...formData.types_evenements_crees, category.id]
                              });
                            }
                          }}
                          className={`px-2 py-1.5 sm:px-3 sm:py-2 border rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                            formData.types_evenements_crees.includes(category.id)
                              ? 'border-[#00008B] bg-[#00008B]/10 text-[#00008B]'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {category.nom}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Format d'événements */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Format d'événements créés</h3>
                  {loadingData ? (
                    <div className="text-center py-6">
                      <div className="w-6 h-6 border-2 border-[#00008B] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chargement des formats...</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formats.map((format) => (
                        <button
                          key={format}
                          type="button"
                          onClick={() => {
                            if (formData.preferences_format.includes(format)) {
                              setFormData({
                                ...formData,
                                preferences_format: formData.preferences_format.filter(f => f !== format)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                preferences_format: [...formData.preferences_format, format]
                              });
                            }
                          }}
                          className={`px-2 py-1.5 sm:px-3 sm:py-2 border rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                            formData.preferences_format.includes(format)
                              ? 'border-[#00008B] bg-[#00008B]/10 text-[#00008B]'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {formatEnumLabel(format)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fréquence d'organisation */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Fréquence d'organisation</h3>
                  {loadingData ? (
                    <div className="text-center py-6">
                      <div className="w-6 h-6 border-2 border-[#00008B] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chargement des fréquences...</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {frequences.map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => {
                            if (formData.preferences_frequence.includes(freq)) {
                              setFormData({
                                ...formData,
                                preferences_frequence: formData.preferences_frequence.filter(f => f !== freq)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                preferences_frequence: [...formData.preferences_frequence, freq]
                              });
                            }
                          }}
                          className={`px-2 py-1.5 sm:px-3 sm:py-2 border rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                            formData.preferences_frequence.includes(freq)
                              ? 'border-[#00008B] bg-[#00008B]/10 text-[#00008B]'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {formatEnumLabel(freq)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tarification */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Types de tarification</h3>
                  {loadingData ? (
                    <div className="text-center py-6">
                      <div className="w-6 h-6 border-2 border-[#00008B] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Chargement des tarifications...</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tarifications.map((tarif) => (
                        <button
                          key={tarif}
                          type="button"
                          onClick={() => {
                            if (formData.preferences_tarification.includes(tarif)) {
                              setFormData({
                                ...formData,
                                preferences_tarification: formData.preferences_tarification.filter(t => t !== tarif)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                preferences_tarification: [...formData.preferences_tarification, tarif]
                              });
                            }
                          }}
                          className={`px-2 py-1.5 sm:px-3 sm:py-2 border rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                            formData.preferences_tarification.includes(tarif)
                              ? 'border-[#00008B] bg-[#00008B]/10 text-[#00008B]'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {formatEnumLabel(tarif)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }

      case 6:
        return (
          <div className="space-y-8">
            {/* Header avec célébration */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#62BF92]/10 rounded-full mb-4">
                <PartyPopper className="w-8 h-8 text-[#62BF92]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Félicitations !
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Votre profil est maintenant complet et prêt à vous connecter avec la communauté chrétienne
              </p>
            </div>

            {/* Récapitulatif moderne et interactif */}
            <div className="space-y-6">
              {/* Header du récapitulatif */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Votre profil en un coup d'œil</h3>
                <p className="text-gray-600">Voici ce que nous avons configuré ensemble</p>
              </div>

              {/* Grille de cartes modernes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Carte Informations personnelles */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Identité</h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-gray-900">{formData.prenom} {formData.nom}</p>
                    {formData.genre && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {formatEnumLabel(formData.genre)}
                      </p>
                    )}
                    {formData.dateNaissance && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Né(e) le {new Date(formData.dateNaissance).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {formData.telephone && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {formData.telephone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Carte Localisation */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <MapPinned className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Localisation</h4>
                  </div>
                  <p className="text-lg font-medium text-gray-900">{formData.localisation}</p>
                  <p className="text-sm text-gray-600 mt-1">Votre zone géographique</p>
                </div>

                {/* Carte Rôle/Mission (Organisateur) */}
                {role === 'organisateur' && formData.mission && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">Rôle & Mission</h4>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                                              {formData.mission === 'autre' ? formData.mission_autre : formData.mission.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Votre mission dans la communauté</p>
                  </div>
                )}

                {/* Carte Centres d'intérêt (Participant) */}
                {role === 'participant' && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#FFA500] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">Centres d'intérêt</h4>
                    </div>
                    <div className="space-y-2">
                      {formData.preferences_categories.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 bg-[#FFA500]/20 text-[#FFA500] text-sm font-medium rounded-full">
                            {formData.preferences_categories.length} type(s) d'événements
                          </span>
                        </div>
                      )}
                      {formData.preferences_audiences.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 bg-[#FFA500]/20 text-[#FFA500] text-sm font-medium rounded-full">
                            {formData.preferences_audiences.length} public(s) cible(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Carte Spécialisation (Organisateur) */}
                {role === 'organisateur' && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#00008B] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">Spécialisation</h4>
                    </div>
                    <div className="space-y-2">
                      {formData.types_evenements_crees.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 bg-[#00008B]/20 text-[#00008B] text-sm font-medium rounded-full">
                            {formData.types_evenements_crees.length} type(s) d'événements créés
                          </span>
                        </div>
                      )}
                      {formData.preferences_format.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 bg-[#00008B]/20 text-[#00008B] text-sm font-medium rounded-full">
                            {formData.preferences_format.length} format(s) d'événements
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistiques du profil */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">Votre profil en chiffres</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#62BF92]">6</div>
                    <div className="text-sm text-gray-600">Étapes complétées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#FFA500]">
                      {role === 'participant' ? formData.preferences_categories.length : formData.types_evenements_crees.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      {role === 'participant' ? 'Types d\'événements' : 'Types créés'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00008B]">
                      {role === 'participant' ? formData.preferences_audiences.length : formData.preferences_format.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      {role === 'participant' ? 'Publics cibles' : 'Formats d\'événements'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#62BF92]">100%</div>
                    <div className="text-sm text-gray-600">Profil complet</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message de fin avec actions */}
            <div className="text-center space-y-4">
              <div className="bg-[#62BF92]/5 border border-[#62BF92]/20 rounded-lg p-4">
                <p className="text-sm text-[#62BF92] font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Votre profil est maintenant configuré ! Vous pouvez le modifier à tout moment depuis votre tableau de bord.
                </p>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>En cliquant sur "Terminer", vous acceptez nos conditions d'utilisation</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Étape {currentStep} - En cours de développement
            </h2>
            <p className="text-gray-600">
              Cette étape sera implémentée prochainement.
            </p>
          </div>
        );
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.nom.trim() && formData.prenom.trim() && 
               (role === 'participant' || formData.telephone.trim());
      case 2:
        return formData.localisation.trim();
      case 3:
        return true; // Photo optionnelle
      case 4:
        if (role === 'participant') {
          return formData.preferences_categories.length > 0;
        } else {
          return formData.mission || (formData.mission === 'autre' && formData.mission_autre.trim());
        }
      case 5:
        if (role === 'participant') {
          return formData.preferences_audiences.length > 0; // Au moins un public intéressé
        } else {
          return formData.types_evenements_crees.length > 0; // Au moins un type d'événement
        }
      case 6:
        return true; // Finalisation - toujours possible
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen">
      <AuthLayout
        title={config.title}
        subtitle={config.subtitle}
        showBackButton={false}
        containerSize="large"
        backgroundImage={adrBg}
      >
                  <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto px-4 sm:px-0">
          {/* Progress Bar - Ultra compacte */}
          <div className="mb-1 sm:mb-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                Étape {currentStep} sur {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            
            {/* Progress Bar simple */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
              <div 
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out ${
                  role === 'participant' ? 'bg-[#FFA500]' : 'bg-[#00008B]'
                }`}
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            
            {/* Indicateurs d'étapes - Ultra compacts */}
            <div className="flex justify-between mt-2">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center ${
                    step <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[7px] sm:text-[9px] font-medium transition-all duration-300 ${
                    step < currentStep 
                      ? 'bg-[#62BF92] text-white' 
                      : step === currentStep 
                        ? (role === 'participant' ? 'bg-[#FFA500] text-white' : 'bg-[#00008B] text-white')
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? '✓' : step}
                  </div>
                  <span className="text-[9px] mt-0.5 font-medium block sm:hidden">
                    {step === 1 ? 'Infos' : 
                     step === 2 ? 'Localisation' : 
                     step === 3 ? 'Photo' : 
                     step === 4 ? 'Préférences' : 
                     step === 5 ? 'Spécialisation' : 'Finalisation'}
                  </span>
                  <span className="text-[10px] mt-0.5 hidden sm:block lg:hidden font-medium">
                    {step === 1 ? 'Infos' : 
                     step === 2 ? 'Localisation' : 
                     step === 3 ? 'Photo' : 
                     step === 4 ? 'Préférences' : 
                     step === 5 ? 'Spécialisation' : 'Finalisation'}
                  </span>
                  <span className="text-xs mt-0.5 hidden lg:block font-medium">
                    {step === 1 ? 'Infos' : 
                     step === 2 ? 'Localisation' : 
                     step === 3 ? 'Photo' : 
                     step === 4 ? 'Préférences' : 
                     step === 5 ? 'Spécialisation' : 'Finalisation'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[450px] sm:min-h-[500px] mt-6 sm:mt-8">
            <div className="animate-fadeIn">
              {renderStep()}
            </div>
          </div>

                      {/* Error Message - Simple et clair */}
            {error && (
              <div className="text-[#EE6239] text-sm bg-[#EE6239]/10 border border-[#EE6239]/20 p-4 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-[#EE6239]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}



          {/* Navigation Buttons - Élégantes et simples */}
          <div className="flex flex-row justify-between items-center gap-3 sm:gap-4 pt-4 sm:pt-8 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 font-medium text-sm sm:text-base ${
                currentStep === 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              } w-auto justify-center`}
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className={`flex items-center gap-1 sm:gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-white font-medium transition-all duration-200 text-sm sm:text-base ${
                  loading || !canProceed()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : role === 'participant' 
                      ? 'bg-[#FFA500] hover:bg-[#FFA500]'
                      : 'bg-[#00008B] hover:bg-[#0000CD]'
                } w-auto justify-center`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Terminer
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-1 sm:gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-white font-medium transition-all duration-200 text-sm sm:text-base ${
                  !canProceed()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : role === 'participant' 
                      ? 'bg-[#FFA500] hover:bg-[#FFA500]'
                      : 'bg-[#00008B] hover:bg-[#0000CD]'
                } w-auto justify-center`}
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>


        </div>
      </AuthLayout>
    </div>
  );
} 