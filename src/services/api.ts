import axios from 'axios';
import {
  LoginRequest,
  LoginResponse,
  Post,
  PostCreateRequest,
  PostUpdateRequest,
  PostListResponse,
  PostSearchParams,
  TopCoffeeBrandItem,
  WeeklyMoodItem,
  CoffeeConsumptionResponse,
  DeleteResponse
} from '../types';

const API_BASE_URL = 'https://fe-hiring-rest-api.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error: Please check your internet connection');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
);

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export const postsApi = {
  getPosts: async (params: PostSearchParams): Promise<PostListResponse> => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (post: PostCreateRequest): Promise<Post> => {
    const response = await api.post('/posts', post);
    return response.data;
  },

  updatePost: async (id: string, post: PostUpdateRequest): Promise<Post> => {
    const response = await api.patch(`/posts/${id}`, post);
    return response.data;
  },

  deletePost: async (id: string): Promise<DeleteResponse> => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  deleteAllPosts: async (): Promise<DeleteResponse> => {
    const response = await api.delete('/posts');
    return response.data;
  },
};

export const mockApi = {
  getTopCoffeeBrands: async (): Promise<TopCoffeeBrandItem[]> => {
    const response = await api.get('/mock/top-coffee-brands');
    console.log('Top coffee brands response:', response.data);
    return response.data;
  },

  getWeeklyMoodTrend: async (): Promise<WeeklyMoodItem[]> => {
    const response = await api.get('/mock/weekly-mood-trend');
    console.log('Weekly mood trend response:', response.data);
    return response.data;
  },

  getCoffeeConsumption: async (): Promise<CoffeeConsumptionResponse> => {
    const response = await api.get('/mock/coffee-consumption');
    console.log('Coffee consumption response:', response.data);
    return response.data;
  },

  getMockPosts: async (count?: number): Promise<any> => {
    const params = count ? { count } : {};
    const response = await api.get('/mock/posts', { params });
    console.log('Mock posts API response:', response.data);
    console.log('Response structure:', {
      isArray: Array.isArray(response.data),
      keys: Object.keys(response.data || {}),
      type: typeof response.data
    });
    return response.data;
  },
};

export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await api.get('/health');
  return response.data;
};