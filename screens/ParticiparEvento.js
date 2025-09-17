import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ParticiparEvento({ route }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusEvento, setStatusEvento] = useState('Não Participa');
  const [activeTab, setActiveTab] = useState('detalhes');
  const [isFavorite, setIsFavorite] = useState(false);
  const [eventoData, setEventoData] = useState({
    nome: 'Carregando...',
    descricao: 'Carregando descrição...',
    preco: 0,
    nomeDono: 'Carregando...',
    endereco: 'Carregando endereço...',
    tipo: 'Carregando...',
    restricoes: 'Carregando...',
    horarioInicio: '00:00',
    horarioFim: '00:00',
    data: '00/00/0000'
  });
  
  const scrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const navigation = useNavigation();

  const carouselItems = [
    { id: '1', image: require('../assets/show.jpg') },
    { id: '2', image: require('../assets/show.jpg') },
    { id: '3', image: require('../assets/show.jpg') },
  ];

  // Simular busca de dados do backend
  const fetchEventoData = async () => {
    try {
      // const response = await fetch(`https://sua-api.com/eventos/${route.params?.eventoId}`);
      // const data = await response.json();
      
      // Dados mockados que viriam do backend
      const mockData = {
        nome: 'Rock Festival 2024',
        descricao: 'O maior festival de rock da cidade! Venha curtir os melhores shows com bandas nacionais e internacionais.',
        preco: 89.90,
        nomeDono: 'João Silva Productions',
        endereco: 'Av. Paulista, 1000 - São Paulo, SP',
        tipo: 'Show Musical',
        restricoes: 'Proibido entrada de bebidas e alimentos',
        horarioInicio: '20:00',
        horarioFim: '02:00',
        data: '25/12/2024'
      };
      
      setEventoData(mockData);
    } catch (error) {
      console.error('Erro ao buscar dados do evento:', error);
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

    fetchEventoData();
  }, []);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    scrollRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true,
    });
  };

  const handleBotaoAcao = () => {
    if (statusEvento === 'Não Participa') {
      setStatusEvento('Pendente');
    } else if (statusEvento === 'Participa') {
      setStatusEvento('Não Participa');
    } else if (statusEvento === 'Pendente') {
      navigation.navigate('PaginaPagamentos', {
        eventoId: route.params?.eventoId,
        valor: eventoData.preco,
        nomeEvento: eventoData.nome
      });
    }
  };

  const handleConvite = async () => {
    try {
      await Share.share({
        message: `🎉 Venha comigo para o ${eventoData.nome}! 🎵\n\n📅 ${eventoData.data}\n📍 ${eventoData.endereco}\n💰 R$ ${eventoData.preco.toFixed(2)}\n\nVai ser incrível! 🔥`,
        title: `Convite para ${eventoData.nome}`,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const renderBotaoAcao = () => {
    let texto = '';
    let icone = '';
    let coresGradiente = ['#4f46e5', '#3b82f6'];
    
    if (statusEvento === 'Não Participa') {
      texto = 'Participar';
      icone = 'plus-circle';
      coresGradiente = ['#10b981', '#059669'];
    } else if (statusEvento === 'Participa') {
      texto = 'Cancelar';
      icone = 'close-circle';
      coresGradiente = ['#ef4444', '#dc2626'];
    } else if (statusEvento === 'Pendente') {
      texto = 'Finalizar Pagamento';
      icone = 'credit-card';
      coresGradiente = ['#f59e0b', '#d97706'];
    }

    return (
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handleBotaoAcao}
        activeOpacity={0.8}
      >
        <LinearGradient colors={coresGradiente} style={styles.gradientButton}>
          <Icon name={icone} size={24} color="#fff" />
          <Text style={styles.buttonText}>{texto}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'detalhes':
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoCard}>
              <Icon name="map-marker" size={20} color="#4f46e5" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Localização</Text>
                <Text style={styles.infoText}>{eventoData.endereco}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Icon name="tag" size={20} color="#4f46e5" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Categoria</Text>
                <Text style={styles.infoText}>{eventoData.tipo}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Icon name="clock" size={20} color="#4f46e5" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Horário</Text>
                <Text style={styles.infoText}>{eventoData.horarioInicio} - {eventoData.horarioFim}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Icon name="information" size={20} color="#4f46e5" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Restrições</Text>
                <Text style={styles.infoText}>{eventoData.restricoes}</Text>
              </View>
            </View>
          </View>
        );
      
      case 'organizador':
        return (
          <View style={styles.tabContent}>
            <View style={styles.organizerCard}>
              <LinearGradient
                colors={['#4f46e5', '#3b82f6']}
                style={styles.organizerAvatar}
              >
                <Icon name="account" size={40} color="#fff" />
              </LinearGradient>
              <View style={styles.organizerInfo}>
                <Text style={styles.organizerName}>{eventoData.nomeDono}</Text>
                <Text style={styles.organizerLabel}>Organizador do Evento</Text>
                <View style={styles.organizerStats}>
                  <View style={styles.statItem}>
                    <Icon name="calendar-check" size={16} color="#10b981" />
                    <Text style={styles.statText}>12 eventos</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Icon name="star" size={16} color="#f59e0b" />
                    <Text style={styles.statText}>4.8</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.priceCard}>
              <Icon name="currency-usd" size={24} color="#10b981" />
              <View style={styles.priceInfo}>
                <Text style={styles.priceLabel}>Valor do Ingresso</Text>
                <Text style={styles.priceValue}>R$ {eventoData.preco.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        );
      
      case 'comentarios':
        return (
          <View style={styles.tabContent}>
            <TouchableOpacity 
              style={styles.commentsButton}
              onPress={() => navigation.navigate('Comentario', {
                eventoId: route.params?.eventoId,
                eventoData: eventoData
              })}
            >
              <LinearGradient
                colors={['#8b5cf6', '#a855f7']}
                style={styles.commentsGradient}
              >
                <Icon name="comment-multiple" size={24} color="#fff" />
                <Text style={styles.commentsButtonText}>Ver Todos os Comentários</Text>
                <Icon name="arrow-right" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.quickCommentsPreview}>
              <Text style={styles.quickCommentsTitle}>Últimos Comentários</Text>
              
              <View style={styles.commentPreview}>
                <View style={styles.commentHeader}>
                  <Icon name="account-circle" size={32} color="#4f46e5" />
                  <View style={styles.commentUserInfo}>
                    <Text style={styles.commentUser}>Maria Santos</Text>
                    <View style={styles.commentRating}>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="star" size={12} color="#fbbf24" />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.commentText}>Evento incrível! Super recomendo!</Text>
              </View>

              <View style={styles.commentPreview}>
                <View style={styles.commentHeader}>
                  <Icon name="account-circle" size={32} color="#4f46e5" />
                  <View style={styles.commentUserInfo}>
                    <Text style={styles.commentUser}>Carlos Lima</Text>
                    <View style={styles.commentRating}>
                      {[...Array(4)].map((_, i) => (
                        <Icon key={i} name="star" size={12} color="#fbbf24" />
                      ))}
                      <Icon name="star-outline" size={12} color="#d1d5db" />
                    </View>
                  </View>
                </View>
                <Text style={styles.commentText}>Muito bom, valeu a pena!</Text>
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header com gradiente */}
        <LinearGradient colors={['#4f46e5', '#3b82f6']} style={styles.headerGradient}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Icon 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite ? "#ef4444" : "#fff"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleConvite}
              >
                <Icon name="share-variant" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Carrossel de imagens */}
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
            {carouselItems.map((item, index) => (
              <View key={item.id} style={styles.carouselItem}>
                <Image 
                  source={item.image} 
                  style={styles.eventImage} 
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.5)']}
                  style={styles.imageOverlay}
                />
              </View>
            ))}
          </ScrollView>

          {/* Indicadores do carrossel */}
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

          {/* Status badge */}
          <View style={styles.statusBadge}>
            <LinearGradient
              colors={statusEvento === 'Participa' ? ['#10b981', '#059669'] : 
                     statusEvento === 'Pendente' ? ['#f59e0b', '#d97706'] : 
                     ['#6b7280', '#4b5563']}
              style={styles.statusGradient}
            >
              <Text style={styles.statusText}>{statusEvento}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Informações do evento */}
        <Animated.View 
          style={[
            styles.eventInfo,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.eventDate}>{eventoData.data}</Text>
          <Text style={styles.eventTitle}>{eventoData.nome}</Text>
          <Text style={styles.eventDescription}>{eventoData.descricao}</Text>
        </Animated.View>

        {/* Tabs de navegação */}
        <View style={styles.tabsContainer}>
          {[
            { key: 'detalhes', label: 'Detalhes', icon: 'information-outline' },
            { key: 'organizador', label: 'Organizador', icon: 'account-outline' },
            { key: 'comentarios', label: 'Comentários', icon: 'comment-outline' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Icon 
                name={tab.icon} 
                size={20} 
                color={activeTab === tab.key ? '#4f46e5' : '#9ca3af'} 
              />
              <Text style={[
                styles.tabLabel,
                activeTab === tab.key && styles.activeTabLabel
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conteúdo das tabs */}
        <Animated.View 
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {renderTabContent()}
        </Animated.View>

        {/* Botões de ação */}
        <View style={styles.actionsContainer}>
          {renderBotaoAcao()}
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleConvite}
            >
              <LinearGradient
                colors={['#8b5cf6', '#a855f7']}
                style={styles.secondaryGradient}
              >
                <Icon name="account-plus" size={20} color="#fff" />
                <Text style={styles.secondaryButtonText}>Convidar</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Chat', { eventoId: route.params?.eventoId })}
            >
              <LinearGradient
                colors={['#06b6d4', '#0891b2']}
                style={styles.secondaryGradient}
              >
                <Icon name="chat" size={20} color="#fff" />
                <Text style={styles.secondaryButtonText}>Chat</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  headerGradient: {
    paddingTop: 50,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  carouselContainer: {
    position: 'relative',
    height: 280,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },

  carouselScroll: {
    height: 280,
  },

  carouselItem: {
    width: screenWidth,
    height: 280,
    position: 'relative',
  },

  eventImage: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },

  pagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: 'white',
    width: 24,
  },

  statusBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },

  statusGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  eventInfo: {
    padding: 24,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  eventDate: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
  },

  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },

  eventDescription: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 0,
    borderRadius: 0,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },

  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4f46e5',
  },

  tabLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
  },

  activeTabLabel: {
    color: '#4f46e5',
  },

  tabContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 16,
    color: '#1f2937',
  },

  organizerCard: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  organizerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  organizerInfo: {
    flex: 1,
  },

  organizerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },

  organizerLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },

  organizerStats: {
    flexDirection: 'row',
    gap: 16,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '600',
  },

  priceCard: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcfce7',
  },

  priceInfo: {
    marginLeft: 16,
  },

  priceLabel: {
    fontSize: 14,
    color: '#15803d',
    marginBottom: 4,
  },

  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
  },

  commentsButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },

  commentsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },

  commentsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },

  quickCommentsPreview: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },

  quickCommentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },

  commentPreview: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  commentUserInfo: {
    marginLeft: 12,
  },

  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },

  commentRating: {
    flexDirection: 'row',
    gap: 2,
  },

  commentText: {
    fontSize: 14,
    color: '#4b5563',
  },

  actionsContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },

  actionButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },

  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },

  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },

  secondaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },

  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 40,
  },
});