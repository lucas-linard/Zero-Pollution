import { TouchableOpacity } from "react-native";
import { useTheme, Image, Box } from "native-base";
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import {
  DrawerActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import Logo from "@assets/Logo.png";

import { Home } from "@screens/Home";
import { Records } from "@screens/Records";
import { NewRecord } from "@screens/NewRecord";
import { Status } from "@screens/Status";
import { Profile } from "@screens/Profile";
import { useAuth } from "@hooks/useAuth";

type AppRoutes = {
  home: undefined;
  records: undefined;
  newRecord: undefined;
  status: {
    id: string;
  };
  profile: undefined;
};

export type AppNavigationRouteProps = DrawerNavigationProp<AppRoutes>;

const { Navigator, Screen } = createDrawerNavigator();
export function AppRoutes() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { signOut } = useAuth();

  return (
    <Navigator
      screenOptions={{
        headerTintColor: "transparent",
        headerStyle: {
          backgroundColor: colors.green[600],
        },
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <Ionicons name="reorder-three" size={30} color="white" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 10 }} onPress={signOut}>
            <Ionicons
              name="ios-log-out-outline"
              size={30}
              color={colors.white}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Screen name="Inicio" component={Home} />
      <Screen name="Registros" component={Records} />
      <Screen name="Novo registro" component={NewRecord} />
      <Screen name="Perfil" component={Profile} />
      <Screen
        name="status"
        component={Status}
        options={{
          drawerItemStyle: { height: 0 },
        }}
      />
    </Navigator>
  );
}
