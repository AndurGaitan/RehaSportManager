import React from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { Patient, Episode } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { PatientAvatar } from '../ui/PatientAvatar';
interface PatientTableProps {
  patients: Patient[];
  episodes: Episode[];
  onSelect: (patient: Patient) => void;
}
export const PatientTable = ({
  patients,
  episodes,
  onSelect
}: PatientTableProps) => {
  const getActiveEpisode = (patientId: string) => {
    return episodes.find(
      (e) => e.patientId === patientId && e.status === 'active'
    );
  };
  const getStatusBadge = (episode: Episode | undefined) => {
    if (!episode) return <Badge variant="gray">Sin episodio</Badge>;
    switch (episode.status) {
      case 'active':
        return <Badge variant="green">Activo</Badge>;
      case 'on_hold':
        return <Badge variant="yellow">En pausa</Badge>;
      case 'completed':
        return <Badge variant="gray">Alta</Badge>;
      default:
        return null;
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paciente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Diagnóstico Activo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fase
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deporte
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => {
            const activeEpisode = getActiveEpisode(patient.id);
            return (
              <tr
                key={patient.id}
                onClick={() => onSelect(patient)}
                className="hover:bg-gray-50 cursor-pointer transition-colors">

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <PatientAvatar
                      name={patient.name}
                      gender={patient.gender}
                      size="sm" />

                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {patient.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {activeEpisode?.injury || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {activeEpisode?.phase || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(activeEpisode)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.sport || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </td>
              </tr>);

          })}
        </tbody>
      </table>
    </div>);

};