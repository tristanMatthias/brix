import { CONFIG } from '../config';

export const clearLocalToken = () =>
  localStorage.removeItem(CONFIG.localStorageTokenKey);

export const getLocalToken = () =>
  localStorage.getItem(CONFIG.localStorageTokenKey);

export const setLocalToken = (token: string) =>
  localStorage.setItem(CONFIG.localStorageTokenKey, token);


export const getEmail = () =>
  localStorage.getItem(CONFIG.localStorageEmailKey);

export const setEmail = (email: string) =>
  localStorage.setItem(CONFIG.localStorageEmailKey, email);

