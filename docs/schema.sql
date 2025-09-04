SCHEMA RECUPÉRÉ SUR LA BASE DE DONNÉES - LA DERNIERE VERSION

CREATE TABLE public.categories (
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  nom character varying NOT NULL UNIQUE,
  description text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.communaute_utilisateurs (
  id integer NOT NULL DEFAULT nextval('communaute_utilisateurs_id_seq'::regclass),
  user_id uuid NOT NULL,
  communaute_id integer NOT NULL,
  role USER-DEFINED DEFAULT 'participant'::role_utilisateur_enum,
  statut USER-DEFINED DEFAULT 'en_attente'::statut_invitation_enum,
  invited_by uuid,
  message_invitation text,
  date_invitation timestamp without time zone DEFAULT now(),
  date_reponse timestamp without time zone,
  CONSTRAINT communaute_utilisateurs_pkey PRIMARY KEY (id),
  CONSTRAINT communaute_utilisateurs_communaute_id_fkey FOREIGN KEY (communaute_id) REFERENCES public.communautes(id),
  CONSTRAINT communaute_utilisateurs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT communaute_utilisateurs_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.users(id)
);
CREATE TABLE public.communautes (
  id integer NOT NULL DEFAULT nextval('communautes_id_seq'::regclass),
  nom character varying NOT NULL,
  description text,
  slug character varying UNIQUE,
  owner_id uuid NOT NULL,
  type USER-DEFINED NOT NULL,
  est_publique boolean DEFAULT false,
  image_couverture character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT communautes_pkey PRIMARY KEY (id),
  CONSTRAINT communautes_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
);
CREATE TABLE public.event_audiences (
  id integer NOT NULL DEFAULT nextval('event_audiences_id_seq'::regclass),
  event_id integer NOT NULL,
  audience USER-DEFINED NOT NULL,
  CONSTRAINT event_audiences_pkey PRIMARY KEY (id),
  CONSTRAINT event_audiences_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_canaux_diffusion (
  id integer NOT NULL DEFAULT nextval('event_canaux_diffusion_id_seq'::regclass),
  event_id integer NOT NULL,
  canal USER-DEFINED NOT NULL,
  CONSTRAINT event_canaux_diffusion_pkey PRIMARY KEY (id),
  CONSTRAINT event_canaux_diffusion_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_intervenants (
  id integer NOT NULL DEFAULT nextval('event_intervenants_id_seq'::regclass),
  event_id integer NOT NULL,
  nom character varying NOT NULL,
  description text,
  email character varying,
  photo_url character varying,
  role_fonction character varying,
  autres_infos jsonb,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT event_intervenants_pkey PRIMARY KEY (id),
  CONSTRAINT event_intervenants_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_mots_cles (
  id integer NOT NULL DEFAULT nextval('event_mots_cles_id_seq'::regclass),
  event_id integer NOT NULL,
  mot_cle character varying NOT NULL,
  CONSTRAINT event_mots_cles_pkey PRIMARY KEY (id),
  CONSTRAINT event_mots_cles_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_sessions (
  id integer NOT NULL DEFAULT nextval('event_sessions_id_seq'::regclass),
  event_id integer NOT NULL,
  titre character varying NOT NULL,
  description text,
  date_debut timestamp without time zone NOT NULL,
  date_fin timestamp without time zone NOT NULL,
  type_session USER-DEFINED NOT NULL,
  intervenant_id integer,
  salle character varying,
  ordre integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT event_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT event_sessions_intervenant_id_fkey FOREIGN KEY (intervenant_id) REFERENCES public.event_intervenants(id),
  CONSTRAINT event_sessions_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.events (
  id integer NOT NULL DEFAULT nextval('events_id_seq'::regclass),
  titre character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description text,
  programme text,
  sous_categorie_id integer NOT NULL,
  format USER-DEFINED NOT NULL,
  frequence USER-DEFINED NOT NULL DEFAULT 'ponctuel'::frequence_enum,
  statut USER-DEFINED NOT NULL DEFAULT 'brouillon'::statut_evenement_enum,
  type_lieu USER-DEFINED,
  lieu character varying,
  adresse text,
  date_debut timestamp without time zone NOT NULL,
  date_fin timestamp without time zone,
  niveau_privacy USER-DEFINED NOT NULL DEFAULT 'public'::niveau_privacy_enum,
  groupe_prive_id integer,
  tarification USER-DEFINED NOT NULL,
  organisateur_id uuid NOT NULL,
  image_couverture character varying,
  capacite_max integer,
  est_accessible boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  programme_mode character varying DEFAULT 'simple'::character varying CHECK (programme_mode::text = ANY (ARRAY['simple'::character varying, 'structured'::character varying]::text[])),
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_sous_categorie_id_fkey FOREIGN KEY (sous_categorie_id) REFERENCES public.sous_categories(id),
  CONSTRAINT events_organisateur_id_fkey FOREIGN KEY (organisateur_id) REFERENCES public.users(id),
  CONSTRAINT events_groupe_prive_id_fkey FOREIGN KEY (groupe_prive_id) REFERENCES public.communautes(id)
);
CREATE TABLE public.sous_categories (
  id integer NOT NULL DEFAULT nextval('sous_categories_id_seq'::regclass),
  categorie_id integer NOT NULL,
  nom character varying NOT NULL,
  description text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT sous_categories_pkey PRIMARY KEY (id),
  CONSTRAINT sous_categories_categorie_id_fkey FOREIGN KEY (categorie_id) REFERENCES public.categories(id)
);
CREATE TABLE public.tickets (
  id integer NOT NULL DEFAULT nextval('tickets_id_seq'::regclass),
  event_id integer NOT NULL,
  category_id integer,
  nom character varying NOT NULL,
  description text,
  prix numeric NOT NULL DEFAULT 0,
  quantite integer,
  date_debut_vente timestamp without time zone,
  date_fin_vente timestamp without time zone,
  type_billet character varying,
  conditions text,
  is_visible boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  image_url character varying,
  CONSTRAINT tickets_pkey PRIMARY KEY (id),
  CONSTRAINT tickets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.tickets_categories(id),
  CONSTRAINT tickets_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.tickets_categories (
  id integer NOT NULL DEFAULT nextval('tickets_categories_id_seq'::regclass),
  event_id integer NOT NULL,
  nom character varying NOT NULL,
  description text,
  ordre integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT tickets_categories_pkey PRIMARY KEY (id),
  CONSTRAINT tickets_categories_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  nom character varying NOT NULL,
  prenom character varying NOT NULL,
  date_naissance date,
  telephone character varying,
  role USER-DEFINED NOT NULL DEFAULT 'participant'::role_utilisateur_enum,
  statut_compte_enum character varying DEFAULT 'actif'::character varying,
  photo_profil_url character varying,
  date_creation timestamp without time zone DEFAULT now(),
  date_dernier_login timestamp without time zone,
  localisation character varying,
  mission USER-DEFINED,
  mission_autre character varying,
  preferences_categories ARRAY,
  preferences_audiences ARRAY,
  preferences_format ARRAY,
  preferences_frequence ARRAY,
  preferences_tarification ARRAY,
  types_evenements_crees ARRAY,
  latitude numeric CHECK (latitude IS NULL OR latitude >= '-90'::integer::numeric AND latitude <= 90::numeric),
  longitude numeric CHECK (longitude IS NULL OR longitude >= '-180'::integer::numeric AND longitude <= 180::numeric),
  genre USER-DEFINED,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);




SCHEMA	NAME	VALUES	
public
audience_enum	familles, jeunes, serviteurs de Dieu, etudiants, seniors, enfants, couples, ministères, tout_public, femmes, hommes	

public
canal_diffusion_enum	youtube, zoom, instagram_live, facebook_live, site_web, teams, meet	

public
format_enum	en_presentiel, en_ligne, hybride	

public
frequence_enum	ponctuel, quotidien, hebdomadaire, bi_hebdomadaire, mensuel, trimestriel, annuel	

public
genre_enum	homme, femme, prefere_ne_pas_preciser	

public
niveau_privacy_enum	public, prive, sur_invitation	

public
role_mission_enum	eglise_locale, reseau_eglises, ministere_individuel, association_chretienne, ong_chretienne, groupe_jeunesse, pasteur, evangeliste, missionnaire, formateur, conference_orateur, artiste_gospel, label_musical_chretien, compagnie_artistique, maison_dedition, organisateur_festival, organisateur_concert, ecole_biblique, autre	

public
role_utilisateur_enum	participant, organisateur, moderateur, admin	

public
statut_evenement_enum	brouillon, en_attente_validation, valide, publie, archive, refuse	

public
statut_invitation_enum	en_attente, invite, accepte, refuse	

public
tarification_enum	gratuit, payant, don_libre, mixte	

public
type_communauté_enum	eglise, cellule, groupe_jeunes, groupe_femmes, groupe_hommes, ministere, association, reseau, autre	

public
type_evenement_specifique_enum	seminaire, conference, atelier, culte, concert, retreat, formation, webinar	

public
type_lieu_enum	en_salle, en_plein_air, virtuel	

public
type_session_enum	pleniere, atelier, table_ronde, priere, louange, pause, conference, networking, debat, autre	


schema
public


Create a new function

NAME	ARGUMENTS	RETURN TYPE	SECURITY	

can_access_event
event_id_param integer
boolean
Definer	


can_edit_event
event_id_param integer
boolean
Definer	


cleanup_orphaned_profile_photos
-
integer
Invoker	


generate_slug
input_text text
text
Invoker	


generate_unique_slug
base_slug text, table_name text, id_column text, current_id integer DEFAULT NULL::integer
text
Invoker	


get_all_enum_values
-
json
Definer	


get_audience_enum_values
-
text[]
Invoker	


get_audience_enum_values_rpc
-
json
Definer	


get_canal_diffusion_enum_values
-
text[]
Invoker	


get_enum_values
enum_name text
text[]
Invoker	


get_format_enum_values
-
text[]
Invoker	


get_format_enum_values_rpc
-
json
Definer	


get_frequence_enum_values
-
text[]
Invoker	


get_frequence_enum_values_rpc
-
json
Definer	


get_genre_enum_values
-
text[]
Definer	


get_genre_enum_values_rpc
-
json
Definer	


get_langue_enum_values
-
text[]
Invoker	


get_langue_enum_values_rpc
-
json
Definer	


get_niveau_difficulte_enum_values
-
text[]
Invoker	


get_niveau_difficulte_enum_values_rpc
-
json
Definer	


get_niveau_privacy_enum_values
-
text[]
Invoker	


get_niveau_privacy_enum_values_rpc
-
json
Definer	


get_optimized_profile_photo_url
user_id uuid
text
Invoker	


get_role_mission_enum_values
-
text[]
Invoker	


get_role_mission_enum_values_rpc
-
json
Definer	


get_role_utilisateur_enum_values
-
text[]
Invoker	


get_role_utilisateur_enum_values_rpc
-
json
Definer	


get_statut_evenement_enum_values
-
text[]
Invoker	


get_statut_evenement_enum_values_rpc
-
json
Definer	


get_tarification_enum_values
-
text[]
Invoker	


get_tarification_enum_values_rpc
-
json
Definer	


get_type_communauté_enum_values
-
text[]
Invoker	


get_type_communauté_enum_values_rpc
-
json
Definer	


get_type_evenement_specifique_enum_values
-
text[]
Invoker	


get_type_evenement_specifique_enum_values_rpc
-
json
Definer	


get_type_lieu_enum_values
-
text[]
Invoker	


get_type_lieu_enum_values_rpc
-
json
Definer	


get_type_session_enum_values
-
text[]
Invoker	


handle_user_photo_deletion
-
trigger
Invoker	


test_profile_photo_setup
-
text
Invoker	


trigger_generate_event_slug
-
trigger
Invoker	


update_updated_at_column
-
trigger
Invoker	


validate_profile_photo_url
photo_url text
boolean
Invoker	



NAME	TABLE	FUNCTION	EVENTS	ORIENTATION	ENABLED	
generate_event_slug_trigger	
events
trigger_generate_event_slug
BEFORE UPDATE
BEFORE INSERT
ROW

update_event_intervenants_updated_at	
event_intervenants
update_updated_at_column
BEFORE UPDATE
ROW

update_event_sessions_updated_at	
event_sessions
update_updated_at_column
BEFORE UPDATE
ROW

update_events_updated_at	
events
update_updated_at_column
BEFORE UPDATE
ROW

update_tickets_categories_updated_at	
tickets_categories
update_updated_at_column
BEFORE UPDATE
ROW

update_tickets_updated_at	
tickets
update_updated_at_column
BEFORE UPDATE
ROW

user_photo_deletion_trigger	
users
handle_user_photo_deletion
AFTER UPDATE
ROW

Database Indexes
Improve query performance against your database
Docs
Index Advisor

schema
public


Create index
SCHEMA	TABLE	NAME	
public
categories
categories_nom_key

View definition

public
categories
categories_pkey

View definition

public
communaute_utilisateurs
communaute_utilisateurs_pkey

View definition

public
communautes
communautes_pkey

View definition

public
event_audiences
event_audiences_pkey

View definition

public
event_canaux_diffusion
event_canaux_diffusion_pkey

View definition

public
event_intervenants
event_intervenants_pkey

View definition

public
event_mots_cles
event_mots_cles_pkey

View definition

public
event_sessions
event_sessions_pkey

View definition

public
events
events_pkey

View definition

public
communaute_utilisateurs
idx_communaute_utilisateurs_communaute

View definition

public
communaute_utilisateurs
idx_communaute_utilisateurs_unique

View definition

public
communaute_utilisateurs
idx_communaute_utilisateurs_user

View definition

public
communautes
idx_communautes_owner

View definition

public
communautes
idx_communautes_slug

View definition

public
communautes
idx_communautes_type

View definition

public
event_audiences
idx_event_audiences_event

View definition

public
event_audiences
idx_event_audiences_unique

View definition

public
event_canaux_diffusion
idx_event_canaux_event

View definition

public
event_canaux_diffusion
idx_event_canaux_unique

View definition

public
event_intervenants
idx_event_intervenants_event

View definition

public
event_mots_cles
idx_event_mots_cles_event

View definition

public
event_mots_cles
idx_event_mots_cles_unique

View definition

public
event_sessions
idx_event_sessions_event

View definition

public
event_sessions
idx_event_sessions_intervenant

View definition

public
events
idx_events_date_debut

View definition

public
events
idx_events_date_debut_statut

View definition

public
events
idx_events_organisateur

View definition

public
events
idx_events_organisateur_statut

View definition

public
events
idx_events_slug

View definition

public
events
idx_events_sous_categorie

View definition

public
events
idx_events_statut

View definition

public
sous_categories
idx_sous_categories_categorie

View definition

public
tickets_categories
idx_tickets_categories_event

View definition

public
tickets
idx_tickets_category

View definition

public
tickets
idx_tickets_event

View definition

public
users
idx_users_email

View definition

public
users
idx_users_genre

View definition

public
users
idx_users_localisation

View definition

public
users
idx_users_location

View definition

public
users
idx_users_photo_profil_url

View definition

public
users
idx_users_preferences_audiences

View definition

public
users
idx_users_preferences_categories

View definition

public
users
idx_users_role_mission

View definition

public
sous_categories
sous_categories_pkey

View definition

public
tickets_categories
tickets_categories_pkey

View definition

public
tickets
tickets_pkey

View definition

public
users
users_pkey

View definition



Database Roles
Manage access control to your database through users, groups, and permissions

All roles
Active roles

Active connections
10/60

Add role
Roles managed by Supabase
Protected

anon
(ID: 16480)
0 connections

authenticated
(ID: 16481)
0 connections

authenticator
(ID: 16483)
1 connections

dashboard_user
(ID: 16601)
0 connections

pgbouncer
(ID: 16385)
1 connections

service_role
(ID: 16482)
0 connections

supabase_admin
(ID: 10)
5 connections

supabase_auth_admin
(ID: 16541)
0 connections

supabase_read_only_user
(ID: 16430)
0 connections

supabase_realtime_admin
(ID: 17232)
0 connections

supabase_replication_admin
(ID: 16427)
0 connections

supabase_storage_admin
(ID: 16596)
1 connections
Other database roles

postgres
(ID: 16384)
2 connections


supabase_etl_admin
(ID: 16428)
0 connections