import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  sampleFamilyUser, 
  sampleCaregiverUser, 
  caregivers, 
  bookings, 
  messageThreads, 
  notifications,
  type Caregiver,
  type Booking,
  type MessageThread,
  type Notification,
  type FamilyUser,
  type CaregiverUser,
} from './mock-data';

export type UserRole = 'family' | 'caregiver' | 'admin' | null;

interface AuthState {
  role: UserRole;
  familyUser: FamilyUser | null;
  caregiverUser: CaregiverUser | null;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

interface CaregiverFilters {
  search: string;
  location: string;
  services: string[];
  minRate: number;
  maxRate: number;
  minRating: number;
  languages: string[];
  availability: string[];
  certifications: string[];
  sortBy: 'rating' | 'price-low' | 'price-high' | 'distance' | 'experience';
}

interface CaregiversState {
  caregivers: Caregiver[];
  filters: CaregiverFilters;
  setFilters: (filters: Partial<CaregiverFilters>) => void;
  resetFilters: () => void;
  getFilteredCaregivers: () => Caregiver[];
}

interface BookingsState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
}

interface MessagesState {
  threads: MessageThread[];
  markAsRead: (threadId: string) => void;
  getTotalUnread: () => number;
}

interface NotificationsState {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  activeModal: string | null;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

const defaultFilters: CaregiverFilters = {
  search: '',
  location: '',
  services: [],
  minRate: 20,
  maxRate: 70,
  minRating: 0,
  languages: [],
  availability: [],
  certifications: [],
  sortBy: 'rating',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: 'family',
      familyUser: sampleFamilyUser,
      caregiverUser: sampleCaregiverUser,
      setRole: (role) => set({ 
        role,
        familyUser: role === 'family' ? sampleFamilyUser : null,
        caregiverUser: role === 'caregiver' ? sampleCaregiverUser : null,
      }),
      logout: () => set({ role: null, familyUser: null, caregiverUser: null }),
    }),
    { name: 'auth-storage' }
  )
);

export const useCaregiversStore = create<CaregiversState>()((set, get) => ({
  caregivers: caregivers,
  filters: defaultFilters,
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
  resetFilters: () => set({ filters: defaultFilters }),
  getFilteredCaregivers: () => {
    const { caregivers, filters } = get();
    let filtered = [...caregivers];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(cg => 
        cg.name.toLowerCase().includes(searchLower) ||
        cg.bio.toLowerCase().includes(searchLower) ||
        cg.specialties.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    // Services filter
    if (filters.services.length > 0) {
      filtered = filtered.filter(cg =>
        filters.services.some(service => 
          cg.specialties.some(s => s.toLowerCase().includes(service.toLowerCase()))
        )
      );
    }

    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(cg =>
        cg.location.toLowerCase().includes(locationLower)
      );
    }

    // Rate filter
    filtered = filtered.filter(cg =>
      cg.hourlyRate >= filters.minRate && cg.hourlyRate <= filters.maxRate
    );

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(cg => cg.rating >= filters.minRating);
    }

    // Languages filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter(cg =>
        filters.languages.some(lang => cg.languages.includes(lang))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'distance':
        filtered.sort((a, b) => (a.distance || 99) - (b.distance || 99));
        break;
      case 'experience':
        filtered.sort((a, b) => b.yearsExperience - a.yearsExperience);
        break;
    }

    return filtered;
  },
}));

export const useBookingsStore = create<BookingsState>()((set) => ({
  bookings: bookings,
  addBooking: (booking) => set((state) => ({ 
    bookings: [...state.bookings, booking] 
  })),
  updateBooking: (id, updates) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, ...updates } : b)
  })),
  cancelBooking: (id) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
  })),
}));

export const useMessagesStore = create<MessagesState>()((set, get) => ({
  threads: messageThreads,
  markAsRead: (threadId) => set((state) => ({
    threads: state.threads.map(t => t.id === threadId ? { ...t, unreadCount: 0 } : t)
  })),
  getTotalUnread: () => get().threads.reduce((sum, t) => sum + t.unreadCount, 0),
}));

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  notifications: notifications,
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true }))
  })),
  getUnreadCount: () => get().notifications.filter(n => !n.isRead).length,
}));

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  activeModal: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));

// Alias for components that use useStore
export const useStore = () => {
  const authStore = useAuthStore();
  return {
    currentUser: authStore.role === 'family' ? authStore.familyUser : authStore.caregiverUser,
    setCurrentUser: (user: FamilyUser | CaregiverUser | null) => {
      if (user && 'careRecipients' in user) {
        authStore.setRole('family');
      } else if (user) {
        authStore.setRole('caregiver');
      } else {
        authStore.logout();
      }
    },
    role: authStore.role,
    setRole: authStore.setRole,
    logout: authStore.logout,
  };
};
