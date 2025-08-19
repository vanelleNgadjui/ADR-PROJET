import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Users, Calendar, MapPin, Heart, Mic, Settings, UserCheck, Users2, UserCog, UserPlus, Crown, Star, Target, Zap, Shield, Award, Trophy, BadgeCheck, UserStar } from 'lucide-react';

export default function ChoixRole() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'participant',
      title: 'Je veux participer',
      description: 'Découvrir et participer à des événements chrétiens inspirants',
          icon: <Users className="w-8 h-8 text-[#FFA500]" />,
    color: 'border-[#FFA500] hover:border-[#FFA500]/80',
    bgColor: 'hover:bg-[#FFA500]/5',
      features: [
        'Découvrir des événements près de chez vous',
        'S\'inscrire facilement aux événements',
        'Recevoir des recommandations personnalisées',
        'Partager vos événements préférés'
      ]
    },
    {
      id: 'organisateur',
      title: 'Je veux organiser',
      description: 'Créer et promouvoir vos événements chrétiens',
      icon: <UserStar className="w-8 h-8 text-[#00008B]" />,
      color: 'border-[#00008B] hover:border-[#00008B]/80',
      bgColor: 'hover:bg-[#00008B]/5',
      features: [
        'Créer des événements en quelques clics',
        'Gérer les inscriptions et participants',
        'Promouvoir vos événements efficacement',
        'Analyser les performances de vos événements'
      ]
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    navigate(`/auth/inscription/${roleId}`);
  };

  return (
    <AuthLayout
      title="Choisis ton rôle"
      subtitle="Rejoins une communauté d'hommes et de femmes qui vivent leur foi à travers des événements inspirants"
      showBackButton={true}
      backTo="/"
      containerSize="large"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`bg-white rounded-lg shadow-lg border-2 cursor-pointer transition-all duration-300 ${role.color} ${role.bgColor} p-6 h-full`}
            onClick={() => handleRoleSelect(role.id)}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  {role.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {role.title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4 flex-grow">
                {role.description}
              </p>
              
              <ul className="space-y-2">
                {role.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

      </div>
      
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Déjà inscrit ?{' '}
          <button
            onClick={() => navigate('/auth/connexion')}
            className="text-[#00008B] hover:underline font-medium"
          >
            Se connecter
          </button>
        </p>
      </div>
    </AuthLayout>
  );
} 