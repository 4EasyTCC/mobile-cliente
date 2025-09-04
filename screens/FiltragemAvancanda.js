import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
 import { useNavigation } from '@react-navigation/native'; // Descomente quando usar navegação

export default function FiltragemAvancada() {
  const navigation = useNavigation(); // Descomente quando usar navegação

  // 🔹 Estados dos filtros
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

  // 🔹 Estados para as opções dos dropdowns
  const [opcoesTipoEvento, setOpcoesTipoEvento] = useState([]);
  const [opcoesRestricaoIdade, setOpcoesRestricaoIdade] = useState([]);
  const [opcoesIngressoPago, setOpcoesIngressoPago] = useState([]);

  // 🔹 Estado para controlar modais
  const [modalAberto, setModalAberto] = useState(null);

  // 🔹 Carregamento dos dados
  const [carregando, setCarregando] = useState(true);

  // 🔹 Buscar dados do banco
  useEffect(() => {
    buscarDadosFiltragem();
  }, []);

  const buscarDadosFiltragem = async () => {
    try {
      setCarregando(true);
      
      // 🔹 SIMULAÇÃO - substitua pela sua chamada real de API/banco
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados do banco de dados
      const dadosSimulados = {
        tipoEvento: ['Shows', 'Festa', 'Teatro', 'Esporte', 'Conferência'],
        restricaoIdade: ['Livre', '16', '18', '21+'],
        ingressoPago: ['R$0,01', 'R$10,00', 'R$25,00', 'R$50,00', 'R$100,00+'],
        filtrosIniciais: {
          usarLocalizacao: false,
          distancia: 5,
          tipoEvento: 'Shows',
          restricaoIdade: '18',
          ingressoPago: 'R$0,01',
          opcaoVip: false,
          combosDisponiveis: false,
          comidaBebida: false,
          horario: '10:00',
          duracao: '1h30'
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

  // 🔹 Atualizar filtro
  const atualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // 🔹 Aplicar filtros
  const aplicarFiltros = () => {
    console.log('Filtros aplicados:', filtros);
    navigation.navigate('PagInicial', { filtros });
  };

  // 🔹 Voltar
  const voltarTela = () => {
    console.log('Voltando...');
     navigation.goBack();
  };

  // 🔹 Abrir modal de seleção
  const abrirModal = (tipo) => {
    setModalAberto(tipo);
  };

  // 🔹 Selecionar opção do modal
  const selecionarOpcao = (tipo, opcao) => {
    atualizarFiltro(tipo, opcao);
    setModalAberto(null);
  };

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Carregando filtros...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/Logo oficial.png')} style={styles.logo} />
        <TouchableOpacity>
          <Icon name="account-circle-outline" size={32} color="#4B5EFC" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Seção de Distância */}
        <Text style={styles.sectionTitle}>Distância de você</Text>
        
        <CheckboxItem 
          label="Utilizar localização" 
          value={filtros.usarLocalizacao} 
          onChange={(value) => atualizarFiltro('usarLocalizacao', value)} 
        />

        <Text style={styles.distanceLabel}>Até {filtros.distancia}Km</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={1}
          minimumTrackTintColor="#4B5EFC"
          maximumTrackTintColor="#E5E5E5"
          thumbTintColor="#4B5EFC"
          value={filtros.distancia}
          onValueChange={(value) => atualizarFiltro('distancia', value)}
        />

        {/* Dropdowns */}
        <DropdownItem 
          label="Tipo de evento" 
          value={filtros.tipoEvento}
          onPress={() => abrirModal('tipoEvento')}
        />
        
        <CheckboxItem 
          label="Restrição de idade" 
          value={false}
          rightContent={
            <TouchableOpacity 
              style={styles.ageButton}
              onPress={() => abrirModal('restricaoIdade')}
            >
              <Text style={styles.ageText}>{filtros.restricaoIdade}</Text>
              <Icon name="chevron-down" size={16} color="#4B5EFC" />
            </TouchableOpacity>
          }
        />

        <CheckboxItem 
          label="Ingresso pago" 
          value={false}
          rightContent={
            <TouchableOpacity 
              style={styles.priceButton}
              onPress={() => abrirModal('ingressoPago')}
            >
              <Text style={styles.priceText}>{filtros.ingressoPago}</Text>
              <Icon name="chevron-down" size={16} color="#4B5EFC" />
            </TouchableOpacity>
          }
        />

        {/* Checkboxes */}
        <CheckboxItem 
          label="Opção VIP disponível" 
          value={filtros.opcaoVip} 
          onChange={(value) => atualizarFiltro('opcaoVip', value)} 
        />
        
        <CheckboxItem 
          label="Combos disponíveis" 
          value={filtros.combosDisponiveis} 
          onChange={(value) => atualizarFiltro('combosDisponiveis', value)} 
        />
        
        <CheckboxItem 
          label="Comida/Bebida à venda" 
          value={filtros.comidaBebida} 
          onChange={(value) => atualizarFiltro('comidaBebida', value)} 
        />

        {/* Horário e Duração */}
        <View style={styles.timeRow}>
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>Horário</Text>
            <TextInput 
              style={styles.timeInput}
              value={filtros.horario}
              onChangeText={(value) => atualizarFiltro('horario', value)}
            />
          </View>
          
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>Duração</Text>
            <TextInput 
              style={styles.timeInput}
              value={filtros.duracao}
              onChangeText={(value) => atualizarFiltro('duracao', value)}
            />
          </View>
        </View>
      </View>

      {/* Botões fixos no rodapé */}
      <View style={styles.footer}>
        <LinearGradient 
          colors={['#4525a4', '#1868fd']} 
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.button}
        >
          <TouchableOpacity 
            style={styles.buttonTouchable}
            onPress={aplicarFiltros}
          >
            <Text style={styles.buttonText}>Aplicar filtros</Text>
          </TouchableOpacity>
        </LinearGradient>
        
        <LinearGradient 
          colors={['#4525a4', '#1868fd']} 
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.button}
        >
          <TouchableOpacity 
            style={styles.buttonTouchable}
            onPress={voltarTela}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Modal de seleção */}
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
                Selecionar {
                  modalAberto === 'tipoEvento' ? 'Tipo de Evento' :
                  modalAberto === 'restricaoIdade' ? 'Restrição de Idade' :
                  'Ingresso Pago'
                }
              </Text>
              <TouchableOpacity onPress={() => setModalAberto(null)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={
                modalAberto === 'tipoEvento' ? opcoesTipoEvento :
                modalAberto === 'restricaoIdade' ? opcoesRestricaoIdade :
                opcoesIngressoPago
              }
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => selecionarOpcao(modalAberto, item)}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Componentes auxiliares
function DropdownItem({ label, value, onPress }) {
  return (
    <TouchableOpacity style={styles.dropdownContainer} onPress={onPress}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <View style={styles.dropdownButton}>
        <Text style={styles.dropdownValue}>{value}</Text>
        <Icon name="chevron-down" size={16} color="#4B5EFC" />
      </View>
    </TouchableOpacity>
  );
}

function CheckboxItem({ label, value, onChange, rightContent }) {
  return (
    <View style={styles.checkboxRow}>
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => onChange && onChange(!value)}
      >
        <View style={[styles.checkbox, value && styles.checkboxChecked]}>
          {value && <View style={styles.checkboxDot} />}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
      {rightContent && rightContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#4B5EFC',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logo: {
    width: 50,
    height: 30,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5EFC',
    marginBottom: 15,
  },
  distanceLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    marginTop: 15,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#4B5EFC',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
  },
  dropdownValue: {
    fontSize: 14,
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#4B5EFC',
    backgroundColor: '#4B5EFC',
  },
  checkboxDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  ageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ageText: {
    fontSize: 12,
    color: '#4B5EFC',
    marginRight: 4,
  },
  priceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 12,
    color: '#4B5EFC',
    marginRight: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  timeItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  timeLabel: {
    fontSize: 14,
    color: '#4B5EFC',
    marginBottom: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#F8F9FA',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  button: {
    flex: 1,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonTouchable: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '80%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalOption: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#333',
  },
});