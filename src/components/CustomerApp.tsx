import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Car, Star, Clock, ShieldCheck, Phone, MessageSquare, Menu, Moon, Sun, User, History as HistoryIcon, Settings as SettingsIcon, HelpCircle, X, Search } from 'lucide-react';
import MapView from './MapView';
import { drivers } from '../data';
import { RideStatus, Driver } from '../types';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';
import { MenuModals } from './MenuModals';

// Fixed mock locations
const PICKUP_LOCATION: [number, number] = [40.4168, -3.7038]; 
const DROPOFF_LOCATION: [number, number] = [40.4350, -3.6900];

export default function CustomerApp() {
  const { theme, toggleTheme } = useTheme();
  const [status, setStatus] = useState<RideStatus>('idle');
  const [pickup, setPickup] = useState('Mi ubicación actual');
  const [dropoff, setDropoff] = useState('');
  
  const [pickupLoc, setPickupLoc] = useState<[number, number]>(PICKUP_LOCATION);
  const [dropoffLoc, setDropoffLoc] = useState<[number, number] | null>(null);
  
  const [searchResults, setSearchResults] = useState<{ display_name: string, lat: string, lon: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<number | null>(null);
  
  const [assignedDriver, setAssignedDriver] = useState<Driver | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Map state
  const [center, setCenter] = useState<[number, number]>(PICKUP_LOCATION);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [activeCarLocation, setActiveCarLocation] = useState<[number, number] | null>(null);

  const openModal = (modalName: string) => {
    setIsMenuOpen(false);
    setActiveModal(modalName);
  };

  const fetchRoute = async (start: [number, number], end: [number, number]) => {
     try {
       const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson`);
       const data = await res.json();
       if (data.routes && data.routes[0]) {
         return data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
       }
     } catch (e) {
         console.error('Failed to fetch route');
     }
     return [start, end] as [number, number][];
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setPickupLoc([latitude, longitude]);
        setCenter([latitude, longitude]);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
             const parts = data.display_name.split(',');
             setPickup(parts[0] + (parts[1] ? ',' + parts[1] : ''));
          }
        } catch (e) {
          console.error(e);
        }
      }, (error) => {
        console.error("Error getting location: ", error);
      });
    }
  }, []);

  useEffect(() => {
    let active = true;
    
    const getRoutePoints = async () => {
      if (status === 'idle' || status === 'searching') {
        setCenter(pickupLoc);
        setRoutePoints([]);
        setActiveCarLocation(null);
      } else if (status === 'driver_found' && assignedDriver) {
        const route = await fetchRoute(assignedDriver.location, pickupLoc);
        if (active) setRoutePoints(route);
      } else if (status === 'in_progress' && dropoffLoc) {
        const route = await fetchRoute(pickupLoc, dropoffLoc);
        if (active) setRoutePoints(route);
      }
    };
    
    getRoutePoints();
    
    return () => { active = false; };
  }, [status, assignedDriver, pickupLoc, dropoffLoc]);

  useEffect(() => {
    if (routePoints.length < 2) {
      setActiveCarLocation(null);
      return;
    }
    
    let duration = 0;
    if (status === 'driver_found') {
      duration = 10000;
    } else if (status === 'in_progress') {
      duration = 15000;
    } else {
      return;
    }

    const startLoc = routePoints[0];
    setActiveCarLocation(startLoc);
    let startTime = performance.now();
    let animationFrameId: number;
    let isCompleted = false;

    const dist = (p1: [number, number], p2: [number, number]) => {
       return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    };

    let totalLength = 0;
    const segmentLengths: number[] = [];
    for (let i = 0; i < routePoints.length - 1; i++) {
        const d = dist(routePoints[i], routePoints[i+1]);
        segmentLengths.push(d);
        totalLength += d;
    }

    const animateCar = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const targetDist = totalLength * progress;
      let currentDist = 0;
      let currentLoc: [number, number] = routePoints[routePoints.length - 1];

      for (let i = 0; i < routePoints.length - 1; i++) {
         const slen = segmentLengths[i];
         if (currentDist + slen >= targetDist) {
            const remaining = targetDist - currentDist;
            const ratio = slen === 0 ? 0 : remaining / slen;
            const p1 = routePoints[i];
            const p2 = routePoints[i+1];
            currentLoc = [
               p1[0] + (p2[0] - p1[0]) * ratio,
               p1[1] + (p2[1] - p1[1]) * ratio
            ];
            break;
         }
         currentDist += slen;
      }

      setActiveCarLocation(currentLoc);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCar);
      } else if (!isCompleted) {
        isCompleted = true;
        if (status === 'in_progress') {
           setTimeout(() => {
             setStatus('idle');
             setAssignedDriver(null);
             setDropoff('');
             setDropoffLoc(null);
           }, 1500);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animateCar);

    return () => cancelAnimationFrame(animationFrameId);
  }, [routePoints, status]);

  const handleSearchChange = (query: string) => {
    setDropoff(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    searchTimeout.current = window.setTimeout(async () => {
      setIsSearching(true);
      try {
         const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
         const data = await res.json();
         setSearchResults(data);
      } catch (e) {
         setSearchResults([]);
      }
      setIsSearching(false);
    }, 500);
  };

  const handleSelectDropoff = (result: any) => {
   const shortName = result.display_name.split(',')[0];
   setDropoff(shortName);
   setDropoffLoc([parseFloat(result.lat), parseFloat(result.lon)]);
   setSearchResults([]);
  };

  const handleRequestRide = () => {
    if (!dropoffLoc) return;
    setStatus('searching');
    
    // Simulate finding driver
    setTimeout(() => {
      // Pick random driver, but let's prioritize Gabriel for now
      const driver = drivers[Math.floor(Math.random() * drivers.length)];
      setAssignedDriver(driver);
      setStatus('driver_found');
    }, 3000);
  };

  const handleReset = () => {
    setStatus('idle');
    setAssignedDriver(null);
    setDropoff('');
    setDropoffLoc(null);
  };

  const displayDrivers = drivers.map(d => {
    if (assignedDriver && d.id === assignedDriver.id && activeCarLocation) {
      return { ...d, location: activeCarLocation };
    }
    return d;
  });

  return (
    <div className="relative w-full h-full bg-slate-50 dark:bg-zinc-950 font-sans overflow-hidden text-slate-900 dark:text-zinc-100 flex flex-col">
      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" 
            />
            
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-4/5 max-w-sm h-full bg-white dark:bg-zinc-950 shadow-2xl flex flex-col"
            >
              <div className="p-6 pt-10 pb-8 bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex flex-col gap-4">
                 <button onClick={() => setIsMenuOpen(false)} className="self-end p-2 -mr-2 text-slate-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                   <X size={24} />
                 </button>
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl border-2 border-white dark:border-zinc-800 shadow-sm">
                      {isAuthenticated ? 'C' : '?'}
                    </div>
                    <div>
                      {isAuthenticated ? (
                        <>
                          <h3 className="font-bold text-lg dark:text-white">Cliente</h3>
                          <div className="flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-zinc-400">
                            <Star size={14} fill="currentColor" className="text-yellow-500" />
                            5.0
                          </div>
                        </>
                      ) : (
                        <h3 className="font-bold text-lg dark:text-white">Invitado</h3>
                      )}
                    </div>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="flex flex-col gap-1 px-4">
                  {isAuthenticated ? (
                    <>
                      <span onClick={() => openModal('profile')} className="cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 font-bold text-slate-700 dark:text-zinc-300 transition-colors">
                        <User size={22} className="text-slate-400" /> Mi Perfil
                      </span>
                      <span onClick={() => openModal('history')} className="cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 font-bold text-slate-700 dark:text-zinc-300 transition-colors">
                        <HistoryIcon size={22} className="text-slate-400" /> Mis Viajes
                      </span>
                      <span onClick={() => openModal('settings')} className="cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 font-bold text-slate-700 dark:text-zinc-300 transition-colors">
                        <SettingsIcon size={22} className="text-slate-400" /> Configuración
                      </span>
                    </>
                  ) : (
                    <span onClick={() => openModal('login')} className="cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 font-bold text-indigo-600 dark:text-indigo-400 transition-colors">
                      <User size={22} className="text-indigo-400" /> Iniciar Sesión
                    </span>
                  )}
                  <span onClick={() => openModal('help')} className="cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 font-bold text-slate-700 dark:text-zinc-300 transition-colors">
                    <HelpCircle size={22} className="text-slate-400" /> Ayuda
                  </span>
                </nav>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-zinc-800">
                <Link to="/driver" className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 py-3.5 rounded-xl font-bold transition-colors">
                  <Car size={20} />
                  Cambiar a Conductor
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header / Nav */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center pointer-events-none">
        <div className="flex gap-2">
          <button onClick={() => setIsMenuOpen(true)} className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 pointer-events-auto hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            <Menu size={20} className="text-slate-700 dark:text-zinc-300" />
          </button>
          <button onClick={toggleTheme} className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 pointer-events-auto hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            {theme === 'light' ? <Moon size={20} className="text-slate-700" /> : <Sun size={20} className="text-zinc-300" />}
          </button>
        </div>
      </div>

      {/* Map Layer */}
      <MapView 
        drivers={displayDrivers} 
        center={center} 
        routePoints={routePoints}
        pickup={status !== 'idle' ? pickupLoc : undefined}
        dropoff={status === 'in_progress' && dropoffLoc ? dropoffLoc : undefined}
      />

      {/* Gradient Overlay for bottom sheet */}
      <div className="absolute bottom-[200px] left-0 w-full h-[200px] bg-gradient-to-t from-slate-50 dark:from-zinc-950 via-slate-50/50 dark:via-zinc-950/50 to-transparent z-10 pointer-events-none" />

      {/* Bottom Sheet Interface */}
      <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col justify-end">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 p-6 rounded-t-[32px] w-full max-w-lg mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none z-20 relative"
            >
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold mb-6 tracking-tight dark:text-white">¿A dónde vamos?</h2>
              
              <div className="relative flex flex-col gap-4">
                 <div className="absolute left-[13px] top-[22px] bottom-[22px] w-[2px] bg-slate-200 dark:bg-zinc-800 z-0"></div>
                 
                 <div className="relative z-10 flex items-center gap-4">
                   <div className="w-7 h-7 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center border-2 border-slate-200 dark:border-zinc-700">
                     <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                   </div>
                   <input 
                     type="text" 
                     value={pickup}
                     readOnly
                     className="bg-slate-50 dark:bg-zinc-900/50 outline-none text-slate-900 dark:text-zinc-100 font-semibold text-sm px-4 py-3.5 rounded-2xl w-full border border-slate-200 dark:border-zinc-800"
                   />
                 </div>

                 <div className="relative z-10 flex items-center gap-4">
                   <div className="w-7 h-7 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center border-2 border-slate-200 dark:border-zinc-700">
                     <span className="w-2.5 h-2.5 bg-black dark:bg-white rounded-sm"></span>
                   </div>
                   <div className="flex-1 relative">
                     <input 
                       type="text" 
                       placeholder="Buscar destino..."
                       value={dropoff}
                       onChange={(e) => {
                         if (!isAuthenticated) {
                           openModal('login');
                           return;
                         }
                         setDropoffLoc(null);
                         handleSearchChange(e.target.value);
                       }}
                       className="bg-white dark:bg-zinc-800/80 outline-none text-slate-900 dark:text-zinc-100 font-semibold text-sm px-4 py-3.5 rounded-2xl w-full border border-slate-200 dark:border-zinc-700 focus:border-black dark:focus:border-zinc-500 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                     />
                     
                     {searchResults.length > 0 && dropoff && !dropoffLoc && (
                       <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden z-20">
                         {searchResults.map((res, i) => (
                           <div 
                             key={i} 
                             onClick={() => handleSelectDropoff(res)}
                             className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-3 border-b border-slate-100 dark:border-zinc-700/50 last:border-0"
                           >
                             <MapPin size={16} className="text-slate-400 shrink-0" />
                             <span className="text-sm font-semibold truncate dark:text-white">{res.display_name}</span>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!isAuthenticated) openModal('login');
                  else handleRequestRide();
                }}
                disabled={isAuthenticated && !dropoffLoc}
                className="w-full mt-6 bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-2xl text-lg shadow-lg dark:shadow-none hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAuthenticated ? 'Solicitar TaxiGo' : 'Inicia Sesión'}
              </motion.button>
            </motion.div>
          )}

          {status === 'searching' && (
            <motion.div
              key="searching"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 p-8 rounded-t-[32px] w-full max-w-lg mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col items-center justify-center text-center z-20 relative"
            >
               <div className="relative w-20 h-20 mb-6">
                 <div className="absolute inset-0 border-4 border-slate-100 dark:border-zinc-800 rounded-full"></div>
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full"
                 ></motion.div>
                 <Car className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black dark:text-white" size={28} />
               </div>
               <h2 className="text-xl font-bold tracking-tight dark:text-white">Buscando conductores...</h2>
               <p className="text-slate-500 dark:text-zinc-400 mt-2 text-sm">Conectando con un KIA cerca de ti.</p>
               
               <button onClick={handleReset} className="mt-8 text-sm text-slate-400 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300 transition-colors uppercase tracking-widest font-bold">Cancelar</button>
            </motion.div>
          )}

          {status === 'driver_found' && assignedDriver && (
            <motion.div
              key="driver_found"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 p-6 rounded-t-[32px] w-full max-w-lg mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none z-20 relative"
            >
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full mx-auto mb-6"></div>
              
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-2xl font-bold tracking-tight dark:text-white">Tu coche está en camino</h2>
                 <div className="flex gap-1.5 items-center bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm">
                   <Clock size={14} className="text-slate-500 dark:text-zinc-400" />
                   <span className="font-bold text-slate-700 dark:text-zinc-200">5 min</span>
                 </div>
              </div>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6 pb-6 border-b border-slate-100 dark:border-zinc-800">El conductor llegará pronto a tu ubicación.</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img src={assignedDriver.avatar} alt={assignedDriver.name} className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-md" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                     <h3 className="text-lg font-bold dark:text-white">{assignedDriver.name}</h3>
                     <div className="flex items-center gap-1 text-slate-800 dark:text-zinc-200 font-bold bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg text-sm border border-slate-200 dark:border-zinc-700">
                        <Star size={14} fill="currentColor" className="text-yellow-500" />
                        <span>{assignedDriver.rating}</span>
                     </div>
                  </div>
                  <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm">{assignedDriver.vehicle}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-4 flex items-center justify-between border-2 border-slate-100 dark:border-zinc-800 mb-6 relative overflow-hidden">
                 <div className="absolute top-2 left-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">TaxiGo</div>
                 <div className="mt-4">
                   <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1">Matrícula</p>
                   <p className="text-xl font-bold tracking-tight dark:text-white">{assignedDriver.plate}</p>
                 </div>
                 <img src={assignedDriver.vehicleImage} alt="Car" className="w-32 h-20 object-contain rounded-xl drop-shadow-sm" />
              </div>

              <button onClick={() => setStatus('in_progress')} className="w-full mb-4 bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-2xl text-lg shadow-lg dark:shadow-none hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                Simular Iniciar Viaje
              </button>

              <div className="flex gap-3">
                 <button className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-colors py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm dark:shadow-none">
                   <MessageSquare size={18} />
                   Mensaje
                 </button>
                 <button className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-colors py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm dark:shadow-none">
                   <Phone size={18} />
                   Llamar
                 </button>
              </div>
              
               <div className="mt-6 flex justify-center">
                 <button onClick={handleReset} className="text-sm text-red-500 hover:text-red-600 transition-colors font-bold uppercase tracking-widest">
                   Cancelar Viaje
                 </button>
               </div>
            </motion.div>
          )}

          {status === 'in_progress' && assignedDriver && (
            <motion.div
              key="in_progress"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 p-6 rounded-t-[32px] w-full max-w-lg mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none z-20 relative"
            >
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full mx-auto mb-6"></div>
              
              <div className="flex justify-center mb-6 mt-4">
                <div className="w-20 h-20 bg-blue-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Navigation size={40} className="ml-1" />
                </div>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-center mb-2 dark:text-white">Viaje en curso</h2>
              <p className="text-slate-500 dark:text-zinc-400 text-center text-sm mb-8">En ruta hacia <span className="font-bold">{dropoff || 'tu destino'}</span>. Tiempo estimado: 15 min.</p>

              <button onClick={handleReset} className="w-full mt-4 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors font-bold py-4 rounded-2xl text-lg flex items-center justify-center dark:text-white">
                Finalizar Viaje
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        <MenuModals 
          activeModal={activeModal} 
          onClose={() => setActiveModal(null)} 
          onLogin={() => {
            setIsAuthenticated(true);
            setActiveModal(null);
          }}
          onLogout={() => {
            setIsAuthenticated(false);
            setActiveModal(null);
          }}
        />
      </AnimatePresence>
    </div>
  );
}
