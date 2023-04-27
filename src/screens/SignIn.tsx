import { Center, HStack, Image, VStack, Text, useToast } from "native-base";

import { Input } from "@components/Input";

import Logo from "@assets/Logo.png";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationRouteProps } from "@routes/auth.routes";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import BackgroundImg from "@assets/Background.jpeg";

const signInSchema = Yup.object({
  email: Yup.string(),
  password: Yup.string(),
});

export function SignIn() {
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const { signIn: signUserIn } = useAuth();

  const navigation = useNavigation<AuthNavigationRouteProps>();

  function handleGoToSignUp() {
    navigation.navigate("signUp");
  }

  async function handleSignIn(data: any) {
    try {
      await signUserIn(data.email, data.password);
    } catch (error) {
      toast.show({
        title: "Email/senha incorretos",
        bg: "red.500",
        placement: "top",
      });
    }
  }
  return (
    <VStack flex={1} px={10} bg="green.4500">
       <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
        />
      <Center flex={1} my={24} justifyItems="center">
        <Image
          alt="Globo terrestre escrito Zero Pollution"
          source={Logo}
          mb={10}
        />
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Senha"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Button w="full" title="Acessar" onPress={handleSubmit(handleSignIn)} />
      </Center>
      <Center mb={"16"}>
        <Text color="gray.100"> Ainda não tem uma conta?</Text>
        <Button
        mt={2}
          variant="outline"
          w="full"
          title="Criar conta"
          onPress={handleGoToSignUp}
        />
      </Center>
    </VStack>
  );
}
