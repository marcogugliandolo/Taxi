import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, History, Settings, HelpCircle, Save, LogOut, Info, MapPin } from 'lucide-react';

interface MenuModalsProps {
  activeModal: string | null;
  onClose: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function MenuModals({ activeModal, onClose, onLogin, onLogout }: MenuModalsProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"
      />
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-sm bg-white dark:bg-zinc-900 shadow-2xl rounded-[32px] overflow-hidden flex flex-col max-h-[85vh]"
      >
        {activeModal === 'profile' && (
          <div className="flex flex-col">
            <div className="p-6 bg-slate-50 dark:bg-zinc-950 flex justify-between items-center border-b border-slate-200 dark:border-zinc-800">
              <h2 className="font-bold text-xl flex items-center gap-2 dark:text-white">
                <User size={24} className="text-indigo-500" /> Mi Perfil
              </h2>
              <button onClick={onClose} className="p-2 -mr-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors">
                <X size={20} className="dark:text-zinc-300" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-4xl border-4 border-white dark:border-zinc-800 shadow-md">
                  C
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Nombre Completo</label>
                  <input type="text" defaultValue="Cliente Frecuente" className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 font-bold dark:text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Email</label>
                  <input type="email" defaultValue="cliente@ejemplo.com" className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 font-bold dark:text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Teléfono</label>
                  <input type="tel" defaultValue="+34 600 000 000" className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 font-bold dark:text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <button onClick={onClose} className="mt-4 w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                <Save size={20} /> Guardar Cambios
              </button>
              <button onClick={onLogout} className="mt-2 w-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                <LogOut size={20} /> Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        {activeModal === 'login' && (
          <div className="flex flex-col">
            <div className="p-6 bg-slate-50 dark:bg-zinc-950 flex justify-between items-center border-b border-slate-200 dark:border-zinc-800">
              <h2 className="font-bold text-xl flex items-center gap-2 dark:text-white">
                <User size={24} className="text-indigo-500" /> {isRegisterMode ? 'Registrarse' : 'Iniciar Sesión'}
              </h2>
              <button onClick={onClose} className="p-2 -mr-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors">
                <X size={20} className="dark:text-zinc-300" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-2">
                {isRegisterMode ? 'Crea una cuenta para pedir un TaxiGo de forma rápida y segura.' : 'Conéctate para poder pedir un TaxiGo de forma rápida y segura.'}
              </p>
              <div className="space-y-4">
                {isRegisterMode && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Nombre Completo</label>
                    <input type="text" placeholder="Ej: Marcos García" className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 font-bold dark:text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Email o Teléfono</label>
                  <input type="text" placeholder="Ej: +34 600 000 000" className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 font-bold dark:text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Contraseña</label>
                  <input type="password" placeholder="••••••••" className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 font-bold dark:text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <button onClick={() => { setIsRegisterMode(false); if (onLogin) onLogin(); }} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                {isRegisterMode ? 'Crear Cuenta' : 'Conectarse'}
              </button>
              
              <div className="text-center mt-2">
                <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                  {isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                </span>
                <button onClick={() => setIsRegisterMode(!isRegisterMode)} className="ml-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {isRegisterMode ? 'Iniciar Sesión' : 'Regístrate aquí'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'history' && (
          <div className="flex flex-col h-full">
            <div className="p-6 bg-slate-50 dark:bg-zinc-950 flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 shrink-0">
              <h2 className="font-bold text-xl flex items-center gap-2 dark:text-white">
                <History size={24} className="text-indigo-500" /> Mis Viajes
              </h2>
              <button onClick={onClose} className="p-2 -mr-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors">
                <X size={20} className="dark:text-zinc-300" />
              </button>
            </div>
            <div className="p-0 overflow-y-auto overflow-x-hidden">
               <div className="flex flex-col">
                 {[1, 2, 3].map((item) => (
                   <div key={item} className="p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-col gap-3">
                     <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Hace {item} días</span>
                       <span className="font-bold text-slate-800 dark:text-zinc-200">{12 * item}€</span>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center mt-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                          <div className="w-[2px] h-6 bg-slate-200 dark:bg-zinc-800"></div>
                          <div className="w-2.5 h-2.5 rounded-sm bg-black dark:bg-white"></div>
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="text-sm font-semibold dark:text-white truncate">Centro de la Ciudad</div>
                          <div className="text-sm font-semibold dark:text-white truncate">Aeropuerto T4</div>
                        </div>
                     </div>
                   </div>
                 ))}
                 <div className="p-6 text-center text-sm font-bold text-slate-400 dark:text-zinc-500">
                    No hay más viajes anteriores.
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeModal === 'settings' && (
          <div className="flex flex-col">
            <div className="p-6 bg-slate-50 dark:bg-zinc-950 flex justify-between items-center border-b border-slate-200 dark:border-zinc-800">
              <h2 className="font-bold text-xl flex items-center gap-2 dark:text-white">
                <Settings size={24} className="text-indigo-500" /> Configuración
              </h2>
              <button onClick={onClose} className="p-2 -mr-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors">
                <X size={20} className="dark:text-zinc-300" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
               <div className="space-y-4">
                 <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Notificaciones</h3>
                 <label className="flex items-center justify-between cursor-pointer">
                   <span className="font-bold text-slate-800 dark:text-zinc-200">Alertas de viaje</span>
                   <div className="w-12 h-6 bg-indigo-500 rounded-full relative shadow-inner">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </div>
                 </label>
                 <label className="flex items-center justify-between cursor-pointer">
                   <span className="font-bold text-slate-800 dark:text-zinc-200">Promociones</span>
                   <div className="w-12 h-6 bg-slate-300 dark:bg-zinc-700 rounded-full relative shadow-inner transition-colors">
                     <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </div>
                 </label>
               </div>
               
               <div className="space-y-4">
                 <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Pagos</h3>
                 <div className="bg-slate-100 dark:bg-zinc-800/80 p-4 rounded-2xl flex items-center justify-between border border-slate-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-blue-900 rounded flex items-center justify-center border border-white/20">
                        <span className="text-white text-[10px] font-bold italic">VISA</span>
                      </div>
                      <span className="font-bold dark:text-white">•••• 4242</span>
                    </div>
                    <button className="text-indigo-500 font-bold text-sm">Cambiar</button>
                 </div>
               </div>

               <button onClick={onClose} className="mt-4 w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center">
                 Aceptar
               </button>
            </div>
          </div>
        )}

        {activeModal === 'help' && (
          <div className="flex flex-col">
            <div className="p-6 bg-slate-50 dark:bg-zinc-950 flex justify-between items-center border-b border-slate-200 dark:border-zinc-800">
              <h2 className="font-bold text-xl flex items-center gap-2 dark:text-white">
                <HelpCircle size={24} className="text-indigo-500" /> Ayuda
              </h2>
              <button onClick={onClose} className="p-2 -mr-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors">
                <X size={20} className="dark:text-zinc-300" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <button className="flex items-center gap-4 bg-slate-100/80 dark:bg-zinc-800/80 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                 <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm">
                   <Info size={24} className="text-indigo-500" />
                 </div>
                 <div className="text-left">
                   <h3 className="font-bold dark:text-white">Centro de Ayuda</h3>
                   <p className="text-sm text-slate-500 dark:text-zinc-400">Preguntas frecuentes y soporte</p>
                 </div>
               </button>
               <button className="flex items-center gap-4 bg-slate-100/80 dark:bg-zinc-800/80 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                 <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm">
                   <MapPin size={24} className="text-indigo-500" />
                 </div>
                 <div className="text-left">
                   <h3 className="font-bold dark:text-white">Reportar un problema</h3>
                   <p className="text-sm text-slate-500 dark:text-zinc-400">Objetos perdidos, cobros...</p>
                 </div>
               </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
