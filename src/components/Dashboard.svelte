<script lang="ts">
  import { dashboardStore, fetchDashboard } from '$lib/stores';
  import { onMount } from 'svelte';

  onMount(() => {
    fetchDashboard();
  });
</script>

<div>
  <h1 class="mb-6 text-3xl font-bold text-gray-900 sm:mb-8 sm:text-4xl">Dashboard</h1>

  <!-- Stats Grid -->
  <div class="mb-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
    <div class="card">
      <p class="text-gray-600 text-sm font-medium mb-2">Total Spent</p>
      <p class="text-2xl font-bold text-red-600 sm:text-3xl">₹{$dashboardStore.totalSpent?.toLocaleString() || '0'}</p>
      <p class="text-gray-500 text-xs mt-2">{$dashboardStore.expenseCount || 0} expenses</p>
    </div>

    <div class="card">
      <p class="text-gray-600 text-sm font-medium mb-2">Total Income</p>
      <p class="text-2xl font-bold text-green-600 sm:text-3xl">₹{$dashboardStore.totalIncome?.toLocaleString() || '0'}</p>
      <p class="text-gray-500 text-xs mt-2">{$dashboardStore.incomeCount || 0} income</p>
    </div>

    <div class="card">
      <p class="text-gray-600 text-sm font-medium mb-2">Net Amount</p>
      <p class="text-2xl font-bold text-primary sm:text-3xl">₹{$dashboardStore.netAmount?.toLocaleString() || '0'}</p>
      <p class="text-gray-500 text-xs mt-2">This month</p>
    </div>

    <div class="card">
      <p class="text-gray-600 text-sm font-medium mb-2">Savings Rate</p>
      <p class="text-2xl font-bold text-blue-600 sm:text-3xl">{$dashboardStore.savingsRate?.toFixed(1) || '0'}%</p>
      <p class="text-gray-500 text-xs mt-2">Of income saved</p>
    </div>
  </div>

  <!-- Category Breakdown and Recent Transactions -->
  <div class="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
    <!-- Top Categories -->
    <div class="card">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Top Expense Categories</h2>
      <div class="space-y-3">
        {#each Object.entries($dashboardStore.expenseCategoryData || {}) as [category, amount]}
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-gray-700 font-medium">{category}</span>
              <span class="text-gray-900 font-bold">₹{amount?.toLocaleString() || '0'}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-gradient-primary h-2 rounded-full"
                style="width: {($dashboardStore.totalSpent ? (amount / $dashboardStore.totalSpent) * 100 : 0) || 0}%"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="card">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
      <div class="space-y-3">
        {#each $dashboardStore.topPaymentMethods || [] as method}
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-700 font-medium">{method}</span>
            <span class="badge bg-primary text-white">{$dashboardStore.paymentMethodData?.[method] || 0}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
