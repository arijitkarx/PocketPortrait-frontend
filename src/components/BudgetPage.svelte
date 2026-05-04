<script lang="ts">
  import { onMount } from 'svelte';
  import BudgetModal from './BudgetModal.svelte';
  import type { Budget } from '$lib/types';

  let budgets: Budget[] = [];
  let alerts: Array<{ category: string; percentage: number; spent: number; limit: number; severity: string }> = [];
  let loading = true;
  let showBudgetModal = false;

  async function loadBudgets() {
    loading = true;
    try {
      const [budgetResponse, alertResponse] = await Promise.all([
        fetch('/api/budgets', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          credentials: 'include',
        }),
        fetch('/api/budgets/alerts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          credentials: 'include',
        }),
      ]);

      budgets = (await budgetResponse.json()) || [];
      alerts = (await alertResponse.json()) || [];
    } catch (error) {
      console.error('Failed to load budgets', error);
    } finally {
      loading = false;
    }
  }

  onMount(loadBudgets);
</script>

<section class="space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Budgets</p>
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Monthly budgets</h1>
    </div>
    <button class="btn-primary" on:click={() => (showBudgetModal = true)}>+ New Budget</button>
  </div>

  {#if loading}
    <div class="card">Loading budgets...</div>
  {:else}
    <div class="grid gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {#each budgets as budget}
        <article class="card space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-slate-400">{budget.month}/{budget.year}</p>
              <h2 class="text-2xl font-bold text-white">{budget.category}</h2>
            </div>
            <span class="badge">₹{budget.limitAmount}</span>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm text-slate-300">
              <span>Spent</span>
              <span>₹{budget.currentSpent}</span>
            </div>
            <div class="h-2 rounded-full bg-slate-800">
              <div class="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style="width: {Math.min((budget.currentSpent / budget.limitAmount) * 100, 100)}%"></div>
            </div>
          </div>
        </article>
      {/each}
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {#each alerts as alert}
        <div class="card border-amber-500/20 bg-amber-500/10 text-amber-100">
          <p class="text-sm uppercase tracking-[0.2em]">{alert.severity}</p>
          <h3 class="mt-2 text-xl font-bold">{alert.category}</h3>
          <p class="mt-2 text-sm">{alert.percentage}% used · ₹{alert.spent} of ₹{alert.limit}</p>
        </div>
      {/each}
    </div>
  {/if}

  {#if showBudgetModal}
    <BudgetModal on:close={() => (showBudgetModal = false)} on:save={() => { showBudgetModal = false; loadBudgets(); }} />
  {/if}
</section>
