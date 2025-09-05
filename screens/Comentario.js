import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Comentario() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusEvento, setStatusEvento] = useState('Não Participa');
  const [comments, setComments] = useState([
    { id: '1', username: 'Usuário 1', comment: 'Comentário', rating: 3 },
    { id: '2', username: 'Usuário 2', comment: 'Comentário', rating: 5 },
  ]);
  const [newComment, setNewComment] = useState('');
  const scrollRef = useRef(null);
  const { width: screenWidth } = Dimensions.get('window');
  const navigation = useNavigation();
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

  // Handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentData = {
        id: String(comments.length + 1),
        username: 'Novo Usuário',
        comment: newComment,
        rating: 4, // Default to a 4-star rating, can be dynamic
      };
      setComments([...comments, newCommentData]);
      setNewComment(''); // Clear the input field
    }
  };

  // Render each comment in the list
  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <View style={styles.commentRating}>
        {[...Array(5)].map((_, index) => (
          <Icon
            key={index}
            name={index < item.rating ? 'star' : 'star-outline'}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
      <Text style={styles.commentText}>{item.comment}</Text>
    </View>
  );

  // Updated FlatList structure for the entire page content
  const data = [
    {
      id: 'event',
      renderItem: () => (
        <>
          {/* Header and Search */}
          <View style={styles.header}>
            <Image source={require('../assets/Logo oficial.png')} style={styles.logo} />
            <Icon name="person-circle-outline" size={32} color="#4B4BE0" />
          </View>
          <View style={styles.searchBar}>
            <TextInput placeholder="Buscar..." style={styles.searchInput} />
            <Icon name="search" size={24} color="#4B4BE0" />
          </View>

          {/* Event Carousel */}
          <LinearGradient colors={['#4f46e5', '#3b82f6']} style={styles.gradientBox}>
            <View style={styles.carouselContainer}>
              <FlatList
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                data={carouselItems}
                renderItem={({ item }) => (
                  <View key={item.id} style={[styles.carouselItem, { width: screenWidth - 60 }]}>
                    <Image source={item.image} style={styles.eventImage} resizeMode="cover" />
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
              <View style={styles.pagination}>
                {carouselItems.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.paginationDot, index === currentIndex && styles.activeDot]}
                    onPress={() => scrollToIndex(index)}
                  />
                ))}
              </View>
            </View>

            <Text style={styles.eventTitle}>Nome Do Evento</Text>
            <Text style={styles.eventDesc}>Descrição do evento</Text>
            <Text style={styles.info}>Endereço</Text>
            <Text style={styles.info}>Tipo de evento</Text>
            <Text style={styles.info}>Status do Evento: {statusEvento}</Text>
            <Text style={styles.info}>Restrições</Text>
            <Text style={styles.info}>Horários: Começa - Acaba</Text>
          </LinearGradient>
        </>
      ),
    },
    {
      id: 'comments',
      renderItem: () => (
        <>
          {/* Comments Section */}
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>Comentários</Text>
            <FlatList
              data={comments}
              renderItem={renderCommentItem}
              keyExtractor={(item) => item.id}
            />
          </View>

          {/* Add Comment Section */}
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.addCommentInput}
              placeholder="Escreva seu comentário"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
              <Text style={styles.addCommentButtonText}>Comentar</Text>
            </TouchableOpacity>
          </View>
        </>
      ),
    },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => item.renderItem()}
      contentContainerStyle={styles.container}
    />
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
  gradientBox: {
    marginTop: 20,
    borderRadius: 15,
    padding: 15,
  },
  carouselContainer: {
    marginTop: 20,
    alignItems: 'center',
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
  commentsContainer: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  commentUsername: {
    fontWeight: 'bold',
  },
  commentRating: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  addCommentContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  addCommentInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addCommentButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCommentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});