<script lang="ts">
  import AddTransaction from './AddTransaction.svelte';
  import { fetchDashboard, transactionsStore } from '$lib/stores';
  import type { Transaction } from '$lib/types';
  import { onMount } from 'svelte';

  let transactions: Transaction[] = [];
  let filteredTransactions: Transaction[] = [];
  let showEditor = false;
  let editingTransaction: Transaction | null = null;
  let openMenuId: number | null = null;

  let filters = {
    startDate: '',
    endDate: '',
    tags: '',
    type: 'all',
    mode: 'all',
    category: 'all',
  };

  const unsubscribe = transactionsStore.subscribe(value => {
    transactions = value;
  });

  onMount(() => {
    transactionsStore.fetchTransactions();
    return () => unsubscribe();
  });

  $: availableCategories = Array.from(new Set(transactions.map(transaction => transaction.category).filter(Boolean))).sort();
  $: availableModes = Array.from(new Set(transactions.map(transaction => transaction.mode).filter(Boolean))).sort();
  $: filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date || transaction.createdAt || '');
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(`${filters.endDate}T23:59:59`) : null;
    const tags = filters.tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(Boolean);

    const matchesDate = (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
    const matchesType = filters.type === 'all' || transaction.type === filters.type;
    const matchesMode = filters.mode === 'all' || transaction.mode === filters.mode;
    const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
    const matchesTags = !tags.length || tags.every(tag => (transaction.tags || []).some(item => item.toLowerCase().includes(tag)));

    return matchesDate && matchesType && matchesMode && matchesCategory && matchesTags;
  });

  $: summary = {
    count: filteredTransactions.length,
    spent: filteredTransactions.filter(transaction => transaction.type === 'expense').reduce((total, transaction) => total + transaction.amount, 0),
    income: filteredTransactions.filter(transaction => transaction.type === 'income').reduce((total, transaction) => total + transaction.amount, 0),
    net: filteredTransactions.reduce((total, transaction) => total + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 0),
  };

  function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));
  }

  function formatMoney(value: number) {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(value || 0);
  }

  function clearFilters() {
    filters = {
      startDate: '',
      endDate: '',
      tags: '',
      type: 'all',
      mode: 'all',
      category: 'all',
    };
  }

  function openEditor(transaction: Transaction | null = null) {
    editingTransaction = transaction;
    showEditor = true;
    openMenuId = null;
  }

  async function handleSave() {
    showEditor = false;
    editingTransaction = null;
    openMenuId = null;
    await transactionsStore.fetchTransactions();
    await fetchDashboard();
  }

  function closeEditor() {
    showEditor = false;
    editingTransaction = null;
  }

  async function deleteTransaction(id: number) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    await transactionsStore.deleteTransaction(id);
    openMenuId = null;
    await fetchDashboard();
  }
</script>

