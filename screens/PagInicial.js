import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Animated,
    Dimensions,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from "@env"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';

// Certifique-se de que o caminho da imagem está correto no seu ambiente de projeto
const LOGO_BRANCA = require('../imagens/branca.png'); 

const { width } = Dimensions.get('window');

// Configurações de Categoria (Apenas cores simples para o card)
const categoriesConfig = {
    'Festas e Shows': { emoji: '🎵', color: '#5847E3' },
    'Congressos e Palestras': { emoji: '📚', color: '#9333ea' },
    'Cursos e Workshops': { emoji: '🎓', color: '#0891b2' },
    'Esporte': { emoji: '🏆', color: '#059669' },
    'Gastronomia': { emoji: '🍔', color: '#ea580c' },
    'Games e Geek': { emoji: '🎮', color: '#7c3aed' },
    'Arte, Cultura e Lazer': { emoji: '🎨', color: '#d946ef' },
    'Moda e Beleza': { emoji: '💄', color: '#ec4899' },
    'Saúde e Bem-Estar': { emoji: '🧘‍♀️', color: '#16a34a' },
    'Religião e Espiritualidade': { emoji: '🙏', color: '#4f46e5' },
    'Teatros e Espetáculos': { emoji: '🎭', color: '#d97706' },
    'Passeios e Tours': { emoji: '🗺️', color: '#1d4ed8' },
    'Infantil': { emoji: '👶', color: '#ef4444' },
    'Grátis': { emoji: '🎁', color: '#65a30d' },
};

// EventCard Redesenhado
const EventCard = ({ event, index, navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const baseUrl = API_URL || 'http://10.80.220.253:3000'; // Fallback URL

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            delay: index * 100,
            useNativeDriver: true,
        }).start();
    }, []);

    const imageUrl = event.Midia && event.Midia.length > 0
        ? `${baseUrl}${event.Midia[0].url}`
        : 'https://placehold.co/400x180/6366F1/ffffff?text=Evento';

    const categoryInfo = categoriesConfig[event.categoria] || { emoji: '✨', color: '#5847E3' };

    const eventPrice = event.Ingressos && event.Ingressos.length > 0
        ? (event.Ingressos.some(ing => ing.preco === 0 || ing.preco === null) ? 'A partir de R$ 0,00' : `R$ ${parseFloat(event.Ingressos[0].preco).toFixed(2)}`)
        : 'Gratuito';

    return (
        <Animated.View style={[styles.eventCardWrapper, { opacity: fadeAnim }]}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('ParticiparEvento', { eventoId: event.eventoId })}
                style={styles.eventCard}
            >
<<<<<<< Updated upstream
                <View style={styles.eventImageWrapper}>
                    <Image 
                        source={{ uri: imageUrl }} 
                        style={styles.eventImage} 
                        onError={(e) => console.log("Erro ao carregar imagem:", e.nativeEvent.error)}
=======
              <Text style={styles.joinButtonText}>Participar</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Componente EventCarusel (mantido como está)
