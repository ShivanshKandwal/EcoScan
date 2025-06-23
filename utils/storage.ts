import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannedItem } from '@/types/sustainability';

const STORAGE_KEY = 'scanned_items';

export async function saveScannedItem(item: ScannedItem): Promise<void> {
  try {
    const existingItems = await getScannedItems();
    const updatedItems = [item, ...existingItems];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Failed to save scanned item:', error);
    throw error;
  }
}

export async function getScannedItems(): Promise<ScannedItem[]> {
  try {
    const items = await AsyncStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Failed to get scanned items:', error);
    return [];
  }
}

export async function deleteScannedItem(itemId: string): Promise<void> {
  try {
    const existingItems = await getScannedItems();
    const filteredItems = existingItems.filter(item => item.id !== itemId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
  } catch (error) {
    console.error('Failed to delete scanned item:', error);
    throw error;
  }
}

export async function clearAllScannedItems(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear scanned items:', error);
    throw error;
  }
}