import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserLocation } from '../hooks/useUserLocation';
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import { supabase } from '../lib/supabaseClient';
import HomeLayout from '../components/layout/HomeLayout';
import { 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Edit3, 
  Save, 
  X,
  Bell,
  Shield,
  BarChart3,
  Heart,
  Users,
  Clock,
  Globe,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { 
  uploadProfilePhoto, 
  deleteProfilePhoto, 
  createPreviewUrl, 
  cleanupPreviewUrl, 
  isTemporaryUrl
} from '../utils/imageOptimization';
import { LocationAutocomplete } from '../components/ui/LocationAutocomplete';
import CustomCalendar from '../components/ui/CustomCalendar';
import Select from '../components/form/Select';
import PreferencesManager from '../components/profile/PreferencesManager';
import SubscriptionInfo from '../components/profile/SubscriptionInfo';

interface UserProfile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  date_naissance?: string;
  genre?: string;
  localisation?: string;
  latitude?: number;
  longitude?: number;
  role: string;
  mission?: string;
  mission_autre?: string;
  photo_profil_url?: string;
  date_creation: string;
  preferences_categories?: number[];
  preferences_audiences?: string[];
  preferences_format?: string[];
  preferences_frequence?: string[];
  preferences_tarification?: string[];
  types_evenements_crees?: string[];
  notifications_email?: boolean;
  notifications_push?: boolean;
  notifications_sms?: boolean;
  notification_frequency?: string;
}

type TabType = 'personal' | 'preferences' | 'notifications' | 'security' | 'stats';

