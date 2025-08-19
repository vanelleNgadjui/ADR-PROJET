# 🔧 Configuration Supabase Auth - Auto-confirmation

## Problème identifié
Supabase Auth nécessite par défaut une confirmation email pour activer les comptes créés par email/mot de passe.

## Solution : Activer l'auto-confirmation

### 1. Dans votre Supabase Dashboard

1. **Aller dans Authentication → Settings**
2. **Section "User Registration"**
3. **Décocher "Enable email confirmations"**
4. **Sauvegarder**

### 2. Alternative : Configurer les redirections

Si vous voulez garder la confirmation email :

1. **Authentication → URL Configuration**
2. **Site URL** : `http://localhost:5173`
3. **Redirect URLs** : 
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/dashboard
   http://localhost:5173/auth/onboarding/participant
   http://localhost:5173/auth/onboarding/organisateur
   ```

### 3. Vérifier les politiques RLS

Assurez-vous que les politiques RLS permettent la création d'utilisateurs :

```sql
-- Politique pour permettre la création de compte
CREATE POLICY users_signup ON users
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

## Test après configuration

1. Vider le cache du navigateur
2. Tester l'inscription email/mot de passe
3. Vérifier que l'utilisateur apparaît dans `auth.users` ET `users`
4. Vérifier que le Header affiche "Bonjour, [email]" 