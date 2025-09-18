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
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 140;
const CARD_HEIGHT = 100;
const CARD_SPACING = 16;

export default function MeusEventos({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [meusEventosData, setMeusEventosData] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [userStats, setUserStats] = useState({
    totalEventos: 0,
    proximos: 0,
    participados: 0
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Função para buscar dados do backend
  const fetchMeusEventosData = async () => {
    try {
      // const response = await fetch('https://sua-api.com/usuarios/meus-eventos');
      // const data = await response.json();
      
      // Dados mockados que virão do backend
      const mockData = {
        stats: {
          totalEventos: 12,
          proximos: 5,
          participados: 7
        },
        categorias: ['Próximos', 'Participados', 'Favoritos', 'Organizados'],
        eventos: {
          Próximos: Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            nome: '',
            data: '',
            local: '',
            status: 'confirmado',
            imagem: '../assets/show.jpg'
          })),
          Participados: Array.from({ length: 7 }, (_, i) => ({
            id: i + 6,
            nome: '',
            data: '',
            local: '',
            status: 'finalizado',
            imagem: '../assets/show.jpg'
          })),
          Favoritos: Array.from({ length: 8 }, (_, i) => ({
            id: i + 13,
            nome: '',
            data: '',
            local: '',
            status: 'favorito',
            imagem: '../assets/show.jpg'
          })),
          Organizados: Array.from({ length: 3 }, (_, i) => ({
            id: i + 21,
            nome: '',
            data: '',
            local: '',
            status: 'organizando',
            imagem: '../assets/show.jpg'
          }))
        }
      };
      
      setUserStats(mockData.stats);
      setCategorias(mockData.categorias);
      setMeusEventosData(mockData.eventos);
    } catch (error) {
      console.error('Erro ao buscar meus eventos:', error);
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

    fetchMeusEventosData();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Cabeçalho melhorado */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#4525a4" />
          </TouchableOpacity>
          
          <Image
            source={require('../assets/Logo oficial.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Perfil')}
          >
            <LinearGradient
              colors={['#4525a4', '#1868fd']}
              style={styles.profileGradient}
            >
              <Icon name="account" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Título da página */}
        <Animated.View 
          style={[
            styles.titleSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.pageTitle}>Meus Eventos</Text>
          <Text style={styles.pageSubtitle}>Gerencie sua agenda de eventos</Text>
        </Animated.View>

        {/* Cards de estatísticas */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Icon name="calendar-check" size={24} color="#4525a4" />
              <Text style={styles.statNumber}>{userStats.totalEventos}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="clock-outline" size={24} color="#f39c12" />
              <Text style={styles.statNumber}>{userStats.proximos}</Text>
              <Text style={styles.statLabel}>Próximos</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="check-circle" size={24} color="#27ae60" />
              <Text style={styles.statNumber}>{userStats.participados}</Text>
              <Text style={styles.statLabel}>Participados</Text>
            </View>
          </View>
        </Animated.View>

        {/* Barra de pesquisa aprimorada */}
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
              placeholder="Buscar nos meus eventos..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={() => {
                if (searchTerm.trim()) {
                  navigation.navigate('Pesquisa', { termo: searchTerm.trim(), filtro: 'meus-eventos' });
                  setSearchTerm('');
                }
              }}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter-variant" size={20} color="#4525a4" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Conteúdo principal com gradiente melhorado */}
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
              {categorias.map((categoria) => (
                <Carousel 
                  key={categoria}
                  title={categoria} 
                  navigation={navigation}
                  eventos={meusEventosData[categoria] || []}
                  categoria={categoria}
                />
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

function Carousel({ title, navigation, eventos = [], categoria }) {
  const scrollRef = useRef(null);
  const scrollPosition = useRef(0);

  const scrollBy = (distance) => {
    if (!scrollRef.current) return;
    scrollPosition.current += distance;
    if (scrollPosition.current < 0) scrollPosition.current = 0;
    scrollRef.current.scrollTo({ x: scrollPosition.current, animated: true });
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Próximos': return 'clock-outline';
      case 'Participados': return 'check-circle';
      case 'Favoritos': return 'heart';
      case 'Organizados': return 'crown';
      default: return 'calendar';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado': return '#27ae60';
      case 'finalizado': return '#95a5a6';
      case 'favorito': return '#e74c3c';
      case 'organizando': return '#f39c12';
      default: return '#4525a4';
    }
  };

  return (
    <View style={styles.carousel}>
      <View style={styles.carouselHeader}>
        <View style={styles.titleWithIcon}>
          <Icon name={getCategoryIcon(categoria)} size={20} color="#FFF" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Ver todos</Text>
          <Icon name="arrow-right" size={16} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>

      {eventos.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="calendar-blank" size={48} color="rgba(255,255,255,0.5)" />
          <Text style={styles.emptyStateText}>Nenhum evento encontrado</Text>
        </View>
      ) : (
        <View style={styles.carouselRow}>
          <TouchableOpacity 
            style={styles.arrowButton}
            onPress={() => scrollBy(-CARD_WIDTH * 2)}
          >
            <Icon name="chevron-left" size={24} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>

          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
            onScroll={(event) => {
              scrollPosition.current = event.nativeEvent.contentOffset.x;
            }}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            snapToAlignment="start"
          >
            {eventos.map((evento, i) => (
              <TouchableOpacity
                key={evento.id || i}
                style={styles.card}
                onPress={() => navigation.navigate('ParticiparEvento', { eventoId: evento.id })}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../assets/show.jpg')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                
                {/* Status badge */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(evento.status) }]}>
                  <Icon 
                    name={
                      evento.status === 'confirmado' ? 'check' :
                      evento.status === 'finalizado' ? 'check-all' :
                      evento.status === 'favorito' ? 'heart' :
                      evento.status === 'organizando' ? 'crown' : 'circle'
                    } 
                    size={12} 
                    color="#FFF" 
                  />
                </View>

                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.cardOverlay}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {evento.nome || `Meu Evento ${i + 1}`}
                    </Text>
                    <View style={styles.cardInfo}>
                      <Icon name="calendar" size={12} color="#FFF" />
                      <Text style={styles.cardDate}>{evento.data || '25 Dez'}</Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Icon name="map-marker" size={12} color="#FFF" />
                      <Text style={styles.cardLocation} numberOfLines={1}>
                        {evento.local || 'Local'}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity 
            style={styles.arrowButton}
            onPress={() => scrollBy(CARD_WIDTH * 2)}
          >
            <Icon name="chevron-right" size={24} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: '#f8f9fa',
    minHeight: '100%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    marginHorizontal: -20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 120,
    height: 70,
  },

  profileButton: {
    borderRadius: 22,
    overflow: 'hidden',
  },

  profileGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginHorizontal: -20,
    marginTop: -10,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },

  pageSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },

  statsSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    marginHorizontal: -20,
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
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
    fontWeight: '600',
  },

  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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

  filterButton: {
    padding: 4,
  },

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

  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  seeAllText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  emptyStateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },

  carouselRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },

  cardsContainer: {
    flexDirection: 'row',
    paddingRight: 10,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    marginRight: CARD_SPACING,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 12,
  },

  cardContent: {
    gap: 4,
  },

  cardTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  cardDate: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '500',
  },

  cardLocation: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },

  bottomSpacing: {
    height: 20,
  },
});