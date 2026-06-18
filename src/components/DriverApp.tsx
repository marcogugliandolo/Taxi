import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowLeft, Car, ShieldCheck, Wallet, Map, LogOut, Moon, Sun, Navigation } from 'lucide-react';
import { drivers } from '../data';
import { Driver } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';

export default function DriverApp() {
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeDriver, setActiveDriver] = useState<Driver | null>(null);
  const [tripState, setTripState] = useState<'idle' | 'request' | 'in_progress'>('idle');
  const navigate = useNavigate();

  const handleLogin = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      setActiveDriver(driver);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setActiveDriver(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn || !activeDriver) {
    return (
      <div className="w-full h-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-sans p-6 overflow-y-auto w-full max-w-lg mx-auto">
         <div className="flex justify-between items-center mb-8">
           <button onClick={() => navigate('/')} className="w-10 h-10 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none rounded-full flex items-center justify-center border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              <ArrowLeft size={20} />
           </button>
           <button onClick={toggleTheme} className="w-10 h-10 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none rounded-full flex items-center justify-center border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
           </button>
         </div>
         
         <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="mb-10 text-center">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg dark:shadow-none">
                <span className="text-white dark:text-black font-bold text-lg">EV</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase dark:text-white">TaxiGo Conductores</h1>
              <p className="text-slate-500 dark:text-zinc-400 font-medium">Selecciona tu perfil para acceder</p>
            </div>

            <div className="space-y-4">
               {drivers.map(driver => (
                 <motion.button
                   key={driver.id}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => handleLogin(driver.id)}
                   className="w-full bg-white dark:bg-zinc-900 border-2 border-transparent dark:border-zinc-800 shadow-sm hover:border-black dark:hover:border-white p-4 rounded-2xl flex items-center gap-4 transition-all text-left"
                 >
                    <img src={driver.avatar} alt={driver.name} className="w-14 h-14 rounded-full object-cover border border-slate-100 dark:border-zinc-800" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white uppercase">{driver.name}</h3>
                      <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">{driver.vehicle} <span className="mx-1 text-slate-300 dark:text-zinc-700">|</span> {driver.plate}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center">
                      <ChevronRight className="text-black dark:text-white" size={20} />
                    </div>
                 </motion.button>
               ))}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-sans overflow-hidden">
       <div className="bg-white dark:bg-zinc-900 p-6 pt-10 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-10 shadow-sm dark:shadow-none shrink-0">
          <div className="flex items-center gap-4">
             <img src={activeDriver.avatar} alt={activeDriver.name} className="w-12 h-12 rounded-full border border-slate-200 dark:border-zinc-800 object-cover" />
             <div>
               <h2 className="font-bold text-lg leading-tight uppercase tracking-tight">{activeDriver.name}</h2>
               <div className="flex items-center gap-1 mt-0.5 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  <span>Verificado</span>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all">
               {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button onClick={handleLogout} className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all">
              <LogOut size={18} />
            </button>
          </div>
       </div>

       <div className="p-6 flex-1 overflow-y-auto max-w-lg mx-auto w-full">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm dark:shadow-none p-5 rounded-[24px]">
                <p className="text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wide mb-2">Ingresos hoy</p>
                <p className="text-3xl font-bold tracking-tight">€142<span className="text-lg text-slate-400 dark:text-zinc-600">.50</span></p>
             </div>
             <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm dark:shadow-none p-5 rounded-[24px]">
                <p className="text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wide mb-2">Viajes Totales</p>
                <p className="text-3xl font-bold tracking-tight">{activeDriver.trips}</p>
             </div>
          </div>

          <h3 className="text-lg font-bold mb-4 tracking-tight">Tu Vehículo</h3>
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-[24px] p-5 mb-8 flex flex-col gap-4 relative">
             <div className="absolute top-4 right-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-0.5 rounded">ACTIVO</div>
             <div className="flex items-start justify-between mt-2">
                <div>
                   <h4 className="text-xl font-bold">{activeDriver.vehicle}</h4>
                   <p className="text-slate-500 dark:text-zinc-400 font-bold mt-0.5">{activeDriver.plate}</p>
                </div>
             </div>
             <img src={activeDriver.vehicleImage} alt="Vehicle" className="w-full h-32 object-contain rounded-xl border border-slate-100 dark:border-zinc-800" />
          </div>

          <h3 className="text-lg font-bold mb-4 tracking-tight">Opciones rápidas</h3>
          <div className="space-y-3 pb-8">
             <button className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center gap-4 hover:border-black dark:hover:border-white shadow-sm dark:shadow-none transition-all group">
                <div className="w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white group-hover:bg-slate-100 dark:group-hover:bg-zinc-700 transition-colors">
                  <Map size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white">Mapa de demanda</h4>
                  <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Zonas con más actividad</p>
                </div>
                <ChevronRight size={20} className="text-slate-300 dark:text-zinc-600 group-hover:text-black dark:group-hover:text-white transition-colors" />
             </button>
             <button className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center gap-4 hover:border-black dark:hover:border-white shadow-sm dark:shadow-none transition-all group">
                <div className="w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white group-hover:bg-slate-100 dark:group-hover:bg-zinc-700 transition-colors">
                  <Wallet size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white">Retirar fondos</h4>
                  <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Transferencia a tu cuenta</p>
                </div>
                <ChevronRight size={20} className="text-slate-300 dark:text-zinc-600 group-hover:text-black dark:group-hover:text-white transition-colors" />
             </button>
          </div>
       </div>

       {tripState === 'idle' && (
         <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
            <button onClick={() => setTripState('request')} className="w-full bg-black dark:bg-white hover:opacity-90 active:scale-95 text-white dark:text-black font-bold py-4 rounded-2xl text-lg shadow-lg dark:shadow-none transition-transform flex items-center justify-center gap-2 uppercase tracking-wide">
               <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse border-2 border-black dark:border-white box-content"></span>
               Conectar / Recibir Viajes
            </button>
         </div>
       )}

       {tripState === 'request' && (
         <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-4 rounded-2xl mb-4 text-center">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 text-lg mb-1">¡Nuevo Pasajero!</h4>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Recogida a 2 min. Destino: Calle de la Princesa.</p>
            </div>
            <button onClick={() => setTripState('in_progress')} className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 rounded-2xl text-lg shadow-lg dark:shadow-none transition-transform flex items-center justify-center gap-2 uppercase tracking-wide">
               Iniciar Viaje
            </button>
         </div>
       )}

       {tripState === 'in_progress' && (
         <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-50 dark:bg-zinc-800 border border-blue-100 dark:border-zinc-700 rounded-full flex items-center justify-center">
                <Navigation className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight dark:text-white">En Ruta</h4>
                <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm">Viaje en curso...</p>
              </div>
            </div>
            <button onClick={() => setTripState('idle')} className="w-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 active:scale-95 text-slate-900 dark:text-white font-bold py-4 rounded-2xl text-lg transition-transform flex items-center justify-center gap-2 uppercase tracking-wide">
               Finalizar y Cobrar
            </button>
         </div>
       )}
    </div>
  );
}
