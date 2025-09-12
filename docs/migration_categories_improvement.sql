-- =====================================================
-- MIGRATION: AMÉLIORATION DES CATÉGORIES D'ÉVÉNEMENTS
-- =====================================================
-- Objectif: Remplacer les catégories actuelles par des noms plus courts et intuitifs
-- Date: 2024-01-XX
-- =====================================================

-- Sauvegarde des données existantes (optionnel)
-- CREATE TABLE categories_backup AS SELECT * FROM categories;
-- CREATE TABLE sous_categories_backup AS SELECT * FROM sous_categories;

-- =====================================================
-- NOUVELLES CATÉGORIES PROPOSÉES
-- =====================================================

-- 1. Supprimer les anciennes catégories (ATTENTION: Cela supprimera aussi les sous-catégories liées)
-- DELETE FROM sous_categories;
-- DELETE FROM categories;

-- 2. Insérer les nouvelles catégories plus intuitives
INSERT INTO categories (nom, description) VALUES
-- Catégories principales pour événements chrétiens
('Culte & Adoration', 'Cérémonies religieuses, cultes, temps d''adoration et de louange'),
('Formation & Enseignement', 'Séminaires, conférences, formations bibliques et théologiques'),
('Évangélisation & Mission', 'Événements d''évangélisation, missions, témoignages'),
('Communauté & Fraternité', 'Rencontres communautaires, cellules, groupes de partage'),
('Jeunesse & Enfants', 'Événements dédiés aux jeunes et aux enfants'),
('Arts & Culture', 'Concerts, spectacles, expositions d''art chrétien'),
('Sport & Loisirs', 'Activités sportives et de détente dans un cadre chrétien'),
('Prière & Retraite', 'Temps de prière, retraites spirituelles, jeûnes'),
('Mariage & Famille', 'Événements liés au mariage, à la famille et aux couples'),
('Social & Solidarité', 'Actions sociales, aide humanitaire, bénévolat');

-- =====================================================
-- SOUS-CATÉGORIES POUR CHAQUE CATÉGORIE
-- =====================================================

-- Culte & Adoration (ID: 1)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(1, 'Culte dominical', 'Culte principal du dimanche'),
(1, 'Culte de semaine', 'Culte en semaine'),
(1, 'Temps d''adoration', 'Sessions d''adoration et de louange'),
(1, 'Veillée de prière', 'Temps de prière prolongé'),
(1, 'Célébration spéciale', 'Célébrations pour occasions particulières');

-- Formation & Enseignement (ID: 2)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(2, 'Séminaire biblique', 'Formation approfondie sur la Bible'),
(2, 'Conférence théologique', 'Enseignement sur des sujets théologiques'),
(2, 'Formation pratique', 'Formation aux compétences pratiques'),
(2, 'École biblique', 'Cours de formation biblique'),
(2, 'Atelier de développement', 'Ateliers de développement personnel');

-- Évangélisation & Mission (ID: 3)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(3, 'Campagne d''évangélisation', 'Événements d''évangélisation publique'),
(3, 'Mission locale', 'Missions dans la communauté locale'),
(3, 'Mission internationale', 'Missions à l''étranger'),
(3, 'Témoignage public', 'Temps de témoignage et de partage'),
(3, 'Formation missionnaire', 'Formation pour les missionnaires');

-- Communauté & Fraternité (ID: 4)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(4, 'Cellule de maison', 'Rencontres en petits groupes'),
(4, 'Groupe de partage', 'Groupes de partage et d''entraide'),
(4, 'Repas communautaire', 'Repas partagés en communauté'),
(4, 'Assemblée générale', 'Réunions officielles de l''église'),
(4, 'Fête communautaire', 'Célébrations de la communauté');

-- Jeunesse & Enfants (ID: 5)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(5, 'Groupe de jeunes', 'Activités pour les adolescents'),
(5, 'École du dimanche', 'Enseignement pour les enfants'),
(5, 'Camp de jeunes', 'Camps et retraites pour jeunes'),
(5, 'Activité enfants', 'Activités spéciales pour enfants'),
(5, 'Formation jeunes leaders', 'Formation pour jeunes leaders');

-- Arts & Culture (ID: 6)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(6, 'Concert gospel', 'Concerts de musique gospel'),
(6, 'Spectacle théâtral', 'Pièces de théâtre chrétien'),
(6, 'Exposition d''art', 'Expositions d''art chrétien'),
(6, 'Festival culturel', 'Festivals culturels chrétiens'),
(6, 'Atelier créatif', 'Ateliers d''art et de créativité');

-- Sport & Loisirs (ID: 7)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(7, 'Tournoi sportif', 'Compétitions sportives'),
(7, 'Randonnée', 'Randonnées et activités nature'),
(7, 'Jeux communautaires', 'Jeux et activités de groupe'),
(7, 'Sport d''équipe', 'Activités sportives en équipe'),
(7, 'Loisirs créatifs', 'Activités de loisirs créatifs');

-- Prière & Retraite (ID: 8)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(8, 'Retraite spirituelle', 'Retraites de ressourcement'),
(8, 'Jeûne collectif', 'Périodes de jeûne en groupe'),
(8, 'Marche de prière', 'Marches de prière et méditation'),
(8, 'Vigile de prière', 'Temps de prière prolongé'),
(8, 'Méditation guidée', 'Sessions de méditation chrétienne');

-- Mariage & Famille (ID: 9)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(9, 'Cérémonie de mariage', 'Mariages et cérémonies'),
(9, 'Formation couples', 'Formation pour couples'),
(9, 'Conférence famille', 'Conférences sur la famille'),
(9, 'Activité familiale', 'Activités pour toute la famille'),
(9, 'Counselling', 'Accompagnement et conseil');

-- Social & Solidarité (ID: 10)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(10, 'Aide humanitaire', 'Actions d''aide humanitaire'),
(10, 'Bénévolat', 'Activités de bénévolat'),
(10, 'Soutien communautaire', 'Soutien à la communauté'),
(10, 'Action sociale', 'Actions sociales et solidaires'),
(10, 'Collecte de fonds', 'Collectes pour causes caritatives');

-- =====================================================
-- NOTES IMPORTANTES
-- =====================================================
-- 1. Cette migration supprime TOUTES les catégories existantes
-- 2. Assurez-vous de faire une sauvegarde avant d'exécuter
-- 3. Les événements existants devront être re-catégorisés
-- 4. Testez d'abord sur un environnement de développement
-- 5. Informez les utilisateurs du changement

-- =====================================================
-- VÉRIFICATION POST-MIGRATION
-- =====================================================
-- SELECT c.nom as categorie, COUNT(sc.id) as nb_sous_categories
-- FROM categories c
-- LEFT JOIN sous_categories sc ON c.id = sc.categorie_id
-- GROUP BY c.id, c.nom
-- ORDER BY c.nom;
