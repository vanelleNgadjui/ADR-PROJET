// =====================================================
// TYPES TYPESCRIPT POUR LA BASE DE DONNÉES
// "L'AGENDA DU ROYAUME"
// =====================================================

// =====================================================
// TYPES ENUM
// =====================================================

// Enums basés sur le schéma SQL réel (version réelle de la DB)
export type FormatEnum = 'en_presentiel' | 'en_ligne' | 'hybride';

export type TarificationEnum = 'gratuit' | 'payant' | 'don_libre' | 'mixte';

export type StatutEvenementEnum = 'brouillon' | 'en_attente_validation' | 'valide' | 'publie' | 'archive' | 'refuse';

export type FrequenceEnum = 'ponctuel' | 'quotidien' | 'hebdomadaire' | 'bi_hebdomadaire' | 'mensuel' | 'trimestriel' | 'annuel';

export type TypeLieuEnum = 'en_salle' | 'en_plein_air' | 'virtuel';

export type NiveauPrivacyEnum = 'public' | 'prive' | 'sur_invitation';

export type TypeCommunautéEnum = 'eglise' | 'cellule' | 'groupe_jeunes' | 'groupe_femmes' | 'groupe_hommes' | 'ministere' | 'association' | 'reseau' | 'autre';

export type TypeEvenementSpecifiqueEnum = 'seminaire' | 'conference' | 'atelier' | 'culte' | 'concert' | 'retreat' | 'formation' | 'webinar';

export type RoleUtilisateurEnum = 'participant' | 'organisateur' | 'moderateur' | 'admin';

export type TypeSessionEnum = 'pleniere' | 'atelier' | 'table_ronde' | 'priere' | 'louange' | 'pause' | 'conference' | 'networking' | 'debat' | 'autre';

// Nouveaux enums ajoutés dans la DB réelle
export type StatutInvitationEnum = 'en_attente' | 'invite' | 'accepte' | 'refuse';

export type RoleMissionEnum = 'eglise_locale' | 'reseau_eglises' | 'ministere_individuel' | 'association_chretienne' | 'ong_chretienne' | 'groupe_jeunesse' | 'pasteur' | 'evangeliste' | 'missionnaire' | 'formateur' | 'conference_orateur' | 'artiste_gospel' | 'label_musical_chretien' | 'compagnie_artistique' | 'maison_dedition' | 'organisateur_festival' | 'organisateur_concert' | 'ecole_biblique' | 'autre';

export type GenreEnum = 'homme' | 'femme' | 'prefere_ne_pas_preciser';

export type AudienceEnum = 'familles' | 'jeunes' | 'serviteurs de Dieu' | 'etudiants' | 'seniors' | 'enfants' | 'couples' | 'ministères' | 'tout_public' | 'femmes' | 'hommes';

export type CanalDiffusionEnum = 'youtube' | 'zoom' | 'instagram_live' | 'facebook_live' | 'site_web' | 'teams' | 'meet';



// =====================================================
// INTERFACES DES TABLES
// =====================================================

// Table users (version réelle de la DB)
export interface User {
  id: string; // UUID
  email: string;
  password_hash: string;
  nom: string;
  prenom: string;
  date_naissance?: string; // DATE
  telephone?: string;
  role: RoleUtilisateurEnum;
  statut_compte_enum?: string;
  photo_profil_url?: string;
  date_creation: string; // TIMESTAMP
  date_dernier_login?: string; // TIMESTAMP
  localisation?: string;
  mission?: RoleMissionEnum;
  mission_autre?: string;
  preferences_categories?: number[]; // ARRAY
  preferences_audiences?: AudienceEnum[]; // ARRAY
  preferences_format?: FormatEnum[]; // ARRAY
  preferences_frequence?: FrequenceEnum[]; // ARRAY
  preferences_tarification?: TarificationEnum[]; // ARRAY
  types_evenements_crees?: TypeEvenementSpecifiqueEnum[]; // ARRAY
  latitude?: number;
  longitude?: number;
  genre?: GenreEnum;
  // Nouveaux champs ajoutés
  notifications_email?: boolean;
  notifications_push?: boolean;
  notifications_sms?: boolean;
  notification_frequency?: 'immediate' | 'daily' | 'weekly';
}

