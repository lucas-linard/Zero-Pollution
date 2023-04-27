import {
  Center,
  HStack,
  Image,
  VStack,
  Text,
  Alert,
  useToast,
} from "native-base";

import { Input } from "@components/Input";

import Logo from "@assets/Logo.png";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { UserDTO } from "@dtos/userDTO";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { storageUserSave } from "@storage/storageUser";
import { useAuth } from "@hooks/useAuth";
import BackgroundImg from "@assets/Background.jpeg";

const signUpSchema = Yup.object({
  name: Yup.string().required("Nome obrigatório"),
  email: Yup.string()
    .required("E-mail obrigatório")
    .email("Digite um e-mail válido"),
  password: Yup.string()
    .required("Senha obrigatória")
    .min(6, "No mínimo 6 dígitos"),
    logged: Yup.boolean().default(true),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigation = useNavigation();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDTO>({
    resolver: yupResolver(signUpSchema),
  });

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleUserSignUp(user: UserDTO) {
    try {
      setIsLoading(true);
      await storageUserSave(user);
      await signIn(user.email, user.password);
      
    } catch (error) {
      toast.show({
        title: "Erro ao criar conta",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} px={10}>
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
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nome"
              autoCorrect={false}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
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
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Senha"
              secureTextEntry
              autoCorrect={false}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Button
          w="full"
          title="Criar e Acessar"
          onPress={handleSubmit(handleUserSignUp)}
          isLoading={isLoading}
        />
      </Center>
      <Center mb={"16"}>
        <Text color="gray.200">Já tem uma conta?</Text>
        <Button
          variant="outline"
          mt={2}
          w="full"
          title="Voltar para login"
          onPress={handleGoBack}
        />
      </Center>
    </VStack>
  );
}