<section class="space-y-6">
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Transactions</p>
      <h1 class="text-4xl font-bold text-white">Filtered ledger</h1>
      <p class="mt-2 text-sm text-slate-400">Use the controls below to slice the list by date, tags, type, mode, or category.</p>
    </div>
    <button class="btn-primary" on:click={() => openEditor()}>+ Add Transaction</button>
  </div>

  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <article class="card">
      <p class="text-sm text-slate-400">Transactions</p>
      <p class="mt-2 text-3xl font-black text-white">{summary.count}</p>
      <p class="mt-2 text-sm text-slate-400">matching your filters</p>
    </article>
    <article class="card">
      <p class="text-sm text-slate-400">Expense total</p>
      <p class="mt-2 text-3xl font-black text-rose-400">₹{formatMoney(summary.spent)}</p>
      <p class="mt-2 text-sm text-slate-400">{filteredTransactions.filter(transaction => transaction.type === 'expense').length} expense entries</p>
    </article>
    <article class="card">
      <p class="text-sm text-slate-400">Income total</p>
      <p class="mt-2 text-3xl font-black text-emerald-400">₹{formatMoney(summary.income)}</p>
      <p class="mt-2 text-sm text-slate-400">{filteredTransactions.filter(transaction => transaction.type === 'income').length} income entries</p>
    </article>
    <article class="card">
      <p class="text-sm text-slate-400">Net amount</p>
      <p class="mt-2 text-3xl font-black text-sky-400">₹{formatMoney(summary.net)}</p>
      <p class="mt-2 text-sm text-slate-400">after filters are applied</p>
    </article>
  </div>

  <div class="card space-y-4">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-xl font-bold text-white">Filters</h2>
      <button class="btn-sm border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10" type="button" on:click={clearFilters}>Reset</button>
    </div>
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      <input class="input-field" type="date" bind:value={filters.startDate} />
      <input class="input-field" type="date" bind:value={filters.endDate} />
      <input class="input-field xl:col-span-2" type="text" placeholder="Tags, comma separated" bind:value={filters.tags} />
      <select class="input-field" bind:value={filters.type}>
        <option value="all">All types</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <select class="input-field" bind:value={filters.mode}>
        <option value="all">All modes</option>
        {#each availableModes as mode}
          <option value={mode}>{mode}</option>
        {/each}
      </select>
      <select class="input-field xl:col-span-2" bind:value={filters.category}>
        <option value="all">All categories</option>
        {#each availableCategories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>
  </div>

  {#if filteredTransactions.length === 0}
    <div class="card py-16 text-center text-slate-300">
      <p class="text-lg font-medium text-white">No transactions match the current filters.</p>
      <p class="mt-2 text-sm text-slate-400">Try clearing the filters or add a new transaction.</p>
    </div>
  {:else}
    <div class="overflow-hidden rounded-3xl border border-white/10 bg-white/90 shadow-2xl shadow-slate-950/30 backdrop-blur dark:bg-slate-900/85">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead class="bg-slate-100/80 dark:bg-slate-950/60">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Category</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Type</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Amount</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Mode</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Tags</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            {#each filteredTransactions as transaction (transaction.id)}
              <tr class="relative bg-white/90 text-slate-900 transition hover:bg-slate-50 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800/80">
                <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-300">{formatDate(transaction.date || transaction.createdAt)}</td>
                <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{transaction.category}</td>
                <td class="px-6 py-4 text-sm">
                  <span class={transaction.type === 'expense' ? 'badge bg-rose-500/15 text-rose-600 dark:text-rose-300' : 'badge bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'}>
                    {transaction.type}
                  </span>
                </td>
                <td class={transaction.type === 'expense' ? 'px-6 py-4 text-sm font-bold text-rose-500' : 'px-6 py-4 text-sm font-bold text-emerald-500'}>
                  {transaction.type === 'expense' ? '-' : '+'}₹{formatMoney(transaction.amount)}
                </td>
                <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{transaction.mode}</td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex flex-wrap gap-2">
                    {#each transaction.tags || [] as tag}
                      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200">{tag}</span>
                    {/each}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm">
                  <div class="relative inline-block text-left">
                    <button
                      type="button"
                      class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl leading-none text-slate-500 transition hover:border-indigo-500 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                      on:click={() => (openMenuId = openMenuId === transaction.id ? null : transaction.id)}
                    >
                      ⋯
                    </button>
                    {#if openMenuId === transaction.id}
                      <div class="absolute right-0 z-20 mt-3 w-72 rounded-3xl border border-white/10 bg-slate-950 p-4 text-slate-100 shadow-2xl shadow-slate-950/60">
                        <div class="space-y-3">
                          <div>
                            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">{transaction.type}</p>
                            <h3 class="mt-1 text-lg font-bold text-white">{transaction.category}</h3>
                            <p class="text-sm text-slate-400">{transaction.mode} · {formatDate(transaction.date || transaction.createdAt)}</p>
                          </div>
                          <div class="rounded-2xl bg-white/5 p-3 text-sm text-slate-300">
                            {transaction.notes || 'No notes available'}
                          </div>
                          <button class="btn-secondary w-full" type="button" on:click={() => openEditor(transaction)}>Edit transaction</button>
                          <button class="w-full rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20" type="button" on:click={() => deleteTransaction(transaction.id)}>
                            Delete transaction
                          </button>
                        </div>
                      </div>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  {#if showEditor}
    <AddTransaction mode={editingTransaction ? 'edit' : 'create'} transaction={editingTransaction} on:close={closeEditor} on:save={handleSave} />
  {/if}
</section>
