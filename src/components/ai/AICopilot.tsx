import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Brain,
  FileText,
  Dumbbell,
  TrendingUp } from
'lucide-react';
import { useApp } from '../../context/AppContext';
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
const QUICK_PROMPTS = [
{
  icon: FileText,
  label: 'Resumen del paciente',
  prompt: 'Dame un resumen del historial de este paciente'
},
{
  icon: Dumbbell,
  label: 'Sugerir ejercicios',
  prompt: 'Qué ejercicios recomiendas para la próxima sesión?'
},
{
  icon: TrendingUp,
  label: 'Análisis de progreso',
  prompt: 'Cómo ha sido la evolución del paciente?'
}];

export const AICopilot = () => {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedPatient = state.patients.find(
    (p) => p.id === state.selectedPatient
  );
  const patientEpisodes = state.episodes.filter(
    (e) => e.patientId === state.selectedPatient
  );
  const patientAppointments = state.appointments.filter(
    (a) => a.patientId === state.selectedPatient
  );
  const patientNotes = state.sessionNotes.filter(
    (n) => n.patientId === state.selectedPatient
  );
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);
  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    // Resumen del paciente
    if (
    lowerMessage.includes('resumen') ||
    lowerMessage.includes('historial'))
    {
      if (!selectedPatient) {
        return 'No hay un paciente seleccionado actualmente. Selecciona un paciente desde la vista de Pacientes para que pueda darte información sobre él.';
      }
      const activeEpisode = patientEpisodes.find((e) => e.status === 'active');
      const completedSessions = patientAppointments.filter(
        (a) => a.status === 'completed'
      ).length;
      const lastNote = patientNotes.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      return `📋 **Resumen de ${selectedPatient.name}**

**Datos básicos:**
• Deporte: ${selectedPatient.sport || 'No especificado'}
• Posición: ${selectedPatient.position || 'No especificada'}

**Episodio activo:**
${
      activeEpisode ?
      `• Diagnóstico: ${activeEpisode.injury}
• Fase: ${activeEpisode.phase}` :
      '• Sin episodio activo'}

**Historial:**
• Sesiones completadas: ${
      completedSessions}
${lastNote ? `• Último nivel de dolor: ${lastNote.painLevel}/10` : '• Sin notas de sesión'}

¿Te gustaría más detalles?`;
    }
    // Sugerencia de ejercicios
    if (
    lowerMessage.includes('ejercicio') ||
    lowerMessage.includes('recomiend'))
    {
      const activeEpisode = patientEpisodes.find((e) => e.status === 'active');
      if (!activeEpisode) {
        return 'No hay un episodio activo para este paciente.';
      }
      const phaseExercises: Record<string, string[]> = {
        acute: ['Movilidad pasiva', 'Isométricos suaves', 'Crioterapia'],
        subacute: [
        'ROM activo',
        'Fortalecimiento isométrico',
        'Propiocepción básica'],

        remodeling: [
        'Fortalecimiento excéntrico',
        'Pliometría baja',
        'Core stability'],

        return_to_sport: [
        'Pliometría avanzada',
        'Agilidad',
        'Gestos deportivos']

      };
      const exercises =
      phaseExercises[activeEpisode.phase] || phaseExercises['subacute'];
      return `🏋️ **Ejercicios para ${selectedPatient?.name}**

**Fase:** ${activeEpisode.phase}

**Sugeridos:**
${exercises.map((e, i) => `${i + 1}. ${e}`).join('\n')}

• Mantener dolor < 4/10
• Progresión gradual`;
    }
    // Análisis de progreso
    if (
    lowerMessage.includes('progreso') ||
    lowerMessage.includes('evolución'))
    {
      if (patientNotes.length < 2) {
        return 'Necesito al menos 2 sesiones para analizar el progreso.';
      }
      const sortedNotes = [...patientNotes].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const firstNote = sortedNotes[0];
      const lastNote = sortedNotes[sortedNotes.length - 1];
      const painReduction = firstNote.painLevel - lastNote.painLevel;
      return `📈 **Progreso de ${selectedPatient?.name}**

**Dolor:**
• Inicial: ${firstNote.painLevel}/10
• Actual: ${lastNote.painLevel}/10
• ${painReduction > 0 ? `✅ Reducción de ${painReduction} puntos` : '⚠️ Sin mejora'}

**Sesiones:** ${patientNotes.length}
**Tendencia:** ${painReduction >= 2 ? '🟢 Favorable' : '🟡 Requiere ajustes'}`;
    }
    return `Puedo ayudarte con:
• Resúmenes de pacientes
• Recomendaciones de ejercicios
• Análisis de progreso

${selectedPatient ? `Paciente actual: **${selectedPatient.name}**` : 'Selecciona un paciente primero.'}`;
  };
  const handleSend = async (message?: string) => {
    const messageToSend = message || input.trim();
    if (!messageToSend) return;
    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 1000)
    );
    const aiResponse = generateAIResponse(messageToSend);
    const assistantMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMessage]);
  };
  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen &&
        <motion.button
          initial={{
            scale: 0,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          exit={{
            scale: 0,
            opacity: 0
          }}
          whileHover={{
            scale: 1.05
          }}
          whileTap={{
            scale: 0.95
          }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 h-12 w-12 md:h-14 md:w-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white z-40 hover:shadow-xl transition-shadow">

            <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>
        }
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            height: isMinimized ? 'auto' : 'min(500px, calc(100vh - 120px))'
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.95
          }}
          transition={{
            duration: 0.2
          }}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-[calc(100vw-32px)] md:w-96 max-w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Copilot</h3>
                  <p className="text-xs text-white/70">Asistente clínico</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">

                  {isMinimized ?
                <Maximize2 className="h-4 w-4 text-white" /> :

                <Minimize2 className="h-4 w-4 text-white" />
                }
                </button>
                <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">

                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {!isMinimized &&
          <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ?
              <div className="text-center py-6">
                      <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="h-5 w-5 text-violet-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1 text-sm">
                        ¡Hola! Soy tu copiloto
                      </h4>
                      <p className="text-xs text-gray-500 mb-4">
                        Puedo ayudarte con información de pacientes y más.
                      </p>

                      <div className="space-y-2">
                        {QUICK_PROMPTS.map((prompt, i) =>
                  <button
                    key={i}
                    onClick={() => handleSend(prompt.prompt)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">

                            <prompt.icon className="h-4 w-4 text-violet-500 flex-shrink-0" />
                            <span className="text-gray-700">
                              {prompt.label}
                            </span>
                          </button>
                  )}
                      </div>
                    </div> :

              messages.map((message) =>
              <motion.div
                key={message.id}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                        {message.role === 'assistant' &&
                <div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-3 w-3 text-violet-600" />
                          </div>
                }
                        <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs ${message.role === 'user' ? 'bg-violet-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>

                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                        {message.role === 'user' &&
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-gray-600" />
                          </div>
                }
                      </motion.div>
              )
              }

                  {isTyping &&
              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                className="flex gap-2">

                      <div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-violet-600" />
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1">
                          <motion.div
                      animate={{
                        y: [0, -3, 0]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0
                      }}
                      className="h-1.5 w-1.5 bg-gray-400 rounded-full" />

                          <motion.div
                      animate={{
                        y: [0, -3, 0]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.2
                      }}
                      className="h-1.5 w-1.5 bg-gray-400 rounded-full" />

                          <motion.div
                      animate={{
                        y: [0, -3, 0]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.4
                      }}
                      className="h-1.5 w-1.5 bg-gray-400 rounded-full" />

                        </div>
                      </div>
                    </motion.div>
              }

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />

                    <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="px-3 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
          }
          </motion.div>
        }
      </AnimatePresence>
    </>);

};