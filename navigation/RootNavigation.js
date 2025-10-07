import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import EsquecerSenha from "../screens/EsquecerSenha";
import Perfil from "../screens/Perfil";
import FiltragemAvancada from "../screens/FiltragemAvancanda";
import ParticiparEvento from "../screens/ParticiparEvento";
import PaginaPagamentos from "../screens/PaginaPagamentos";
import PagInicial from "../screens/PagInicial";
import EventosAbertos from "../screens/EventosAbertos";
import MeusEventos from "../screens/MeusEventos";
import Pesquisa from "../screens/Pesquisa";
import PaginaQrCode from "../screens/PaginaQrCode";
import Chat from "../screens/Chat"
import Comentario from "../screens/Comentario"
import GrupoScreen from "../screens/GrupoScreen";

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="PagInicial"
      >
        <Stack.Screen name="Login" component={Login}></Stack.Screen>
        <Stack.Screen name="Cadastro" component={Cadastro}></Stack.Screen>
        <Stack.Screen name="EsquecerSenha" component={EsquecerSenha}></Stack.Screen>
        <Stack.Screen name="Perfil" component={Perfil}></Stack.Screen>
        <Stack.Screen name="PagInicial" component={PagInicial}></Stack.Screen>

        <Stack.Screen name="ParticiparEvento" component={ParticiparEvento}></Stack.Screen>
        <Stack.Screen name="PaginaPagamentos" component={PaginaPagamentos}></Stack.Screen>
        <Stack.Screen name="PaginaQrCode" component={PaginaQrCode}></Stack.Screen>

        <Stack.Screen name="Comentario" component={Comentario}></Stack.Screen>
        <Stack.Screen name="Chat" component={Chat}></Stack.Screen>
        <Stack.Screen name="GrupoScreen" component={GrupoScreen}></Stack.Screen>

        <Stack.Screen name="FiltragemAvancada" component={FiltragemAvancada}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;