import React from 'react';
import type { EventSession, EventIntervenant } from '../../../types/database';
import { Button } from '../../ui/Button';
import { Edit, Trash2, Clock, User, MapPin, AlertTriangle, Mic, Wrench, Users, Heart, Music, Coffee, MessageSquare, Handshake, MessageCircle } from 'lucide-react';

interface SessionListProps {
  sessions: EventSession[];
  intervenants: EventIntervenant[];
  onEditSession: (session: EventSession) => void;
  onDeleteSession: (sessionId: number) => void;
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  intervenants,
  onEditSession,
  onDeleteSession,
}) => {
  // Fonction pour formater la date
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fonction pour obtenir le nom de l'intervenant
  const getIntervenantName = (intervenantId?: number) => {
    if (!intervenantId) return null;
    const intervenant = intervenants.find(i => i.id === intervenantId);
    return intervenant?.nom || 'Intervenant inconnu';
  };

  // Fonction pour obtenir l'icône du type de session
  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'pleniere':
        return <Mic className="w-5 h-5" />;
      case 'atelier':
        return <Wrench className="w-5 h-5" />;
      case 'table_ronde':
        return <Users className="w-5 h-5" />;
      case 'priere':
        return <Heart className="w-5 h-5" />;
      case 'louange':
        return <Music className="w-5 h-5" />;
      case 'pause':
        return <Coffee className="w-5 h-5" />;
      case 'conference':
        return <MessageSquare className="w-5 h-5" />;
      case 'networking':
        return <Handshake className="w-5 h-5" />;
      case 'debat':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  // Fonction pour détecter les sessions parallèles
  const detectParallelSessions = (sessions: EventSession[]) => {
    const parallelGroups: EventSession[][] = [];
    
    for (let i = 0; i < sessions.length; i++) {
      const currentSession = sessions[i];
      const currentStart = new Date(currentSession.date_debut);
      const currentEnd = new Date(currentSession.date_fin);
      
      const parallelSessions = [currentSession];
      
      for (let j = i + 1; j < sessions.length; j++) {
        const otherSession = sessions[j];
        const otherStart = new Date(otherSession.date_debut);
        const otherEnd = new Date(otherSession.date_fin);
        
        // Vérifier si les sessions se chevauchent
        if (
          (currentStart <= otherEnd && currentEnd >= otherStart) ||
          (otherStart <= currentEnd && otherEnd >= currentStart)
        ) {
          parallelSessions.push(otherSession);
        }
      }
      
      if (parallelSessions.length > 1) {
        parallelGroups.push(parallelSessions);
      }
    }
    
    return parallelGroups;
  };

  const parallelGroups = detectParallelSessions(sessions);

  // Fonction pour vérifier si une session fait partie d'un groupe parallèle
  const isInParallelGroup = (session: EventSession) => {
    return parallelGroups.some(group => 
      group.some(s => s.id === session.id)
    );
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 italic">
          Aucune session configurée. Ajoutez des sessions pour créer un programme structuré.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Avertissement pour les sessions parallèles */}
      {parallelGroups.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">
                Sessions en parallèle détectées
              </h4>
              <p className="text-sm text-yellow-800">
                Certaines sessions se déroulent en même temps. Les participants devront choisir une session.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Liste des sessions */}
      <div className="space-y-3">
        {sessions.map((session, index) => (
          <div 
            key={session.id || index} 
            className={`p-4 border rounded-lg ${
              isInParallelGroup(session) 
                ? 'border-yellow-300 bg-yellow-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600">{getSessionIcon(session.type_session)}</span>
                  <h4 className="font-medium text-gray-900">
                    {session.titre}
                  </h4>
                  {isInParallelGroup(session) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Parallèle
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatDateTime(session.date_debut)} - {formatDateTime(session.date_fin)}
                    </span>
                  </div>

                  {session.intervenant_id && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{getIntervenantName(session.intervenant_id)}</span>
                    </div>
                  )}

                  {session.salle && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{session.salle}</span>
                    </div>
                  )}

                  {session.description && (
                    <p className="text-gray-700 mt-2">{session.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  onClick={() => onEditSession(session)}
                  variant="ghost"
                  size="sm"
                  className="p-1 text-primary-blue hover:bg-primary-blue/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onDeleteSession(session.id!)}
                  variant="ghost"
                  size="sm"
                  className="p-1 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionList;
