import { useState } from "react";
import {
  VStack,
  Text,
  Center,
  Pressable,
  HStack,
  Select,
  useToast,
  Image,
  ScrollView,
  useTheme,
} from "native-base";

import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Header } from "@components/Header";
import { Button } from "@components/Button";
import { Input } from "@components/Input";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";

import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MapView from "react-native-maps";
import { storageRecordSave } from "@storage/storageRecord";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationRouteProps } from "@routes/app.routes";

const recordSchema = yup.object({
  type: yup.string().required("Tipo obrigatório"),
  description: yup.string().required("Descrição obrigatória"),
  address: yup.string().required("Endereço obrigatório"),
});

type RecordFormData = {
  type: string;
  description: string;
  address: string;
};

export function NewRecord() {
  const [isLoading, setIsLoading] = useState(false);
  const navigator = useNavigation<AppNavigationRouteProps>();
  const [image, setImage] = useState("");
  const [showMap, setShowMap] = useState(false);
  const toast = useToast();
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecordFormData>({
    resolver: yupResolver(recordSchema),
  });

  async function handleSubmitRecord(form: RecordFormData) {
    try {
      setIsLoading(true);
      const created_at = new Date().toLocaleDateString("pt-BR");
      await storageRecordSave({
        id: uuid.v4(),
        ...form,
        image,
        created_at,
        status: 0,
      });
      toast.show({
        title: "Registro salvo com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      navigator.navigate("records");
    } catch (error) {
      toast.show({
        title: "Erro ao salvar o registro. Tente novamente mais tarde.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePickPhoto() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [16, 9],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        );

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: "A imagem deve ter no máximo 5MB",
            placement: "top",
            bgColor: "red.500",
          });
        }
        setImage(photoSelected.assets[0].uri);
      }
    } catch (error) {
      toast.show({
        title:
          "Erro ao selecionar a imagem. Tente novamente mais tarde ou com uma nova image.",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <VStack flex={1}>
      {showMap ? (
        <VStack>
          <Pressable
            _pressed={{
              opacity: 0.5,
            }}
            onPress={() => setShowMap(false)}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={40}
              color={colors.gray[500]}
            />
          </Pressable>
          <MapView
            initialRegion={{
              latitude: -12.2522,
              longitude: -38.9524,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </VStack>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} px={10}>
          <Center my={4}>
            <Header title="Nova Ocorrência" />
          </Center>
          <Text color="green.600">Tipo de ocorrência</Text>
          <Controller
            control={control}
            name="type"
            defaultValue="Poluição do ar"
            render={({ field: { onChange, value } }) => (
              <Select
                bg="gray.100"
                borderRadius="xl"
                h={"12"}
                px={4}
                fontSize="md"
                fontFamily="body"
                borderWidth="0"
                placeholder="Selecione"
                placeholderTextColor={"gray.300"}
                _selectedItem={{
                  bg: "gray.200",
                  borderWidth: 1,
                  borderRadius: "xl",
                  borderColor: "green.500",
                }}
                selectedValue={value}
                onValueChange={onChange}
              >
                <Select.Item label="Poluição do ar" value="Poluição do ar" />
                <Select.Item
                  label="Poluição da água"
                  value="Poluição da água"
                />
                <Select.Item
                  label="Desmatamento e degradação de florestas"
                  value="Descarte incorreto de lixo"
                />
                <Select.Item
                  label="Pesca predatória"
                  value="Pesca predatória"
                />
                <Select.Item
                  label="Contaminação do solo"
                  value="Contaminação do solo"
                />
                <Select.Item
                  label="Mudanças climáticas"
                  value="Mudanças climáticas"
                />
              </Select>
            )}
          />
          {errors.type?.message && (
            <Text color="red.500" fontSize="xs" mb={4}>
              {errors.type?.message}
            </Text>
          )}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                title="O que você vê?"
                multiline
                numberOfLines={4}
                h={32}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.description?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <Input
                title="Informe o endereço"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.address?.message}
              />
            )}
          />
          <HStack justifyContent="space-evenly" mb={5}>
            <Center
              borderRightWidth={2}
              borderRightColor="grey.700"
              width="50%"
            >
              <Text
                textAlign="center"
                color="green.800"
                fontWeight="bold"
                fontSize="lg"
              >
                {"Capturar \n Localização"}
              </Text>
              <Pressable
                onPress={() => setShowMap(true)}
                _pressed={{
                  opacity: 0.5,
                }}
              >
                <Entypo name="location" size={80} color="black" />
              </Pressable>
            </Center>

            <Center width="50%">
              <Text color="green.800" fontWeight="bold" fontSize="lg">
                {"Adicionar\nimagem"}
              </Text>
              <Pressable
                onPress={handlePickPhoto}
                _pressed={{
                  opacity: 0.5,
                }}
              >
                <MaterialCommunityIcons
                  name="image-plus"
                  size={80}
                  color="black"
                />
              </Pressable>
            </Center>
          </HStack>

          <Center flex={1} mb={"16"} justifyContent={"flex-end"}>
            {image && (
              <HStack
                alignItems="center"
                width="full"
                justifyContent="space-between"
                borderWidth={2}
                borderColor="green.600"
                borderRadius="xl"
                padding="2"
                mb="4"
              >
                <Image
                  source={{ uri: image }}
                  size={20}
                  alt="Imagem da ocorrência"
                />
                <Pressable
                  flexDirection="row"
                  alignItems="center"
                  onPress={() => setImage("")}
                  _pressed={{ opacity: 0.5 }}
                >
                  <Text color="red.500">Deletar</Text>
                  <MaterialCommunityIcons
                    name="delete"
                    size={40}
                    color={colors.red[500]}
                  />
                </Pressable>
              </HStack>
            )}
            <Button
              onPress={handleSubmit(handleSubmitRecord)}
              isLoading={isLoading}
              w="full"
              title="Enviar nova ocorrência"
            />
          </Center>
        </ScrollView>
      )}
    </VStack>
  );
}
