# Configuration Complète de la Confirmation Email

## 🚨 POURQUOI C'EST COMPLEXE

La confirmation email nécessite plusieurs configurations :

### **1. Configuration SMTP dans Supabase**

#### **Option A : Utiliser un service SMTP externe**
1. **Dans Supabase Dashboard** : Authentication → Settings → SMTP Settings
2. **Configurer** :
   - **Host** : smtp.gmail.com (pour Gmail)
   - **Port** : 587
   - **Username** : votre-email@gmail.com
   - **Password** : mot de passe d'application Gmail
   - **Sender Name** : "L'Agenda du Royaume"
   - **Sender Email** : votre-email@gmail.com

#### **Option B : Utiliser un service d'email transactionnel**
- **SendGrid** : Plus fiable pour les emails transactionnels
- **Mailgun** : Alternative populaire
- **Resend** : Service moderne et simple

### **2. Configuration des templates d'email**

#### **Template de confirmation**
```html
<h2>Confirmez votre email</h2>
<p>Cliquez sur le lien ci-dessous pour confirmer votre compte :</p>
<a href="{{ .ConfirmationURL }}">Confirmer mon email</a>
```

#### **Template de réinitialisation de mot de passe**
```html
<h2>Réinitialisation de mot de passe</h2>
<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
<a href="{{ .ConfirmationURL }}">Réinitialiser mon mot de passe</a>
```

### **3. Configuration des URLs de redirection**

#### **Dans Supabase Dashboard** : Authentication → Settings → URL Configuration
- **Site URL** : `http://localhost:5173`
- **Redirect URLs** : 
  - `http://localhost:5173/auth/callback`
  - `http://localhost:5173/auth/onboarding/*`

### **4. Gestion des états dans l'application**

#### **États possibles après inscription :**
1. **Email non confirmé** → Afficher page "Vérifiez votre email"
2. **Email confirmé** → Rediriger vers onboarding
3. **Erreur** → Afficher message d'erreur

## 🔧 IMPLÉMENTATION TECHNIQUE

### **1. Page de vérification email**
```tsx
// pages/auth/EmailVerification.tsx
export default function EmailVerification() {
  return (
    <div>
      <h1>Vérifiez votre email</h1>
      <p>Un email de confirmation a été envoyé à votre adresse.</p>
      <p>Cliquez sur le lien dans l'email pour activer votre compte.</p>
    </div>
  );
}
```

### **2. Gestion des redirections**
```tsx
// Dans AuthCallback.tsx
useEffect(() => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    if (session.user.email_confirmed_at) {
      // Email confirmé → onboarding
      navigate('/auth/onboarding/participant');
    } else {
      // Email non confirmé → page de vérification
      navigate('/auth/email-verification');
    }
  }
}, []);
```

### **3. Vérification du statut email**
```tsx
// Dans useAuth.ts
const checkEmailConfirmation = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user && !user.email_confirmed_at) {
    // Rediriger vers page de vérification
    navigate('/auth/email-verification');
  }
};
```

## ⚠️ PROBLÈMES COURANTS

### **1. Emails non reçus**
- **Vérifier** la configuration SMTP
- **Tester** avec un email valide
- **Vérifier** les spams

### **2. Liens de confirmation cassés**
- **Vérifier** les URLs de redirection
- **Tester** les liens manuellement

### **3. Redirections incorrectes**
- **Vérifier** la logique de redirection
- **Tester** tous les cas d'usage

## 🎯 RECOMMANDATION

### **Pour le développement :**
- **Désactiver** la confirmation email (plus simple)
- **Utiliser** l'authentification directe

### **Pour la production :**
- **Activer** la confirmation email
- **Configurer** un service SMTP fiable
- **Tester** tous les flux d'email

## 📋 CHECKLIST COMPLÈTE

- [ ] Configuration SMTP dans Supabase
- [ ] Templates d'email personnalisés
- [ ] URLs de redirection configurées
- [ ] Page de vérification email créée
- [ ] Gestion des états d'email
- [ ] Tests des flux d'email
- [ ] Gestion des erreurs
- [ ] Messages utilisateur appropriés 