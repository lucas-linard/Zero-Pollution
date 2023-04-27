import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_COLLECTION } from "./storageConfig";
import { UserDTO } from "@dtos/userDTO";

export async function storageUserSave(user: UserDTO) {
  try {
    AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(user));
    return user;
  } catch (error) {
    throw error;
  }
}

export async function storageUserGet() {
  try {
    const storage = await AsyncStorage.getItem(USER_COLLECTION);
    if (storage) {
      return JSON.parse(storage);
    } else {
      console.log("storageUserGet: storage is null");
      return null;
    }
  } catch (error) {
    throw error;
  }
}
export async function storageUserLogout() {
  try {
    console.log("storageUseRemove: removing user from storage")
    const user = await storageUserGet();
    user.logged = false;
    console.log(user)
    await storageUserSave(user);

  } catch (error) {
    throw error;
  }
}
export async function storageUserLogIn(user: UserDTO) {
  try {
    user.logged = true;
    const response = await storageUserSave(user);
    return response;

  } catch (error) {
    throw error;
  }
}
