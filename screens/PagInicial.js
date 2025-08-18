import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

/* ---------------------- CONSTANTES ---------------------- */
const CARD_WIDTH = 100;
const CARD_HEIGHT = 70;
const CARD_SPACING = 12;
const mockCards = Array.from({ length: 10 });

/* ---------------------- TELA INICIAL -------------------- */
export default function PaginaInicial({ navigation }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho ------------------------------------------------ */}
      <View style={styles.header}>
        <Image
          source={require('../assets/Logo oficial.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Icon name="account-circle-outline" 
        size={60} 
        color="#4525a4"
        marginRight="20"
        onPress={() => navigation.navigate('Perfil')} 
        />
      </View>

      {/* Barra de pesquisa -------------------------------------- */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar eventos..."
          placeholderTextColor="#666"
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
        <Icon name="magnify" size={24} color="#4525a4" style={styles.searchIcon} />
      </View>

      {/* Gradiente + carrosséis --------------------------------- */}
      <LinearGradient
        colors={['#4525a4', '#1868fd']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        {/* Eventos abertos */}
        <Carousel
          title="Eventos Abertos"
          navigation={navigation}
          loadMoreRoute="EventosAbertos"
        />

        {/* Meus eventos */}
        <Carousel
          title="Meus Eventos"
          navigation={navigation}
          loadMoreRoute="MeusEventos"
        />
      </LinearGradient>

      {/* Filtros ------------------------------------------------- */}
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filtro</Text>

        {/* Opções avançadas já existente */}
        <TouchableOpacity onPress={() => navigation.navigate('FiltragemAvancada')}>
          <Text style={styles.filterTitle}>Opções avançadas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {['Shows', 'Festas', 'Jogos'].map((item) => (
          <TouchableOpacity key={item} style={styles.filterButton}>
            <Text style={styles.filterText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.filterRow}>
        {['Esportivo', 'Cultural', 'Outros'].map((item) => (
          <TouchableOpacity key={item} style={styles.filterButton}>
            <Text style={styles.filterText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

/* ---------------------- COMPONENTE CARROSSEL ------------- */
function Carousel({ title, navigation, loadMoreRoute }) {
  const scrollRef = useRef(null);
  const scrollPosition = useRef(0);

  /* Função para rolar com as setas */
  const scrollBy = (distance) => {
    if (!scrollRef.current) return;
    scrollPosition.current += distance;
    if (scrollPosition.current < 0) scrollPosition.current = 0;
    scrollRef.current.scrollTo({ x: scrollPosition.current, animated: true });
  };

  return (
    <View style={styles.carousel}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.carouselRow}>
        {/* Seta esquerda */}
        <TouchableOpacity onPress={() => scrollBy(-CARD_WIDTH * 3)}>
          <Icon name="chevron-left" size={36} color="#FFF" />
        </TouchableOpacity>

        {/* ScrollView horizontal com swipe */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          onScroll={(event) => {
            scrollPosition.current = event.nativeEvent.contentOffset.x;
          }}
          scrollEventThrottle={16}
        >
          {mockCards.map((_, i) => (
            <View key={i} style={styles.card} />
          ))}
        </ScrollView>

        {/* Seta direita */}
        <TouchableOpacity onPress={() => scrollBy(CARD_WIDTH * 3)}>
          <Icon name="chevron-right" size={36} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Botão Carregar todos */}
      <TouchableOpacity
        style={styles.loadMore}
        onPress={() => navigation.navigate(loadMoreRoute)}
      >
        <Text style={styles.loadMoreText}>Carregar todos</Text>
        <Icon name="chevron-down" size={18} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

/* ---------------------- ESTILOS -------------------------- */
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: '#FFF',
    flex: 1,
  },

  /* Cabeçalho */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: { 
    width: 130, 
    height: 90,
  },

  /* Busca */
  searchContainer: {
    marginHorizontal: 20,
  },

  searchInput: {
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 44,
    height: 40,
    fontSize: 14,
  },
  searchIcon: { position: 'absolute', right: 16, top: 8 },

  /* Gradiente */
  gradientBox: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginTop: 28,
  },

  /* Carrossel */
  carousel: { marginBottom: 24 },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  carouselRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardsContainer: { flexDirection: 'row', paddingRight: 10 },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginRight: CARD_SPACING,
  },

  /* Carregar todos */
  loadMore: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loadMoreText: { color: '#FFF', fontSize: 14, marginRight: 4 },

  /* Filtros */
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  filterTitle: { 
    color: '#4525a4', 
    fontWeight: '600', 
    marginHorizontal: 10,
  },
  filterRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 12, 
    marginHorizontal: 10,
    justifyContent: 'center',  
  },
  filterButton: {
    backgroundColor: '#4525a4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  filterText: { 
    color: '#FFF', 
    fontSize: 13,
   },
});