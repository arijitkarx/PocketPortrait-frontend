import { writable } from 'svelte/store';
import type { Transaction, User } from './types';

function safeLocalStorageGet(key: string) {
    if (typeof localStorage === 'undefined') {
        return null;
    }

    return localStorage.getItem(key);
}

function safeLocalStorageSet(key: string, value: string) {
    if (typeof localStorage === 'undefined') {
        return;
    }

    localStorage.setItem(key, value);
}

function safeLocalStorageRemove(key: string) {
    if (typeof localStorage === 'undefined') {
        return;
    }

    localStorage.removeItem(key);
}

// Auth Store
export const authStore = writable<{ token: string | null; user: User | null }>({
    token: safeLocalStorageGet('authToken'),
    user: null,
});

export function persistAuthToken(token: string | null) {
    if (token) {
        safeLocalStorageSet('authToken', token);
        return;
    }

    safeLocalStorageRemove('authToken');
}

export const darkModeStore = writable<boolean>(safeLocalStorageGet('finyo-theme') === 'dark');

export function persistTheme(isDark: boolean) {
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark);
    }

    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('finyo-theme', isDark ? 'dark' : 'light');
    }
}

// Transactions Store
function createTransactionsStore() {
    const { subscribe, set, update } = writable<Transaction[]>([]);
    const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

    return {
        subscribe,
        fetchTransactions: async () => {
            try {
                const response = await fetch(`${API_BASE}/api/transactions/transactions?page=1&limit=100`, {
                    headers: {
                        'Authorization': `Bearer ${safeLocalStorageGet('authToken')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }

                const data = await response.json();
                set(data.transactions || []);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            }
        },
        addTransaction: async (transaction: Partial<Transaction>) => {
            try {
                const response = await fetch(`${API_BASE}/api/transactions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${safeLocalStorageGet('authToken')}`,
                    },
                    body: JSON.stringify(transaction),
                });
                if (!response.ok) {
                    throw new Error('Failed to add transaction');
                }

                const newTransaction = await response.json();
                update(transactions => [newTransaction, ...transactions]);
                return newTransaction;
            } catch (error) {
                console.error('Failed to add transaction:', error);
                throw error;
            }
        },
        updateTransaction: async (id: number, transaction: Partial<Transaction>) => {
            try {
                const response = await fetch(`${API_BASE}/api/transactions/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${safeLocalStorageGet('authToken')}`,
                    },
                    body: JSON.stringify(transaction),
                });
                if (!response.ok) {
                    throw new Error('Failed to update transaction');
                }

                const updated = await response.json();
                update(transactions =>
                    transactions.map(t => (t.id === id ? updated : t))
                );
                return updated;
            } catch (error) {
                console.error('Failed to update transaction:', error);
                throw error;
            }
        },
        deleteTransaction: async (id: number) => {
            try {
                await fetch(`${API_BASE}/api/transactions/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${safeLocalStorageGet('authToken')}`,
                    },
                });
                update(transactions => transactions.filter(t => t.id !== id));
            } catch (error) {
                console.error('Failed to delete transaction:', error);
                throw error;
            }
        },
    };
}

export const transactionsStore = createTransactionsStore();

// Dashboard Store
export const dashboardStore = writable({
    totalSpent: 0,
    totalIncome: 0,
    netAmount: 0,
    savingsRate: 0,
    topCategory: '',
    categoryData: {},
    monthlyData: [],
});

export async function fetchDashboard() {
    try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${API_BASE}/api/transactions/dashboard`, {
            headers: {
                'Authorization': `Bearer ${safeLocalStorageGet('authToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard');
        }

        const data = await response.json();
        dashboardStore.set(data);
    } catch (error) {
        console.error('Failed to fetch dashboard:', error);
    }
}

// Current View Store
export const currentViewStore = writable<'landing' | 'login' | 'signup' | 'forgot' | 'dashboard' | 'transactions' | 'budgets' | 'profile'>('landing');