function EventCarousel({ title, events, loading, navigation }) {
  if (loading) {
    return (
      <View style={[styles.carouselContainer, { paddingHorizontal: 20 }]}>
        <Text style={[styles.carouselTitle, { color: '#6b7280' }]}>Carregando...</Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={[styles.carouselContainer, { paddingHorizontal: 20 }]}>
        <Text style={[styles.carouselTitle, { color: '#6b7280' }]}>{title}</Text>
        <Text style={{ color: '#9ca3af', marginTop: 10 }}>Nenhum evento encontrado nesta seção.</Text>
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <View style={styles.carouselHeader}>
        <Text style={styles.carouselTitle}>{title}</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Ver todos</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#667eea" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        snapToInterval={width * 0.8 + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
      >
        {events.map((event, index) => (
          <EventCard key={event.eventoId} event={event} index={index} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
}

// Componente da Barra de Navegação (mantido como está)
const BottomNavBar = ({ activeTab, setActiveTab, navigation }) => {
  const navItems = [
    { name: 'Home', icon: 'home', screen: 'PagInicial' },
    { name: 'Chat', icon: 'chat', screen: 'Chat'},
    { name: 'Busca', icon: 'search', screen: 'EventDiscoveryApp' },
    { name: 'Favoritos', icon: 'favorite-border', screen: 'FiltragemAvancada' },
    { name: 'Perfil', icon: 'person-outline', screen: 'Perfil' },
  ];

  const handlePress = async (item) => {
    if (item.screen === 'Perfil') {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Acesso negado', 'Você precisa estar logado para ver seu perfil.', [
          { text: 'Ir para o Login', onPress: () => navigation.navigate('Login') }
        ]);
        return;
      }
    }

    setActiveTab(item.name);
    if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <View style={navStyles.navContainer}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={navStyles.navItem}
          onPress={() => handlePress(item)}
        >
          <MaterialIcons
            name={item.icon}
            size={24}
            color={activeTab === item.name ? '#667eea' : '#9ca3af'}
          />
          <Text
            style={[
              navStyles.navText,
              { color: activeTab === item.name ? '#667eea' : '#9ca3af' },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Componente principal EventDiscoveryApp
export default function EventDiscoveryApp({ navigation, route }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  const [advancedFilters, setAdvancedFilters] = useState({});

  // 2. USEFOCUS EFFECT PARA GERENCIAR A BARRA DE NAVEGAÇÃO
  useFocusEffect(
    React.useCallback(() => {
      // 3. OCULTAR A BARRA AO ENTRAR NA TELA (ANDROID)
      const hideNavigationBar = async () => {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
          // Opcional: Define como a barra deve se comportar se for arrastada (swipe)
          await NavigationBar.setBehaviorAsync('overlay-swipe');
        } catch (error) {
          console.warn('Erro ao tentar ocultar a barra de navegação:', error);
        }
      };

      // 4. RESTAURAR A BARRA AO SAIR DA TELA (CLEANUP)
      const showNavigationBar = async () => {
        try {
          await NavigationBar.setVisibilityAsync('visible');
        } catch (error) {
          console.warn('Erro ao tentar mostrar a barra de navegação:', error);
        }
      };

      hideNavigationBar();

      if (route.params?.filtros) {
        setAdvancedFilters(route.params.filtros);
        fetchFilteredEvents(route.params.filtros);
      } else {
        fetchEvents();
      }

      // Retorna a função de limpeza para restaurar a barra quando a tela perde o foco
      return () => {
        showNavigationBar();
      };
    }, [route.params])
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const featuredResponse = await axios.get(`${API_URL}/api/eventos/home`, {
        params: { limite: 5 }
      });
      setFeaturedEvents(featuredResponse.data.eventos);

      const todayResponse = await axios.get(`${API_URL}/api/eventos/home`, {
        params: { periodo: 'hoje', limite: 3 }
      });
      setTodayEvents(todayResponse.data.eventos);

      const nearbyResponse = await axios.get(`${API_URL}/api/eventos/home`, {
        params: { limite: 5 }
      });
      setNearbyEvents(nearbyResponse.data.eventos);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      Alert.alert("Erro", "Não foi possível carregar os eventos. Verifique se o backend está ativo e acessível.");
    } finally {
      setLoadingEvents(false);
    }
  };
  
  const fetchFilteredEvents = async (filters) => {
    setLoadingEvents(true);
    try {
        const response = await axios.get(`${API_URL}/api/eventos/filtrados`, {
            params: {
                categoria: filters.categoria || undefined,
                preco: filters.preco || undefined,
                localizacao: filters.usarLocalizacao ? 'Sua Cidade' : undefined, 
                // Add other filters here
            }
        });
        setFeaturedEvents(response.data.eventos);
        setTodayEvents([]); 
        setNearbyEvents([]);
    } catch (error) {
        console.error("Erro ao buscar eventos filtrados:", error);
        Alert.alert("Erro", "Não foi possível carregar os eventos com os filtros aplicados.");
    } finally {
        setLoadingEvents(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(`${API_URL}/api/eventos/categorias`);
      const formattedCategories = response.data.map(name => ({
        name: name,
        emoji: categoriesConfig[name]?.emoji || '✨',
        color: categoriesConfig[name]?.color || ['#8b5cf6', '#7c3aed'],
      }));
      setAllCategories(formattedCategories);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      Alert.alert('Busca', `Buscando por: ${searchTerm}`);
    }
  };
  
  const handleOpenFilters = () => {
    navigation.navigate('FiltragemAvancada', { currentFilters: advancedFilters });
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <>
            <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Descubra Eventos{'\n'}Incríveis! 🎉</Text>
                <Text style={styles.heroSubtitle}>Encontre experiências únicas na sua região</Text>
                <View style={styles.searchContainer}>
                  <View style={styles.searchInputContainer}>
                    <Feather name="search" size={20} color="#667eea" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="O que você procura?"
                      placeholderTextColor="#9ca3af"
                      value={searchTerm}
                      onChangeText={setSearchTerm}
                      onSubmitEditing={handleSearch}
>>>>>>> Stashed changes
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']} // Gradiente mais forte
                        style={styles.imageGradient}
                    />
                    <View style={styles.dateBadge}>
                        <Text style={styles.dateText}>
                            {new Date(event.dataInicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()}
                        </Text>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.categoryTag}>
                        <Text style={styles.categoryEmoji}>{categoryInfo.emoji}</Text>
                        <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
                            {event.categoria}
                        </Text>
                    </View>
                    <Text style={styles.eventTitle} numberOfLines={2}>{event.nomeEvento}</Text>
                    <View style={styles.eventMeta}>
                        <View style={styles.metaItem}>
                            <MaterialIcons name="place" size={16} color="#4b5563" /> 
                            <Text style={styles.metaText}>{event.localizacao?.cidade || 'Online'}</Text>
                        </View>
                        <View style={styles.priceBadge}>
                            <Text style={[styles.priceText, eventPrice === 'Gratuito' && { color: '#059669', fontWeight: '800' }]}>
                                {eventPrice}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// EventCarousel Redesenhado
function EventCarousel({ title, events, loading, navigation }) {
    if (loading) {
        return (
            <View style={styles.carouselSection}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <ActivityIndicator size="large" color="#5847E3" style={styles.loadingIndicator} />
            </View>
        );
    }

    if (events.length === 0) {
        return (
            <View style={styles.carouselSection}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.emptyText}>Nenhum evento encontrado.</Text>
            </View>
        );
    }

    return (
        <View style={styles.carouselSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('FiltragemAvancada', { currentFilters: { categoria: title.includes('Destaque') ? undefined : title.includes('Hoje') ? 'hoje' : 'nearby' } })}>
                    <Text style={styles.viewAllLink}>Ver todos →</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselScroll}
                snapToInterval={width * 0.88 + 16} // Ajustado para o novo cardWrapper width
                decelerationRate="fast"
            >
                {events.map((event, index) => (
                    <EventCard key={event.eventoId} event={event} index={index} navigation={navigation} />
                ))}
            </ScrollView>
        </View>
    );
}

// BottomNavBar Melhorado
const BottomNavBar = ({ activeTab, setActiveTab, navigation }) => {
    const navItems = [
        { name: 'Home', icon: 'home', screen: 'PagInicial' },
        { name: 'Chat', icon: 'chat-bubble-outline', screen: 'GrupoScreen' }, 
        { name: 'Buscar', icon: 'search', screen: 'FiltragemAvancada' },
        { name: 'Eventos', icon: 'event', screen: 'MeusEventos' },
        { name: 'Perfil', icon: 'person-outline', screen: 'Perfil' },
    ];


    const activeIcons = {
        'Home': 'home',
        'Chat': 'chat-bubble',
        'Buscar': 'search', 
        'Eventos': 'event',
        'Perfil': 'person',
    };

    const handlePress = async (item) => {
        if (['Chat', 'Eventos', 'Perfil'].includes(item.name)) {
            const userToken = await AsyncStorage.getItem('@user_token'); 
            if (!userToken) {
                Alert.alert('Login necessário', 'Você precisa estar logado para acessar esta área.', [
                    { text: 'Fazer Login', onPress: () => navigation.navigate('Login') }
                ]);
                return;
            }
        }
        setActiveTab(item.name);
        navigation.navigate(item.screen);
    };

    return (
        <View style={navStyles.container}>
            {navItems.map((item) => {
                const isActive = activeTab === item.name;
                return (
                    <TouchableOpacity
                        key={item.name}
                        style={navStyles.item}
                        onPress={() => handlePress(item)}
                        activeOpacity={0.7}
                    >
                        <View style={[navStyles.iconContainer, isActive && navStyles.iconContainerActive]}>
                            <MaterialIcons
                                name={isActive ? activeIcons[item.name] : item.icon}
                                size={24}
                                color={isActive ? '#5847E3' : '#9ca3af'}
                            />
                        </View>
                        <Text style={[navStyles.label, isActive && navStyles.labelActive]}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

// Componente Principal
export default function PagInicial({ navigation, route }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Home');
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [todayEvents, setTodayEvents] = useState([]);
    const [nearbyEvents, setNearbyEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [advancedFilters, setAdvancedFilters] = useState({});

    // Funções de animação (mantidas, mas simplificadas na declaração)
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    
    const baseUrl = API_URL || 'http://10.80.220.253:3000'; // Fallback URL

    useFocusEffect(
        React.useCallback(() => {
            const hideNav = async () => {
                try {
                    if (NavigationBar) { 
                        await NavigationBar.setVisibilityAsync('hidden');
                        await NavigationBar.setBehaviorAsync('overlay-swipe');
                    }
                } catch (error) {}
            };

            const showNav = async () => {
                try {
                    if (NavigationBar) {
                        await NavigationBar.setVisibilityAsync('visible');
                    }
                } catch (error) {}
            };

            hideNav();

            if (route.params?.filtros) {
                setAdvancedFilters(route.params.filtros);
                fetchFilteredEvents(route.params.filtros);
            } else {
                fetchEvents();
            }

            return () => showNav();
        }, [route.params])
    );

    const fetchEvents = async () => {
        setLoadingEvents(true);
        try {            
            const [featuredResponse, todayResponse, nearbyResponse] = await Promise.all([
                // Simulação de eventos em destaque (aleatório)
                axios.get(`${baseUrl}/api/eventos/home`, { params: { limite: 5 } }), 
                // Simulação de eventos de hoje
                axios.get(`${baseUrl}/api/eventos/home`, { params: { periodo: 'hoje', limite: 3 } }),
                // Simulação de eventos perto de você (aleatório)
                axios.get(`${baseUrl}/api/eventos/home`, { params: { limite: 5 } }), 
            ]);

            setFeaturedEvents(featuredResponse.data.eventos);
            setTodayEvents(todayResponse.data.eventos);
            setNearbyEvents(nearbyResponse.data.eventos);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            Alert.alert("Erro", "Não foi possível carregar os eventos. Verifique a API_URL e o servidor.");
        } finally {
            setLoadingEvents(false);
        }
    };
    
    const fetchFilteredEvents = async (filters) => {
        setLoadingEvents(true);
        try {
            const response = await axios.get(`${baseUrl}/api/eventos/filtrados`, {
                params: {
                    categoria: filters.categoria || undefined,
                    preco: filters.preco || undefined,
                    localizacao: filters.localizacao || undefined,
                    tipo: filters.tipo || undefined,
                }
            });
            setFeaturedEvents(response.data.eventos);
            setTodayEvents([]);
            setNearbyEvents([]);
        } catch (error) {
            console.error("Erro ao buscar eventos filtrados:", error);
            Alert.alert("Erro", "Não foi possível carregar os eventos filtrados.");
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigation.navigate('FiltragemAvancada', { currentFilters: { busca: searchTerm } });
        }
    };
    
    const handleOpenFilters = () => {
        navigation.navigate('FiltragemAvancada', { currentFilters: advancedFilters });
    };
    
    const handleClearFilters = () => {
        setAdvancedFilters({});
        fetchEvents();
    }

    const isFiltered = Object.keys(advancedFilters).length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#5847E3" />
            
            {/* Header e Hero combinados */}
            <LinearGradient
                colors={['#5847E3', '#2816b2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientTop} // Novo estilo para o topo do gradient
            >
                <View style={styles.headerContent}>
                    <Image source={LOGO_BRANCA} style={styles.logo} resizeMode="contain" />
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
                            <MaterialIcons name="notifications-none" size={26} color="#fff" />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>3</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
            
            {/* Conteúdo principal flutuando abaixo do Hero/Header */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section (Fundo Branco, Unificado) */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Descubra experiências únicas</Text>
                    <Text style={styles.heroSubtitle}>Seu evento, do jeito que você imagina</Text>
                    
                    {/* Search Bar Aprimorada, Flutuando sobre o Hero */}
                    <View style={styles.searchBar}>
                        <Feather name="search" size={20} color="#5847E3" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar por nome, local ou categoria..."
                            placeholderTextColor="#9ca3af"
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            onSubmitEditing={handleSearch}
                        />
                        <TouchableOpacity style={styles.filterBtn} onPress={handleOpenFilters} activeOpacity={0.7}>
                            <MaterialIcons name="tune" size={24} color="#5847E3" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Filtros Aplicados */}
                {isFiltered && (
                    <View style={styles.filterBanner}>
                        <MaterialIcons name="filter-list" size={18} color="#5847E3" />
                        <Text style={styles.filterText}>Filtros aplicados ({featuredEvents.length} resultados)</Text>
                        <TouchableOpacity onPress={handleClearFilters}>
                            <Text style={styles.clearBtn}>Limpar</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Carrosséis */}
                <EventCarousel 
                    title={isFiltered ? "🔍 Resultados da Busca" : "⭐ Em Destaque"} 
                    events={featuredEvents} 
                    loading={loadingEvents} 
                    navigation={navigation} 
                />
                
                {!isFiltered && (
                    <>
                        <EventCarousel 
                            title="📅 Eventos de Hoje" 
                            events={todayEvents} 
                            loading={loadingEvents} 
                            navigation={navigation} 
                        />
                        <EventCarousel 
                            title="📍 Perto de Você" 
                            events={nearbyEvents} 
                            loading={loadingEvents} 
                            navigation={navigation} 
                        />
                    </>
                )}
                
                <View style={{ height: 100 }} />
            </ScrollView>
            
            <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} />
        </SafeAreaView>
    );
}

// Estilos da Barra de Navegação (navStyles)
const navStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 0, 
        paddingVertical: 14, 
        paddingHorizontal: 4,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05, 
        shadowRadius: 5,
        elevation: 8,
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        flex: 1,
    },
    iconContainer: {
        padding: 10, 
        borderRadius: 14,
        transition: 'background-color 0.3s',
    },
    iconContainerActive: {
        backgroundColor: '#f0edff', 
    },
    label: {
        fontSize: 12, 
        color: '#9ca3af',
        marginTop: 4,
        fontWeight: '500',
    },
    labelActive: {
        color: '#5847E3',
        fontWeight: '700', 
    },
});

// Estilos da Página (styles)
const styles = StyleSheet.create({
<<<<<<< Updated upstream
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa', 
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    // --- Header ---
    gradientTop: {
      paddingBottom: 2,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24, 
        paddingTop: 4,
        minHeight: 80, 
    },
    logo: {
        width: 80, 
        height: 60,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationBtn: {
        position: 'relative',
        padding: 8,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 0,
        backgroundColor: '#ff6b6b',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2, 
        borderColor: '#5847E3',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    hero: {
        paddingHorizontal: 24,
        paddingTop: 40, 
        paddingBottom: 30,
        backgroundColor: '#fff',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    heroTitle: {
        fontSize: 30, 
        fontWeight: '800',
        color: '#1f2937',
        lineHeight: 38,
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#4b5563', 
        marginBottom: 30,
        fontWeight: '500',
    },
    // --- Search Bar ---
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16, // Mais arredondado
        paddingHorizontal: 16,
        paddingVertical: 14, 
        borderWidth: 1,
        borderColor: '#d1d5db', 
        shadowColor: '#5847E3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, 
        shadowRadius: 8,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
        marginLeft: 12,
        paddingVertical: 0,
    },
    filterBtn: {
        padding: 4,
        marginLeft: 8,
    },
    // --- Filter Banner ---
    filterBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0edff', 
        marginHorizontal: 24,
        marginTop: 20,
        padding: 14,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#5847E3',
    },
    filterText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#1f2937',
        fontWeight: '600',
    },
    clearBtn: {
        color: '#2816b2', 
        fontSize: 15,
        fontWeight: '700',
    },
    // --- Carrossel e Seções ---
    carouselSection: {
        marginTop: 30, 
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800', 
        color: '#1f2937',
    },
    viewAllLink: {
        fontSize: 15,
        color: '#5847E3',
        fontWeight: '700',
    },
    carouselScroll: {
        paddingLeft: 24, 
        paddingRight: 8,
    },
    loadingIndicator: {
        marginVertical: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: 15,
        marginTop: 20,
        paddingHorizontal: 40,
    },
    // --- Card de Evento ---
    eventCardWrapper: {
        width: width * 0.88, 
        marginRight: 16,
        borderRadius: 20, 
        overflow: 'hidden',
    },
    eventCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#5847E3', 
        shadowOffset: { width: 0, height: 6 }, 
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8, 
    },
    eventImageWrapper: {
        height: 190, 
        position: 'relative',
    },
    eventImage: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%', 
    },
    dateBadge: {
        position: 'absolute',
        top: 14,
        right: 14,
        backgroundColor: 'rgba(40, 22, 178, 0.8)', 
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
    },
    dateText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '800', 
    },
    cardContent: {
        padding: 16,
    },
    categoryTag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0ff', 
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1, 
        borderColor: '#e0e0ff',
    },
    categoryEmoji: {
        fontSize: 15,
        marginRight: 6,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '700',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: 10,
        lineHeight: 24,
    },
    eventMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    metaText: {
        fontSize: 14,
        color: '#4b5563',
        marginLeft: 6,
    },
    priceBadge: {
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        minWidth: 90,
        alignItems: 'center',
    },
    priceText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#059669',
    },
});
=======
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    paddingBottom: 80,
  },
  headerContainer: {
    marginBottom: -20,
    zIndex: 10,
  },
  headerGradient: {
    paddingBottom: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  // ESTILO AJUSTADO PARA A LOGO (150px)
  headerLogoImage: {
    width: 80, // Largura ajustada para 150px
    height: 100, 
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 12,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  notificationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  userButtonGradient: {
    padding: 12,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterButtonGradient: {
    padding: 14,
  },
  eventsSection: {
    marginBottom: 30,
  },
  carouselContainer: {
    marginBottom: 32,
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  viewAllText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  eventCardContainer: {
    width: width * 0.8,
    marginRight: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  eventImageContainer: {
    height: 180,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  eventDetails: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventInfo: {
    marginBottom: 16,
  },
  eventInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  eventPrice: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 6,
  },
  joinButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoriesSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  advancedFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  advancedFilterText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginRight: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCardWrapper: {
    width: (width - 64) / 2,
  },
  categoryCard: {
    aspectRatio: 1.3,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryCardActive: {
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  categoryGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryIconContainer: {
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    padding: 2,
  },
  placeholderScreen: {
    flex: 1,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ccc',
    textAlign: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  bottomTabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  tabIconText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
>>>>>>> Stashed changes
