import AsyncStorage from '@react-native-async-storage/async-storage';

import { PersistedState } from '@/types/wordle';

const STORAGE_KEY = 'infinite-wordle-state-v1';

export async function loadPersistedState() {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as PersistedState;
  } catch {
    return null;
  }
}

export async function savePersistedState(state: PersistedState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
