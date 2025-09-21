import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import io from "socket.io-client";
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');
const socket = io("http://10.80.220.253:6969");

export default function Chat({ route }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [eventoInfo, setEventoInfo] = useState({
    nome: 'Chat Privado',
    organizador: ''
  });
  
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // Buscar informações do evento do backend
    const fetchEventoInfo = async () => {
      try {
        // const response = await fetch(`https://sua-api.com/eventos/${route.params?.eventoId}`);
        // const data = await response.json();
        
        const mockData = {
          nome: route.params?.nomeEvento || 'Rock Festival 2024',
          organizador: 'João Silva (Organizador)'
        };
        
        setEventoInfo(mockData);
      } catch (error) {
        console.error('Erro ao buscar info do evento:', error);
      }
    };

    fetchEventoInfo();

    // Animação de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Mensagens iniciais apenas entre organizador e usuário
    setChat([
      { 
        id: '1',
        text: 'Olá! Obrigado por se inscrever no evento. Tem alguma dúvida?', 
        sender: 'João Silva (Organizador)',
        timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
        isUser: false,
        avatar: '👨‍💼'
      },
      { 
        id: '2',
        text: 'Oi! Gostaria de saber se posso levar acompanhante.', 
        sender: 'Usuário',
        timestamp: new Date(Date.now() - 180000).toLocaleTimeString(),
        isUser: true,
        avatar: '👤'
      },
      { 
        id: '3',
        text: 'Claro! Cada inscrito pode levar até 1 acompanhante. É só avisar na entrada.', 
        sender: 'João Silva (Organizador)',
        timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
        isUser: false,
        avatar: '👨‍💼'
      }
    ]);

    // Socket listeners
    socket.on("receiveMessage", (msg) => {
      const newMessage = {
        ...msg,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        isUser: msg.sender === "Usuário",
        avatar: msg.sender === "Usuário" ? '👤' : '👨‍💼'
      };
      
      setChat((prev) => [...prev, newMessage]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    socket.on("userTyping", (data) => {
      setIsTyping(data.isTyping);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        text: message,
        sender: "Usuário",
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        isUser: true,
        avatar: '👤'
      };
      
      setChat(prev => [...prev, newMessage]);
      socket.emit("sendMessage", newMessage);
      setMessage("");
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp ? timestamp.slice(0, 5) : '';
  };

  const renderItem = ({ item, index }) => {
    const isUser = item.isUser || item.sender === "Usuário";
    const showAvatar = index === 0 || chat[index - 1]?.sender !== item.sender;
    
    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.otherMessageContainer,
          { opacity: fadeAnim }
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            {showAvatar ? (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{item.avatar || '👤'}</Text>
              </View>
            ) : (
              <View style={styles.avatarSpacer} />
            )}
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.otherBubble
        ]}>
          {!isUser && showAvatar && (
            <Text style={styles.senderName}>{item.sender}</Text>
          )}
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.otherMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.otherTimestamp
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
        
        {isUser && (
          <View style={styles.avatarContainer}>
            {showAvatar ? (
              <View style={styles.userAvatarCircle}>
                <Text style={styles.avatarText}>{item.avatar || '👤'}</Text>
              </View>
            ) : (
              <View style={styles.avatarSpacer} />
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <View style={styles.chatHeader}>
      <Text style={styles.chatTitle}>{eventoInfo.nome}</Text>
      <View style={styles.chatSubInfo}>
        <View style={styles.participantInfo}>
          <Icon name="account-group" size={14} color="rgba(255,255,255,0.8)" />
          <Text style={styles.participantCount}>
            {eventoInfo.participantes} participantes
          </Text>
        </View>
        {onlineUsers > 0 && (
          <View style={styles.onlineInfo}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>{onlineUsers} online</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <View style={styles.typingContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>👨‍💼</Text>
          </View>
        </View>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <View style={[styles.dot, { animationDelay: '0ms' }]} />
            <View style={[styles.dot, { animationDelay: '150ms' }]} />
            <View style={[styles.dot, { animationDelay: '300ms' }]} />
          </View>
          <Text style={styles.typingText}>Organizador está digitando...</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4525a4" />
      <View style={styles.container}>
        {/* Header com gradiente */}
        <LinearGradient
          colors={["#4525a4", "#1868fd"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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
              <Text style={styles.headerTitle}>Chat Privado</Text>
              <Text style={styles.headerSubtitle}>
                {eventoInfo.organizador}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.moreButton}>
              <Icon name="dots-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* KeyboardAvoidingView para subir input com teclado */}
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* Lista de mensagens */}
          <FlatList
            ref={flatListRef}
            data={chat}
            keyExtractor={(item) => item.id || item.text + Math.random()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => 
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListFooterComponent={renderTypingIndicator}
          />

          {/* Campo de input melhorado */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachButton}>
                <Icon name="plus" size={24} color="#4525a4" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={(text) => {
                  setMessage(text);
                  // Emitir evento de typing
                  socket.emit("typing", { isTyping: text.length > 0 });
                }}
                placeholder="Digite sua mensagem..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
                onFocus={() => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }}
              />
              
              <TouchableOpacity 
                onPress={sendMessage}
                style={styles.sendButtonContainer}
                disabled={!message.trim()}
              >
                <LinearGradient
                  colors={message.trim() ? ["#4525a4", "#1868fd"] : ["#ccc", "#999"]}
                  style={styles.sendButton}
                >
                  <Icon name="send" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  headerGradient: {
    paddingTop: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },

  moreButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  chatContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1,
  },

  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },

  userMessageContainer: {
    justifyContent: 'flex-end',
  },

  otherMessageContainer: {
    justifyContent: 'flex-start',
  },

  avatarContainer: {
    width: 40,
    alignItems: 'center',
  },

  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4525a4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarSpacer: {
    width: 32,
    height: 32,
  },

  avatarText: {
    fontSize: 16,
  },

  messageBubble: {
    maxWidth: screenWidth * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 8,
  },

  userBubble: {
    backgroundColor: '#4525a4',
    borderBottomRightRadius: 6,
  },

  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4525a4',
    marginBottom: 4,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },

  userMessageText: {
    color: '#fff',
  },

  otherMessageText: {
    color: '#2c3e50',
  },

  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },

  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },

  otherTimestamp: {
    color: '#7f8c8d',
  },

  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  typingBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4525a4',
    marginHorizontal: 1,
  },

  typingText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },

  inputWrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 4,
    paddingVertical: 4,
    maxHeight: 120,
  },

  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
    color: '#2c3e50',
  },

  sendButtonContainer: {
    marginLeft: 8,
  },

  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});