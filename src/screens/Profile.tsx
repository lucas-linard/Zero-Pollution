import { useState } from "react";
import {
  Center,
  Image,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from "native-base";
import { Header } from "@components/Header";

import UserProfileImg from "@assets/userPhotoDefault.png";
import { Input } from "@components/Input";
import { UserPhoto } from "@components/userPhoto";
import { Button } from "@components/Button";
import { TouchableOpacity } from "react-native";
import { useAuth } from "@hooks/useAuth";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { storageUserSave } from "@storage/storageUser";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
};

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  password: yup
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "As senhas não coincidem")
    .when("password", {
      is: (Field: any) => Field,
      then: yup
        .string()
        .nullable()
        .required("Informe a confirmação da senha.")
        .transform((value) => (!!value ? value : null)),
    }),
});

export function Profile() {
  const PHOTO_SIZE = 33;
  const toast = useToast();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const { user, updateUserProfile } = useAuth();
  const [userPhoto, setUserPhoto] = useState(user.avatar);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  async function handlePickPhoto() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
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
        await storageUserSave({ ...user, avatar: photoSelected.assets[0].uri });
        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      toast.show({
        title: "Erro ao atualizar a foto de perfil",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleUpdateProfile(form: FormDataProps) {
   // setIsUpdatingProfile(true);

    const updatedUser = user;

    if(!!form.confirm_password) {
      updatedUser.name = form.name;
      updatedUser.password = form.password;
    } else if(!!form.password) {
      updatedUser.name = form.name;
      throw new Error("Problema ao atualizar o perfil");
    } else {
      updatedUser.name = form.name;
    }
    

    try {
      await updateUserProfile(updatedUser);
      await storageUserSave(updatedUser);

      toast.show({
        title: "Perfil atualizado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      toast.show({
        title: "Erro ao atualizar o perfil",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  return (
    <VStack flex={1} bg="white" p={4}>
      <Header title="Perfil" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <Center mt={"10"}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={userPhoto ? { uri: userPhoto } : UserProfileImg}
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity style={{ marginTop: 10 }} onPress={handlePickPhoto}>
            <Text fontSize="lg" color="green.600">
              Alterar foto
            </Text>
          </TouchableOpacity>
        </Center>
        <Center mt={10}>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                errorMessage={errors?.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { value } }) => (
              <Input placeholder="E-mail" value={value} isDisabled />
            )}
          />
        </Center>
        <Center mt={10}>
          <Text color="green.600">Alterar senha</Text>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors?.password?.message}
              />
            )}
          />
          <Controller
            name="confirm_password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirmar senha"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors?.confirm_password?.message}
              />
            )}
          />
        </Center>
        <Center flex={1} justifyContent={"flex-end"}>
          <Button
            w="full"
            title="Atualizar"
            isLoading={isUpdatingProfile}
            onPress={handleSubmit(handleUpdateProfile)}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
