import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

/* ---------------------- CONSTANTES ---------------------- */
const CARD_WIDTH = 180;
const CARD_HEIGHT = 150;
const CARD_SPACING = 16;
const { width: screenWidth } = Dimensions.get('window');
const mockCards = Array.from({ length: 10 });

// Dados mockados - em produção virão do backend
const eventData = [
  { 
    id: 1, 
    title: 'Rock Festival', 
    image: 'https://example.com/images/rock-festival.jpg', 
    category: 'Shows', 
    date: '25 Set',
    fallbackImage: require('../assets/show.jpg') 
  },
  { 
    id: 2, 
    title: 'Tech Conference', 
    image: 'https://example.com/images/tech-conference.jpg', 
    category: 'Cultural', 
    date: '28 Set',
    fallbackImage: require('../assets/show.jpg')
  },
  { 
    id: 3, 
    title: 'Football Match', 
    image: 'https://example.com/images/football.jpg', 
    category: 'Esportivo', 
    date: '30 Set',
    fallbackImage: require('../assets/show.jpg')
  },
  { 
    id: 4, 
    title: 'Art Exhibition', 
    image: 'https://example.com/images/art-exhibition.jpg', 
    category: 'Cultural', 
    date: '02 Out',
    fallbackImage: require('../assets/show.jpg')
  },
  { 
    id: 5, 
    title: 'DJ Night', 
    image: 'https://example.com/images/dj-night.jpg', 
    category: 'Festas', 
    date: '05 Out',
    fallbackImage: require('../assets/show.jpg')
  },
];

