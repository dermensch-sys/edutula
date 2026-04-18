// Authentication and User Management System
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
    dailyGoal: number; // minutes per day
  };
  profile: {
    level: string; // 'beginner', 'intermediate', 'advanced'
    interests: string[];
    goals: string[];
    studyTime: number; // preferred study time in minutes
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  interests: string[];
  level: string;
  goals: string[];
}

export class AuthService {
  private currentUser: User | null = null;
  private authListeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.loadUserFromStorage();
    this.initializeAdminUser();
  }

  private initializeAdminUser(): void {
    const ADMIN_EMAIL = 'dermensch@mail.ru';
    const users = this.getAllUsers();
    const adminUser = users.find(u => u.email === ADMIN_EMAIL);

    if (!adminUser) {
      const newAdminUser: User = {
        id: this.generateUserId(),
        email: ADMIN_EMAIL,
        name: 'System Administrator',
        isAdmin: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          language: 'ru',
          theme: 'light',
          notifications: true,
          dailyGoal: 30
        },
        profile: {
          level: 'advanced',
          interests: [],
          goals: [],
          studyTime: 30
        }
      };

      this.saveUser(newAdminUser);
      this.savePassword(newAdminUser.id, 'admin123');
    } else if (!adminUser.isAdmin) {
      adminUser.isAdmin = true;
      this.saveUser(adminUser);
    }
  }

  // Register new user
  async register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate input
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Пароли не совпадают' };
      }

      if (data.password.length < 6) {
        return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
      }

      // Check if user already exists
      const existingUsers = this.getAllUsers();
      if (existingUsers.some(user => user.email === data.email)) {
        return { success: false, error: 'Пользователь с таким email уже существует' };
      }

      // Create new user
      const newUser: User = {
        id: this.generateUserId(),
        email: data.email,
        name: data.name,
        isAdmin: false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          language: 'ru',
          theme: 'light',
          notifications: true,
          dailyGoal: 30
        },
        profile: {
          level: data.level,
          interests: data.interests,
          goals: data.goals,
          studyTime: 30
        }
      };

      // Save user
      this.saveUser(newUser);
      this.setCurrentUser(newUser);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Ошибка при регистрации' };
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    try {
      const users = this.getAllUsers();
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        return { success: false, error: 'Пользователь не найден' };
      }

      // In a real app, you would verify the password hash
      // For demo purposes, we'll use a simple check
      const storedPassword = localStorage.getItem(`password_${user.id}`);
      if (storedPassword !== credentials.password) {
        return { success: false, error: 'Неверный пароль' };
      }

      // Update last login
      user.lastLoginAt = new Date();
      this.saveUser(user);
      this.setCurrentUser(user);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Ошибка при входе' };
    }
  }

  // Logout user
  logout(): void {
    this.setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Update user profile
  updateProfile(updates: Partial<User>): void {
    if (!this.currentUser) return;

    const updatedUser = { ...this.currentUser, ...updates };
    this.saveUser(updatedUser);
    this.setCurrentUser(updatedUser);
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  // Private methods
  private setCurrentUser(user: User | null): void {
    this.currentUser = user;
    
    if (user) {
      localStorage.setItem('currentUserId', user.id);
    } else {
      localStorage.removeItem('currentUserId');
    }

    // Notify listeners
    this.authListeners.forEach(callback => callback(user));
  }

  private saveUser(user: User): void {
    const users = this.getAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }

    localStorage.setItem('users', JSON.stringify(users));
  }

  getAllUsers(): User[] {
    try {
      const users = localStorage.getItem('users');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  private loadUserFromStorage(): void {
    try {
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) {
        const users = this.getAllUsers();
        const user = users.find(u => u.id === currentUserId);
        if (user) {
          this.currentUser = user;
        }
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    }
  }

  private generateUserId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Save password (in real app, this would be hashed)
  savePassword(userId: string, password: string): void {
    localStorage.setItem(`password_${userId}`, password);
  }

  // Set admin role for a user
  setAdminRole(email: string, isAdmin: boolean): void {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);

    if (user) {
      user.isAdmin = isAdmin;
      this.saveUser(user);

      if (this.currentUser?.email === email) {
        this.currentUser.isAdmin = isAdmin;
        this.notifyListeners();
      }
    }
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.currentUser?.isAdmin ?? false;
  }

  // Delete a user
  deleteUser(userId: string): void {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    if (this.currentUser?.id === userId) {
      this.setCurrentUser(null);
    }

    // Clean up password
    localStorage.removeItem(`password_${userId}`);
  }

  private notifyListeners(): void {
    this.authListeners.forEach(callback => callback(this.currentUser));
  }
}

// Singleton instance
export const authService = new AuthService();