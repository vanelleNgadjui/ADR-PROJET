import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import HomeLayout from '../../components/layout/HomeLayout';
import OrganizerSidebar from '../../components/sidebar/OrganizerSidebar';
import HomeHeader from '../../components/header/HomeHeader';
import { useSidebar } from '../../context/dashboard/SidebarContext';

const HomeOrg: React.FC = () => {
  const { user, loading } = useAuth();
  const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  // Redirection si non authentifié
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/connexion" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Organisateur */}
      <OrganizerSidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isMobileOpen ? 'ml-0' : isExpanded ? 'ml-0 lg:ml-64' : 'ml-0 lg:ml-16'
      }`}>
        {/* Header - Full width sur mobile */}
        <div className="header-full-width">
          <HomeHeader onToggle={toggleMobileSidebar} onClick={toggleSidebar} />
        </div>
        
        {/* Page Content */}
        <main>
          <div className="mx-auto max-w-7xl">
            <div className="flex-1 bg-gray-50">
              {/* Contenu principal */}
              <main className="pb-2 sm:px-4 sm:pb-4 lg:pt-2 lg:pb-8 lg:px-8">
                
                {/* Section de bienvenue avec stats rapides */}
                <section className="mb-8">
                  <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                          Bienvenue dans votre espace organisateur
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 font-normal">
                          Gérez vos événements, suivez vos participants et développez votre communauté.
                        </p>
                      </div>
                      <div className="mt-4 lg:mt-0">
                        <Link 
                          to="/events/create"
                          className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-primary-blue text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-primary-blue/90 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Créer un événement
                        </Link>
                      </div>
                    </div>
                    
                    {/* Stats rapides */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-medium text-gray-900 mb-1">12</div>
                        <div className="text-xs sm:text-sm text-gray-600 font-normal">Événements actifs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-medium text-gray-900 mb-1">1,247</div>
                        <div className="text-xs sm:text-sm text-gray-600 font-normal">Participants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-medium text-gray-900 mb-1">€8,420</div>
                        <div className="text-xs sm:text-sm text-gray-600 font-normal">Revenus</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-medium text-gray-700 mb-1">+23%</div>
                        <div className="text-xs sm:text-sm text-gray-600 font-normal">Croissance</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Grille des fonctionnalités principales - Vue 360° */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Vos fonctionnalités
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    
                    {/* ÉVÉNEMENTS */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105 flex flex-col h-full">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Événements</h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 font-normal mb-4 flex-1">
                        Créez, gérez et publiez vos événements. Suivez leur performance et gérez les inscriptions.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <Link 
                          to="/events/create"
                          className="px-3 py-2 sm:px-4 sm:py-2 bg-primary-blue text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-primary-blue/90 transition-colors"
                        >
                          Créer
                        </Link>
                        <Link 
                          to="/events"
                          className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Voir tout
                        </Link>
                      </div>
                    </div>

                    {/* PARTICIPANTS */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105 flex flex-col h-full">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-orange/10 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Participants</h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 font-normal mb-4 flex-1">
                        Gérez vos inscriptions, suivez les participants et analysez leur engagement.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <Link 
                          to="/dashboard/participants"
                          className="px-3 py-2 sm:px-4 sm:py-2 bg-primary-orange text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-primary-orange/90 transition-colors"
                        >
                          Gérer
                        </Link>
                        <Link 
                          to="/dashboard/inscriptions"
                          className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Inscriptions
                        </Link>
                      </div>
                    </div>

                    {/* BILLETTERIE */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105 flex flex-col h-full">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Billets & Inscription</h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 font-normal mb-4 flex-1">
                        Vendez des billets, gérez les tarifs et suivez vos revenus en temps réel.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <Link 
                          to="/dashboard/billets"
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Gérer
                        </Link>
                        <Link 
                          to="/dashboard/revenus"
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Revenus
                        </Link>
                      </div>
                    </div>

                    {/* COMMUNAUTÉS */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105 flex flex-col h-full">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Communautés</h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 font-normal mb-4 flex-1">
                        Créez et gérez vos communautés, groupes et réseaux d'organisateurs.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <Link 
                          to="/dashboard/communautes"
                          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Gérer
                        </Link>
                        <Link 
                          to="/dashboard/communautes/create"
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Créer
                        </Link>
                      </div>
                    </div>

                    {/* ANALYTICS */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105 flex flex-col h-full">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Suivi & Analyse</h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 font-normal mb-4 flex-1">
                        Analysez les performances de vos événements et générez des rapports détaillés.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <Link 
                          to="/dashboard/analytics"
                          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Voir
                        </Link>
                        <Link 
                          to="/dashboard/rapports"
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Exporter
                        </Link>
                      </div>
                    </div>

                    {/* PARAMÈTRES */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105 flex flex-col h-full">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Paramètres</h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 font-normal mb-4 flex-1">
                        Gérez votre profil, abonnement et préférences de la plateforme.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <Link 
                          to="/dashboard/profile"
                          className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Profil
                        </Link>
                        <Link 
                          to="/dashboard/abonnement"
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Plan
                        </Link>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Section Activité récente */}
                <section className="mb-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Activité récente
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600 font-normal">Nouvelle inscription pour "Concert Gospel"</span>
                        <span className="ml-auto text-xs text-gray-500 font-normal">Il y a 2h</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600 font-normal">Événement "Retraite Spirituelle" publié</span>
                        <span className="ml-auto text-xs text-gray-500 font-normal">Il y a 4h</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-600 font-normal">Vente de billet pour "Conférence Foi"</span>
                        <span className="ml-auto text-xs text-gray-500 font-normal">Il y a 6h</span>
                      </div>
                    </div>
                  </div>
                </section>

              </main>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeOrg;
