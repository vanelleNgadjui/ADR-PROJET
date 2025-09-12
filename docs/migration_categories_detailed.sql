-- =====================================================
-- MIGRATION: CATÉGORIES DÉTAILLÉES POUR ÉVÉNEMENTS CHRÉTIENS
-- =====================================================
-- Objectif: Remplacer les catégories par une structure détaillée et intuitive
-- Date: 2024-01-XX
-- Structure: 10 catégories principales avec sous-catégories spécifiques
-- =====================================================

-- Sauvegarde des données existantes (optionnel)
-- CREATE TABLE categories_backup AS SELECT * FROM categories;
-- CREATE TABLE sous_categories_backup AS SELECT * FROM sous_categories;

-- =====================================================
-- NOUVELLES CATÉGORIES DÉTAILLÉES
-- =====================================================

-- 1. Supprimer les anciennes catégories (ATTENTION: Cela supprimera aussi les sous-catégories liées)
DELETE FROM sous_categories;
DELETE FROM categories;

-- 2. Insérer les nouvelles catégories détaillées
INSERT INTO categories (nom, description) VALUES
-- Catégories principales avec emojis et descriptions
('🎶 Concerts & Festivals', 'Événements musicaux, festivals et spectacles chrétiens'),
('🎤 Conférences & Séminaires', 'Formations, conférences et séminaires thématiques'),
('🙏 Prière & Veillées', 'Temps de prière, veillées et moments spirituels'),
('📖 Enseignement & Études', 'Formations bibliques, études et retraites spirituelles'),
('🌍 Évangélisation & Missions', 'Actions d''évangélisation et missions chrétiennes'),
('👨‍👩‍👧 Vie & Famille', 'Événements pour couples, familles et célibataires'),
('✝️ Cultes & Célébrations', 'Cérémonies religieuses et célébrations spéciales'),
('👦 Jeunesse & Enfants', 'Activités dédiées aux jeunes et aux enfants'),
('🤝 Rencontres & Réseaux', 'Rencontres communautaires et réseautage chrétien'),
('❤️ Actions Solidaires & Société', 'Actions caritatives et engagement social'),
('💼 Business & Leadership', 'Formations professionnelles et leadership chrétien');

-- =====================================================
-- SOUS-CATÉGORIES POUR CHAQUE CATÉGORIE
-- =====================================================

-- 🎶 Concerts & Festivals (ID: 1)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(1, 'Concert gospel', 'Concerts de musique gospel et chrétienne'),
(1, 'Festival chrétien', 'Festivals de musique et culture chrétienne'),
(1, 'Soirée témoignages', 'Soirées de témoignages et partages'),
(1, 'Spectacle chrétien', 'Spectacles et représentations chrétiennes'),
(1, 'Projection film chrétien', 'Projections de films et documentaires chrétiens'),
(1, 'Exposition chrétienne', 'Expositions d''art et culture chrétienne'),
(1, 'Slam / open mic', 'Scènes ouvertes et slams chrétiens');

-- 🎤 Conférences & Séminaires (ID: 2)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(2, 'Conférence thématique', 'Conférences sur mariage, foi & société, leadership, etc.'),
(2, 'Conférence jeunesse', 'Conférences spécialement dédiées aux jeunes'),
(2, 'Séminaire biblique / spirituel', 'Séminaires d''approfondissement biblique et spirituel'),
(2, 'Forum chrétien', 'Forums de discussion et d''échange chrétien'),
(2, 'Table ronde / Panel / Talk show', 'Tables rondes et panels de discussion'),
(2, 'Masterclass', 'Masterclasses et formations avancées'),
(2, 'Atelier pratique', 'Ateliers pratiques et formations techniques'),
(2, 'Webinaire chrétien', 'Formations en ligne et webinaires');

-- 🙏 Prière & Veillées (ID: 3)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(3, 'Nuit / veillée de prière', 'Veillées et nuits de prière'),
(3, 'Chaîne de prière', 'Chaînes de prière continues'),
(3, 'Jeûne & prière collectif', 'Périodes de jeûne et prière en groupe'),
(3, '24h/7j de prière', 'Marathons de prière 24h/7j'),
(3, 'Marche de prière', 'Marches et processions de prière'),
(3, 'Temps d''adoration / louange', 'Sessions d''adoration et de louange');

-- 📖 Enseignement & Études (ID: 4)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(4, 'Étude biblique en groupe', 'Études bibliques en petits groupes'),
(4, 'Formation chrétienne', 'Formations générales chrétiennes'),
(4, 'École biblique', 'Cours et formations bibliques'),
(4, 'École du ministère', 'Formations pour le ministère'),
(4, 'Retraite spirituelle', 'Retraites d''enseignement et méditation'),
(4, 'Atelier biblique / interactif', 'Ateliers bibliques interactifs'),
(4, 'Masterclass enseignement', 'Masterclasses d''enseignement biblique');

