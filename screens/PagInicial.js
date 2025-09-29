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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation

const { width } = Dimensions.get('window');

// Definições de ícones para as categorias
const categoriesConfig = {
  'Festas e Shows': { emoji: '🎵', color: ['#ff6b6b', '#ee5a52'] },
  'Congressos e Palestras': { emoji: '📚', color: ['#a855f7', '#9333ea'] },
  'Cursos e Workshops': { emoji: '🎓', color: ['#06b6d4', '#0891b2'] },
  'Esporte': { emoji: '🏆', color: ['#10b981', '#059669'] },
  'Gastronomia': { emoji: '🍔', color: ['#f97316', '#ea580c'] },
  'Games e Geek': { emoji: '🎮', color: ['#8b5cf6', '#7c3aed'] },
  'Arte, Cultura e Lazer': { emoji: '🎨', color: ['#ec4899', '#d946ef'] },
  'Moda e Beleza': { emoji: '💄', color: ['#f472b6', '#ec4899'] },
  'Saúde e Bem-Estar': { emoji: '🧘‍♀️', color: ['#22c55e', '#16a34a'] },
  'Religião e Espiritualidade': { emoji: '🙏', color: ['#6366f1', '#4f46e5'] },
  'Teatros e Espetáculos': { emoji: '🎭', color: ['#eab308', '#d97706'] },
  'Passeios e Tours': { emoji: '🗺️', color: ['#2563eb', '#1d4ed8'] },
  'Infantil': { emoji: '👶', color: ['#f87171', '#ef4444'] },
  'Grátis': { emoji: '🎁', color: ['#84cc16', '#65a30d'] },
};

// Componente EventCard
const EventCard = ({ event, index, navigation }) => { // Receba a prop 'navigation'
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      }).start();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const imageUrl = event.Midia && event.Midia.length > 0
    ? `${API_URL}${event.Midia[0].url}`
    : 'https://via.placeholder.com/400';

  const categoryInfo = categoriesConfig[event.categoria] || { emoji: '✨', color: ['#8b5cf6', '#7c3aed'] };

  const eventPrice = event.Ingressos && event.Ingressos.length > 0
    ? (event.Ingressos[0].preco > 0 ? `R$ ${parseFloat(event.Ingressos[0].preco).toFixed(2)}` : 'Gratuito')
    : 'Gratuito';

  return (
    <Animated.View style={[
      styles.eventCardContainer,
      { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }
    ]}>
      {/* Adicione o onPress para navegar para a tela de ParticiparEvento */}
      <TouchableOpacity 
        style={styles.eventCard} 
        activeOpacity={0.9} 
        onPress={() => navigation.navigate('ParticiparEvento', { eventoId: event.eventoId })}
      >
        <View style={styles.eventImageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.eventImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.eventImageOverlay}
          />
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{new Date(event.dataInicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton}>
            <MaterialIcons name="favorite-border" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.eventDetails}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle} numberOfLines={2}>{event.nomeEvento}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color[0] + '20' }]}>
              <Text style={[styles.categoryBadgeText, { color: categoryInfo.color[0] }]}>{event.categoria}</Text>
            </View>
          </View>
          <View style={styles.eventInfo}>
            <View style={styles.eventInfoItem}>
              <MaterialIcons name="place" size={14} color="#6b7280" />
              <Text style={styles.eventLocation}>{event.localizacao?.cidade || 'Online'}</Text>
            </View>
            <View style={styles.eventInfoItem}>
              <MaterialIcons name="attach-money" size={14} color="#6b7280" />
              <Text style={styles.eventPrice}>{eventPrice}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.joinButton}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.joinButtonGradient}
            >
              <Text style={styles.joinButtonText}>Participar</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Componente EventCarusel
