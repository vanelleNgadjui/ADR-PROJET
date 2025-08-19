# Configuration Supabase Auth - Guide Complet

## 🚨 ÉTAPE CRITIQUE : Désactiver la confirmation email

### Dans votre Supabase Dashboard :

1. **Allez dans** : Authentication → Settings
2. **Trouvez la section** : "Email Auth"
3. **Décochez** : "Enable email confirmations"
4. **Sauvegardez** les changements

### Pourquoi c'est important :
- Par défaut, Supabase exige une confirmation email
- Cela bloque la connexion immédiate après inscription
- Notre application ne gère pas encore les emails de confirmation

## 🔧 Configuration OAuth Google (optionnel)

1. **Allez dans** : Authentication → Providers
2. **Activez** : Google
3. **Ajoutez vos clés** Google OAuth

## 📧 Configuration Email (optionnel)

1. **Allez dans** : Authentication → Settings → SMTP Settings
2. **Configurez** votre serveur SMTP pour les emails

## ✅ Vérification

Après avoir désactivé la confirmation email :
- L'inscription devrait rediriger vers l'onboarding
- La connexion devrait fonctionner immédiatement
- Plus d'erreur "Email not confirmed" 