import { Center, VStack, Text, Image } from "native-base";

import { Header } from "@components/Header";
import { useAuth } from "@hooks/useAuth";
import Pollution from "@assets/Pollution.png";

export function Home() {
  const { signOut, user } = useAuth();

  return (
    <VStack px={10} my={24}>
      <Center justifyItems="center">
        <Header title="Zero Pollution"/>
        <Text mt={5} color="green.900" opacity={0.7} textAlign="center">
          A poluição pode ser definida, de maneira simplificada, como alterações
          no ambiente que podem provocar prejuízos aos seres vivos daquele local
          bem como aos seres humanos e suas atividades econômicas. A poluição
          pode causar alterações físicas, químicas ou biológicas no meio e pode
          ser consequência, por exemplo, da ação humana.
        </Text>
        <Image
          alt="Cidade metade poluída e metade limpa"
          source={Pollution}
          mt={8}
        />
      </Center>
    </VStack>
  );
}