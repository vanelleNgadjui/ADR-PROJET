import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Connexion() {
  const navigate = useNavigate();
  const { signInWithEmail, resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Tous les champs sont requis');
      return;
    }

    try {
      setLoading(true);
      const { error } = await signInWithEmail(formData.email, formData.password);

      if (error) {
        setError(error.message);
      } else {
        // Redirection vers la page d'accueil
        navigate('/');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError('Veuillez entrer votre email pour réinitialiser le mot de passe');
      return;
    }

    try {
      setLoading(true);
      const { error } = await resetPassword(formData.email);

      if (error) {
        setError(error.message);
      } else {
        setResetEmailSent(true);
        setError('');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Se connecter"
      subtitle="Accède à ton espace personnel"
      showBackButton={true}
      backTo="/"
      containerSize="small"
    >
      <form onSubmit={handleEmailSignIn} className="space-y-6">
        {/* Google OAuth */}
        <div>
          <GoogleAuthButton>
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
              placeholder="Votre mot de passe"
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

        {/* Forgot password */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleResetPassword}
            className="text-sm text-[#00008B] hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>

        {/* Success message for reset */}
        {resetEmailSent && (
          <div className="text-[#62BF92] text-sm bg-[#62BF92]/10 p-3 rounded-md">
            Un email de réinitialisation a été envoyé à {formData.email}
          </div>
        )}

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
            backgroundColor: '#00008B',
            color: 'white'
          }}
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/choix-role')}
              className="text-[#00008B] hover:underline font-medium"
            >
              S'inscrire
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
} 