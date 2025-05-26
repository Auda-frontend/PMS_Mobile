import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock user data
const MOCK_USERS = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        // In a real app, this would be an API call
        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            isAuthenticated: true,
          });
          return true;
        }
        
        return false;
      },
      
      register: async (name, email, password) => {
        // Check if email already exists
        const existingUser = MOCK_USERS.find((u) => u.email === email);
        
        if (existingUser) {
          return false;
        }
        
        // In a real app, this would be an API call
        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
        };
        
        // Add to mock users (in a real app, this would be saved to a database)
        MOCK_USERS.push(newUser);
        
        set({
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
          isAuthenticated: true,
        });
        
        return true;
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);