import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Image, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  ScrollView, 
  Alert, 
  SafeAreaView, 
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

const { width: screenWidth } = Dimensions.get('window');

// Tema para a barra de navegação (para manter a consistência)
const theme = {
  colors: {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    white: "#FFFFFF",
    textSecondary: "#94A3A1", // Cor ajustada para melhor legibilidade
  }
};

// ===============================================
// COMPONENTE DA BARRA DE NAVEGAÇÃO
// Removida a dependência do componente pai para simplificar
// ===============================================
const BottomNavBar = ({ navigation, activeTab, setActiveTab }) => {
  const navItems = [
    { name: 'Home', icon: 'home', screen: 'PagInicial' },
    { name: 'Busca', icon: 'magnify', screen: 'Busca' },
    { name: 'Adicionar', icon: 'plus-circle', screen: 'CriarEvento' },
    { name: 'Favoritos', icon: 'heart-outline', screen: 'Favoritos' },
    { name: 'Perfil', icon: 'account-circle', screen: 'Perfil' },
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
    <View style={navStyles.bottomTabBar}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={navStyles.tabItem}
          onPress={() => handlePress(item)}
        >
          {item.name === 'Adicionar' ? (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={navStyles.centralButtonGradient}
            >
              <Icon name="plus" size={28} color="#fff" />
            </LinearGradient>
          ) : (
            <>
              <Icon
                name={item.icon}
                size={24}
                color={activeTab === item.name ? '#667eea' : '#9ca3af'}
              />
              <Text
                style={[
                  navStyles.tabText,
                  { color: activeTab === item.name ? '#667eea' : '#9ca3af' },
                ]}
              >
                {item.name}
              </Text>
            </>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL DO PERFIL
// A lógica do componente principal é mantida
// ===============================================
export default function Perfil() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [dadosUsuario, setDadosUsuario] = useState(null); 
  const [estatisticasUsuario, setEstatisticasUsuario] = useState(null);
  const [userType, setUserType] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [activeTab, setActiveTab] = useState('Perfil');

  const [notificacoes, setNotificacoes] = useState({
    mensagensChat: false,
    mensagensDono: false,
    cancelamento: false,
    alteracoes: false,
    lembretes: false,
    promocoes: false
  });

  const buscarDadosUsuario = async () => {
    try {
      setCarregando(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const storedUserType = await AsyncStorage.getItem('userType');

      if (!userToken || !storedUserType) {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }

      setUserType(storedUserType);
      
      const endpoint = storedUserType === 'organizador' 
        ? `${API_URL}/perfil/organizador` 
        : `${API_URL}/perfil/convidado`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 200) {
        const { perfil, convidado } = response.data;
        const dadosBrutos = perfil || convidado;
        const estatisticasBrutas = perfil?.estatisticas || response.data?.estatisticas || {};

        const dadosFormatados = {
          nome: dadosBrutos.nome || 'N/A',
          email: dadosBrutos.email || 'N/A',
          senha: '••••••••',
          localizacao: dadosBrutos.cidade ? `${dadosBrutos.cidade}, ${dadosBrutos.estado}` : 'Não informada',
          idioma: 'Português (BR)',
          avatarUrl: dadosBrutos.avatarUrl ? `${API_URL}${dadosBrutos.avatarUrl}` : null,
          telefone: dadosBrutos.telefone || 'Não informado',
          dataNascimento: dadosBrutos.dataNascimento || 'Não informada',
          sobreMim: dadosBrutos.sobreMim || 'Nenhuma descrição adicionada.',
        };
      
        setDadosUsuario(dadosFormatados);
        setEstatisticasUsuario(estatisticasBrutas);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      if (error.response?.status === 401) {
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }]
        });
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
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
    buscarDadosUsuario();
  }, []);

  const toggleSwitch = (key) => {
    setNotificacoes({ ...notificacoes, [key]: !notificacoes[key] });
  };

  const salvarAlteracoes = async () => {
    Alert.alert('Funcionalidade indisponível', 'A edição do perfil ainda não foi implementada.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
          });
        }}
      ]
    );
  };

  if (carregando || !dadosUsuario || !estatisticasUsuario) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#4525a4" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4525a4" />
      
      {/* NOVO ESTILO DO HEADER */}
      <LinearGradient
        colors={['#4525a4', '#1868fd']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.headerIcon}>
            <Icon name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.profileSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#4525a4', '#1868fd']}
              style={styles.avatarGradient}
            >
              {dadosUsuario.avatarUrl ? (
                <Image source={{ uri: dadosUsuario.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Icon name="account" size={60} color="#fff" />
              )}
            </LinearGradient>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="camera" size={16} color="#4525a4" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{dadosUsuario.nome}</Text>
          <Text style={styles.userEmail}>{dadosUsuario.email}</Text>
          {userType === 'convidado' && (
            <Text style={styles.userBio}>{dadosUsuario.sobreMim}</Text>
          )}
        </Animated.View>

        {/* Cards de estatísticas (Renderização Condicional) */}
        <Animated.View 
          style={[
            styles.statsSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.statsContainer}>
            {userType === 'organizador' ? (
              <>
                <View style={styles.statCard}>
                  <Icon name="calendar-check" size={24} color="#4525a4" />
                  <Text style={styles.statNumber}>{estatisticasUsuario.totalEventos || 0}</Text>
                  <Text style={styles.statLabel}>Eventos Criados</Text>
                </View>
                <View style={styles.statCard}>
                  <Icon name="calendar-range" size={24} color="#4525a4" />
                  <Text style={styles.statNumber}>{estatisticasUsuario.eventosAtivos || 0}</Text>
                  <Text style={styles.statLabel}>Eventos Ativos</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.statCard}>
                  <Icon name="account-multiple" size={24} color="#4525a4" />
                  <Text style={styles.statNumber}>{estatisticasUsuario.amigos || 0}</Text>
                  <Text style={styles.statLabel}>Amigos</Text>
                </View>
                <View style={styles.statCard}>
                  <Icon name="calendar-check" size={24} color="#4525a4" />
                  <Text style={styles.statNumber}>{estatisticasUsuario.eventos || 0}</Text>
                  <Text style={styles.statLabel}>Eventos</Text>
                </View>
              </>
            )}
          </View>
        </Animated.View>

        {/* Informações pessoais */}
        <Animated.View 
          style={[
            styles.infoSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <InfoRow 
            icon="email-outline" 
            label="E-mail" 
            value={dadosUsuario.email} 
            showAlterButton
            onEdit={() => Alert.alert('Editar E-mail')}
          />
          <InfoRow 
            icon="phone-outline" 
            label="Telefone" 
            value={dadosUsuario.telefone}
            showAlterButton
            onEdit={() => Alert.alert('Editar Telefone')}
          />
          <InfoRow 
            icon="phone-outline" 
            label="Telefone" 
            value={dadosUsuario.telefone}
            showAlterButton
            onEdit={() => console.log('Editar telefone')}
          />
          <InfoRow 
            icon="lock-outline" 
            label="Senha" 
            value={dadosUsuario.senha}
            showEyeIcon
            showAlterButton
            onEdit={() => Alert.alert('Editar Senha')}
          />
          <InfoRow 
            icon="map-marker-outline" 
            label="Localização" 
            value={dadosUsuario.localizacao}
            showAlterButton
            onEdit={() => Alert.alert('Editar Localização')}
          />
          <InfoRow 
            icon="cake-variant" 
            label="Data de Nascimento" 
            value={dadosUsuario.dataNascimento}
            showAlterButton
            onEdit={() => Alert.alert('Editar Data de Nascimento')}
          />
          <InfoRow 
            icon="cake-variant" 
            label="Data de Nascimento" 
            value={dadosUsuario.dataNascimento}
            showAlterButton
            onEdit={() => console.log('Editar data nascimento')}
          />
          <InfoRow 
            icon="web" 
            label="Idioma" 
            value={dadosUsuario.idioma} 
            showDropdown
            onEdit={() => Alert.alert('Selecionar Idioma')}
          />
        </Animated.View>

        {/* Seção de notificações */}
        <Animated.View 
          style={[
            styles.notificationSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Notificações</Text>
          <View style={styles.notificationCard}>
            <NotificacaoItem icon="chat" label="Mensagens do chat" value={notificacoes.mensagensChat} onValueChange={() => toggleSwitch('mensagensChat')} />
            <NotificacaoItem icon="account-star" label="Mensagens do organizador" value={notificacoes.mensagensDono} onValueChange={() => toggleSwitch('mensagensDono')} />
            <NotificacaoItem icon="cancel" label="Cancelamento de eventos" value={notificacoes.cancelamento} onValueChange={() => toggleSwitch('cancelamento')} />
            <NotificacaoItem icon="update" label="Alterações em eventos" value={notificacoes.alteracoes} onValueChange={() => toggleSwitch('alteracoes')} />
            <NotificacaoItem icon="bell-ring" label="Lembretes de eventos" value={notificacoes.lembretes} onValueChange={() => toggleSwitch('lembretes')} />
            <NotificacaoItem icon="tag" label="Ofertas e promoções" value={notificacoes.promocoes} onValueChange={() => toggleSwitch('promocoes')} />
          </View>
        </Animated.View>

        {/* Opções adicionais */}
        <Animated.View 
          style={[
            styles.optionsSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Configurações</Text>
          <TouchableOpacity style={styles.optionRow}>
            <Icon name="shield-account" size={24} color="#4525a4" />
            <Text style={styles.optionText}>Privacidade e Segurança</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <Icon name="help-circle-outline" size={24} color="#4525a4" />
            <Text style={styles.optionText}>Ajuda e Suporte</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <Icon name="information-outline" size={24} color="#4525a4" />
            <Text style={styles.optionText}>Sobre o App</Text>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Botões de navegação da tela inicial */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} />
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, showAlterButton, showDropdown, showEyeIcon, onEdit }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <Icon name={icon} size={20} color="#4525a4" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Não informado'}</Text>
      </View>
      <View style={styles.infoActions}>
        {showEyeIcon && (
          <TouchableOpacity style={styles.actionIcon}>
            <Icon name="eye-outline" size={18} color="#999" />
          </TouchableOpacity>
        )}
        {showAlterButton && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        )}
        {showDropdown && (
          <TouchableOpacity onPress={onEdit} style={styles.actionIcon}>
            <Icon name="chevron-down" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function NotificacaoItem({ icon, label, value, onValueChange }) {
  return (
    <View style={styles.notificationRow}>
      <View style={styles.notificationLeft}>
        <Icon name={icon} size={20} color="#4525a4" />
        <Text style={styles.notificationLabel}>{label}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange}
        trackColor={{ false: '#e9ecef', true: '#4525a4' }}
        thumbColor={value ? '#fff' : '#fff'}
        ios_backgroundColor="#e9ecef"
      />
    </View>
  );
}

const navStyles = StyleSheet.create({
  bottomTabBar: {
    position: 'absolute',
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
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  centralButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#4525a4',
    fontWeight: '600',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  headerGradient: {
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 30,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
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
    fontSize: 20,
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

  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
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
    fontSize: 20,
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

  infoSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  notificationSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  optionsSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },

  notificationSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  optionsSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  infoIconContainer: {
    width: 40,
    alignItems: 'center',
  },

  infoIconContainer: {
    width: 40,
    alignItems: 'center',
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 14,
    color: '#7f8c8d',
  },

  infoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    padding: 4,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  editButtonText: {
    color: '#4525a4',
    fontSize: 12,
    fontWeight: '600',
  },
  notificationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 4,
  },

  editButtonText: {
    color: '#4525a4',
    fontSize: 12,
    fontWeight: '600',
  },

  notificationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 4,
  },

  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  notificationLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 16,
    fontWeight: '500',
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 16,
    fontWeight: '500',
  },

  footerButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#4525a4',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});