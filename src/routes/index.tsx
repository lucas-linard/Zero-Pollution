import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAuth } from "@hooks/useAuth";
import { Loading } from "@components/Loading";
export function Routes() {
  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.white;

//   if(isLoadingUserStorageData){
//     return <Loading/>
//   }
  const { user, isLoadingUserStorageData } = useAuth();

  if(isLoadingUserStorageData){
    return <Loading/>
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {user.logged ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}