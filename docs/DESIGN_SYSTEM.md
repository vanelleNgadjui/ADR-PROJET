# Design System - Agenda du Royaume

## Couleurs Personnalisées

### Palette de Couleurs Principale

#### Couleurs de Rôles
- **Participant** : `#FFA500` (Jaune orangé)
- **Organisateur** : `#00008B` (Bleu marine)

#### Couleurs de Feedback
- **Succès/Validation** : `#62BF92` (Vert menthe)
- **Erreur/Avertissement** : `#EE6239` (Corail)

### Utilisation des Couleurs

#### Vert Menthe (`#62BF92`)
- ✅ Messages de succès
- ✅ Indicateurs de validation
- ✅ Données pré-remplies (Google OAuth)
- ✅ Étapes complétées dans l'onboarding
- ✅ Confirmations d'actions

#### Corail (`#EE6239`)
- ❌ Messages d'erreur
- ❌ Boutons de suppression
- ❌ Avertissements
- ❌ Actions destructives

### Classes Tailwind Personnalisées

```css
/* Succès */
bg-[#62BF92]/10          /* Fond très clair */
border-[#62BF92]/20       /* Bordure claire */
text-[#62BF92]            /* Texte principal */

/* Erreur */
bg-[#EE6239]/10           /* Fond très clair */
border-[#EE6239]/20       /* Bordure claire */
text-[#EE6239]            /* Texte principal */
hover:bg-[#EE6239]/80     /* Hover pour boutons */
```

### Règles d'Utilisation

1. **Cohérence** : Toujours utiliser ces couleurs pour les mêmes types de feedback
2. **Accessibilité** : Les contrastes sont optimisés pour la lisibilité
3. **Responsive** : Les couleurs s'adaptent à tous les écrans
4. **Performance** : Utilisation de classes Tailwind pour optimiser le CSS

### Migration

Toutes les couleurs `green-*` et `red-*` ont été remplacées par :
- `green-*` → `#62BF92` (vert menthe)
- `red-*` → `#EE6239` (corail)

### Maintenance

Pour ajouter de nouvelles couleurs ou modifier la palette :
1. Mettre à jour ce fichier
2. Vérifier l'accessibilité des contrastes
3. Tester sur différents appareils
4. Documenter les changements
