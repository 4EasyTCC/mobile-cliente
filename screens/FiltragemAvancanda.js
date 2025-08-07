import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function FiltragemAvancada() {
  const [usarLocalizacao, setUsarLocalizacao] = useState(false);
  const [distancia, setDistancia] = useState(5);
  const [vip, setVip] = useState(false);
  const [combo, setCombo] = useState(false);
  const [comida, setComida] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Image source={require('../assets/Logo oficial.png')} style={styles.logo} resizeMode="contain"/>
        <Icon name="account-circle-outline" size={32} color="#4B4BE0" />
      </View>


      <Text style={styles.sectionTitle}>Distância de você</Text>
      <View style={styles.row}>
      <CheckBoxItem label="Utilizar localização" value={usarLocalizacao} onChange={setUsarLocalizacao} />
      </View>

      <Text style={styles.kmLabel}>Até {distancia}Km</Text>
      <Slider
        style={{ width: '100%' }}
        minimumValue={1}
        maximumValue={20}
        step={1}
        minimumTrackTintColor="#4B4BE0"
        maximumTrackTintColor="#DDD"
        thumbTintColor="#4B4BE0"
        value={distancia}
        onValueChange={(value) => setDistancia(value)}
      />

      {/* Filtros adicionais */}
      <DropDown label="Tipo de evento" value="Shows" />
      <DropDown label="Restrição de idade" value="18" />
      <DropDown label="Ingresso pago" value="R$0,01" />

      <CheckBoxItem label="Opção VIP disponível" value={vip} onChange={setVip} />
      <CheckBoxItem label="Combos disponíveis" value={combo} onChange={setCombo} />
      <CheckBoxItem label="Comida/Bebida à venda" value={comida} onChange={setComida} />


      <View style={styles.row}>
        <Text style={styles.inputLabel}>Horário</Text>
        <TextInput style={styles.timeInput} defaultValue="10:00" />
        <Text style={styles.inputLabel}>Duração</Text>
        <TextInput style={styles.timeInput} defaultValue="1h30" />
      </View>


      <View style={styles.buttonContainer}>
        <GradientButton label="Aplicar filtros" />
        <GradientButton label="Voltar" />
      </View>
    </View>
  );
}

// Componentes auxiliares

function DropDown({ label, value }) {
  return (
    <View style={styles.dropDownRow}>
      <Text style={styles.dropDownLabel}>{label}</Text>
      <View style={styles.dropDownBox}>
        <Text style={styles.dropDownText}>{value}</Text>
        <Icon name="chevron-down" size={20} color="#4B4BE0" />
      </View>
    </View>
  );
}

function CheckBoxItem({ label, value, onChange }) {
  return (
    <TouchableOpacity onPress={() => onChange(!value)} style={styles.checkboxRow}>
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Icon name="check" size={16} color="#fff" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function GradientButton({ label, onPress }) {
  return (
<TouchableOpacity style={{ backgroundColor: '#4B4BE0', padding: 12, borderRadius: 10 }}>
  <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>Aplicar filtros</Text>
</TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    color: '#4B4BE0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  kmLabel: {
    alignSelf: 'flex-start',
    fontSize: 14,
    marginBottom: 10,
    color: '#4B4BE0',
  },
  dropDownRow: {
    marginVertical: 8,
  },
  dropDownLabel: {
    fontSize: 14,
    color: '#4B4BE0',
    marginBottom: 4,
  },
  dropDownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#BBB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'space-between',
  },
  dropDownText: {
    fontSize: 14,
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4B4BE0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4B4BE0',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    color: '#4B4BE0',
    marginRight: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#BBB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 16,
    width: 80,
    fontSize: 14,
    backgroundColor: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  gradientButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