function EventCarousel({ title, events, loading, navigation }) { // Receba a prop 'navigation'
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
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.8 + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
      >
        {events.map((event, index) => (
          // Passe a prop 'navigation' para o EventCard
          <EventCard key={event.eventoId} event={event} index={index} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
}

// Componente da Barra de Navegação
const BottomNavBar = ({ activeTab, setActiveTab, navigation }) => {
  const navItems = [
    { name: 'Home', icon: 'home', screen: 'PagInicial' },
    { name: 'Busca', icon: 'search', screen: 'Busca' },
    { name: 'Favoritos', icon: 'favorite-border', screen: 'Favoritos' },
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
export default function EventDiscoveryApp({ navigation }) {
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

    fetchEvents();
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

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <>
            <Animated.View style={[
              styles.heroSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }
            ]}>
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
                    />
                  </View>
                  <TouchableOpacity style={styles.filterButton}>
                    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.filterButtonGradient}>
                      <MaterialIcons name="tune" size={20} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
            <Animated.View style={[
              styles.eventsSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}>
              {/* Passe a prop 'navigation' para os carrosseis */}
              <EventCarousel title="⭐ Eventos em Destaque" events={featuredEvents} loading={loadingEvents} navigation={navigation} />
              <EventCarousel title="📅 Acontecendo Hoje" events={todayEvents} loading={loadingEvents} navigation={navigation} />
              <EventCarousel title="📍 Perto de Você" events={nearbyEvents} loading={loadingEvents} navigation={navigation} />
            </Animated.View>
            <Animated.View style={[
              styles.categoriesSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explore por Categoria</Text>
                <TouchableOpacity style={styles.advancedFilterButton}>
                  <Text style={styles.advancedFilterText}>Ver todas</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#667eea" />
                </TouchableOpacity>
              </View>
              <View style={styles.categoriesGrid}>
                {loadingCategories ? (
                  <Text style={styles.loadingText}>Carregando categorias...</Text>
                ) : (
                  allCategories.map((item, index) => (
                    <Animated.View key={item.name} style={[styles.categoryCardWrapper, { transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }]}>
                      <TouchableOpacity
                        onPress={() => setActiveFilter(activeFilter === item.name ? null : item.name)}
                        style={[styles.categoryCard, activeFilter === item.name && styles.categoryCardActive]}
                      >
                        <LinearGradient colors={activeFilter === item.name ? item.color : ['#ffffff', '#f8fafc']} style={styles.categoryGradient}>
                          <View style={styles.categoryContent}>
                            <View style={styles.categoryIconContainer}>
                              <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                            </View>
                            <Text style={[styles.categoryText, { color: activeFilter === item.name ? '#fff' : '#374151' }]}>
                              {item.name}
                            </Text>
                          </View>
                        </LinearGradient>
                        {activeFilter === item.name && (
                          <View style={styles.activeIndicator}>
                            <MaterialIcons name="check-circle" size={20} color="#fff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    </Animated.View>
                  ))
                )}
              </View>
            </Animated.View>
          </>
        );
      case 'Busca':
        return <View style={styles.placeholderScreen}><Text style={styles.placeholderText}>Tela de Busca</Text></View>;
      case 'Favoritos':
        return <View style={styles.placeholderScreen}><Text style={styles.placeholderText}>Tela de Favoritos</Text></View>;
      case 'Perfil':
        return <View style={styles.placeholderScreen}><Text style={styles.placeholderText}>Tela de Perfil</Text></View>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[
          styles.headerContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGradient}>
            <View style={styles.header}>
              <Text style={styles.headerLogoText}>EVENTO APP</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialIcons name="notifications" size={24} color="#fff" />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>3</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.userButton}>
                  <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} style={styles.userButtonGradient}>
                    <MaterialIcons name="person" size={24} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {renderContent()}
      </ScrollView>
      {/* Passe a prop 'navigation' para a BottomNavBar */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} />
    </SafeAreaView>
  );
}

// Estilos
const navStyles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

const styles = StyleSheet.create({
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
    paddingBottom: 40,
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
  headerLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
    tintColor: '#fff',
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