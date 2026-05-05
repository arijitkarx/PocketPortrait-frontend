<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  export let budget: { category: string; limitAmount: number } | null = null;

  let category = budget?.category || 'Food';
  let limitAmount = budget?.limitAmount?.toString() || '';
  let isSaving = false;
  let error = '';

  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Education', 'Other'];

  async function submitBudget() {
    if (!category || !limitAmount) {
      error = 'Please provide a category and limit';
      return;
    }

    isSaving = true;
    error = '';

    try {
      const response = await fetch(`${API_BASE}/api/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include',
        body: JSON.stringify({ category, limitAmount: Number(limitAmount) }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to save budget');
      }
      dispatch('save', data);
    } catch (saveError) {
      error = saveError instanceof Error ? saveError.message : 'Unable to save budget';
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
  <div class="surface w-full max-w-md p-6 shadow-2xl shadow-slate-950/60">
    <div class="mb-5 flex items-center justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.25em] text-slate-400">Budget</p>
        <h2 class="text-2xl font-bold text-white">Set your monthly budget</h2>
      </div>
      <button class="text-2xl text-slate-400 hover:text-white" aria-label="Close" on:click={() => dispatch('close')}>×</button>
    </div>

    <div class="space-y-4">
      {#if error}
        <div class="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>
      {/if}
      <select class="input-field" bind:value={category}>
        {#each categories as item}
          <option value={item}>{item}</option>
        {/each}
      </select>
      <input class="input-field" type="number" bind:value={limitAmount} placeholder="Limit amount" />
      <div class="flex gap-3">
        <button class="btn-secondary flex-1" type="button" on:click={() => dispatch('close')}>Cancel</button>
        <button class="btn-primary flex-1" type="button" on:click={submitBudget} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save budget'}</button>
      </div>
    </div>
  </div>
</div>
