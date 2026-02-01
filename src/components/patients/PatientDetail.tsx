import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Activity,
  FileText,
  Plus,
  TrendingDown,
  TrendingUp,
  Dumbbell } from
'lucide-react';
import { Patient } from '../../lib/types';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { PatientAvatar } from '../ui/PatientAvatar';
interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}
export const PatientDetail = ({ patient, onBack }: PatientDetailProps) => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const episodes = state.episodes.filter((e) => e.patientId === patient.id);
  const activeEpisode = episodes.find((e) => e.status === 'active');
  const appointments = state.appointments.filter(
    (a) => a.patientId === patient.id
  );
  const sessionNotes = state.sessionNotes.filter(
    (n) => n.patientId === patient.id
  );
  // Calculate pain trend
  const recentNotes = sessionNotes.
  sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).
  slice(0, 5);
  const painTrend =
  recentNotes.length >= 2 ?
  recentNotes[0].painLevel - recentNotes[recentNotes.length - 1].painLevel :
  0;
  const completedSessions = appointments.filter(
    (a) => a.status === 'completed'
  ).length;
  const upcomingSessions = appointments.filter(
    (a) =>
    a.status === 'scheduled' ||
    a.status === 'confirmed' && new Date(a.date) >= new Date()
  ).length;
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">

            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <PatientAvatar
            name={patient.name}
            gender={patient.gender}
            size="lg"
            className="hidden sm:flex" />

          <PatientAvatar
            name={patient.name}
            gender={patient.gender}
            size="md"
            className="sm:hidden" />

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {patient.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
              {patient.sport &&
              <span className="flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  {patient.sport}
                  {patient.position &&
                <span className="hidden sm:inline">
                      {' '}
                      - {patient.position}
                    </span>
                }
                </span>
              }
              {patient.level &&
              <Badge
                variant={patient.level === 'professional' ? 'blue' : 'gray'}>

                  {patient.level}
                </Badge>
              }
            </div>
          </div>
        </div>
        <div className="flex space-x-2 sm:space-x-3">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <FileText className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Historial</span>
          </Button>
          <Button variant="primary" size="sm" className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Nuevo Turno</span>
          </Button>
        </div>
      </div>

      {/* Contact Info Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
        <a
          href={`mailto:${patient.email}`}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">

          <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{patient.email}</span>
        </a>
        <a
          href={`tel:${patient.phone}`}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">

          <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          {patient.phone}
        </a>
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          {new Date(patient.dateOfBirth).toLocaleDateString('es-AR')}
        </div>
      </div>

      {/* Quick Stats - Responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-500">Sesiones</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
            {completedSessions}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-500">Próximas</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
            {upcomingSessions}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-500">Último Dolor</p>
          <div className="flex items-center mt-1">
            <p className="text-xl md:text-2xl font-bold text-gray-900">
              {recentNotes[0]?.painLevel ?? '-'}/10
            </p>
            {painTrend !== 0 &&
            <span
              className={`ml-2 flex items-center text-sm ${painTrend < 0 ? 'text-green-600' : 'text-red-600'}`}>

                {painTrend < 0 ?
              <TrendingDown className="h-4 w-4" /> :

              <TrendingUp className="h-4 w-4" />
              }
              </span>
            }
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-500">Fase</p>
          <p className="text-sm md:text-lg font-semibold text-gray-900 mt-1 truncate">
            {activeEpisode?.phase || 'Sin episodio'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Tabs
          tabs={[
          {
            id: 'overview',
            label: 'Resumen'
          },
          {
            id: 'sessions',
            label: 'Sesiones'
          },
          {
            id: 'exercises',
            label: 'Ejercicios'
          },
          {
            id: 'progress',
            label: 'Evolución'
          }]
          }
          activeTab={activeTab}
          onChange={setActiveTab} />


        <div className="p-4 md:p-6">
          {activeTab === 'overview' &&
          <div className="space-y-4 md:space-y-6">
              {/* Active Episode */}
              {activeEpisode ?
            <div className="border rounded-lg p-3 md:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Episodio Activo
                    </h3>
                    <Badge variant="green">Activo</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Diagnóstico</p>
                      <p className="font-medium">{activeEpisode.injury}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fase</p>
                      <p className="font-medium">{activeEpisode.phase}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Inicio</p>
                      <p className="font-medium">
                        {new Date(activeEpisode.startDate).toLocaleDateString(
                      'es-AR'
                    )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Detalle</p>
                      <p className="font-medium">
                        {activeEpisode.diagnosis || '-'}
                      </p>
                    </div>
                  </div>
                </div> :

            <div className="border rounded-lg p-6 text-center text-gray-500">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No hay episodio activo</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Episodio
                  </Button>
                </div>
            }

              {/* Recent Sessions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Últimas Sesiones
                </h3>
                {recentNotes.length > 0 ?
              <div className="space-y-2">
                    {recentNotes.slice(0, 3).map((note) =>
                <div
                  key={note.id}
                  className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                        <div>
                          <p className="font-medium text-sm">
                            {new Date(note.date).toLocaleDateString('es-AR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short'
                      })}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {note.sessionGoal}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Dolor</p>
                            <p className="font-semibold">{note.painLevel}/10</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Ejercicios</p>
                            <p className="font-semibold">
                              {note.exerciseDoses.length}
                            </p>
                          </div>
                        </div>
                      </div>
                )}
                  </div> :

              <p className="text-gray-500 text-sm">
                    No hay sesiones registradas
                  </p>
              }
              </div>

              {/* Notes */}
              {patient.notes &&
            <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notas</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {patient.notes}
                  </p>
                </div>
            }
            </div>
          }

          {activeTab === 'sessions' &&
          <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Historial completo de sesiones</p>
              <p className="text-sm">(En desarrollo)</p>
            </div>
          }

          {activeTab === 'exercises' &&
          <div className="text-center py-8 text-gray-500">
              <Dumbbell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Plan de ejercicios asignado</p>
              <p className="text-sm">(En desarrollo)</p>
            </div>
          }

          {activeTab === 'progress' &&
          <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Gráficos de evolución</p>
              <p className="text-sm">(En desarrollo)</p>
            </div>
          }
        </div>
      </div>
    </div>);

};