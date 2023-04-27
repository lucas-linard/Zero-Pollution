import { Header } from "@components/Header";
import { VStack, Image, Text, Box, Center, ScrollView } from "native-base";

import RecordSample1 from "@assets/RecordSample1.png";
import { StatusIndicator } from "@components/StatusIndicator";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { storageRecordFindById } from "@storage/storageRecord";
import { Loading } from "@components/Loading";
import { RecordDTO } from "@dtos/recordDTO";

export function Status() {
  const { params } = useRoute();
  const { id } = params as { id: string };
  const [isLoading, setIsLoading] = useState(true);
  const [record, setRecord] = useState({} as RecordDTO);
  
  async function fetchRecord(id: string) {
    const record =  await storageRecordFindById(id);
    setRecord(record);
    setIsLoading(false);
  }
  useFocusEffect(
    useCallback(() => {
      fetchRecord(id);
    }, [id])
  );
  return (
    
    <VStack flex={1} px={5}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title="Acompanhamento" my={5} />
        { isLoading ? (
        <Loading/>) : (
        <>
        <Center w="full">
          <Image
            alt="Imagem de denuncia"
            source={RecordSample1}
            width={343}
            height={200}
          />
        </Center>
        <Center w="full" mt={5}>
          <Text fontFamily="body" color="green.800" fontSize="2xl">
            {record.type}
          </Text>
          <Text fontFamily="body" color="green.800" fontSize="xs">
           {record.address}
          </Text>
          <Text fontFamily="body" color="green.800" fontSize="xs">
            {record.created_at}
          </Text>
        </Center>
        <Text
          numberOfLines={10}
          fontFamily="heading"
          color="green.800"
          fontSize="md"
          mt={5}
        >
          Descrição:{" "}
          <Text fontFamily="body">
            {" "}
            {record.description}
          </Text>
        </Text>
        <Center w="full" mt={5} mb={20}>
          <StatusIndicator status={record.status} />
        </Center>
        </>
        )}
      </ScrollView>
    </VStack>
  );
}
