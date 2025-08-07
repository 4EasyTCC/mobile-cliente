import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ParticiparEvento() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
      <Image source={require('../assets/Logo oficial.png')} style={styles.logo} />
        <Icon name="person-circle-outline" size={32} color="#4B4BE0" />
      </View>

      <View style={styles.searchBar}>
        <TextInput placeholder="Buscar..." style={styles.searchInput} />
        <Icon name="search" size={24} color="#4B4BE0" />
      </View>


      <View style={styles.imageSlider}>
        <TouchableOpacity>
          <Icon name="chevron-back" size={24} color="#4B4BE0" />
        </TouchableOpacity>
        <Text style={styles.imageText}>Imagens do evento</Text>
        <TouchableOpacity>
          <Icon name="chevron-forward" size={24} color="#4B4BE0" />
        </TouchableOpacity>
      </View>


      <LinearGradient
        colors={['#4B4BE0', '#6F86FF']}
        style={styles.gradientBox}
      >
        <Text style={styles.eventTitle}>Nome Do Evento</Text>
        <Text style={styles.eventDesc}>Descrição do evento</Text>

        <Text style={styles.info}>Endereço</Text>
        <Text style={styles.info}>Tipo de evento</Text>
        <Text style={styles.info}>Status do Evento:</Text>
        <Text style={styles.info}>Restrições</Text>
        <Text style={styles.info}>Horários: Começa - Acaba</Text>
      </LinearGradient>


      <View style={styles.footer}>
        <TouchableOpacity style={styles.participarButton}>
          <Text style={styles.buttonText}>Participar</Text>
        </TouchableOpacity>

        <View style={styles.precoBox}>
          <Text style={styles.precoLabel}>Preço:</Text>
          <View style={styles.precoTag}>
            <Text style={styles.tagText}>Dono do evento</Text>
          </View>
        </View>
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
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  imageSlider: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  imageText: {
    fontSize: 16,
    color: '#4B4BE0',
    fontWeight: '600',
  },
  gradientBox: {
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
  },
  participarButton: {
    backgroundColor: '#4B4BE0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  precoBox: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  precoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B4BE0',
    marginBottom: 4,
  },
  precoTag: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
});
