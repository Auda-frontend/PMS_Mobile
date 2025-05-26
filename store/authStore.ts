import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your MockAPI.io base URL
const BASE_URL = "https://6834e461cd78db2058bfa8a2.mockapi.io/api/v1";

interface User {
  id: string;
  fullNames: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Check if user exists with this email and password
          const response = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const users = await response.json();
          const user = users.find((u: any) => u.email === email && u.password === password);
          
          if (!user) {
            set({ error: 'Invalid email or password', isLoading: false });
            return false;
          }
          
          // In a real app, you would get a token from your backend
          const mockToken = `mock-token-${Date.now()}`;
          
          set({
            user: {
              id: user.id,
              fullNames: user.fullNames,
              email: user.email,
              createdAt: user.createdAt,
            },
            isAuthenticated: true,
            token: mockToken,
            isLoading: false,
          });
          
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            error: 'Login failed. Please try again.', 
            isLoading: false 
          });
          return false;
        }
      },
      
      register: async (fullNames, email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // First check if email already exists
          const emailCheck = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
          
          if (!emailCheck.ok) {
            throw new Error('Network response was not ok');
          }
          
          const existingUsers = await emailCheck.json();
          if (existingUsers.length > 0) {
            set({ error: 'Email already in use', isLoading: false });
            return false;
          }
          
          // Create new user
          const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fullNames,
              email,
              password, // Note: In production, never store plain text passwords
              createdAt: new Date().toISOString(),
            }),
          });
          
          if (!response.ok) {
            throw new Error('Registration failed');
          }
          
          const newUser = await response.json();
          
          // In a real app, you would get a token from your backend
          const mockToken = `mock-token-${Date.now()}`;
          
          set({
            user: {
              id: newUser.id,
              fullNames: newUser.fullNames,
              email: newUser.email,
              createdAt: newUser.createdAt,
            },
            isAuthenticated: true,
            token: mockToken,
            isLoading: false,
          });
          
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          set({ 
            error: 'Registration failed. Please try again.', 
            isLoading: false 
          });
          return false;
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          error: null,
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these values
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);