export default function ProfilePage() {
  const { user } = useAuth();
  const { location: userLocation } = useUserLocation();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // États pour l'édition
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Hook pour la photo de profil
  const { getOptimizedUrl } = useProfilePhoto({
    userId: user?.id || '',
    userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur',
    initialPhotoUrl: user?.user_metadata?.avatar_url || ''
  });

  // Charger le profil utilisateur
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setEditData(data);
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        setError('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Gestion de la photo de profil
  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La photo doit faire moins de 5MB');
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setNewPhoto(file);
    const preview = createPreviewUrl(file);
    setPhotoPreview(preview);
  };

  const handleSavePhoto = async () => {
    if (!newPhoto || !user) return;

    try {
      setSaving(true);
      
      // Supprimer l'ancienne photo si elle existe
      if (profile?.photo_profil_url && !isTemporaryUrl(profile.photo_profil_url)) {
        await deleteProfilePhoto(profile.photo_profil_url);
      }

      // Uploader la nouvelle photo
      const photoUrl = await uploadProfilePhoto(newPhoto, user.id);
      
      // Mettre à jour le profil
      const { error } = await supabase
        .from('users')
        .update({ photo_profil_url: photoUrl })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, photo_profil_url: photoUrl } : null);
      setEditData(prev => ({ ...prev, photo_profil_url: photoUrl }));
      setNewPhoto(null);
      setPhotoPreview('');
      setSuccess('Photo de profil mise à jour');
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la photo:', err);
      setError('Erreur lors de la mise à jour de la photo');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelPhoto = () => {
    setNewPhoto(null);
    if (photoPreview) {
      cleanupPreviewUrl(photoPreview);
      setPhotoPreview('');
    }
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError('');

      const { error } = await supabase
        .from('users')
        .update(editData)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...editData } : null);
      setEditing(false);
      setSuccess('Profil mis à jour avec succès');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile || {});
    setEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </HomeLayout>
    );
  }

  if (!profile) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">Erreur lors du chargement du profil</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  const tabs = [
    { id: 'personal' as TabType, label: 'Informations', icon: User },
    { id: 'preferences' as TabType, label: 'Préférences', icon: Heart },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
    { id: 'security' as TabType, label: 'Sécurité', icon: Shield },
  ];

  // Ajouter l'onglet statistiques pour les organisateurs
  if (profile.role === 'organisateur') {
    tabs.push({ id: 'stats' as TabType, label: 'Statistiques', icon: BarChart3 });
  }

  const profilePhotoUrl = photoPreview || profile.photo_profil_url || getOptimizedUrl();

  return (
    <HomeLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header du profil - Mobile optimisé */}
        <div className="bg-white">
          <div className="max-w-5xl mx-auto px-4 py-6 lg:py-8">
            {/* Mobile Layout */}
            <div className="lg:hidden">
              {/* Photo en haut sur mobile */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                    {profilePhotoUrl ? (
                      <img 
                        src={profilePhotoUrl} 
                        alt="Photo de profil" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-blue text-white text-lg font-bold">
                        {profile.prenom.charAt(0)}{profile.nom.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {editing && (
                    <div className="absolute -bottom-1 -right-1">
                      <label className="flex items-center justify-center w-6 h-6 bg-primary-blue text-white rounded-full cursor-pointer hover:bg-primary-blue/90 transition-colors">
                        <Edit3 className="w-3 h-3" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Nom et rôle sur la même ligne */}
              <div className="text-center mb-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.prenom} {profile.nom}
                </h1>
                <p className="text-gray-600 flex items-center justify-center gap-1">
                  <span className="capitalize">{profile.role === 'participant' ? 'Participant' : 'Organisateur'}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm">Membre depuis {new Date(profile.date_creation).getFullYear()}</span>
                </p>
              </div>

              {/* Localisation */}
              {userLocation && (
                <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{userLocation}</span>
                </div>
              )}

              {/* Boutons d'action en bas */}
              <div className="flex items-center justify-center gap-3">
                {editing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors disabled:opacity-50 text-sm"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Sauvegarder
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors text-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    Modifier mon profil
                  </button>
                )}
              </div>
            </div>


            {/* Desktop Layout */}
            <div className="hidden lg:flex items-start gap-6">
              {/* Photo de profil */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                  {profilePhotoUrl ? (
                    <img 
                      src={profilePhotoUrl} 
                      alt="Photo de profil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-blue text-white text-2xl font-bold">
                      {profile.prenom.charAt(0)}{profile.nom.charAt(0)}
                    </div>
                  )}
                </div>
                
                {editing && (
                  <div className="absolute -bottom-2 -right-2">
                    <label className="flex items-center justify-center w-8 h-8 bg-primary-blue text-white rounded-full cursor-pointer hover:bg-primary-blue/90 transition-colors">
                      <Edit3 className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.prenom} {profile.nom}
                    </h1>
                    <p className="text-lg text-gray-600 capitalize">
                      {profile.role === 'participant' ? 'Participant' : 'Organisateur'}
                    </p>
                    {userLocation && (
                      <div className="flex items-center gap-2 mt-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{userLocation}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {editing ? (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors disabled:opacity-50"
                        >
                          {saving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Sauvegarder
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Modifier mon profil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages de statut */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Actions pour la photo */}
            {newPhoto && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleSavePhoto}
                  disabled={saving}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Confirmer la photo
                </button>
                <button
                  onClick={handleCancelPhoto}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>


        {/* Carte Organisateurs suivis - Avant la navigation */}
        {profile.role === 'participant' && (
          <div className="bg-white">
            <div className="max-w-5xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between p-4 rounded-lg border border-primary-blue/20" style={{backgroundColor: 'rgba(0, 0, 139, 0.05)'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(0, 0, 139, 0.1)'}}>
                    <UserPlus className="w-5 h-5 text-primary-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Organisateurs suivis</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Organisateurs que vous suivez</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-blue">0</div>
                  <div className="text-xs text-gray-500">suivis</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation par onglets - Scrollable sur mobile */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-blue text-primary-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {activeTab === 'personal' && (
            <PersonalInfoTab 
              profile={profile} 
              editData={editData} 
              setEditData={setEditData} 
              editing={editing} 
            />
          )}
          {activeTab === 'preferences' && (
            <PreferencesTab 
              profile={profile} 
              editData={editData} 
              setEditData={setEditData} 
              editing={editing} 
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab 
              profile={profile} 
              editData={editData} 
              setEditData={setEditData} 
              editing={editing} 
            />
          )}
          {activeTab === 'security' && (
            <SecurityTab profile={profile} />
          )}
          {activeTab === 'stats' && profile.role === 'organisateur' && (
            <StatsTab profile={profile} />
          )}
        </div>
      </div>
    </HomeLayout>
  );
}

// Composant pour les informations personnelles
function PersonalInfoTab({ 
  profile, 
  editData, 
  setEditData, 
  editing 
}: { 
  profile: UserProfile; 
  editData: Partial<UserProfile>; 
  setEditData: (data: Partial<UserProfile>) => void; 
  editing: boolean; 
}) {
  return (
    <div className="space-y-6">
      {/* Informations de base */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations de base</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            {editing ? (
              <input
                type="text"
                value={editData.prenom || ''}
                onChange={(e) => setEditData({ ...editData, prenom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.prenom}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            {editing ? (
              <input
                type="text"
                value={editData.nom || ''}
                onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.nom}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <p className="text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              {profile.email}
            </p>
            <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            {editing ? (
              <input
                type="tel"
                value={editData.telephone || ''}
                onChange={(e) => setEditData({ ...editData, telephone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="Votre numéro de téléphone"
              />
            ) : (
              <p className="text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {profile.telephone || 'Non renseigné'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de naissance
            </label>
            {editing ? (
              <CustomCalendar
                value={editData.date_naissance || ''}
                onChange={(date) => setEditData({ ...editData, date_naissance: date })}
                role={profile.role}
                placeholder="Sélectionnez votre date de naissance"
              />
            ) : (
              <p className="text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {profile.date_naissance ? new Date(profile.date_naissance).toLocaleDateString('fr-FR') : 'Non renseigné'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            {editing ? (
              <Select
                options={[
                  { value: 'homme', label: 'Homme' },
                  { value: 'femme', label: 'Femme' },
                  { value: 'prefere_ne_pas_preciser', label: 'Préfère ne pas préciser' }
                ]}
                placeholder="Sélectionner votre genre"
                defaultValue={editData.genre || ''}
                onChange={(value) => setEditData({ ...editData, genre: value })}
              />
            ) : (
              <p className="text-gray-900">
                {profile.genre === 'homme' ? 'Homme' : 
                 profile.genre === 'femme' ? 'Femme' : 
                 profile.genre === 'prefere_ne_pas_preciser' ? 'Préfère ne pas préciser' : 
                 'Non renseigné'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Localisation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Localisation</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville ou région
          </label>
          {editing ? (
            <LocationAutocomplete
              value={editData.localisation || ''}
              onChange={(location) => setEditData({ ...editData, localisation: location })}
              placeholder="Votre localisation"
            />
          ) : (
            <p className="text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              {profile.localisation || 'Non renseigné'}
            </p>
          )}
        </div>
      </div>

      {/* Mission (pour les organisateurs) */}
      {profile.role === 'organisateur' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Mission</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de mission
            </label>
            {editing ? (
              <input
                type="text"
                value={editData.mission || ''}
                onChange={(e) => setEditData({ ...editData, mission: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="Votre mission"
              />
            ) : (
              <p className="text-gray-900">{profile.mission || 'Non renseigné'}</p>
            )}
          </div>
          {profile.mission === 'autre' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Précision
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editData.mission_autre || ''}
                  onChange={(e) => setEditData({ ...editData, mission_autre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="Précisez votre mission"
                />
              ) : (
                <p className="text-gray-900">{profile.mission_autre || 'Non renseigné'}</p>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// Composant pour les préférences
function PreferencesTab({ 
  profile, 
  editData, 
  setEditData, 
  editing 
}: { 
  profile: UserProfile; 
  editData: Partial<UserProfile>; 
  setEditData: (data: Partial<UserProfile>) => void; 
  editing: boolean; 
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Préférences d'événements</h3>
        <p className="text-gray-600 mb-6">
          Ces préférences nous aident à vous proposer des événements qui vous correspondent.
        </p>
        
        <PreferencesManager
          profile={profile}
          editData={editData}
          setEditData={setEditData}
          editing={editing}
          role={profile.role}
        />
      </div>
    </div>
  );
}

// Composant pour les notifications
function NotificationsTab({ 
  profile, 
  editData, 
  setEditData, 
  editing 
}: { 
  profile: UserProfile; 
  editData: Partial<UserProfile>; 
  setEditData: (data: Partial<UserProfile>) => void; 
  editing: boolean; 
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Préférences de notifications</h3>
        <p className="text-gray-600 mb-6">
          Configurez comment vous souhaitez recevoir les notifications.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notifications par email</h4>
              <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={editData.notifications_email || false}
                onChange={(e) => setEditData({ ...editData, notifications_email: e.target.checked })}
                className="sr-only peer"
                disabled={!editing}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notifications push</h4>
              <p className="text-sm text-gray-500">Recevoir des notifications push sur votre appareil</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={editData.notifications_push || false}
                onChange={(e) => setEditData({ ...editData, notifications_push: e.target.checked })}
                className="sr-only peer"
                disabled={!editing}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notifications SMS</h4>
              <p className="text-sm text-gray-500">Recevoir des notifications par SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={editData.notifications_sms || false}
                onChange={(e) => setEditData({ ...editData, notifications_sms: e.target.checked })}
                className="sr-only peer"
                disabled={!editing}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour la sécurité
function SecurityTab({ profile }: { profile: UserProfile }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sécurité du compte</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Changer le mot de passe</h4>
              <p className="text-sm text-gray-500">Mettez à jour votre mot de passe pour plus de sécurité</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Modifier
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sessions actives</h4>
              <p className="text-sm text-gray-500">Gérez vos sessions de connexion actives</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Voir les sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les statistiques (organisateurs)
function StatsTab({ profile }: { profile: UserProfile }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistiques de votre activité</h3>
        
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Statistiques en cours de développement</p>
        </div>
      </div>
    </div>
  );
}
