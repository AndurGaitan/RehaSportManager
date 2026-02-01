import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  Play,
  Check } from
'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { PatientAvatar } from '../ui/PatientAvatar';
import { useApp } from '../../context/AppContext';
import { AppointmentCard } from './AppointmentCard';
import { NewAppointmentModal } from './NewAppointmentModal';
import { Appointment } from '../../lib/types';
import { cn } from '../../lib/utils';
const timeSlots = Array.from(
  {
    length: 25
  },
  (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }
);
const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const weekDaysFull = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
export const CalendarView = () => {
  const { state, dispatch } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterProf, setFilterProf] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalParams, setModalParams] = useState<{
    date?: string;
    time?: string;
  }>({});
  const [mobileView, setMobileView] = useState<'day' | 'week'>('day');
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };
  const startOfWeek = getStartOfWeek(selectedDate);
  const weekDates = weekDaysFull.map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };
  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };
  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };
  const handleSlotClick = (date: string, time: string) => {
    setModalParams({
      date,
      time
    });
    setIsModalOpen(true);
  };
  const handleAction = (action: string, appointment: Appointment) => {
    if (action === 'start_session') {
      dispatch({
        type: 'UPDATE_APPOINTMENT',
        payload: {
          ...appointment,
          status: 'in_session' as const
        }
      });
    } else {
      const statusMap: Record<string, any> = {
        confirm: 'confirmed',
        check_in: 'checked_in',
        complete: 'completed',
        cancel: 'cancelled',
        no_show: 'no_show'
      };
      if (statusMap[action]) {
        dispatch({
          type: 'UPDATE_APPOINTMENT',
          payload: {
            ...appointment,
            status: statusMap[action]
          }
        });
      }
    }
  };
  // Get appointments for selected date (mobile day view)
  const selectedDateStr = formatDate(selectedDate);
  const dayAppointments = state.appointments.
  filter((apt) => {
    if (filterProf !== 'all' && apt.professionalId !== filterProf)
    return false;
    return apt.date === selectedDateStr && apt.status !== 'cancelled';
  }).
  sort((a, b) => a.time.localeCompare(b.time));
  const isToday = formatDate(new Date()) === selectedDateStr;
  return (
    <div className="flex flex-col h-full">
      {/* Mobile Header */}
      <div className="md:hidden space-y-3 mb-4">
        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevDay}
            className="p-2 hover:bg-gray-100 rounded-lg">

            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('es-AR', {
                weekday: 'long'
              })}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedDate.toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-gray-100 rounded-lg">

            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Week Mini Calendar */}
        <div className="flex justify-between bg-white rounded-xl p-2 border">
          {weekDates.map((date, i) => {
            const dateStr = formatDate(date);
            const isSelected = dateStr === selectedDateStr;
            const hasAppointments = state.appointments.some(
              (a) => a.date === dateStr && a.status !== 'cancelled'
            );
            const isTodayDate = formatDate(new Date()) === dateStr;
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  'flex flex-col items-center py-2 px-3 rounded-lg transition-colors',
                  isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100',
                  isTodayDate && !isSelected && 'ring-2 ring-blue-200'
                )}>

                <span
                  className={cn(
                    'text-xs',
                    isSelected ? 'text-blue-100' : 'text-gray-500'
                  )}>

                  {weekDays[i]}
                </span>
                <span
                  className={cn(
                    'text-lg font-semibold',
                    !isSelected && 'text-gray-900'
                  )}>

                  {date.getDate()}
                </span>
                {hasAppointments && !isSelected &&
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                }
              </button>);

          })}
        </div>

        {/* Add Button */}
        <Button
          variant="primary"
          className="w-full"
          onClick={() => {
            setModalParams({
              date: selectedDateStr
            });
            setIsModalOpen(true);
          }}>

          <Plus className="h-4 w-4 mr-2" />
          Nuevo Turno
        </Button>
      </div>

      {/* Mobile Day View - List of Appointments */}
      <div className="md:hidden flex-1 overflow-y-auto space-y-3 pb-4">
        {dayAppointments.length > 0 ?
        dayAppointments.map((apt) => {
          const patient = state.patients.find((p) => p.id === apt.patientId);
          const episode = state.episodes.find((e) => e.id === apt.episodeId);
          return (
            <div
              key={apt.id}
              className={cn(
                'bg-white rounded-xl border p-4',
                apt.status === 'in_session' &&
                'ring-2 ring-orange-300 border-orange-200'
              )}>

                <div className="flex items-start gap-3">
                  <div className="text-center min-w-[50px]">
                    <p className="text-lg font-bold text-gray-900">
                      {apt.time}
                    </p>
                    <p className="text-xs text-gray-500">{apt.duration}m</p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <PatientAvatar
                      name={patient?.name || ''}
                      gender={patient?.gender}
                      size="sm" />

                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {patient?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {episode?.injury || apt.type}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-2 flex items-center justify-between">
                      <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        apt.status === 'scheduled' &&
                        'bg-gray-100 text-gray-700',
                        apt.status === 'confirmed' &&
                        'bg-blue-100 text-blue-700',
                        apt.status === 'checked_in' &&
                        'bg-amber-100 text-amber-700',
                        apt.status === 'in_session' &&
                        'bg-orange-100 text-orange-700',
                        apt.status === 'completed' &&
                        'bg-emerald-100 text-emerald-700'
                      )}>

                        {apt.status === 'scheduled' && 'Programado'}
                        {apt.status === 'confirmed' && 'Confirmado'}
                        {apt.status === 'checked_in' && 'En sala'}
                        {apt.status === 'in_session' && 'En sesión'}
                        {apt.status === 'completed' && 'Completado'}
                      </span>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {apt.status === 'scheduled' &&
                      <button
                        onClick={() => handleAction('confirm', apt)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600">

                            <Check className="h-4 w-4" />
                          </button>
                      }
                        {apt.status === 'confirmed' &&
                      <button
                        onClick={() => handleAction('check_in', apt)}
                        className="p-2 rounded-lg bg-amber-100 text-amber-600">

                            <Check className="h-4 w-4" />
                          </button>
                      }
                        {apt.status === 'checked_in' &&
                      <button
                        onClick={() => handleAction('start_session', apt)}
                        className="p-2 rounded-lg bg-blue-600 text-white">

                            <Play className="h-4 w-4" />
                          </button>
                      }
                        {apt.status === 'in_session' &&
                      <span className="text-xs text-orange-600 font-medium animate-pulse">
                            En curso...
                          </span>
                      }
                      </div>
                    </div>
                  </div>
                </div>
              </div>);

        }) :

        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Sin turnos</p>
            <p className="text-sm text-gray-400 mt-1">
              {isToday ?
            'No hay turnos para hoy' :
            'No hay turnos para este día'}
            </p>
          </div>
        }
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900 capitalize">
            {selectedDate.toLocaleDateString('es-AR', {
              month: 'long',
              year: 'numeric'
            })}
          </h2>
          <div className="flex items-center bg-white rounded-md shadow-sm border">
            <button onClick={handlePrevWeek} className="p-1 hover:bg-gray-50">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 text-sm font-medium border-l border-r hover:bg-gray-50">

              Hoy
            </button>
            <button onClick={handleNextWeek} className="p-1 hover:bg-gray-50">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-48">
            <Select
              options={[
              {
                value: 'all',
                label: 'Todos los profesionales'
              },
              ...state.professionals.map((p) => ({
                value: p.id,
                label: p.name
              }))]
              }
              value={filterProf}
              onChange={(e) => setFilterProf(e.target.value)}
              className="text-sm" />

          </div>
          <Button onClick={() => setIsModalOpen(true)}>Nuevo Turno</Button>
        </div>
      </div>

      {/* Desktop Calendar Grid */}
      <div className="hidden md:flex flex-1 bg-white border rounded-lg shadow overflow-hidden flex-col">
        {/* Header Row */}
        <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b bg-gray-50">
          <div className="p-2 border-r"></div>
          {weekDates.map((date, i) => {
            const dateStr = formatDate(date);
            const isTodayDate = formatDate(new Date()) === dateStr;
            return (
              <div
                key={i}
                className={cn(
                  'p-2 text-center border-r last:border-r-0',
                  isTodayDate && 'bg-blue-50'
                )}>

                <div className="text-sm font-medium text-gray-900">
                  {weekDaysFull[i]}
                </div>
                <div
                  className={cn(
                    'text-xs',
                    isTodayDate ?
                    'text-blue-600 font-semibold' :
                    'text-gray-500'
                  )}>

                  {date.getDate()}
                </div>
              </div>);

          })}
        </div>

        {/* Time Slots */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[60px_repeat(5,1fr)]">
            {/* Time Column */}
            <div className="border-r bg-gray-50">
              {timeSlots.map((time) =>
              <div
                key={time}
                className="h-20 border-b text-xs text-gray-500 flex items-start justify-center pt-1">

                  {time}
                </div>
              )}
            </div>

            {/* Days Columns */}
            {weekDates.map((date, dayIndex) => {
              const dateStr = formatDate(date);
              return (
                <div
                  key={dayIndex}
                  className="border-r last:border-r-0 relative">

                  {timeSlots.map((time) => {
                    const slotAppointments = state.appointments.filter(
                      (apt) => {
                        if (
                        filterProf !== 'all' &&
                        apt.professionalId !== filterProf)

                        return false;
                        return (
                          apt.date === dateStr &&
                          apt.time === time &&
                          apt.status !== 'cancelled');

                      }
                    );
                    return (
                      <div
                        key={time}
                        className="h-20 border-b border-gray-100 hover:bg-gray-50 transition-colors relative group"
                        onClick={() => handleSlotClick(dateStr, time)}>

                        {slotAppointments.map((apt) =>
                        <div
                          key={apt.id}
                          className="absolute inset-x-1 inset-y-1 z-10">

                            <AppointmentCard
                            appointment={apt}
                            patient={state.patients.find(
                              (p) => p.id === apt.patientId
                            )}
                            onClick={() => {}}
                            onAction={handleAction} />

                          </div>
                        )}

                        {slotAppointments.length === 0 &&
                        <div className="absolute inset-0 hidden group-hover:flex items-center justify-center opacity-50">
                            <span className="text-blue-500 text-xs font-medium">
                              + Agendar
                            </span>
                          </div>
                        }
                      </div>);

                  })}
                </div>);

            })}
          </div>
        </div>
      </div>

      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDate={modalParams.date}
        initialTime={modalParams.time} />

    </div>);

};