<script lang="ts">
  import { transactionsStore } from '$lib/stores';
  import type { Transaction } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let transaction: Partial<Transaction> | null = null;
  export let mode: 'create' | 'edit' = 'create';

  let formData = {
    amount: '',
    type: 'expense',
    category: 'Food',
    mode: 'UPI',
    source: 'manual',
    secondPartyId: '',
    notes: '',
    tags: '',
  };

  let isSubmitting = false;
  let error = '';

  $: if (transaction) {
    formData = {
      amount: transaction.amount?.toString() ?? '',
      type: transaction.type ?? 'expense',
      category: transaction.category ?? 'Food',
      mode: transaction.mode ?? 'UPI',
      source: transaction.source ?? 'manual',
      secondPartyId: transaction.secondPartyId ?? '',
      notes: transaction.notes ?? '',
      tags: Array.isArray(transaction.tags) ? transaction.tags.join(', ') : '',
    };
  }

  const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Utilities',
    'Healthcare',
    'Education',
    'Other',
  ];

  const modes = ['UPI', 'Card', 'Cash', 'Bank Transfer', 'Wallet'];

  async function handleSubmit() {
    if (!formData.amount || !formData.secondPartyId) {
      error = 'Please fill in all required fields';
      return;
    }

    isSubmitting = true;
    error = '';

    try {
      const payload = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        mode: formData.mode,
        source: formData.source,
        secondPartyId: formData.secondPartyId,
        notes: formData.notes,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      };

      if (mode === 'edit' && transaction?.id) {
        await transactionsStore.updateTransaction(transaction.id, payload);
      } else {
        await transactionsStore.addTransaction(payload);
      }

      dispatch('save');
    } catch (err) {
      error = 'Failed to create transaction';
      console.error(err);
    } finally {
      isSubmitting = false;
    }
  }

  function closeModal() {
    dispatch('close');
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<div class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <button type="button" class="absolute inset-0 bg-black/50" aria-label="Close modal" on:click={closeModal}></button>
  <div class="relative z-10 mx-4 w-full max-w-md rounded-xl bg-white shadow-2xl">
    <!-- Header -->
    <div class="flex justify-between items-center p-6 border-b border-gray-200">
      <h2 id="modal-title" class="text-2xl font-bold text-gray-900">{mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}</h2>
      <button on:click={closeModal} class="text-gray-500 hover:text-gray-700 text-2xl" aria-label="Close modal">×</button>
    </div>

    <!-- Form -->
    <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-4">
      {#if error}
        <div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      {/if}

      <!-- Type -->
      <fieldset>
        <legend class="block text-sm font-medium text-gray-900 mb-2">Type</legend>
        <div class="flex gap-4">
          <label class="flex items-center cursor-pointer">
            <input type="radio" name="type" value="expense" bind:group={formData.type} class="mr-2" />
            <span class="text-sm">Expense</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input type="radio" name="type" value="income" bind:group={formData.type} class="mr-2" />
            <span class="text-sm">Income</span>
          </label>
        </div>
      </fieldset>

      <!-- Amount -->
      <div>
        <label for="amount" class="block text-sm font-medium text-gray-900 mb-1">Amount *</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          bind:value={formData.amount}
          placeholder="0.00"
          class="input-field"
          required
        />
      </div>

      <!-- Category -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-900 mb-1">Category</label>
        <select bind:value={formData.category} class="input-field">
          {#each categories as cat}
            <option value={cat}>{cat}</option>
          {/each}
        </select>
      </div>

      <!-- Mode -->
      <div>
        <label for="mode" class="block text-sm font-medium text-gray-900 mb-1">Payment Mode</label>
        <select bind:value={formData.mode} class="input-field">
          {#each modes as mode}
            <option value={mode}>{mode}</option>
          {/each}
        </select>
      </div>

      <!-- Merchant/Party -->
      <div>
        <label for="secondPartyId" class="block text-sm font-medium text-gray-900 mb-1">
          {formData.type === 'expense' ? 'Merchant' : 'Source'} *
        </label>
        <input
          id="secondPartyId"
          type="text"
          bind:value={formData.secondPartyId}
          placeholder={formData.type === 'expense' ? 'e.g., Starbucks' : 'e.g., Salary'}
          class="input-field"
          required
        />
      </div>

      <!-- Notes -->
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-900 mb-1">Notes</label>
        <textarea
          id="notes"
          bind:value={formData.notes}
          placeholder="Add a note..."
          class="input-field resize-none h-20"
        ></textarea>
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-900 mb-1">Tags</label>
        <input
          id="tags"
          type="text"
          bind:value={formData.tags}
          placeholder="e.g., lunch, office (comma separated)"
          class="input-field"
        />
      </div>

      <!-- Buttons -->
      <div class="flex gap-3 mt-6">
        <button
          type="button"
          on:click={closeModal}
          class="flex-1 btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" class="flex-1 btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  </div>
</div>
