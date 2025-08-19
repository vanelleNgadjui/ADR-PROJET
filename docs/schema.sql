-- =====================================================
-- SCHÉMA SQL COMPLET POUR "L'AGENDA DU ROYAUME"
-- =====================================================

-- Activation de l'extension UUID (si elle n'existe pas déjà)
DO $$ BEGIN
    CREATE EXTENSION "uuid-ossp";
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 1. CRÉATION DES TYPES ENUM
-- =====================================================

-- Format des événements
DO $$ BEGIN
    CREATE TYPE format_enum AS ENUM (
      'en_presentiel',
      'en_ligne',
      'hybride'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tarification
DO $$ BEGIN
    CREATE TYPE tarification_enum AS ENUM (
      'gratuit',
      'payant',
      'don_libre',
      'mixte'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Statut des événements
DO $$ BEGIN
    CREATE TYPE statut_evenement_enum AS ENUM (
      'brouillon',
      'en_attente_validation',
      'valide',
      'publie',
      'archive',
      'refuse'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Fréquence des événements
DO $$ BEGIN
    CREATE TYPE frequence_enum AS ENUM (
      'ponctuel',
      'quotidien',
      'hebdomadaire',
      'bi_hebdomadaire',
      'mensuel',
      'trimestriel',
      'annuel'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Langues
DO $$ BEGIN
    CREATE TYPE langue_enum AS ENUM (
      'fr',
      'en',
      'es',
      'pt',
      'ar',
      'autre'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Niveau de difficulté
DO $$ BEGIN
    CREATE TYPE niveau_difficulte_enum AS ENUM (
      'debutant',
      'intermediaire',
      'avance'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type de lieu
DO $$ BEGIN
    CREATE TYPE type_lieu_enum AS ENUM (
      'en_salle',
      'en_plein_air',
      'virtuel'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Niveau de confidentialité
DO $$ BEGIN
    CREATE TYPE niveau_privacy_enum AS ENUM (
      'public',
      'prive',
      'sur_invitation'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type de communauté
DO $$ BEGIN
    CREATE TYPE type_communauté_enum AS ENUM (
      'eglise',
      'cellule',
      'groupe_jeunes',
      'groupe_femmes',
      'groupe_hommes',
      'ministere',
      'association',
      'reseau',
      'autre'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type d'événement spécifique
DO $$ BEGIN
    CREATE TYPE type_evenement_specifique_enum AS ENUM (
      'seminaire',
      'conference',
      'atelier',
      'culte',
      'concert',
      'retreat',
      'formation',
      'webinar'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Rôle utilisateur
DO $$ BEGIN
    CREATE TYPE role_utilisateur_enum AS ENUM (
      'participant',
      'organisateur',
      'moderateur',
      'admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type de session
DO $$ BEGIN
    CREATE TYPE type_session_enum AS ENUM (
      'pleniere',
      'atelier',
      'table_ronde',
      'priere',
      'louange',
      'pause'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Audience cible
DO $$ BEGIN
    CREATE TYPE audience_enum AS ENUM (
      'familles',
      'jeunes',
      'pasteurs',
      'etudiants',
      'seniors',
      'enfants',
      'couples',
      'tout_public'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Canal de diffusion
DO $$ BEGIN
    CREATE TYPE canal_diffusion_enum AS ENUM (
      'youtube',
      'zoom',
      'instagram_live',
      'facebook_live',
      'site_web',
      'teams',
      'meet'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;



-- =====================================================
-- 2. CRÉATION DES TABLES PRINCIPALES
-- =====================================================

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE,
  telephone VARCHAR(20),
  role role_utilisateur_enum NOT NULL DEFAULT 'participant',
  statut_compte_enum VARCHAR(50) DEFAULT 'actif',
  photo_profil_url VARCHAR(255),
  date_creation TIMESTAMP DEFAULT NOW(),
  date_dernier_login TIMESTAMP,
  
  -- Contrainte d'unicité
  CONSTRAINT idx_users_email UNIQUE (email)
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des sous-catégories
CREATE TABLE IF NOT EXISTS sous_categories (
  id SERIAL PRIMARY KEY,
  categorie_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Contrainte d'unicité
  CONSTRAINT idx_sous_categories_categorie UNIQUE (categorie_id, nom)
);

-- Table des communautés
CREATE TABLE IF NOT EXISTS communautes (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  slug VARCHAR(150) UNIQUE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type type_communauté_enum NOT NULL,
  est_publique BOOLEAN DEFAULT FALSE,
  image_couverture VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Contrainte d'unicité
  CONSTRAINT idx_communautes_slug UNIQUE (slug)
);

-- Table des événements (table centrale)
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  programme TEXT,
  sous_categorie_id INT NOT NULL REFERENCES sous_categories(id) ON DELETE RESTRICT,
  format format_enum NOT NULL,
  frequence frequence_enum NOT NULL DEFAULT 'ponctuel',
  langue langue_enum NOT NULL DEFAULT 'fr',
  niveau_difficulte niveau_difficulte_enum,
  statut statut_evenement_enum NOT NULL DEFAULT 'brouillon',
  type_lieu type_lieu_enum,
  lieu VARCHAR(255),
  adresse TEXT,
  date_debut TIMESTAMP NOT NULL,
  date_fin TIMESTAMP,
  niveau_privacy niveau_privacy_enum NOT NULL DEFAULT 'public',
  groupe_prive_id INT REFERENCES communautes(id) ON DELETE SET NULL,
  tarification tarification_enum NOT NULL,
  organisateur_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_couverture VARCHAR(255),
  capacite_max INT,
  est_accessible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Contrainte d'unicité pour le slug
  CONSTRAINT idx_events_slug UNIQUE (slug)
);

-- =====================================================
-- 3. TABLES ASSOCIATIVES
-- =====================================================

-- Table associative communauté-utilisateurs
CREATE TABLE IF NOT EXISTS communaute_utilisateurs (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  communaute_id INT NOT NULL REFERENCES communautes(id) ON DELETE CASCADE,
  role role_utilisateur_enum DEFAULT 'participant',
  date_adhésion TIMESTAMP DEFAULT NOW(),
  
  -- Contrainte d'unicité
  CONSTRAINT idx_communaute_utilisateurs_unique UNIQUE (user_id, communaute_id)
);

-- Table des audiences cibles
CREATE TABLE IF NOT EXISTS event_audiences (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  audience audience_enum NOT NULL,
  
  -- Contrainte d'unicité
  CONSTRAINT idx_event_audiences_unique UNIQUE (event_id, audience)
);

-- Table des canaux de diffusion
CREATE TABLE IF NOT EXISTS event_canaux_diffusion (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  canal canal_diffusion_enum NOT NULL,
  
  -- Contrainte d'unicité
  CONSTRAINT idx_event_canaux_unique UNIQUE (event_id, canal)
);

-- Table des mots-clés
CREATE TABLE IF NOT EXISTS event_mots_cles (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  mot_cle VARCHAR(100) NOT NULL,
  
  -- Contrainte d'unicité
  CONSTRAINT idx_event_mots_cles_unique UNIQUE (event_id, mot_cle)
);

-- =====================================================
-- 4. SYSTÈME DE BILLETTERIE
-- =====================================================

-- Catégories de billets
CREATE TABLE IF NOT EXISTS tickets_categories (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  ordre INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Billets individuels
CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category_id INT REFERENCES tickets_categories(id) ON DELETE SET NULL,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  prix NUMERIC(10,2) NOT NULL DEFAULT 0,
  quantite INT,
  date_debut_vente TIMESTAMP,
  date_fin_vente TIMESTAMP,
  type_billet VARCHAR(100),
  conditions TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. SESSIONS ET INTERVENANTS
-- =====================================================

-- Intervenants des événements
CREATE TABLE IF NOT EXISTS event_intervenants (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  email VARCHAR(255),
  photo_url VARCHAR(255),
  role_fonction VARCHAR(100),
  autres_infos JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions des événements
CREATE TABLE IF NOT EXISTS event_sessions (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date_debut TIMESTAMP NOT NULL,
  date_fin TIMESTAMP NOT NULL,
  type_session type_session_enum NOT NULL,
  intervenant_id INT REFERENCES event_intervenants(id) ON DELETE SET NULL,
  salle VARCHAR(255),
  ordre INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. FONCTIONS ET TRIGGERS
-- =====================================================

-- Fonction pour générer un slug à partir d'un titre
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour générer un slug unique
CREATE OR REPLACE FUNCTION generate_unique_slug(base_slug TEXT, table_name TEXT, id_column TEXT, current_id INT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  new_slug TEXT;
  counter INT := 0;
  exists_count INT;
BEGIN
  new_slug := base_slug;
  
  LOOP
    -- Vérifier si le slug existe déjà
    EXECUTE format('SELECT COUNT(*) FROM %I WHERE %I = $1', table_name, id_column) 
    INTO exists_count 
    USING new_slug;
    
    -- Si l'ID actuel est fourni, exclure cet enregistrement du comptage
    IF current_id IS NOT NULL THEN
      EXECUTE format('SELECT COUNT(*) FROM %I WHERE %I = $1 AND id != $2', table_name, id_column) 
      INTO exists_count 
      USING new_slug, current_id;
    END IF;
    
    -- Si le slug n'existe pas, on peut l'utiliser
    IF exists_count = 0 THEN
      RETURN new_slug;
    END IF;
    
    -- Sinon, ajouter un suffixe numérique
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le slug des événements
CREATE OR REPLACE FUNCTION trigger_generate_event_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_unique_slug(
      generate_slug(NEW.titre), 
      'events', 
      'slug', 
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    CREATE TRIGGER generate_event_slug_trigger
      BEFORE INSERT OR UPDATE ON events
      FOR EACH ROW
      EXECUTE FUNCTION trigger_generate_event_slug();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Application du trigger updated_at sur les tables concernées
DO $$ BEGIN
    CREATE TRIGGER update_events_updated_at
      BEFORE UPDATE ON events
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_tickets_categories_updated_at
      BEFORE UPDATE ON tickets_categories
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_tickets_updated_at
      BEFORE UPDATE ON tickets
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_event_intervenants_updated_at
      BEFORE UPDATE ON event_intervenants
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_event_sessions_updated_at
      BEFORE UPDATE ON event_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 7. CONTRAINTES MÉTIER
-- =====================================================

-- Contrainte : Un événement privé doit avoir un groupe privé
DO $$ BEGIN
    ALTER TABLE events 
    ADD CONSTRAINT check_private_event_has_group 
    CHECK (
      (niveau_privacy = 'prive' AND groupe_prive_id IS NOT NULL) OR 
      (niveau_privacy != 'prive')
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Contrainte : Une communauté publique ne peut avoir que des événements publics
-- (Cette contrainte sera vérifiée au niveau application ou avec un trigger)
-- Note: PostgreSQL ne permet pas les sous-requêtes dans les contraintes CHECK

-- Contrainte : Seuls les organisateurs/admins peuvent créer des événements
-- (Cette contrainte sera vérifiée au niveau application)

-- Contrainte : Une communauté publique ne peut avoir que des événements publics
-- (Cette contrainte sera vérifiée au niveau application)

-- =====================================================
-- 8. INDEX DE PERFORMANCE
-- =====================================================

-- Index pour les recherches rapides d'événements
DO $$ BEGIN
    CREATE INDEX idx_events_date_debut ON events(date_debut);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_events_statut ON events(statut);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_events_organisateur ON events(organisateur_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_events_date_debut_statut ON events(date_debut, statut);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_events_organisateur_statut ON events(organisateur_id, statut);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_events_sous_categorie ON events(sous_categorie_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Index pour les recherches de communautés
DO $$ BEGIN
    CREATE INDEX idx_communautes_owner ON communautes(owner_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_communautes_type ON communautes(type);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Index pour les tables associatives
DO $$ BEGIN
    CREATE INDEX idx_communaute_utilisateurs_user ON communaute_utilisateurs(user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_communaute_utilisateurs_communaute ON communaute_utilisateurs(communaute_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Index pour les audiences et canaux
DO $$ BEGIN
    CREATE INDEX idx_event_audiences_event ON event_audiences(event_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_event_canaux_event ON event_canaux_diffusion(event_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_event_mots_cles_event ON event_mots_cles(event_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Index pour la billetterie
DO $$ BEGIN
    CREATE INDEX idx_tickets_categories_event ON tickets_categories(event_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_tickets_event ON tickets(event_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_tickets_category ON tickets(category_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Index pour les sessions et intervenants
DO $$ BEGIN
    CREATE INDEX idx_event_intervenants_event ON event_intervenants(event_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_event_sessions_event ON event_sessions(event_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE INDEX idx_event_sessions_intervenant ON event_sessions(intervenant_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =====================================================
-- 9. DONNÉES DE BASE (OPTIONNEL)
-- =====================================================

-- Insertion de catégories de base
INSERT INTO categories (nom, description) 
SELECT * FROM (VALUES
  ('Culte & Adoration', 'Cérémonies de culte, temps d''adoration et de louange'),
  ('Enseignement & Formation', 'Cours, séminaires, formations bibliques'),
  ('Évangélisation & Mission', 'Événements d''évangélisation et mission'),
  ('Communion & Fraternité', 'Temps de partage, repas communautaires'),
  ('Prière & Intercession', 'Temps de prière, veillées, intercession'),
  ('Jeunesse & Enfants', 'Activités spécifiques aux jeunes et enfants'),
  ('Social & Entraide', 'Actions sociales, aide humanitaire'),
  ('Arts & Culture', 'Concerts, expositions, événements culturels')
) AS v(nom, description)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE categories.nom = v.nom);

-- Insertion de sous-catégories de base
INSERT INTO sous_categories (categorie_id, nom, description) 
SELECT * FROM (VALUES
  (1, 'Culte dominical', 'Culte principal du dimanche'),
  (1, 'Culte de prière', 'Culte centré sur la prière'),
  (1, 'Temps d''adoration', 'Sessions d''adoration et de louange'),
  (2, 'École biblique', 'Formation biblique approfondie'),
  (2, 'Séminaire théologique', 'Formation théologique'),
  (2, 'Atelier pratique', 'Ateliers pratiques et formations'),
  (3, 'Évangélisation de rue', 'Évangélisation en extérieur'),
  (3, 'Conférence missionnaire', 'Conférences sur la mission'),
  (4, 'Repas communautaire', 'Repas partagés en communauté'),
  (4, 'Café fraternel', 'Temps de convivialité'),
  (5, 'Veillée de prière', 'Veillées de prière nocturnes'),
  (5, 'Intercession', 'Temps d''intercession'),
  (6, 'Groupe de jeunes', 'Activités pour les jeunes'),
  (6, 'École du dimanche', 'Activités pour les enfants'),
  (7, 'Distribution alimentaire', 'Aide alimentaire'),
  (7, 'Soutien scolaire', 'Aide aux devoirs'),
  (8, 'Concert chrétien', 'Concerts de musique chrétienne'),
  (8, 'Exposition artistique', 'Expositions d''art chrétien')
) AS v(categorie_id, nom, description)
WHERE NOT EXISTS (
  SELECT 1 FROM sous_categories 
  WHERE sous_categories.categorie_id = v.categorie_id 
  AND sous_categories.nom = v.nom
);

-- =====================================================
-- FIN DU SCHÉMA
-- =====================================================

-- Commentaire de fin
COMMENT ON SCHEMA public IS 'Base de données pour la plateforme "L''Agenda du Royaume" - Gestion d''événements chrétiens'; 