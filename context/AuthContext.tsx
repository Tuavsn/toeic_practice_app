import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/global.type';
import { Alert } from 'react-native';
  
interface AuthContextType {
    user: User | null;
    loading: boolean;
    toggleLoading: () => void;
    login: (userInfo: User) => Promise<void>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}
  

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy thông tin đăng nhập từ AsyncStorage khi ứng dụng khởi động
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)
      try {
        const userData = await AsyncStorage.getItem('userInfo');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setLoading(false)
      }
    };
    loadUser();
  }, []);

  const login = async (userInfo: User) => {
    setLoading(true)
    setUser(userInfo);
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    Alert.alert("Đăng nhập thành công")
    setLoading(false)
  };

  const logout = async () => {
    setLoading(true)
    setUser(null);
    await AsyncStorage.removeItem('userInfo');
    Alert.alert("Đăng xuất thành công")
    setLoading(false)
  };

  const toggleLoading = () => {
    setLoading((prev) => !prev)
  }

  return (
    <AuthContext.Provider value={{ loading, toggleLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
};
