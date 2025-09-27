import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

export default function FiltragemAvancada() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Estados dos filtros
  const [filtros, setFiltros] = useState({
    usarLocalizacao: false,
    distancia: 5,
    tipoEvento: '',
    restricaoIdade: '',
    ingressoPago: '',
    opcaoVip: false,
    combosDisponiveis: false,
    comidaBebida: false,
    horario: '10:00',
    duracao: '1h30'
  });

  // Estados para as opções dos dropdowns
  const [opcoesTipoEvento, setOpcoesTipoEvento] = useState([]);
  const [opcoesRestricaoIdade, setOpcoesRestricaoIdade] = useState([]);
  const [opcoesIngressoPago, setOpcoesIngressoPago] = useState([]);

  // Estado para controlar modais
  const [modalAberto, setModalAberto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [filtrosAplicados, setFiltrosAplicados] = useState(0);

  // Buscar dados do backend
  const buscarDadosFiltragem = async () => {
    try {
      setCarregando(true);
      
      // const response = await fetch('https://sua-api.com/filtros/opcoes');
      // const data = await response.json();
      
      const dadosSimulados = {
        tipoEvento: [
          { label: '🎵 Shows', value: 'Shows' },
          { label: '🎉 Festas', value: 'Festa' },
          { label: '🎭 Teatro', value: 'Teatro' },
          { label: '⚽ Esporte', value: 'Esporte' },
          { label: '💼 Conferência', value: 'Conferência' },
          { label: '🎨 Cultural', value: 'Cultural' }
        ],
        restricaoIdade: [
          { label: '🟢 Livre', value: 'Livre' },
          { label: '🟡 16+', value: '16' },
          { label: '🟠 18+', value: '18' },
          { label: '🔴 21+', value: '21+' }
        ],
        ingressoPago: [
          { label: '🆓 Gratuito', value: 'R$0,00' },
          { label: '💰 Até R$25', value: 'R$25,00' },
          { label: '💰 Até R$50', value: 'R$50,00' },
          { label: '💰 Até R$100', value: 'R$100,00' },
          { label: '💎 R$100+', value: 'R$100,00+' }
        ],
        filtrosIniciais: {
          usarLocalizacao: false,
          distancia: 5,
          tipoEvento: 'Shows',
          restricaoIdade: 'Livre',
          ingressoPago: 'R$0,00',
          opcaoVip: false,
          combosDisponiveis: false,
          comidaBebida: false,
          horario: '18:00',
          duracao: '2h30'
        }
      };
      
      setOpcoesTipoEvento(dadosSimulados.tipoEvento);
      setOpcoesRestricaoIdade(dadosSimulados.restricaoIdade);
      setOpcoesIngressoPago(dadosSimulados.ingressoPago);
      setFiltros(dadosSimulados.filtrosIniciais);
      
    } catch (error) {
      console.error('Erro ao buscar dados de filtragem:', error);
    } finally {
      setCarregando(false);
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

    buscarDadosFiltragem();
  }, []);

  // Contar filtros aplicados
  useEffect(() => {
    let count = 0;
    if (filtros.usarLocalizacao) count++;
    if (filtros.distancia !== 5) count++;
    if (filtros.tipoEvento && filtros.tipoEvento !== 'Shows') count++;
    if (filtros.restricaoIdade && filtros.restricaoIdade !== 'Livre') count++;
    if (filtros.ingressoPago && filtros.ingressoPago !== 'R$0,00') count++;
    if (filtros.opcaoVip) count++;
    if (filtros.combosDisponiveis) count++;
    if (filtros.comidaBebida) count++;
    if (filtros.horario !== '18:00') count++;
    if (filtros.duracao !== '2h30') count++;
    
    setFiltrosAplicados(count);
  }, [filtros]);

  const atualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const aplicarFiltros = () => {
    navigation.navigate('PagInicial', { filtros });
  };

  const limparFiltros = () => {
    setFiltros({
      usarLocalizacao: false,
      distancia: 5,
      tipoEvento: 'Shows',
      restricaoIdade: 'Livre',
      ingressoPago: 'R$0,00',
      opcaoVip: false,
      combosDisponiveis: false,
      comidaBebida: false,
      horario: '18:00',
      duracao: '2h30'
    });
  };

  const selecionarOpcao = (tipo, opcao) => {
    atualizarFiltro(tipo, opcao.value);
    setModalAberto(null);
  };

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingContent}>
          <Icon name="filter-variant" size={60} color="#4525a4" />
          <Text style={styles.loadingText}>Carregando filtros...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4525a4" />
      
      {/* Header com gradiente */}
      <LinearGradient
        colors={['#4525a4', '#1868fd']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Filtros Avançados</Text>
            <Text style={styles.headerSubtitle}>
              {filtrosAplicados} filtro{filtrosAplicados !== 1 ? 's' : ''} aplicado{filtrosAplicados !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <TouchableOpacity onPress={limparFiltros} style={styles.clearButton}>
            <Icon name="broom" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Seção de Localização */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Icon name="map-marker" size={20} color="#4525a4" />
            <Text style={styles.sectionTitle}>Localização</Text>
          </View>
          
          <View style={styles.card}>
            <SwitchItem 
              label="Usar minha localização" 
              description="Encontrar eventos próximos a você"
              value={filtros.usarLocalizacao} 
              onChange={(value) => atualizarFiltro('usarLocalizacao', value)} 
            />

            {filtros.usarLocalizacao && (
              <View style={styles.distanceSection}>
                <Text style={styles.distanceLabel}>
                  Raio de busca: {filtros.distancia} km
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={50}
                  step={1}
                  minimumTrackTintColor="#4525a4"
                  maximumTrackTintColor="#e9ecef"
                  thumbTintColor="#4525a4"
                  value={filtros.distancia}
                  onValueChange={(value) => atualizarFiltro('distancia', value)}
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>1 km</Text>
                  <Text style={styles.sliderLabel}>50 km</Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Seção de Categoria */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Icon name="tag" size={20} color="#4525a4" />
            <Text style={styles.sectionTitle}>Categoria do Evento</Text>
          </View>
          
          <View style={styles.card}>
            <DropdownItem 
              label="Tipo de evento" 
              value={filtros.tipoEvento}
              onPress={() => setModalAberto('tipoEvento')}
              icon="chevron-down"
            />
          </View>
        </Animated.View>

        {/* Seção de Restrições */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Icon name="shield-account" size={20} color="#4525a4" />
            <Text style={styles.sectionTitle}>Restrições</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Classificação etária</Text>
              <TouchableOpacity 
                style={styles.ageButton}
                onPress={() => setModalAberto('restricaoIdade')}
              >
                <Text style={styles.ageText}>{filtros.restricaoIdade}</Text>
                <Icon name="chevron-down" size={16} color="#4525a4" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Seção de Preço */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Icon name="currency-usd" size={20} color="#4525a4" />
            <Text style={styles.sectionTitle}>Preço</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Faixa de preço</Text>
              <TouchableOpacity 
                style={styles.priceButton}
                onPress={() => setModalAberto('ingressoPago')}
              >
                <Text style={styles.priceText}>{filtros.ingressoPago}</Text>
                <Icon name="chevron-down" size={16} color="#4525a4" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Seção de Extras */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Icon name="star" size={20} color="#4525a4" />
            <Text style={styles.sectionTitle}>Extras</Text>
          </View>
          
          <View style={styles.card}>
            <SwitchItem 
              label="Opção VIP disponível" 
              description="Eventos com ingressos VIP"
              value={filtros.opcaoVip} 
              onChange={(value) => atualizarFiltro('opcaoVip', value)} 
            />
            
            <SwitchItem 
              label="Combos disponíveis" 
              description="Pacotes com desconto"
              value={filtros.combosDisponiveis} 
              onChange={(value) => atualizarFiltro('combosDisponiveis', value)} 
            />
            
            <SwitchItem 
              label="Comida e bebida" 
              description="Venda de alimentação no local"
              value={filtros.comidaBebida} 
              onChange={(value) => atualizarFiltro('comidaBebida', value)} 
            />
          </View>
        </Animated.View>

        {/* Seção de Horário */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Icon name="clock" size={20} color="#4525a4" />
            <Text style={styles.sectionTitle}>Horário</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.timeRow}>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Horário de início</Text>
                <TextInput 
                  style={styles.timeInput}
                  value={filtros.horario}
                  onChangeText={(value) => atualizarFiltro('horario', value)}
                  placeholder="00:00"
                />
              </View>
              
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Duração estimada</Text>
                <TextInput 
                  style={styles.timeInput}
                  value={filtros.duracao}
                  onChangeText={(value) => atualizarFiltro('duracao', value)}
                  placeholder="0h00"
                />
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Botões fixos melhorados */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={limparFiltros}
        >
          <Icon name="refresh" size={20} color="#4525a4" />
          <Text style={styles.secondaryButtonText}>Limpar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={aplicarFiltros}
        >
          <LinearGradient 
            colors={['#4525a4', '#1868fd']} 
            style={styles.primaryGradient}
          >
            <Icon name="check" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>
              Aplicar {filtrosAplicados > 0 ? `(${filtrosAplicados})` : ''}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Modal melhorado */}
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
                {modalAberto === 'tipoEvento' ? 'Escolha o tipo' :
                 modalAberto === 'restricaoIdade' ? 'Classificação etária' :
                 'Faixa de preço'}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalAberto(null)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={
                modalAberto === 'tipoEvento' ? opcoesTipoEvento :
                modalAberto === 'restricaoIdade' ? opcoesRestricaoIdade :
                opcoesIngressoPago
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

// Componentes auxiliares melhorados
function DropdownItem({ label, value, onPress, icon = "chevron-down" }) {
  return (
    <TouchableOpacity style={styles.dropdownContainer} onPress={onPress}>
      <View style={styles.dropdownContent}>
        <Text style={styles.dropdownLabel}>{label}</Text>
        <Text style={styles.dropdownValue}>{value}</Text>
      </View>
      <Icon name={icon} size={20} color="#4525a4" />
    </TouchableOpacity>
  );
}

function SwitchItem({ label, description, value, onChange }) {
  return (
    <View style={styles.switchContainer}>
      <TouchableOpacity 
        style={styles.switchContent}
        onPress={() => onChange(!value)}
      >
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>{label}</Text>
          {description && (
            <Text style={styles.switchDescription}>{description}</Text>
          )}
        </View>
        <View style={[styles.switch, value && styles.switchActive]}>
          <View style={[styles.switchThumb, value && styles.switchThumbActive]} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

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

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },

  clearButton: {
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

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  switchContainer: {
    marginBottom: 16,
  },

  switchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  switchInfo: {
    flex: 1,
    marginRight: 16,
  },

  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },

  switchDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },

  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    padding: 2,
  },

  switchActive: {
    backgroundColor: '#4525a4',
  },

  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },

  distanceSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },

  distanceLabel: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  slider: {
    width: '100%',
    height: 40,
  },

  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: -8,
  },

  sliderLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },

  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },

  dropdownContent: {
    flex: 1,
  },

  dropdownLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },

  dropdownValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  filterLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },

  ageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },

  ageText: {
    fontSize: 14,
    color: '#4525a4',
    fontWeight: '600',
  },

  priceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },

  priceText: {
    fontSize: 14,
    color: '#4525a4',
    fontWeight: '600',
  },

  timeRow: {
    flexDirection: 'row',
    gap: 16,
  },

  timeItem: {
    flex: 1,
  },

  timeLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '600',
  },

  timeInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 20,
  },

  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    gap: 12,
  },

  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },

  secondaryButtonText: {
    color: '#4525a4',
    fontSize: 16,
    fontWeight: '600',
  },

  primaryButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },

  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },

  modalOptionSelected: {
    backgroundColor: '#f8f9fa',
  },

  modalOptionText: {
    fontSize: 16,
    color: '#2c3e50',
  },

  modalOptionTextSelected: {
    color: '#4525a4',
    fontWeight: '600',
  },
});