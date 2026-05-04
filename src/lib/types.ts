export interface User {
    id: string;
    email: string;
    username?: string;
}

export interface Transaction {
    id: number;
    userId: string;
    from: string;
    to: string | null;
    fromUserId: string;
    toUserId: string | null;
    secondPartyId: string | null;
    amount: number;
    type: 'expense' | 'income';
    mode: string;
    source: 'manual' | 'api' | 'import';
    category: string;
    notes?: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    date: string;
}

export interface Budget {
    id: number;
    userId: string;
    category: string;
    limitAmount: number;
    currentSpent: number;
    month: string;
    year: number;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardData {
    totalSpent: number;
    totalIncome: number;
    netAmount: number;
    savingsRate: number;
    topCategory: string;
    topExpenseCategory: string;
    topIncomeCategory: string;
    categoryData: Record<string, number>;
    expenseCategoryData: Record<string, number>;
    incomeCategoryData: Record<string, number>;
    topPaymentMethods: string[];
    paymentMethodData: Record<string, number>;
    monthlyData: Array<{
        month: string;
        amount: number;
        expenses: number;
        income: number;
        net: number;
    }>;
    totalTransactions: number;
    expenseCount: number;
    incomeCount: number;
    avgExpense: number;
    avgIncome: number;
}
