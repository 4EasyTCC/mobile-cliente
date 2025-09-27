import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Bell, User, Search, TrendingUp, Heart, MapPin, Filter, ChevronLeft, ChevronRight, ArrowRight, Music, PartyPopper, Gamepad2, Trophy, Palette, MoreHorizontal } from 'lucide-react';

const CARD_WIDTH = 280;
const CARD_SPACING = 20;

// Mock data for events
const eventData = [
  { id: 1, title: 'Rock Festival 2025', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400', category: 'Shows', date: '25 Set', location: 'São Paulo' },
  { id: 2, title: 'Tech Conference', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', category: 'Cultural', date: '28 Set', location: 'Rio de Janeiro' },
  { id: 3, title: 'Football Championship', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400', category: 'Esportivo', date: '02 Out', location: 'Belo Horizonte' },
  { id: 4, title: 'Art Exhibition', image: 'https://images.unsplash.com/photo-1544967882-6abde5fab1cb?w=400', category: 'Cultural', date: '05 Out', location: 'Salvador' },
  { id: 5, title: 'Electronic Music Night', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', category: 'Festas', date: '08 Out', location: 'Florianópolis' },
];

export default function EventDiscoveryApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [userStats, setUserStats] = useState({
    participando: 12,
    favoritos: 28
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      // Navigate to search results
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <img 
                src="Logo oficial.png" 
                alt="Logo oficial" 
                className="h-12 w-auto object-contain"
              />
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Eventos</a>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Categorias</a>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Sobre</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full hover:bg-purple-50 transition-colors">
                <Bell size={20} className="text-purple-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
              <button className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg transition-all duration-300">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className={`py-12 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Olá! <span className="animate-bounce inline-block">👋</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">Que tal descobrir novos eventos hoje?</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500" size={20} />
                <input
                  type="text"
                  placeholder="Buscar eventos incríveis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                  className="w-full pl-12 pr-16 py-4 bg-white rounded-full border-2 border-transparent shadow-lg focus:border-purple-300 focus:shadow-xl transition-all duration-300 text-lg"
                />
                <button
                  onClick={() => console.log('Filter clicked')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-purple-50 transition-colors"
                >
                  <Filter size={18} className="text-purple-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Calendar className="mx-auto mb-3 text-purple-600" size={32} />
              <div className="text-2xl font-bold text-gray-800">{userStats.participando}</div>
              <div className="text-sm text-gray-600">Participando</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Heart className="mx-auto mb-3 text-red-500" size={32} />
              <div className="text-2xl font-bold text-gray-800">{userStats.favoritos}</div>
              <div className="text-sm text-gray-600">Favoritos</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <TrendingUp className="mx-auto mb-3 text-green-500" size={32} />
              <div className="text-2xl font-bold text-gray-800">156</div>
              <div className="text-sm text-gray-600">Descobertos</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <MapPin className="mx-auto mb-3 text-blue-500" size={32} />
              <div className="text-2xl font-bold text-gray-800">23</div>
              <div className="text-sm text-gray-600">Próximos</div>
            </div>
          </div>
        </section>

        {/* Events Sections */}
        <section className={`py-12 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="rounded-3xl p-8 shadow-2xl" style={{ background: 'rgba(40, 22, 178, 0.50)' }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              {/* Featured Events */}
              <EventCarousel 
                title="⭐ Eventos em Destaque"
                events={eventData}
              />

              {/* My Events */}
              <EventCarousel 
                title="📅 Meus Eventos"
                events={eventData.slice(0, 3)}
              />

              {/* Nearby Events */}
              <EventCarousel 
                title="📍 Perto de Você"
                events={eventData.slice(2, 6)}
              />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className={`py-12 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">🎯 Categorias</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-full text-purple-600 hover:bg-purple-100 transition-colors">
                <span className="text-sm font-medium">Filtros avançados</span>
                <Filter size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Shows', icon: Music, color: 'from-red-400 to-red-600' },
                { name: 'Festas', icon: PartyPopper, color: 'from-purple-400 to-purple-600' },
                { name: 'Jogos', icon: Gamepad2, color: 'from-blue-400 to-blue-600' },
                { name: 'Esportivo', icon: Trophy, color: 'from-green-400 to-green-600' },
                { name: 'Cultural', icon: Palette, color: 'from-orange-400 to-orange-600' },
                { name: 'Outros', icon: MoreHorizontal, color: 'from-gray-400 to-gray-600' },
              ].map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => setActiveFilter(activeFilter === item.name ? null : item.name)}
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                    activeFilter === item.name 
                      ? 'ring-4 ring-purple-300' 
                      : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    activeFilter === item.name ? item.color : 'from-gray-50 to-white'
                  } transition-all duration-300`} />
                  <div className="relative flex flex-col items-center space-y-3">
                    <item.icon 
                      size={28} 
                      className={`transition-colors duration-300 ${
                        activeFilter === item.name ? 'text-white' : 'text-gray-600'
                      }`}
                    />
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      activeFilter === item.name ? 'text-white' : 'text-gray-700'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer spacing */}
      <div className="h-20" />
    </div>
  );
}

// Event Carousel Component
function EventCarousel({ title, events }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = CARD_WIDTH + CARD_SPACING;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-12 last:mb-0">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all">
          <span className="text-sm">Ver todos</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex space-x-5 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              className="flex-shrink-0 group cursor-pointer"
              style={{ width: CARD_WIDTH }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-white text-sm">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{event.title}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin size={12} />
                      <span>{event.location}</span>
                    </div>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}