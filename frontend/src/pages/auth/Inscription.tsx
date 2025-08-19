import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Inscription() {
  const { role } = useParams<{ role: 'participant' | 'organisateur' }>();
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfig = {
    participant: {
      title: 'Créer un compte participant',
      subtitle: 'Rejoins la communauté et découvre des événements inspirants',
      color: 'text-[#FFA500]'
    },
    organisateur: {
      title: 'Créer un compte organisateur',
      subtitle: 'Commence à créer et promouvoir tes événements',
      color: 'text-[#00008B]'
    }
  };

  const config = roleConfig[role || 'participant'];

  const validateForm = () => {
    if (!formData.email) {
      setError('L\'email est requis');
      return false;
    }
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (!formData.acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return false;
    }
    return true;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
              console.log('Début inscription avec:', { email: formData.email, role });
      
      const { data, error } = await signUpWithEmail(
        formData.email,
        formData.password,
        role || 'participant'
      );

      console.log('📊 Réponse inscription:', { data, error });

      if (error) {
        console.error('❌ Erreur inscription:', error);
        console.error('❌ Type d\'erreur:', typeof error);
        console.error('❌ Erreur complète:', JSON.stringify(error, null, 2));
        
        let errorMessage = 'Erreur lors de l\'inscription';
        
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error && typeof error === 'object') {
          if ('message' in error) {
            errorMessage = (error as any).message;
          } else if ('error_description' in error) {
            errorMessage = (error as any).error_description;
          } else {
            errorMessage = JSON.stringify(error);
          }
        }
        
        console.error('❌ Message d\'erreur final:', errorMessage);
        setError(errorMessage);
      } else if (data?.user) {
        // Inscription réussie
        
        // Attendre que la session soit mise à jour
        const checkSession = setInterval(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            clearInterval(checkSession);
            navigate(`/auth/onboarding/${role}`);
          }
        }, 500);
        
        // Timeout de sécurité après 10 secondes
        setTimeout(() => {
          clearInterval(checkSession);
          navigate(`/auth/onboarding/${role}`);
        }, 10000);
      } else {
        console.warn('⚠️ Pas d\'utilisateur dans la réponse');
        setError('Erreur inattendue lors de l\'inscription');
      }
    } catch (err) {
      console.error('💥 Erreur inattendue:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle(role || 'participant');
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={config.title}
      subtitle={config.subtitle}
      showBackButton={true}
      backTo="/auth/choix-role"
      containerSize="small"
    >
      <form onSubmit={handleEmailSignUp} className="space-y-6">
        {/* Google OAuth */}
        <div>
          <GoogleAuthButton role={role}>
            Continuer avec Google
          </GoogleAuthButton>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {/* Email field */}
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail className="w-4 h-4" />}
          placeholder="votre@email.com"
          required
        />

        {/* Password field */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-black/80 mb-1">
            Mot de passe
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-neutral-black/60 pointer-events-none z-10">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="8 caractères minimum"
              required
              className="w-full py-2 px-3 pl-10 pr-10 rounded-lg border border-neutral-black/10 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300 outline-none bg-neutral-white text-body"
            />
            <button
              type="button"
              className="absolute right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm password field */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-black/80 mb-1">
            Confirmer le mot de passe
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-neutral-black/60 pointer-events-none z-10">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Répétez votre mot de passe"
              required
              className="w-full py-2 px-3 pl-10 pr-10 rounded-lg border border-neutral-black/10 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all duration-300 outline-none bg-neutral-white text-body"
            />
            <button
              type="button"
              className="absolute right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
            className={`mt-1 h-4 w-4 border-gray-300 rounded focus:ring-2 ${
              role === 'organisateur' 
                ? 'text-[#00008B] focus:ring-[#00008B]' 
                : 'text-[#FFA500] focus:ring-[#FFA500]'
            }`}
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            J'accepte les{' '}
            <a 
              href="/terms" 
              className={`hover:underline ${
                role === 'organisateur' ? 'text-[#00008B]' : 'text-[#FFA500]'
              }`}
            >
              conditions d'utilisation
            </a>{' '}
            et la{' '}
            <a 
              href="/privacy" 
              className={`hover:underline ${
                role === 'organisateur' ? 'text-[#00008B]' : 'text-[#FFA500]'
              }`}
            >
              politique de confidentialité
            </a>
          </label>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-[#EE6239] text-sm bg-[#EE6239]/10 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          style={{
            backgroundColor: role === 'organisateur' ? '#00008B' : '#FFA500',
            color: 'white'
          }}
        >
          {loading ? 'Création en cours...' : 'Créer mon compte'}
        </Button>

        {/* Login link */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Déjà inscrit ?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/connexion')}
              className={`hover:underline font-medium ${
                role === 'organisateur' ? 'text-[#00008B]' : 'text-[#FFA500]'
              }`}
            >
              Se connecter
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
} 