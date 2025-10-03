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
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

const { width: screenWidth } = Dimensions.get('window');

// --- Componentes da BottomNavBar replicados do PagInicial.js ---
const navItemsPagInicial = [
    { name: 'Home', icon: 'home', screen: 'PagInicial' },
    { name: 'Chat', icon: 'chat-bubble-outline', screen: 'GrupoScreen' }, 
    { name: 'Buscar', icon: 'search', screen: 'FiltragemAvancada' },
    { name: 'Eventos', icon: 'event', screen: 'MeusEventos' },
    { name: 'Perfil', icon: 'person-outline', screen: 'Perfil' },
];

const activeIconsPagInicial = {
    'Home': 'home',
    'Chat': 'chat-bubble',
    'Buscar': 'search', 
    'Eventos': 'event',
    'Perfil': 'person',
};

// Componente BottomNavBar Padronizado
const BottomNavBar = ({ activeTab, setActiveTab, navigation }) => {
    
    const handlePress = async (item) => {
        if (['Chat', 'Eventos', 'Perfil'].includes(item.name)) {
            const userToken = await AsyncStorage.getItem('@user_token'); 
            if (!userToken) {
                Alert.alert('Login necessário', 'Você precisa estar logado para acessar esta área.', [
                    { text: 'Fazer Login', onPress: () => navigation.navigate('Login') }
                ]);
                return;
            }
        }
        setActiveTab(item.name);
        navigation.navigate(item.screen);
    };

    return (
        <View style={navStyles.container}>
            {navItemsPagInicial.map((item) => {
                const isActive = activeTab === item.name;
                return (
                    <TouchableOpacity
                        key={item.name}
                        style={navStyles.item}
                        onPress={() => handlePress(item)}
                        activeOpacity={0.7}
                    >
                        <View style={[navStyles.iconContainer, isActive && navStyles.iconContainerActive]}>
                            <MaterialIcons
                                name={isActive ? activeIconsPagInicial[item.name] : item.icon}
                                size={24}
                                color={isActive ? '#5847E3' : '#9ca3af'}
                            />
                        </View>
                        <Text style={[navStyles.label, isActive && navStyles.labelActive]}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
// --- Fim Componentes da BottomNavBar replicados do PagInicial.js ---


// Componente de Linha de Informação
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

// Componente de Notificação
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


// Componente Principal do Perfil
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
        mensagensChat: true,
        mensagensDono: false,
        cancelamento: true,
        alteracoes: false,
        lembretes: true,
        promocoes: false
    });

    const buscarDadosUsuario = async () => {
        try {
            setCarregando(true);
            // CORREÇÃO: Usando as chaves padronizadas
            const userToken = await AsyncStorage.getItem('@user_token');
            const storedUserType = await AsyncStorage.getItem('@user_type');

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
            {/* Usando cores do PagInicial: #5847E3 (principal) e #2816b2 (secundária) */}
            <StatusBar barStyle="light-content" backgroundColor="#5847E3" />
            
            {/* Header: Gradiente no estilo PagInicial.js */}
            <LinearGradient
                colors={['#5847E3', '#2816b2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
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

            <ScrollView 
                style={styles.scrollContainer} 
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. SEÇÃO DO PERFIL E AVATAR (Card Flutuante) */}
                <Animated.View 
                    style={[
                        styles.profileSection,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={['#5847E3', '#2816b2']} // Cores do PagInicial
                            style={styles.avatarGradient}
                        >
                            {dadosUsuario.avatarUrl ? (
                                <Image source={{ uri: dadosUsuario.avatarUrl }} style={styles.avatarImage} />
                            ) : (
                                <Icon name="account" size={60} color="#fff" />
                            )}
                        </LinearGradient>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Icon name="camera" size={16} color="#5847E3" /> {/* Cor do PagInicial */}
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.userName}>{dadosUsuario.nome}</Text>
                    <Text style={styles.userEmail}>{dadosUsuario.email}</Text>
                    {userType === 'convidado' && (
                        <Text style={styles.userBio}>{dadosUsuario.sobreMim}</Text>
                    )}
                </Animated.View>

                {/* 2. CARDS DE ESTATÍSTICAS */}
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
                                    <Icon name="calendar-check" size={24} color="#5847E3" />
                                    <Text style={styles.statNumber}>{estatisticasUsuario.totalEventos || 0}</Text>
                                    <Text style={styles.statLabel}>Eventos Criados</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <Icon name="calendar-range" size={24} color="#5847E3" />
                                    <Text style={styles.statNumber}>{estatisticasUsuario.eventosAtivos || 0}</Text>
                                    <Text style={styles.statLabel}>Eventos Ativos</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.statCard}>
                                    <Icon name="account-multiple" size={24} color="#5847E3" />
                                    <Text style={styles.statNumber}>{estatisticasUsuario.amigos || 0}</Text>
                                    <Text style={styles.statLabel}>Amigos</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <Icon name="calendar-check" size={24} color="#5847E3" />
                                    <Text style={styles.statNumber}>{estatisticasUsuario.eventos || 0}</Text>
                                    <Text style={styles.statLabel}>Eventos</Text>
                                </View>
                            </>
                        )}
                    </View>
                </Animated.View>

                {/* 3. INFORMAÇÕES PESSOAIS (Card Agrupador) */}
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
                        icon="web" 
                        label="Idioma" 
                        value={dadosUsuario.idioma} 
                        showDropdown
                        onEdit={() => Alert.alert('Selecionar Idioma')}
                    />
                </Animated.View>

                {/* 4. SEÇÃO DE NOTIFICAÇÕES (Card Agrupador) */}
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

                {/* 5. OPÇÕES ADICIONAIS (Card Agrupador) */}
                <Animated.View 
                    style={[
                        styles.optionsSection,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <Text style={styles.sectionTitle}>Configurações</Text>
                    <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
                        <Icon name="shield-account" size={24} color="#5847E3" /> {/* Cor do PagInicial */}
                        <Text style={styles.optionText}>Privacidade e Segurança</Text>
                        <Icon name="chevron-right" size={20} color="#999" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
                        <Icon name="help-circle-outline" size={24} color="#5847E3" /> {/* Cor do PagInicial */}
                        <Text style={styles.optionText}>Ajuda e Suporte</Text>
                        <Icon name="chevron-right" size={20} color="#999" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionRow, { borderBottomWidth: 0 }]} activeOpacity={0.7}>
                        <Icon name="information-outline" size={24} color="#5847E3" /> {/* Cor do PagInicial */}
                        <Text style={styles.optionText}>Sobre o App</Text>
                        <Icon name="chevron-right" size={20} color="#999" />
                    </TouchableOpacity>
                </Animated.View>
                
                <View style={styles.bottomSpacing} />
            </ScrollView>
            
            <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} />
        </SafeAreaView>
    );
}

// Estilos da Barra de Navegação (navStyles) REPLICADOS DO PagInicial.js
const navStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 0, 
        paddingVertical: 14, 
        paddingHorizontal: 4,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05, 
        shadowRadius: 5,
        elevation: 8,
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        flex: 1,
    },
    iconContainer: {
        padding: 10, 
        borderRadius: 14,
        // transition: 'background-color 0.3s', // RN não suporta CSS transition
    },
    iconContainerActive: {
        backgroundColor: '#f0edff', // Roxo claro
    },
    label: {
        fontSize: 12, 
        color: '#9ca3af',
        marginTop: 4,
        fontWeight: '500',
    },
    labelActive: {
        color: '#5847E3', // Cor principal do PagInicial
        fontWeight: '700', 
    },
    // Adicionado style para o botão central (Adicionar)
    centralButtonGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#1868fd',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
});

