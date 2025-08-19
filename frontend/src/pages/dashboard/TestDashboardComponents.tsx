import React, { useState } from 'react';
import { Button, Badge, Dropdown, DropdownItem, Modal, Avatar, Alert, Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/dashboard/ui';
import { PlusIcon, ArrowRightIcon, UserIcon, CheckCircleIcon, AlertTriangleIcon, InfoIcon, MoreHorizontalIcon, SettingsIcon, LogOutIcon, PencilIcon, TrashIcon, LockIcon, XIcon } from 'lucide-react';

const TestDashboardComponents: React.FC = () => {
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);
  const [dropdown3Open, setDropdown3Open] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);
  const [modal4Open, setModal4Open] = useState(false);
  const [showAlert1, setShowAlert1] = useState(true);
  const [showAlert2, setShowAlert2] = useState(true);
  const [showAlert3, setShowAlert3] = useState(true);
  const [showAlert4, setShowAlert4] = useState(true);
  const [showAlert5, setShowAlert5] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test des Composants Dashboard
        </h1>

        {/* Tests Rapides en Haut */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tests Rapides</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="sm">Test Button</Button>
            <Button variant="secondary" size="sm">Test Button</Button>
            <Badge variant="light" color="primary">Test Badge</Badge>
            <Badge variant="solid" color="secondary">Test Badge</Badge>
            
            {/* Test Dropdown */}
            <div className="relative">
              <button 
                className="dropdown-toggle p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                onClick={() => setDropdown1Open(!dropdown1Open)}
              >
                <MoreHorizontalIcon className="w-4 h-4" />
              </button>
              <Dropdown isOpen={dropdown1Open} onClose={() => setDropdown1Open(false)}>
                <DropdownItem onClick={() => console.log('Action 1')}>Action 1</DropdownItem>
                <DropdownItem onClick={() => console.log('Action 2')}>Action 2</DropdownItem>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Section Avatar */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Composant Avatar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tailles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Tailles</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" size="xsmall" />
                  <span className="text-sm text-gray-600">xsmall</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" size="small" />
                  <span className="text-sm text-gray-600">small</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" size="medium" />
                  <span className="text-sm text-gray-600">medium (default)</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" size="large" />
                  <span className="text-sm text-gray-600">large</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" size="xlarge" />
                  <span className="text-sm text-gray-600">xlarge</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" size="xxlarge" />
                  <span className="text-sm text-gray-600">xxlarge</span>
                </div>
              </div>
            </div>

            {/* Statuts */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Statuts</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" status="online" />
                  <span className="text-sm text-gray-600">En ligne</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" status="offline" />
                  <span className="text-sm text-gray-600">Hors ligne</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" status="busy" />
                  <span className="text-sm text-gray-600">Occupé</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" status="none" />
                  <span className="text-sm text-gray-600">Aucun statut</span>
                </div>
              </div>
            </div>

            {/* Fallback par rôle */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Fallback par rôle</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Avatar src="invalid-url" alt="John Doe" role="participant" fallback="JD" />
                  <span className="text-sm text-gray-600">Participant (Orange)</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="invalid-url" alt="Marie Dupont" role="organisateur" fallback="MD" />
                  <span className="text-sm text-gray-600">Organisateur (Bleu)</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="invalid-url" alt="Admin User" role="admin" fallback="AU" />
                  <span className="text-sm text-gray-600">Admin (Gris)</span>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar src="invalid-url" alt="John Doe" />
                  <span className="text-sm text-gray-600">Sans rôle (Orange par défaut)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exemples d'usage */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Exemples d'usage</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="John Doe" size="large" status="online" role="organisateur" />
              <div>
                <h4 className="font-medium text-gray-800">John Doe</h4>
                <p className="text-sm text-gray-600">Organisateur • En ligne</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Composant Table</h2>
          
          <div className="space-y-6">
            {/* Table style template */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Table style template</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>Utilisateur</TableCell>
                    <TableCell isHeader>Projet</TableCell>
                    <TableCell isHeader>Équipe</TableCell>
                    <TableCell isHeader>Statut</TableCell>
                    <TableCell isHeader>Budget</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                          alt="John Doe" 
                          size="small"
                          role="organisateur"
                        />
                        <div>
                          <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
                            John Doe
                          </span>
                          <span className="block text-gray-500 text-xs dark:text-gray-400">
                            Organisateur
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Conférence Évangélique</TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        <Avatar 
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face" 
                          alt="Team 1" 
                          size="xsmall"
                          className="border-2 border-white dark:border-gray-900"
                        />
                        <Avatar 
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face" 
                          alt="Team 2" 
                          size="xsmall"
                          className="border-2 border-white dark:border-gray-900"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="light" color="success" size="sm">Actif</Badge>
                    </TableCell>
                    <TableCell>3.9K €</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" 
                          alt="Marie Dupont" 
                          size="small"
                          role="participant"
                        />
                        <div>
                          <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
                            Marie Dupont
                          </span>
                          <span className="block text-gray-500 text-xs dark:text-gray-400">
                            Participant
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Retraite Spirituelle</TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        <Avatar 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" 
                          alt="Team 1" 
                          size="xsmall"
                          className="border-2 border-white dark:border-gray-900"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="light" color="warning" size="sm">En attente</Badge>
                    </TableCell>
                    <TableCell>24.9K €</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Table variant card */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Table variant card (Recent Orders)</h3>
              <Table 
                variant="card" 
                title="Événements Récents"
                actions={
                  <>
                    <Button variant="outline" size="sm" startIcon={<SettingsIcon className="w-4 h-4" />}>
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      Voir tout
                    </Button>
                  </>
                }
              >
                <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                  <TableRow>
                    <TableCell isHeader className="py-3">Événements</TableCell>
                    <TableCell isHeader className="py-3">Catégorie</TableCell>
                    <TableCell isHeader className="py-3">Prix</TableCell>
                    <TableCell isHeader className="py-3">Statut</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <TableRow>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-[50px] w-[50px] overflow-hidden rounded-md bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm dark:text-white/90">
                            Conférence Évangélique
                          </p>
                          <span className="text-gray-500 text-xs dark:text-gray-400">
                            2 Variantes
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">Conférence</TableCell>
                    <TableCell className="py-3">25.00 €</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="light" color="success" size="sm">Livré</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-[50px] w-[50px] overflow-hidden rounded-md bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm dark:text-white/90">
                            Retraite Spirituelle
                          </p>
                          <span className="text-gray-500 text-xs dark:text-gray-400">
                            1 Variante
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">Retraite</TableCell>
                    <TableCell className="py-3">45.00 €</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="light" color="warning" size="sm">En attente</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-[50px] w-[50px] overflow-hidden rounded-md bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm dark:text-white/90">
                            Concert Gospel
                          </p>
                          <span className="text-gray-500 text-xs dark:text-gray-400">
                            3 Variantes
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">Concert</TableCell>
                    <TableCell className="py-3">15.00 €</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="light" color="error" size="sm">Annulé</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Exemples d'usage */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Exemples d'usage</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Les tables sont parfaites pour afficher des données structurées comme les listes d'événements, 
                participants, transactions, etc.
              </p>
              <div className="flex gap-4">
                <Button variant="primary" startIcon={<PlusIcon className="w-4 h-4" />}>
                  Ajouter un événement
                </Button>
                <Button variant="outline" startIcon={<ArrowRightIcon className="w-4 h-4" />}>
                  Exporter les données
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section Alert */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Composant Alert</h2>
          
          <div className="space-y-4">
            {/* Types d'alertes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Types d'alertes</h3>
              
              {showAlert1 && (
                <Alert
                  variant="success"
                  title="Succès !"
                  message="Votre événement a été créé avec succès. Vous pouvez maintenant le gérer depuis votre tableau de bord."
                  showLink={true}
                  linkHref="/dashboard/events"
                  linkText="Voir mes événements"
                  onClose={() => setShowAlert1(false)}
                />
              )}

              {showAlert2 && (
                <Alert
                  variant="error"
                  title="Erreur !"
                  message="Impossible de créer l'événement. Veuillez vérifier vos informations et réessayer."
                  showLink={true}
                  linkHref="/help"
                  linkText="Besoin d'aide ?"
                  onClose={() => setShowAlert2(false)}
                />
              )}

              {showAlert3 && (
                <Alert
                  variant="warning"
                  title="Attention !"
                  message="Votre événement se termine dans 24h. N'oubliez pas de finaliser les préparatifs."
                  onClose={() => setShowAlert3(false)}
                />
              )}

              {showAlert4 && (
                <Alert
                  variant="info"
                  title="Information"
                  message="Nouvelle fonctionnalité disponible : vous pouvez maintenant exporter vos données d'événement."
                  showLink={true}
                  linkHref="/features"
                  linkText="Découvrir"
                  onClose={() => setShowAlert4(false)}
                />
              )}

              {showAlert5 && (
                <Alert
                  variant="gray"
                  title="Note importante"
                  message="Cette fonctionnalité est en cours de développement. Certaines options peuvent ne pas être disponibles."
                  onClose={() => setShowAlert5(false)}
                />
              )}
            </div>

            {/* Exemples d'usage */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-card">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Exemples d'usage</h3>
              <div className="space-y-4">
                <Alert
                  variant="success"
                  title="Inscription réussie"
                  message="Votre compte a été créé avec succès. Bienvenue sur Agenda du Royaume !"
                />
                <Alert
                  variant="info"
                  title="Mise à jour disponible"
                  message="Une nouvelle version de l'application est disponible."
                  showLink={true}
                  linkText="Mettre à jour"
                />
                <Alert
                  variant="gray"
                  title="Informations générales"
                  message="Cette section vous permet de gérer vos préférences et paramètres de compte."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section Modal */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Composant Modal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tailles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Tailles</h3>
              <div className="space-y-3">
                <Button variant="primary" onClick={() => setModal1Open(true)}>
                  Modal Small
                </Button>
                <Button variant="primary" onClick={() => setModal2Open(true)}>
                  Modal Medium
                </Button>
                <Button variant="primary" onClick={() => setModal3Open(true)}>
                  Modal Large
                </Button>
                <Button variant="primary" onClick={() => setModal4Open(true)}>
                  Modal XL
                </Button>
              </div>
            </div>

            {/* Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Types</h3>
              <div className="space-y-3">
                <Button variant="secondary" onClick={() => setModal1Open(true)}>
                  Avec bouton fermer
                </Button>
                <Button variant="outline" onClick={() => setModal2Open(true)}>
                  Sans bouton fermer
                </Button>
                <Button variant="ghost" onClick={() => setModal3Open(true)}>
                  Modal plein écran
                </Button>
              </div>
            </div>

            {/* Exemples */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Exemples</h3>
              <div className="space-y-3">
                <Button variant="primary" startIcon={<PlusIcon className="w-4 h-4" />} onClick={() => setModal1Open(true)}>
                  Créer un événement
                </Button>
                <Button variant="secondary" startIcon={<UserIcon className="w-4 h-4" />} onClick={() => setModal2Open(true)}>
                  Modifier le profil
                </Button>
                <Button variant="outline" startIcon={<SettingsIcon className="w-4 h-4" />} onClick={() => setModal3Open(true)}>
                  Paramètres
                </Button>
              </div>
            </div>
          </div>

          {/* Exemples d'usage */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Exemples d'usage</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => setModal1Open(true)}>
                Confirmation
              </Button>
              <Button variant="secondary" onClick={() => setModal2Open(true)}>
                Formulaire
              </Button>
              <Button variant="outline" onClick={() => setModal3Open(true)}>
                Détails
              </Button>
            </div>
          </div>
        </section>

        {/* Section Button */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Composant Button</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Variants */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Variants</h3>
              <div className="space-y-3">
                <Button variant="primary" onClick={() => console.log('Primary clicked')}>
                  Primary (Organisateur)
                </Button>
                <Button variant="secondary" onClick={() => console.log('Secondary clicked')}>
                  Secondary (Participant)
                </Button>
                <Button variant="outline" onClick={() => console.log('Outline clicked')}>
                  Outline
                </Button>
                <Button variant="ghost" onClick={() => console.log('Ghost clicked')}>
                  Ghost
                </Button>
              </div>
            </div>

            {/* Tailles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Tailles</h3>
              <div className="space-y-3">
                <Button size="sm" variant="primary">
                  Small
                </Button>
                <Button size="md" variant="primary">
                  Medium (default)
                </Button>
                <Button size="lg" variant="primary">
                  Large
                </Button>
              </div>
            </div>

            {/* États */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">États</h3>
              <div className="space-y-3">
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" loading>
                  Loading
                </Button>
                <Button variant="primary" startIcon={<PlusIcon className="w-4 h-4" />}>
                  Avec icône gauche
                </Button>
                <Button variant="primary" endIcon={<ArrowRightIcon className="w-4 h-4" />}>
                  Avec icône droite
                </Button>
              </div>
            </div>
          </div>

          {/* Exemples d'usage */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Exemples d'usage</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" startIcon={<PlusIcon className="w-4 h-4" />}>
                Créer un événement
              </Button>
              <Button variant="secondary" startIcon={<UserIcon className="w-4 h-4" />}>
                Voir le profil
              </Button>
              <Button variant="outline">
                Annuler
              </Button>
              <Button variant="ghost" endIcon={<ArrowRightIcon className="w-4 h-4" />}>
                Continuer
              </Button>
            </div>
          </div>
        </section>

        {/* Section Badge */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Composant Badge</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Variants */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Variants Light</h3>
              <div className="space-y-3">
                <Badge variant="light" color="primary">Organisateur</Badge>
                <Badge variant="light" color="secondary">Participant</Badge>
                <Badge variant="light" color="success">Validé</Badge>
                <Badge variant="light" color="error">Erreur</Badge>
                <Badge variant="light" color="warning">En attente</Badge>
                <Badge variant="light" color="info">Information</Badge>
              </div>
            </div>

            {/* Variants Solid */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Variants Solid</h3>
              <div className="space-y-3">
                <Badge variant="solid" color="primary">Organisateur</Badge>
                <Badge variant="solid" color="secondary">Participant</Badge>
                <Badge variant="solid" color="success">Validé</Badge>
                <Badge variant="solid" color="error">Erreur</Badge>
                <Badge variant="solid" color="warning">En attente</Badge>
                <Badge variant="solid" color="info">Information</Badge>
              </div>
            </div>

            {/* Tailles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Tailles</h3>
              <div className="space-y-3">
                <Badge size="sm" color="primary">Small</Badge>
                <Badge size="md" color="primary">Medium (default)</Badge>
                <Badge size="lg" color="primary">Large</Badge>
              </div>
            </div>
          </div>

          {/* Exemples d'usage */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Exemples d'usage</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="light" color="success" startIcon={<CheckCircleIcon className="w-3 h-3" />}>
                Événement validé
              </Badge>
              <Badge variant="light" color="warning" startIcon={<AlertTriangleIcon className="w-3 h-3" />}>
                En attente de validation
              </Badge>
              <Badge variant="solid" color="primary" startIcon={<UserIcon className="w-3 h-3" />}>
                Organisateur
              </Badge>
              <Badge variant="solid" color="secondary" startIcon={<UserIcon className="w-3 h-3" />}>
                Participant
              </Badge>
              <Badge variant="light" color="info" startIcon={<InfoIcon className="w-3 h-3" />}>
                Nouveau
              </Badge>
            </div>
          </div>
        </section>

        {/* Section Dropdown */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Composant Dropdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Menu Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Menu Actions</h3>
              <div className="space-y-3">
                <div className="relative">
                  <button 
                    className="dropdown-toggle flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    onClick={() => setDropdown2Open(!dropdown2Open)}
                  >
                    Actions <ArrowRightIcon className="w-4 h-4" />
                  </button>
                  <Dropdown isOpen={dropdown2Open} onClose={() => setDropdown2Open(false)}>
                    <DropdownItem onClick={() => console.log('Éditer')}>
                      <div className="flex items-center gap-2">
                        <PencilIcon className="w-4 h-4" />
                        Éditer
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => console.log('Supprimer')}>
                      <div className="flex items-center gap-2">
                        <TrashIcon className="w-4 h-4" />
                        Supprimer
                      </div>
                    </DropdownItem>
                    <DropdownItem disabled>
                      <div className="flex items-center gap-2">
                        <LockIcon className="w-4 h-4" />
                        Désactivé
                      </div>
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>
            </div>

            {/* Menu Utilisateur */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Menu Utilisateur</h3>
              <div className="space-y-3">
                <div className="relative">
                  <button 
                    className="dropdown-toggle flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    onClick={() => setDropdown3Open(!dropdown3Open)}
                  >
                    <UserIcon className="w-4 h-4" />
                    Mon Profil
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                  <Dropdown isOpen={dropdown3Open} onClose={() => setDropdown3Open(false)}>
                    <DropdownItem tag="a" to="/profile">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Voir le profil
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => console.log('Paramètres')}>
                      <div className="flex items-center gap-2">
                        <SettingsIcon className="w-4 h-4" />
                        Paramètres
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => console.log('Déconnexion')}>
                      <div className="flex items-center gap-2">
                        <LogOutIcon className="w-4 h-4" />
                        Déconnexion
                      </div>
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>
            </div>

            {/* Positions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Positions</h3>
              <div className="space-y-3">
                <div className="relative">
                  <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                    Position Bottom (default)
                  </button>
                </div>
                <div className="relative">
                  <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                    Position Top
                  </button>
                </div>
                <div className="relative">
                  <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                    Position Left/Right
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Exemples d'usage */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Exemples d'usage</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <button 
                  className="dropdown-toggle flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-blue text-white hover:bg-primary-blue/90"
                  onClick={() => setDropdown1Open(!dropdown1Open)}
                >
                  Menu Principal
                </button>
                <Dropdown isOpen={dropdown1Open} onClose={() => setDropdown1Open(false)}>
                  <DropdownItem onClick={() => console.log('Nouvel événement')}>
                    Nouvel événement
                  </DropdownItem>
                  <DropdownItem onClick={() => console.log('Importer')}>
                    Importer des données
                  </DropdownItem>
                  <DropdownItem onClick={() => console.log('Exporter')}>
                    Exporter les données
                  </DropdownItem>
                </Dropdown>
              </div>
            </div>
          </div>
        </section>

        {/* Informations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Informations</h3>
          <p className="text-blue-700">
            Ces composants ont été adaptés du template dashboard avec nos couleurs :
          </p>
          <ul className="mt-2 text-blue-700 space-y-1">
            <li>• <strong>Button Primary</strong> : Bleu organisateur (#00008B)</li>
            <li>• <strong>Button Secondary</strong> : Orange participant (#FFA500)</li>
            <li>• <strong>Badge Primary</strong> : Bleu organisateur avec transparence</li>
            <li>• <strong>Badge Secondary</strong> : Orange participant avec transparence</li>
            <li>• <strong>Badge Success</strong> : Vert menthe (#62BF92)</li>
            <li>• <strong>Badge Error</strong> : Coral (#EE6239)</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={modal1Open} onClose={() => setModal1Open(false)} size="sm">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Modal Small</h3>
          <p className="text-gray-600 mb-6">Ceci est un exemple de modal de petite taille.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setModal1Open(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => setModal1Open(false)}>
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal2Open} onClose={() => setModal2Open(false)} size="md" showCloseButton={false}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Modal Medium</h3>
          <p className="text-gray-600 mb-6">Ceci est un exemple de modal de taille moyenne sans bouton de fermeture.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setModal2Open(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => setModal2Open(false)}>
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal3Open} onClose={() => setModal3Open(false)} size="lg" isFullscreen>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Modal Large (Plein écran)</h3>
          <p className="text-gray-600 mb-6">Ceci est un exemple de modal en plein écran.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setModal3Open(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => setModal3Open(false)}>
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal4Open} onClose={() => setModal4Open(false)} size="xl">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Modal XL</h3>
          <p className="text-gray-600 mb-6">Ceci est un exemple de modal de très grande taille.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setModal4Open(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => setModal4Open(false)}>
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TestDashboardComponents;
