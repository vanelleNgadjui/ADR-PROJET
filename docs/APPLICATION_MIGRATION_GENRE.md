# Application de la Migration Genre

## 📋 **ÉTAPES POUR AJOUTER LE CHAMP GENRE**

### **1. Application de la migration SQL**

Exécutez le fichier `docs/migration_add_genre.sql` dans votre base de données Supabase :

```sql
-- Copiez et exécutez le contenu de migration_add_genre.sql
-- dans l'éditeur SQL de Supabase
```

### **2. Vérification de la migration**

Après l'exécution, vérifiez que :

- ✅ L'enum `genre_enum` a été créé avec les valeurs : `homme`, `femme`, `prefere_ne_pas_preciser`
- ✅ La colonne `genre` a été ajoutée à la table `users`
- ✅ Les fonctions `get_genre_enum_values()` et `get_genre_enum_values_rpc()` ont été créées
- ✅ La fonction `get_all_enum_values()` a été mise à jour pour inclure le genre

### **3. Test de la fonctionnalité**

1. **Redémarrez le serveur de développement** :
   ```bash
   cd frontend
   npm run dev
   ```

2. **Testez l'onboarding** :
   - Créez un nouveau compte
   - Vérifiez que le champ "Genre" apparaît dans l'étape 1
   - Sélectionnez un genre
   - Vérifiez qu'il apparaît dans le récapitulatif final

### **4. Fonctionnalités ajoutées**

#### **Dans l'onboarding (Étape 1)**
- ✅ Champ "Genre" avec 3 options : Homme, Femme, Préfère ne pas préciser
- ✅ Interface dropdown/select similaire au champ rôle/mission
- ✅ Style cohérent avec les autres champs (couleurs, focus effects)

#### **Dans le récapitulatif (Étape 6)**
- ✅ Affichage du genre sélectionné avec icône
- ✅ Intégration dans la carte "Identité"

#### **Sauvegarde en base**
- ✅ Le genre est sauvegardé dans la colonne `genre` de la table `users`
- ✅ Utilisation de l'enum `genre_enum` pour la validation

### **5. Structure de données**

```sql
-- Enum créé
CREATE TYPE genre_enum AS ENUM (
    'homme',
    'femme', 
    'prefere_ne_pas_preciser'
);

-- Colonne ajoutée
ALTER TABLE users ADD COLUMN genre genre_enum;
```

### **6. Interface utilisateur**

- **Format** : Dropdown/select similaire au champ rôle/mission
- **Responsive** : S'adapte automatiquement à tous les écrans
- **Sélection** : Option par défaut "Sélectionnez votre genre"
- **Couleurs** : Utilisation de la palette du projet (focus ring bleu)

### **7. Validation**

Le champ genre est :
- ✅ **Optionnel** (pas de validation obligatoire)
- ✅ **Validé** par l'enum PostgreSQL
- ✅ **Formaté** avec `formatEnumLabel()` pour l'affichage

---

## 🎯 **RÉSULTAT FINAL**

L'utilisateur peut maintenant sélectionner son genre lors de l'onboarding, et cette information sera :
- Sauvegardée en base de données
- Affichée dans le récapitulatif final
- Disponible pour d'autres fonctionnalités futures
