// Base URL
export const BASE_URL = "https://apnavidyalay.pythonanywhere.com/apis/v1/";

// Endpoints
export const API = {
  LOGIN: `${BASE_URL}auth/login/`,
  REGISTER: `${BASE_URL}auth/register/`,
  FORGET: `${BASE_URL}auth/forget-password/`,
  RESET: `${BASE_URL}auth/reset-password/`,
  REFRESH: `${BASE_URL}auth/refresh/`,
  LOGOUT: `${BASE_URL}auth/logout/`,
  PROFILE: `${BASE_URL}user/profile/`,
  MENUS: `${BASE_URL}user/menu-list/`,
}