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
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock API_URL for this example
const API_URL = 'https://example-api.com';

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
const EventCard = ({ event, index, navigation }) => {
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
  }, [fadeAnim, index]);

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
        showsHorizontalScrollIndicator={false}
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

// Helper components for the filter UI
const DropdownItem = ({ label, value, onPress, icon = "chevron-down" }) => (
  <TouchableOpacity style={styles.dropdownContainer} onPress={onPress}>
    <View style={styles.dropdownContent}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <Text style={styles.dropdownValue}>{value}</Text>
    </View>
    <Icon name={icon} size={20} color="#4525a4" />
  </TouchableOpacity>
);

// Main component - EventDiscoveryApp
export default function EventDiscoveryApp() {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [allEvents, setAllEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Filter states
  const [filtros, setFiltros] = useState({
    categoria: '',
    preco: 'qualquer',
    idade: 'Livre',
  });
  const [opcoesTipoEvento, setOpcoesTipoEvento] = useState([]);
  const [opcoesRestricaoIdade, setOpcoesRestricaoIdade] = useState([
    { label: 'Livre', value: 'Livre' },
    { label: '16+', value: '16' },
    { label: '18+', value: '18' },
    { label: '21+', value: '21+' },
  ]);
  const [opcoesPreco, setOpcoesPreco] = useState([
    { label: 'Gratuito', value: 'gratis' },
    { label: 'Pago', value: 'pago' },
    { label: 'Qualquer', value: 'qualquer' },
  ]);
  const [modalAberto, setModalAberto] = useState(null);

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

  // Use a single useEffect for event fetching with dependencies on filters
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const response = await axios.get(`${API_URL}/api/eventos/filtrados`, {
          params: {
            categoria: filtros.categoria || undefined,
            preco: filtros.preco || undefined,
            // Adicione outros filtros aqui (idade, localizacao, etc.)
          },
        });
        setAllEvents(response.data.eventos);
      } catch (error) {
        console.error("Erro ao buscar eventos filtrados:", error);
        Alert.alert("Erro", "Não foi possível carregar os eventos. Verifique se o backend está ativo.");
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, [filtros]);

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
      setOpcoesTipoEvento(formattedCategories.map(cat => ({ label: cat.name, value: cat.name })));
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const atualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({
      categoria: '',
      preco: 'qualquer',
      idade: 'Livre',
    });
  };

  const selecionarOpcao = (tipo, opcao) => {
    atualizarFiltro(tipo, opcao.value);
    setModalAberto(null);
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
                      onSubmitEditing={() => { /* Implement search logic here */ }}
                    />
                  </View>
                  <TouchableOpacity style={styles.filterButton} onPress={() => setIsFiltersVisible(!isFiltersVisible)}>
                    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.filterButtonGradient}>
                      <MaterialIcons name="tune" size={20} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
            
            {isFiltersVisible && (
              <Animated.View style={[
                styles.filtersSection,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Filtros Avançados</Text>
                  <TouchableOpacity onPress={limparFiltros} style={styles.clearFiltersButton}>
                    <Text style={styles.clearFiltersText}>Limpar</Text>
                    <Icon name="broom" size={16} color="#4525a4" />
                  </TouchableOpacity>
                </View>
                <View style={styles.card}>
                  <DropdownItem
                    label="Categoria"
                    value={filtros.categoria || 'Qualquer'}
                    onPress={() => setModalAberto('categoria')}
                  />
                  <View style={styles.divider} />
                  <DropdownItem
                    label="Preço"
                    value={opcoesPreco.find(op => op.value === filtros.preco)?.label || 'Qualquer'}
                    onPress={() => setModalAberto('preco')}
                  />
                  <View style={styles.divider} />
                  <DropdownItem
                    label="Restrição de Idade"
                    value={opcoesRestricaoIdade.find(op => op.value === filtros.idade)?.label || 'Livre'}
                    onPress={() => setModalAberto('idade')}
                  />
                </View>
              </Animated.View>
            )}

            <View style={styles.eventsSection}>
              <EventCarousel title="🎉 Eventos Encontrados" events={allEvents} loading={loadingEvents} navigation={navigation} />
            </View>

            <View style={styles.categoriesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explore por Categoria</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>Ver todas</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#667eea" />
                </TouchableOpacity>
              </View>
              <View style={styles.categoriesGrid}>
                {loadingCategories ? (
                  <Text style={styles.loadingText}>Carregando categorias...</Text>
                ) : (
                  allCategories.map((item, index) => (
                    <TouchableOpacity
                      key={item.name}
                      onPress={() => atualizarFiltro('categoria', item.name)}
                      style={[styles.categoryCard, { backgroundColor: item.color[0] + '15' }]}
                    >
                      <View style={styles.categoryContent}>
                        <View style={styles.categoryIconContainer}>
                          <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                        </View>
                        <Text style={[styles.categoryText, { color: item.color[0] }]}>
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
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
        <Animated.View style={[styles.headerContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
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
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} />
      <Modal
        visible={modalAberto !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalAberto(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalAberto === 'categoria' ? 'Escolha a Categoria' :
                  modalAberto === 'idade' ? 'Classificação Etária' :
                  'Faixa de Preço'}
              </Text>
              <TouchableOpacity onPress={() => setModalAberto(null)} style={styles.closeButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={
                modalAberto === 'categoria' ? opcoesTipoEvento :
                modalAberto === 'idade' ? opcoesRestricaoIdade :
                opcoesPreco
              }
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    filtros[modalAberto] === item.value && styles.modalOptionSelected
                  ]}
                  onPress={() => selecionarOpcao(modalAberto, item)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    filtros[modalAberto] === item.value && styles.modalOptionTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {filtros[modalAberto] === item.value && (
                    <Icon name="check" size={20} color="#4525a4" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

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
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  mainContent: { paddingBottom: 80 },
  headerContainer: { marginBottom: -20, zIndex: 10 },
  headerGradient: { paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerLogoText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
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
  notificationText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  userButton: { borderRadius: 25, overflow: 'hidden' },
  userButtonGradient: { padding: 12 },
  heroSection: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 30 },
  heroContent: { alignItems: 'center' },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: 12, lineHeight: 40 },
  heroSubtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 30 },
  searchContainer: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12 },
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
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#374151' },
  filterButton: { borderRadius: 20, overflow: 'hidden' },
  filterButtonGradient: { padding: 14 },
  eventsSection: { marginBottom: 30 },
  carouselContainer: { marginBottom: 32 },
  carouselHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  carouselTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15 },
  viewAllText: { color: '#667eea', fontSize: 14, fontWeight: '600', marginRight: 4 },
  carouselContent: { paddingHorizontal: 20 },
  eventCardContainer: { width: width * 0.8, marginRight: 16 },
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
  eventImageContainer: { height: 180, position: 'relative' },
  eventImage: { width: '100%', height: '100%' },
  eventImageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  favoriteButton: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
  eventDetails: { padding: 16 },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  eventTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginRight: 8 },
  categoryBadge: { backgroundColor: '#e0e7ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  categoryBadgeText: { color: '#6366f1', fontSize: 10, fontWeight: 'bold' },
  eventInfo: { marginBottom: 16 },
  eventInfoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  eventLocation: { fontSize: 14, color: '#6b7280', marginLeft: 6 },
  eventPrice: { fontSize: 14, color: '#059669', fontWeight: '600', marginLeft: 6 },
  joinButton: { borderRadius: 12, overflow: 'hidden' },
  joinButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 8 },
  joinButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  categoriesSection: { paddingHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15 },
  viewAllText: { color: '#667eea', fontSize: 14, fontWeight: '600', marginRight: 4 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  categoryCard: {
    aspectRatio: 1.3,
    width: (width - 64) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContent: { alignItems: 'center' },
  categoryIconContainer: { marginBottom: 12 },
  categoryEmoji: { fontSize: 32 },
  categoryText: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  placeholderScreen: { flex: 1, height: 500, justifyContent: 'center', alignItems: 'center', padding: 20 },
  placeholderText: { fontSize: 24, fontWeight: 'bold', color: '#ccc', textAlign: 'center' },
  loadingText: { color: '#6b7280', fontSize: 16, paddingHorizontal: 20 },
  filtersSection: { paddingHorizontal: 20, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  clearFiltersButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 15 },
  clearFiltersText: { color: '#4525a4', fontSize: 14, fontWeight: '600', marginRight: 4 },
  divider: { height: 1, backgroundColor: '#f1f3f4', marginVertical: 12 },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  dropdownContent: { flex: 1 },
  dropdownLabel: { fontSize: 12, color: '#7f8c8d', marginBottom: 4 },
  dropdownValue: { fontSize: 16, color: '#2c3e50', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f1f3f4' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f3f4' },
  modalOptionSelected: { backgroundColor: '#f8f9fa' },
  modalOptionText: { fontSize: 16, color: '#2c3e50' },
  modalOptionTextSelected: { color: '#4525a4', fontWeight: '600' },
});