-- 🌍 Évangélisation & Missions (ID: 5)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(5, 'Campagne d''évangélisation', 'Campagnes d''évangélisation publique'),
(5, 'Croisade', 'Croisades d''évangélisation'),
(5, 'Street evangelism / action de rue', 'Évangélisation de rue et actions publiques'),
(5, 'Mission humanitaire', 'Missions d''aide humanitaire'),
(5, 'Mission courte durée', 'Missions courtes et voyages missionnaires'),
(5, 'Conférence missionnaire', 'Conférences sur les missions');

-- 👨‍👩‍👧 Vie & Famille (ID: 6)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(6, 'Rencontre célibataires', 'Événements pour célibataires chrétiens'),
(6, 'Conférence mariage', 'Conférences sur le mariage chrétien'),
(6, 'Événement couples', 'Événements pour couples mariés'),
(6, 'Événement familles', 'Événements pour familles chrétiennes'),
(6, 'Retraite femmes', 'Retraites spécialement pour femmes'),
(6, 'Retraite hommes', 'Retraites spécialement pour hommes'),
(6, 'Accompagnement post-conversion', 'Accompagnement après conversion');

-- ✝️ Cultes & Célébrations (ID: 7)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(7, 'Culte dominical / célébration', 'Cultes et célébrations dominicales'),
(7, 'Sainte Cène', 'Célébrations de la Sainte Cène'),
(7, 'Eucharistie', 'Célébrations eucharistiques'),
(7, 'Culte jeunesse', 'Cultes spécialement pour jeunes'),
(7, 'Rencontre annuelle', 'Rencontres et assemblées annuelles'),
(7, 'Service spécial', 'Services spéciaux (ordination, baptême, confirmation...)');

-- 👦 Jeunesse & Enfants (ID: 8)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(8, 'Camp jeunes / ados', 'Camps pour jeunes et adolescents'),
(8, 'Conférence jeunesse', 'Conférences pour jeunes'),
(8, 'Youth service (culte jeunesse)', 'Services et cultes pour jeunes'),
(8, 'École du dimanche', 'Enseignement pour enfants le dimanche'),
(8, 'Événement enfants', 'Événements spécialement pour enfants'),
(8, 'Atelier créatif enfants', 'Ateliers créatifs pour enfants');

-- 🤝 Rencontres & Réseaux (ID: 9)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(9, 'Rencontre inter-églises', 'Rencontres entre différentes églises'),
(9, 'Groupe de maison / cellule', 'Groupes de maison et cellules'),
(9, 'Afterwork networking chrétien', 'Networking professionnel chrétien'),
(9, 'Rencontre communautaire', 'Rencontres de la communauté'),
(9, 'Forum de discussion', 'Forums de discussion chrétienne'),
(9, 'Petit-déjeuner / repas fraternel', 'Repas fraternels et rencontres informelles');

-- ❤️ Actions Solidaires & Société (ID: 10)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(10, 'Journée caritative / collecte', 'Journées caritatives et collectes'),
(10, 'Justice sociale & plaidoyer', 'Actions pour la justice sociale'),
(10, 'Environnement', 'Actions pour la protection de l''environnement'),
(10, 'Transformation locale', 'Initiatives de transformation locale'),
(10, 'Sensibilisation', 'Sensibilisation (santé, éducation, pauvreté...)');

-- 💼 Business & Leadership (ID: 11)
INSERT INTO sous_categories (categorie_id, nom, description) VALUES
(11, 'Conférence business chrétien', 'Conférences sur le business chrétien'),
(11, 'Atelier entrepreneuriat', 'Ateliers d''entrepreneuriat chrétien'),
(11, 'Leadership & management', 'Formations en leadership et management'),
(11, 'Innovation digitale & foi', 'Innovation digitale dans la foi'),
(11, 'Finances chrétiennes / carrière', 'Gestion financière et carrière chrétienne'),
(11, 'Networking professionnel', 'Réseautage professionnel chrétien'),
(11, 'Masterclass business', 'Masterclasses en business chrétien');

-- =====================================================
-- NOTES IMPORTANTES
-- =====================================================
-- 1. Cette migration supprime TOUTES les catégories existantes
-- 2. Assurez-vous de faire une sauvegarde avant d'exécuter
-- 3. Les événements existants devront être re-catégorisés
-- 4. Testez d'abord sur un environnement de développement
-- 5. Informez les utilisateurs du changement
-- 6. Structure optimisée pour les événements chrétiens
-- 7. Noms courts et intuitifs avec emojis pour la reconnaissance visuelle

-- =====================================================
-- VÉRIFICATION POST-MIGRATION
-- =====================================================
-- SELECT c.nom as categorie, COUNT(sc.id) as nb_sous_categories
-- FROM categories c
-- LEFT JOIN sous_categories sc ON c.id = sc.categorie_id
-- GROUP BY c.id, c.nom
-- ORDER BY c.nom;
