import { VStack, Text, Center, Image, Box, FlatList } from "native-base";

import RecordSample1 from "@assets/RecordSample1.png";
import { Header } from "@components/Header";
import { RecordCard } from "@components/RecordCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { storageRecordGet } from "@storage/storageRecord";
import { RecordDTO } from "@dtos/recordDTO";
import { AppNavigationRouteProps } from "@routes/app.routes";

export function Records() {
  const navigation = useNavigation<AppNavigationRouteProps>();
  const [records, setRecords] = useState<RecordDTO[]>([] as RecordDTO[])

  async function fetchRecords() {
    const storage = await storageRecordGet()
    setRecords(storage)
  }
  useFocusEffect(useCallback(() => {
    fetchRecords()
  },[]))

  function handleGoToRecordDetails(id: string | number[]) {
    id = id.toString()
    navigation.navigate("status",{id});
  }
  
  return (
    <VStack px={5}>
      <Center my={5}>
        <Header title="Registros"/>
      </Center>
      <Center w="full">
        <FlatList
          data={records}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecordCard
              title={item.type}
              image={item.image || RecordSample1}
              description={item.address}
              onPress={() => handleGoToRecordDetails(item.id)}
            />
          )}
          numColumns={2}
        />
      </Center>
    </VStack>
  );
}