// Estilos da Página (Ajustados para o visual Light Mode moderno)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    // --- Loading ---
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingContent: {
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#5847E3', // Cor principal do PagInicial
        fontWeight: '600',
    },
    // --- Header ---
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 20, 
        borderBottomLeftRadius: 30, // Mantido para o visual moderno
        borderBottomRightRadius: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24, // Padding ajustado para consistência
        paddingBottom: 20,
    },
    headerIcon: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    // --- Scroll / Transition ---
    scrollContainer: {
        flex: 1,
        marginTop: -30, // Efeito Pull-Up
    },
    // --- Profile Section (Main Card) ---
    profileSection: {
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 30,
        borderTopLeftRadius: 24, 
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        marginBottom: 12,
        overflow: 'visible',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarGradient: {
        width: 110, 
        height: 110,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 55,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36, 
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3, 
        borderColor: '#f8f9fa', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    userName: {
        fontSize: 26, 
        fontWeight: '800', 
        color: '#2c3e50',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 10,
    },
    userBio: {
        fontSize: 14,
        color: '#495057',
        textAlign: 'center',
        paddingHorizontal: 40,
        marginTop: 10,
    },
    // --- Stats Section ---
    statsSection: {
        paddingHorizontal: 16, // Padding ajustado para o card
        paddingVertical: 20,
        backgroundColor: '#f8f9fa', 
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 18, 
        alignItems: 'center',
        shadowColor: '#5847E3', // Cor do PagInicial
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    statNumber: {
        fontSize: 22, 
        fontWeight: '900', 
        color: '#2c3e50',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 13, 
        color: '#7f8c8d',
        marginTop: 4,
        fontWeight: '600',
    },
    // --- Grouped Sections (Info, Notif, Options) ---
    sectionTitle: {
        fontSize: 20, 
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    // Card Agrupador
    infoSection: {
        backgroundColor: '#fff',
        marginTop: 16,
        borderRadius: 15,
        marginHorizontal: 16,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    notificationSection: {
        backgroundColor: '#fff',
        marginTop: 16,
        borderRadius: 15,
        marginHorizontal: 16,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    optionsSection: {
        backgroundColor: '#fff',
        marginTop: 16,
        borderRadius: 15,
        marginHorizontal: 16,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 100, 
    },
    // --- Individual Rows ---
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20, 
        paddingVertical: 18, 
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    infoIconContainer: {
        width: 30, 
        alignItems: 'flex-start',
    },
    infoContent: {
        flex: 1,
        marginLeft: 16,
    },
    infoLabel: {
        fontSize: 14,
        color: '#2c3e50',
        fontWeight: '700',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    editButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#f0edff', 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    editButtonText: {
        color: '#5847E3', // Cor principal do PagInicial
        fontSize: 12,
        fontWeight: '700',
    },
    // --- Notifications Rows ---
    notificationCard: {
        padding: 0,
        paddingTop: 4,
    },
    notificationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    notificationLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 16,
    },
    notificationLabel: {
        fontSize: 15, 
        color: '#2c3e50',
        fontWeight: '500',
    },
    // --- Options Rows ---
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
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
    bottomSpacing: {
        height: 20,
    },
});
