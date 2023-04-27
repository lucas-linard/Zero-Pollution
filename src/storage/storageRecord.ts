import { RecordDTO } from "@dtos/recordDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RECORD_COLLECTION } from "./storageConfig";

export async function storageRecordSave(data: RecordDTO) {
  console.log(data);
  try {
    const storage = await AsyncStorage.getItem(RECORD_COLLECTION);
    if (storage) {
      const records = JSON.parse(storage);
      records.unshift(data);
      AsyncStorage.setItem(RECORD_COLLECTION, JSON.stringify(records));
      return true;
    } else if (typeof storage === "object") {
      const records = [data];
      AsyncStorage.setItem(RECORD_COLLECTION, JSON.stringify(records));
      return true;
    }
  } catch (error) {
    throw error;
  }
}

export async function storageRecordGet() {
  try {
    const storage = await AsyncStorage.getItem(RECORD_COLLECTION);
    if (storage) {
      return JSON.parse(storage);
    } else {
      console.log("storageRecordGet: storage is null");
      return null;
    }
  } catch (error) {
    throw error;
  }
}

export async function storageRecordFindById(id:string) {
    try {
      const storage = await AsyncStorage.getItem(RECORD_COLLECTION);
      if (storage) {
        const records = JSON.parse(storage);
        const record = records.find((record: RecordDTO) => record.id === id);
        return record;
      } else {
        console.log("storageRecordGet: storage is null");
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

export async function storageRecordDelete(id: string) {
    try {
        const storage = await AsyncStorage.getItem(RECORD_COLLECTION);
        if (storage) {
        const records = JSON.parse(storage);
        const newRecords = records.filter((record: RecordDTO) => record.id !== id);
        AsyncStorage.setItem(RECORD_COLLECTION, JSON.stringify(newRecords));
        return true;
        } else {
        console.log("storageRecordDelete: storage is null");
        return false;
        }
    } catch (error) {
        throw error;
    }
}
