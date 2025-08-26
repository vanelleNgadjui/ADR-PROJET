-- Migration pour ajouter le système de sessions d'événements

-- 1. Ajouter le champ programme_mode à la table events
ALTER TABLE events ADD COLUMN programme_mode VARCHAR(20) DEFAULT 'simple' CHECK (programme_mode IN ('simple', 'structured'));

-- 2. Créer le type enum pour les types de sessions
CREATE TYPE type_session_enum AS ENUM (
  'pleniere',
  'atelier',
  'table_ronde',
  'priere',
  'louange',
  'pause',
  'conference',
  'networking',
  'debat',
  'autre'
);

-- 3. Créer la table event_sessions
CREATE TABLE public.event_sessions (
  id serial not null,
  event_id integer not null,
  titre character varying(255) not null,
  description text null,
  date_debut timestamp without time zone not null,
  date_fin timestamp without time zone not null,
  type_session type_session_enum not null,
  intervenant_id integer null,
  salle character varying(255) null,
  ordre integer null default 0,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  constraint event_sessions_pkey primary key (id),
  constraint event_sessions_event_id_fkey foreign KEY (event_id) references events (id) on delete CASCADE,
  constraint event_sessions_intervenant_id_fkey foreign KEY (intervenant_id) references event_intervenants (id) on delete set null
) TABLESPACE pg_default;

-- 4. Créer les index
CREATE INDEX IF not exists idx_event_sessions_event on public.event_sessions using btree (event_id) TABLESPACE pg_default;
CREATE INDEX IF not exists idx_event_sessions_intervenant on public.event_sessions using btree (intervenant_id) TABLESPACE pg_default;

-- 5. Créer le trigger pour updated_at
CREATE TRIGGER update_event_sessions_updated_at BEFORE
update on event_sessions for EACH row
execute FUNCTION update_updated_at_column();

-- 6. Commentaires pour la documentation
COMMENT ON TABLE event_sessions IS 'Sessions structurées d''un événement';
COMMENT ON COLUMN event_sessions.programme_mode IS 'Mode du programme: simple (texte) ou structured (sessions)';
COMMENT ON COLUMN event_sessions.type_session IS 'Type de session: conference, atelier, pause, etc.';
COMMENT ON COLUMN event_sessions.ordre IS 'Ordre d''affichage des sessions';