// Table categories
export interface Category {
  id: number;
  nom: string;
  description?: string;
  created_at: string; // TIMESTAMP
}

// Table sous_categories
export interface SousCategorie {
  id: number;
  categorie_id: number;
  nom: string;
  description?: string;
  created_at: string; // TIMESTAMP
}

// Table communautes
export interface Communaute {
  id: number;
  nom: string;
  description?: string;
  slug: string;
  owner_id: string; // UUID
  type: TypeCommunautéEnum;
  est_publique: boolean;
  image_couverture?: string;
  created_at: string; // TIMESTAMP
}

// Table events (table centrale - version réelle de la DB)
export interface Event {
  id: number;
  titre: string;
  slug: string;
  description?: string;
  programme?: string;
  programme_mode: 'simple' | 'structured'; // Champ obligatoire avec contrainte CHECK
  sous_categorie_id: number;
  format: FormatEnum;
  frequence: FrequenceEnum;
  statut: StatutEvenementEnum;
  type_lieu?: TypeLieuEnum;
  lieu?: string;
  adresse?: string;
  date_debut: string; // TIMESTAMP
  date_fin?: string; // TIMESTAMP
  niveau_privacy: NiveauPrivacyEnum;
  groupe_prive_id?: number;
  tarification: TarificationEnum;
  organisateur_id: string; // UUID
  image_couverture?: string;
  capacite_max?: number;
  est_accessible: boolean;
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
}

// Table communaute_utilisateurs (version réelle de la DB)
export interface CommunauteUtilisateur {
  id: number;
  user_id: string; // UUID
  communaute_id: number;
  role: RoleUtilisateurEnum;
  statut: StatutInvitationEnum;
  invited_by?: string; // UUID
  message_invitation?: string;
  date_invitation: string; // TIMESTAMP
  date_reponse?: string; // TIMESTAMP
}

// Table event_audiences
export interface EventAudience {
  id: number;
  event_id: number;
  audience: AudienceEnum;
}

// Table event_canaux_diffusion
export interface EventCanalDiffusion {
  id: number;
  event_id: number;
  canal: CanalDiffusionEnum;
}

// Table event_mots_cles
export interface EventMotCle {
  id: number;
  event_id: number;
  mot_cle: string;
}

// Table tickets_categories (selon le schéma SQL)
export interface TicketCategorie {
  id: number;
  event_id: number;
  nom: string;
  description?: string;
  ordre: number;
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
}

// Table tickets (version réelle de la DB)
export interface Ticket {
  id: number;
  event_id: number;
  category_id?: number;
  nom: string;
  description?: string;
  prix: number; // NUMERIC
  quantite?: number;
  date_debut_vente?: string; // TIMESTAMP
  date_fin_vente?: string; // TIMESTAMP
  type_billet?: string;
  conditions?: string;
  is_visible: boolean;
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
  image_url?: string; // URL de l'image du ticket (ajouté dans la DB réelle)
}

// Table event_intervenants
export interface EventIntervenant {
  id: number;
  event_id: number;
  nom: string;
  description?: string;
  email?: string;
  photo_url?: string;
  role_fonction?: string;
  autres_infos?: Record<string, any>; // JSONB
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
}

// Table event_sessions (version réelle de la DB)
export interface EventSession {
  id: number;
  event_id: number;
  titre: string;
  description?: string;
  date_debut: string; // TIMESTAMP
  date_fin: string; // TIMESTAMP
  type_session: TypeSessionEnum; // Utilise le bon enum de la DB
  intervenant_id?: number;
  salle?: string;
  ordre: number;
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
}

// =====================================================
// NOUVELLES TABLES AJOUTÉES
// =====================================================

// Table user_follows (nouvelle)
export interface UserFollow {
  id: number;
  follower_id: string; // UUID
  followed_id: string; // UUID
  created_at: string; // TIMESTAMP
}

