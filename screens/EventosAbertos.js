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

const CARD_WIDTH = 100;
const CARD_HEIGHT = 70;
const CARD_SPACING = 12;
const mockCards = Array.from({ length: 6 });

export default function EventosAbertos({ navigation }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image
          source={require('../assets/Logo oficial.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Icon
          name="account-circle-outline"
          size={60}
          color="#4525a4"
          marginRight="20"
          onPress={() => navigation.navigate('Perfil')}
        />
      </View>

      {/* Barra de pesquisa */}
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

      {/* Conteúdo principal com gradiente */}
      <LinearGradient
        colors={['#4525a4', '#1868fd']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        <Text style={styles.sectionTitle}>Eventos abertos</Text>
        <Carousel title="Shows" navigation={navigation} />
        <Carousel title="Festas" navigation={navigation} />
        <Carousel title="Jogos" navigation={navigation} />
        <Carousel title="Shows" navigation={navigation} />
      </LinearGradient>
    </ScrollView>
  );
}

function Carousel({ title, navigation }) {
  const scrollRef = useRef(null);
  const scrollPosition = useRef(0); // Guarda a posição atual

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
        {/* Botão "<" à esquerda */}
        <TouchableOpacity onPress={() => scrollBy(-CARD_WIDTH * 3)}>
          <Icon name="chevron-left" size={36} color="#FFF" />
        </TouchableOpacity>

        {/* Scroll horizontal */}
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
            <TouchableOpacity
              key={i}
              style={styles.card}
              onPress={() => navigation.navigate('ParticiparEvento')} // Navegar para a tela ParticiparEvento
            >
              <Image
                source={require('../assets/show.jpg')} // Imagem default
                style={styles.cardImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Botão ">" à direita */}
        <TouchableOpacity onPress={() => scrollBy(CARD_WIDTH * 3)}>
          <Icon name="chevron-right" size={36} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: '#FFF',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 130,
    height: 90,
  },
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
  searchIcon: {
    position: 'absolute',
    right: 16,
    top: 8,
  },
  gradientBox: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginTop: 28,
  },
  carousel: {
    marginBottom: 16,
  },
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
  cardsContainer: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginRight: CARD_SPACING,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});