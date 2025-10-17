import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lead } from '../lib/supabase';

interface LeadsStore {
  leads: Lead[];
  filteredLeads: Lead[];
  searchQuery: string;
  selectedDisposition: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof Lead | null;
  sortDirection: 'asc' | 'desc';
  theme: 'light' | 'dark';

  setLeads: (leads: Lead[]) => void;
  addLeads: (leads: Lead[]) => void;
  updateLead: (id: string, data: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  clearAllLeads: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedDisposition: (disposition: string) => void;
  setCurrentPage: (page: number) => void;
  setSorting: (field: keyof Lead) => void;
  toggleTheme: () => void;
  filterLeads: () => void;
}

export const useLeadsStore = create<LeadsStore>()(
  persist(
    (set, get) => ({
      leads: [],
      filteredLeads: [],
      searchQuery: '',
      selectedDisposition: 'all',
      currentPage: 1,
      itemsPerPage: 50,
      sortField: null,
      sortDirection: 'asc',
      theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

      setLeads: (leads) => {
        set({ leads, filteredLeads: leads });
        get().filterLeads();
      },

      addLeads: (newLeads) => {
        const leads = [...get().leads, ...newLeads];
        set({ leads });
        get().filterLeads();
      },

      updateLead: (id, data) => {
        const leads = get().leads.map(lead =>
          lead.id === id ? { ...lead, ...data, updated_at: new Date().toISOString() } : lead
        );
        set({ leads });
        get().filterLeads();
      },

      deleteLead: (id) => {
        const leads = get().leads.filter(lead => lead.id !== id);
        set({ leads });
        get().filterLeads();
      },

      clearAllLeads: () => {
        set({ leads: [], filteredLeads: [] });
      },

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().filterLeads();
  },

  setSelectedDisposition: (disposition) => {
    set({ selectedDisposition: disposition, currentPage: 1 });
    get().filterLeads();
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  setSorting: (field) => {
    const { sortField, sortDirection } = get();
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    set({ sortField: field, sortDirection: newDirection });
    get().filterLeads();
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  filterLeads: () => {
    let filtered = [...get().leads];
    const { searchQuery, selectedDisposition, sortField, sortDirection } = get();

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.executive_first_name?.toLowerCase().includes(query) ||
        lead.company_name?.toLowerCase().includes(query) ||
        lead.phone_number?.includes(query) ||
        lead.address?.toLowerCase().includes(query)
      );
    }

    if (selectedDisposition !== 'all') {
      filtered = filtered.filter(lead => lead.disposition === selectedDisposition);
    }

    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField] || '';
        const bVal = b[sortField] || '';
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    set({ filteredLeads: filtered });
  },
    }),
    {
      name: 'leads-storage',
      partialize: (state) => ({ leads: state.leads, theme: state.theme }),
    }
  )
);
