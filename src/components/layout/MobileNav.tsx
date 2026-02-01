import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Calendar,
  Activity,
  FileText,
  Settings,
  Layout,
  Dumbbell,
  X } from
'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
const navigation = [
{
  name: 'Dashboard',
  icon: Layout,
  id: 'dashboard'
},
{
  name: 'Agenda',
  icon: Calendar,
  id: 'agenda'
},
{
  name: 'Pacientes',
  icon: Users,
  id: 'patients'
},
{
  name: 'Ejercicios',
  icon: Dumbbell,
  id: 'exercises'
},
{
  name: 'Reportes',
  icon: FileText,
  id: 'reports'
},
{
  name: 'Configuración',
  icon: Settings,
  id: 'settings'
}];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}
export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const { state, dispatch } = useApp();
  const handleNavClick = (viewId: string) => {
    dispatch({
      type: 'SET_VIEW',
      payload: viewId
    });
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose} />


          {/* Drawer */}
          <motion.div
          initial={{
            x: '-100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '-100%'
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300
          }}
          className="fixed inset-y-0 left-0 w-72 bg-white z-50 md:hidden flex flex-col shadow-xl">

            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="text-xl font-bold text-blue-600 flex items-center">
                <Activity className="h-6 w-6 mr-2" />
                RehaSport
              </h1>
              <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors">

                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
              const isActive = state.activeView === item.id;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive ?
                    'bg-blue-50 text-blue-700' :
                    'text-gray-700 hover:bg-gray-50'
                  )}>

                    <item.icon
                    className={cn(
                      'mr-3 h-5 w-5',
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    )} />

                    {item.name}
                  </button>);

            })}
            </nav>

            {/* User */}
            <div className="p-4 border-t">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  AV
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Dr. Vega</p>
                  <p className="text-xs text-gray-500">Kinesiólogo</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

};
// Bottom Tab Bar for mobile
export const MobileTabBar = () => {
  const { state, dispatch } = useApp();
  const tabs = [
  {
    name: 'Inicio',
    icon: Layout,
    id: 'dashboard'
  },
  {
    name: 'Agenda',
    icon: Calendar,
    id: 'agenda'
  },
  {
    name: 'Pacientes',
    icon: Users,
    id: 'patients'
  },
  {
    name: 'Ejercicios',
    icon: Dumbbell,
    id: 'exercises'
  },
  {
    name: 'Más',
    icon: Settings,
    id: 'settings'
  }];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-30 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = state.activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() =>
              dispatch({
                type: 'SET_VIEW',
                payload: tab.id
              })
              }
              className={cn(
                'flex flex-col items-center py-1 px-3 rounded-lg transition-colors min-w-[60px]',
                isActive ? 'text-blue-600' : 'text-gray-500'
              )}>

              <tab.icon
                className={cn('h-5 w-5', isActive && 'text-blue-600')} />

              <span className="text-xs mt-1 font-medium">{tab.name}</span>
              {isActive &&
              <motion.div
                layoutId="tabIndicator"
                className="absolute bottom-0 h-0.5 w-12 bg-blue-600 rounded-full"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }} />

              }
            </button>);

        })}
      </div>
    </div>);

};