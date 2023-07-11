import { defineStore } from 'pinia';
import { ref } from 'vue'
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: localStorage.getItem('user') || '',
    }),
    actions: {
        login(userToken: string, user: string) {
          this.token = userToken;
          this.user = user;
          localStorage.setItem('token', userToken);
          localStorage.setItem('username', user);
          axios.interceptors.request.use(
              (config) => {
                  if (this.token) {
                  config.headers['Authorization'] = `Bearer ${this.token}`;
                  }
              
                  return config;
              },
              (error) => {
                  return Promise.reject(error);
              }
            );
        },
        logout() {
          this.token = '';
          this.user = '';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        },
      },
});