// Table event_favorites (nouvelle)
export interface EventFavorite {
  id: number;
  user_id: string; // UUID
  event_id: number;
  created_at: string; // TIMESTAMP
}

// =====================================================
// TYPES POUR LES RELATIONS
// =====================================================

// Event avec relations
export interface EventWithRelations extends Event {
  sous_categorie?: SousCategorie;
  organisateur?: User;
  groupe_prive?: Communaute;
  audiences?: EventAudience[];
  canaux_diffusion?: EventCanalDiffusion[];
  mots_cles?: EventMotCle[];
  tickets_categories?: TicketCategorie[];
  tickets?: Ticket[];
  intervenants?: EventIntervenant[];
  sessions?: EventSession[];
}

// Category avec sous-catégories
export interface CategoryWithSousCategories extends Category {
  sous_categories?: SousCategorie[];
}

// Communaute avec membres
export interface CommunauteWithMembers extends Communaute {
  owner?: User;
  membres?: CommunauteUtilisateur[];
}

// User avec relations
export interface UserWithRelations extends User {
  communautes?: CommunauteUtilisateur[];
  events_organises?: Event[];
}

// =====================================================
// TYPES POUR LES REQUÊTES
// =====================================================

// Filtres pour les événements
export interface EventFilters {
  statut?: StatutEvenementEnum[];
  format?: FormatEnum[];
  date_debut_min?: string;
  date_debut_max?: string;
  sous_categorie_id?: number;
  organisateur_id?: string;
  niveau_privacy?: NiveauPrivacyEnum[];
  tarification?: TarificationEnum[];
  audience?: AudienceEnum[];
  mots_cles?: string[];
}

// Options de pagination
export interface PaginationOptions {
  page?: number;
  limit?: number;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

// Résultat paginé
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// =====================================================
// TYPES POUR LES FORMULAIRES
// =====================================================

// Formulaire de création d'événement
export interface CreateEventForm {
  titre: string;
  description?: string;
  programme?: string;
  sous_categorie_id: number;
  format: FormatEnum;
  frequence: FrequenceEnum;
  type_lieu?: TypeLieuEnum;
  lieu?: string;
  adresse?: string;
  date_debut: string;
  date_fin?: string;
  niveau_privacy: NiveauPrivacyEnum;
  groupe_prive_id?: number;
  tarification: TarificationEnum;
  image_couverture?: string;
  capacite_max?: number;
  est_accessible: boolean;
  audiences?: AudienceEnum[];
  canaux_diffusion?: CanalDiffusionEnum[];
  mots_cles?: string[];
}

// Formulaire de mise à jour d'événement
export interface UpdateEventForm extends Partial<CreateEventForm> {
  id: number;
}

// Formulaire de création d'utilisateur
export interface CreateUserForm {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  date_naissance?: string;
  telephone?: string;
  role?: RoleUtilisateurEnum;
}

// Formulaire de création de communauté
export interface CreateCommunauteForm {
  nom: string;
  description?: string;
  type: TypeCommunautéEnum;
  est_publique: boolean;
  image_couverture?: string;
}

// =====================================================
// TYPES POUR LES RÉPONSES API
// =====================================================

// Réponse API générique
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Réponse pour les événements
export type EventsResponse = ApiResponse<PaginatedResult<EventWithRelations>>;

// Réponse pour un événement
export type EventResponse = ApiResponse<EventWithRelations>;

// Réponse pour les catégories
export type CategoriesResponse = ApiResponse<CategoryWithSousCategories[]>;

// Réponse pour les communautés
export type CommunautesResponse = ApiResponse<PaginatedResult<CommunauteWithMembers>>;

// =====================================================
// TYPES POUR LES HOOKS ET SERVICES
// =====================================================

// Options pour les hooks de données
export interface UseDataOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

// État de chargement
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: Error;
}

// État de mutation
export interface MutationState extends LoadingState {
  isSuccess: boolean;
  isIdle: boolean;
}

// =====================================================
// EXPORT DES TYPES PRINCIPAUX
// =====================================================

// Tous les types sont déjà exportés individuellement ci-dessus
// Pas besoin de les réexporter ici 