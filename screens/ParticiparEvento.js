import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ParticiparEvento() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusEvento, setStatusEvento] = useState('Não Participa'); 
  const scrollRef = useRef(null);
  const { width: screenWidth } = Dimensions.get('window');

  const carouselItems = [
    { id: '1', image: require('../assets/show.jpg') },
    { id: '2', image: require('../assets/show.jpg') },
    { id: '3', image: require('../assets/show.jpg') },
  ];

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (screenWidth - 60));
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    scrollRef.current?.scrollToOffset({
      offset: index * (screenWidth - 60),
      animated: true,
    });
  };

  // 🔹 Função para renderizar botão conforme status
  const renderBotaoAcao = () => {
    let texto = '';
    if (statusEvento === 'Não Participa') texto = 'Participar';
    if (statusEvento === 'Participa') texto = 'Cancelar Inscrição';
    if (statusEvento === 'Pendente') texto = 'Pagamento';

    return (
      <LinearGradient colors={['#4f46e5', '#3b82f6']} style={styles.gradientButton}>
        <TouchableOpacity 
          style={styles.participarButton} 
          onPress={() => console.log(`${texto} clicado`)}
        >
          <Text style={styles.buttonText}>{texto}</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image source={require('../assets/Logo oficial.png')} style={styles.logo} />
        <Icon name="person-circle-outline" size={32} color="#4B4BE0" />
      </View>

      {/* Barra de busca */}
      <View style={styles.searchBar}>
        <TextInput placeholder="Buscar..." style={styles.searchInput} />
        <Icon name="search" size={24} color="#4B4BE0" />
      </View>

      {/* Box do evento */}
      <LinearGradient colors={['#4f46e5', '#3b82f6']} style={styles.gradientBox}>
        {/* Carrossel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.carouselScroll}
          >
            {carouselItems.map((item) => (
              <View key={item.id} style={[styles.carouselItem, { width: screenWidth - 60 }]}>
                <Image 
                  source={item.image} 
                  style={styles.eventImage} 
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {carouselItems.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.activeDot
                ]}
                onPress={() => scrollToIndex(index)}
              />
            ))}
          </View>
        </View>

        {/* Infos básicas */}
        <Text style={styles.eventTitle}>Nome Do Evento</Text>
        <Text style={styles.eventDesc}>Descrição do evento</Text>

        <Text style={styles.info}>Endereço</Text>
        <Text style={styles.info}>Tipo de evento</Text>
        <Text style={styles.info}>Status do Evento: {statusEvento}</Text>
        <Text style={styles.info}>Restrições</Text>
        <Text style={styles.info}>Horários: Começa - Acaba</Text>
      </LinearGradient>


      <View style={styles.footer}>
        {/* Botão principal de ação (condicional) */}
        {renderBotaoAcao()}

        {/* Botão de chat */}
        <LinearGradient colors={['#4f46e5', '#3b82f6']} style={styles.gradientButton}>
          <TouchableOpacity style={styles.participarButton} onPress={() => console.log("Chat aberto")}>
            <Icon name="chatbubbles-outline" size={22} color="#fff" />
            <Text style={[styles.buttonText, { marginLeft: 6 }]}>Chat</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F7F6FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  searchBar: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    fontFamily: 'Montserrat',
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  carouselContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  carouselScroll: {
    borderRadius: 10,
  },
  carouselItem: {
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 12,
  },
  gradientBox: {
    marginTop: 20,
    borderRadius: 15,
    padding: 15,
  },
  gradientButton: {
    borderRadius: 15,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTitle: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 8,
  },
  eventDesc: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
  },
  info: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 4,
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  participarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