/* ---------------------- TELA INICIAL -------------------- */
export default function PaginaInicial({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [userStats, setUserStats] = useState({
    participando: 0,
    favoritos: 0
  });
  const [eventsData, setEventsData] = useState({
    featured: [],
    myEvents: [],
    nearby: []
  });
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Função para buscar dados do usuário do backend
  const fetchUserStats = async () => {
    try {
      // Substitua pela sua URL da API
      // const response = await fetch('https://sua-api.com/user/stats');
      // const data = await response.json();
      
      // Simulação de dados vindos do backend
      const mockData = {
        participando: 12,
        favoritos: 28
      };
      
      setUserStats(mockData);
    } catch (error) {
      console.error('Erro ao buscar estatísticas do usuário:', error);
      // Valores padrão em caso de erro
      setUserStats({
        participando: 0,
        favoritos: 0
      });
    }
  };

  // Função para buscar eventos do backend
  const fetchEventsData = async () => {
    try {
      setLoading(true);
      
      // Substitua pelas suas URLs da API
      // const [featuredRes, myEventsRes, nearbyRes] = await Promise.all([
      //   fetch('https://sua-api.com/events/featured'),
      //   fetch('https://sua-api.com/events/my-events'),
      //   fetch('https://sua-api.com/events/nearby')
      // ]);
      
      // const featured = await featuredRes.json();
      // const myEvents = await myEventsRes.json();
      // const nearby = await nearbyRes.json();
      
      // Simulação de dados vindos do backend
      const mockEventsData = {
        featured: eventData,
        myEvents: eventData.slice(0, 3),
        nearby: eventData.slice(2, 6)
      };
      
      setEventsData(mockEventsData);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      // Usar dados mockados em caso de erro
      setEventsData({
        featured: eventData,
        myEvents: eventData.slice(0, 3),
        nearby: eventData.slice(2, 6)
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Buscar dados do usuário e eventos
    fetchUserStats();
    fetchEventsData();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Cabeçalho com animação */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Image
            source={require('../assets/Logo oficial.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Icon name="bell-outline" size={24} color="#4525a4" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Perfil')}
            >
              <LinearGradient
                colors={['#4525a4', '#1868fd']}
                style={styles.profileGradient}
              >
                <Icon name="account" size={28} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Saudação personalizada */}
        <Animated.View 
          style={[
            styles.greetingContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.greetingText}>Olá! 👋</Text>
          <Text style={styles.subGreetingText}>Que tal descobrir novos eventos hoje?</Text>
        </Animated.View>

        {/* Barra de pesquisa melhorada */}
        <Animated.View 
          style={[
            styles.searchContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.searchWrapper}>
            <Icon name="magnify" size={20} color="#4525a4" style={styles.searchIcon} />
            <TextInput
              placeholder="Buscar eventos incríveis..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={() => {
                if (searchTerm.trim()) {
                  navigation.navigate('Pesquisa', { termo: searchTerm.trim() });
                  setSearchTerm('');
                }
              }}
            />
            <TouchableOpacity style={styles.filterIconButton}>
              <Icon name="tune" size={20} color="#4525a4" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Cards de estatísticas rápidas */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.statCard}>
            <Icon name="calendar-check" size={24} color="#4525a4" />
            <Text style={styles.statNumber}>{userStats.participando}</Text>
            <Text style={styles.statLabel}>Participando</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="heart" size={24} color="#e74c3c" />
            <Text style={styles.statNumber}>{userStats.favoritos}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </Animated.View>

        {/* Gradiente + carrosséis com design melhorado */}
        <Animated.View 
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#4525a4', '#1868fd', '#00d4ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBox}
          >
            <View style={styles.gradientOverlay}>
              {/* Eventos em destaque */}
              <Carousel
                title="⭐ Eventos em Destaque"
                navigation={navigation}
                loadMoreRoute="EventosAbertos"
                data={eventsData.featured}
                loading={loading}
              />

              {/* Meus eventos */}
              <Carousel
                title="📅 Meus Eventos"
                navigation={navigation}
                loadMoreRoute="MeusEventos"
                data={eventsData.myEvents}
                loading={loading}
              />

              {/* Eventos próximos */}
              <Carousel
                title="📍 Perto de Você"
                navigation={navigation}
                loadMoreRoute="EventosProximos"
                data={eventsData.nearby}
                loading={loading}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Filtros redesenhados */}
        <Animated.View 
          style={[
            styles.filterSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>🎯 Categorias</Text>
            <TouchableOpacity 
              style={styles.advancedButton}
              onPress={() => navigation.navigate('FiltragemAvancada')}
            >
              <Text style={styles.advancedText}>Filtros avançados</Text>
              <Icon name="tune-variant" size={16} color="#4525a4" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterGrid}>
            {[
              { name: 'Shows', icon: 'music', color: '#e74c3c' },
              { name: 'Festas', icon: 'party-popper', color: '#9b59b6' },
              { name: 'Jogos', icon: 'gamepad-variant', color: '#3498db' },
              { name: 'Esportivo', icon: 'soccer', color: '#27ae60' },
              { name: 'Cultural', icon: 'palette', color: '#f39c12' },
              { name: 'Outros', icon: 'dots-horizontal', color: '#95a5a6' },
            ].map((item) => (
              <TouchableOpacity 
                key={item.name} 
                style={[
                  styles.filterButton,
                  activeFilter === item.name && styles.filterButtonActive
                ]}
                onPress={() => setActiveFilter(activeFilter === item.name ? null : item.name)}
              >
                <LinearGradient
                  colors={activeFilter === item.name 
                    ? [item.color, item.color + '80'] 
                    : ['#f8f9fa', '#ffffff']
                  }
                  style={styles.filterGradient}
                >
                  <Icon 
                    name={item.icon} 
                    size={22} 
                    color={activeFilter === item.name ? '#FFF' : item.color} 
                  />
                  <Text style={[
                    styles.filterText,
                    activeFilter === item.name && styles.filterTextActive
                  ]}>
                    {item.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

/* ---------------------- COMPONENTE CARROSSEL MELHORADO ------------- */
function Carousel({ title, navigation, loadMoreRoute, data, loading }) {
  const scrollRef = useRef(null);

  // Componente de loading para os cards
  const LoadingCard = () => (
    <View style={[styles.card, styles.loadingCard]}>
      <View style={styles.loadingPlaceholder} />
    </View>
  );

  // Componente de card de evento
  const EventCard = ({ item, index }) => {
    const [imageError, setImageError] = useState(false);
    
    const imageSource = imageError || !item?.image 
      ? item?.fallbackImage || require('../assets/show.jpg')
      : { uri: item.image };

    return (
      <View style={styles.eventCardWrapper}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ParticiparEvento', { eventId: item?.id })}
          activeOpacity={0.8}
        >
          <Image
            source={imageSource}
            style={styles.cardImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.cardOverlay}
          />
        </TouchableOpacity>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item?.title || `Evento ${index + 1}`}
          </Text>
          <View style={styles.eventDateContainer}>
            <Icon name="calendar" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.eventDate}>
              {item?.date || `${25 + index} Set`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.carousel}>
      <View style={styles.carouselHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        style={styles.carouselScroll}
      >
        {loading ? (
          // Mostra placeholders durante o loading
          Array.from({ length: 5 }).map((_, index) => (
            <View key={`loading-${index}`} style={styles.eventCardWrapper}>
              <LoadingCard />
              <View style={styles.eventInfo}>
                <View style={[styles.loadingText, { width: '80%', height: 16 }]} />
                <View style={[styles.loadingText, { width: '60%', height: 14, marginTop: 6 }]} />
              </View>
            </View>
          ))
        ) : (
          // Mostra os dados reais
          (data || []).map((item, index) => (
            <EventCard key={item?.id || index} item={item} index={index} />
          ))
        )}
      </ScrollView>

      {!loading && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={() => navigation.navigate(loadMoreRoute)}
        >
          <Text style={styles.loadMoreButtonText}>Ver todos</Text>
          <Icon name="arrow-right" size={18} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ---------------------- ESTILOS MELHORADOS -------------------------- */
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: '#f8f9fa',
    minHeight: '100%',
  },

  /* Cabeçalho */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  logo: { 
    width: 160, 
    height: 110,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  notificationButton: {
    position: 'relative',
    padding: 8,
  },

  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  profileButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },

  profileGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Saudação */
  greetingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  subGreetingText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },

  /* Busca melhorada */
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  searchIcon: {
    marginRight: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },

  filterIconButton: {
    padding: 4,
  },

  /* Cards de estatísticas */
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 20,
    justifyContent: 'center',
  },

  statCard: {
    flex: 1,
    maxWidth: 150,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },

  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },

  /* Gradiente */
  gradientBox: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
    marginTop: 10,
  },

  gradientOverlay: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 10,
  },

  /* Carrossel */
  carousel: { 
    marginBottom: 30,
  },

  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  carouselScroll: {
    paddingLeft: 10,
  },

  cardsContainer: { 
    flexDirection: 'row', 
    paddingRight: 30,
  },

  eventCardWrapper: {
    marginRight: CARD_SPACING,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },

  eventInfo: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },

  eventTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    lineHeight: 20,
  },

  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  eventDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },

  /* Carregar todos - Nova posição */
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
    minWidth: 120,
  },

  loadMoreButtonText: { 
    color: '#FFF', 
    fontSize: 15, 
    fontWeight: '600',
    marginRight: 8,
  },

  /* Estados de loading */
  loadingCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  loadingPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
  },

  loadingText: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },

  /* Filtros redesenhados */
  filterSection: {
    backgroundColor: '#FFF',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  filterTitle: { 
    color: '#2c3e50', 
    fontSize: 20,
    fontWeight: 'bold',
  },

  advancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
  },

  advancedText: {
    color: '#4525a4',
    fontSize: 14,
    fontWeight: '600',
  },

  filterGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  filterButton: {
    width: (screenWidth - 64) / 3,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 12,
  },

  filterButtonActive: {
    transform: [{ scale: 0.95 }],
  },

  filterGradient: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },

  filterText: { 
    color: '#2c3e50', 
    fontSize: 14,
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#FFF',
  },

  bottomSpacing: {
    height: 20,
  },
});