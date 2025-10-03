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
const CARD_WIDTH = 180;
const CARD_HEIGHT = 150;
const CARD_SPACING = 16;

export default function EventosAbertos({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventosData, setEventosData] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Função para buscar dados do backend
  const fetchEventosData = async () => {
    try {
      setLoading(true);
      
      // Substitua pela sua URL da API
      // const response = await fetch('https://sua-api.com/eventos/abertos');
      // const data = await response.json();
      
      // Dados mockados que virão do backend
      const mockData = {
        categorias: ['Shows', 'Festas', 'Jogos', 'Cultural'],
        eventos: {
          Shows: Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            title: `Rock Festival ${i + 1}`,
            date: '25 Dez',
            location: 'São Paulo',
            image: `https://example.com/images/show-${i + 1}.jpg`,
            fallbackImage: require('../assets/show.jpg')
          })),
          Festas: Array.from({ length: 6 }, (_, i) => ({
            id: i + 7,
            title: `Festa Premium ${i + 1}`,
            date: '26 Dez',
            location: 'Rio de Janeiro',
            image: `https://example.com/images/festa-${i + 1}.jpg`,
            fallbackImage: require('../assets/show.jpg')
          })),
          Jogos: Array.from({ length: 6 }, (_, i) => ({
            id: i + 13,
            title: `Championship ${i + 1}`,
            date: '27 Dez',
            location: 'Brasília',
            image: `https://example.com/images/jogo-${i + 1}.jpg`,
            fallbackImage: require('../assets/show.jpg')
          })),
          Cultural: Array.from({ length: 6 }, (_, i) => ({
            id: i + 19,
            title: `Exposição Arte ${i + 1}`,
            date: '28 Dez',
            location: 'Salvador',
            image: `https://example.com/images/cultural-${i + 1}.jpg`,
            fallbackImage: require('../assets/show.jpg')
          }))
        }
      };
      
      setCategorias(mockData.categorias);
      setEventosData(mockData.eventos);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      // Fallback para dados mockados em caso de erro
      setCategorias(['Shows', 'Festas', 'Jogos', 'Cultural']);
      setEventosData({});
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

    fetchEventosData();
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
              <Icon name="account" size={28} color="#FFF" />
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
          <Text style={styles.pageTitle}>Eventos Abertos</Text>
          <Text style={styles.pageSubtitle}>Descubra os melhores eventos disponíveis</Text>
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
              placeholder="Buscar eventos..."
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
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="tune" size={20} color="#4525a4" />
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
                  eventos={eventosData[categoria] || []}
                  loading={loading}
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

function Carousel({ title, navigation, eventos = [], loading }) {
  const scrollRef = useRef(null);

  // Componente de loading para os cards
  const LoadingCard = () => (
    <View style={[styles.card, styles.loadingCard]}>
      <View style={styles.loadingPlaceholder} />
    </View>
  );

  // Componente de card de evento
  const EventCard = ({ evento, index }) => {
    const [imageError, setImageError] = useState(false);
    
    const imageSource = imageError || !evento?.image 
      ? evento?.fallbackImage || require('../assets/show.jpg')
      : { uri: evento.image };

    return (
      <View style={styles.eventCardWrapper}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ParticiparEvento', { eventoId: evento?.id })}
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
            {evento?.title || `Evento ${index + 1}`}
          </Text>
          <View style={styles.eventDateContainer}>
            <Icon name="calendar" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.eventDate}>
              {evento?.date || '25 Dez'}
            </Text>
          </View>
          <View style={styles.eventLocationContainer}>
            <Icon name="map-marker" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.eventLocation} numberOfLines={1}>
              {evento?.location || 'Local'}
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
                <View style={[styles.loadingText, { width: '50%', height: 14, marginTop: 4 }]} />
              </View>
            </View>
          ))
        ) : (
          // Mostra os dados reais
          eventos.map((evento, index) => (
            <EventCard key={evento?.id || index} evento={evento} index={index} />
          ))
        )}
      </ScrollView>

      {!loading && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={() => navigation.navigate('EventosPorCategoria', { categoria: title })}
        >
          <Text style={styles.loadMoreButtonText}>Ver todos</Text>
          <Icon name="arrow-right" size={18} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
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
    width: 160,
    height: 110,
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

  sectionTitle: {
    color: '#FFF',
    fontSize: 22,
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
    marginBottom: 4,
  },

  eventDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },

  eventLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  eventLocation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
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

  bottomSpacing: {
    height: 20,
  },
});