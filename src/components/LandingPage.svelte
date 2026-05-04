<script lang="ts">
  import { currentViewStore } from '$lib/stores';

  const highlights = [
    {
      title: 'Fast tracking',
      text: 'Capture expenses, income, and budgets in a clean, focused workspace.',
    },
    {
      title: 'Live insights',
      text: 'See totals, trends, and category pressure at a glance as filters change.',
    },
    {
      title: 'Secure access',
      text: 'Use email, password, or Google to get in quickly and keep your data synced.',
    },
  ];
</script>

<section class="min-h-screen overflow-y-auto text-slate-100">
  <div class="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12 lg:px-12">
    <div class="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="space-y-8">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-lg backdrop-blur">
          <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
          Finyo helps you stay ahead of every rupee
        </div>

        <div class="space-y-5">
          <h1 class="max-w-3xl text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Beautiful money tracking for people who want clarity, not clutter.
          </h1>
          <p class="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            A polished finance workspace inspired by your ledger flow, built for transactions, budgets,
            profile management, and quick sign-in across web and mobile.
          </p>
        </div>

        <div class="flex flex-wrap gap-4">
          <button class="btn-primary" on:click={() => currentViewStore.set('login')}>Sign in</button>
          <button class="btn-secondary" on:click={() => currentViewStore.set('signup')}>Create account</button>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          {#each highlights as item}
            <article class="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
              <h2 class="mb-2 text-base font-semibold text-white">{item.title}</h2>
              <p class="text-sm leading-6 text-slate-300">{item.text}</p>
            </article>
          {/each}
        </div>
      </div>

      <div class="surface relative overflow-hidden p-6 shadow-2xl shadow-indigo-950/40">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-violet-500/20"></div>
        <div class="relative space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400">Monthly overview</p>
              <h2 class="text-2xl font-bold text-white">Finyo dashboard</h2>
            </div>
            <div class="rounded-2xl bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              Live
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-2xl bg-slate-950/70 p-4">
              <p class="text-sm text-slate-400">Spent</p>
              <p class="mt-2 text-2xl font-bold text-rose-400">₹12,000</p>
            </div>
            <div class="rounded-2xl bg-slate-950/70 p-4">
              <p class="text-sm text-slate-400">Income</p>
              <p class="mt-2 text-2xl font-bold text-emerald-400">₹35,000</p>
            </div>
            <div class="rounded-2xl bg-slate-950/70 p-4">
              <p class="text-sm text-slate-400">Net</p>
              <p class="mt-2 text-2xl font-bold text-sky-400">₹23,000</p>
            </div>
            <div class="rounded-2xl bg-slate-950/70 p-4">
              <p class="text-sm text-slate-400">Savings</p>
              <p class="mt-2 text-2xl font-bold text-violet-400">65.7%</p>
            </div>
          </div>

          <div class="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
            <div class="flex items-center justify-between text-sm text-slate-300">
              <span>Food</span>
              <span>₹6,000</span>
            </div>
            <div class="mt-3 h-2 rounded-full bg-slate-800">
              <div class="h-2 w-[78%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"></div>
            </div>
            <div class="mt-4 flex items-center justify-between text-sm text-slate-300">
              <span>UPI</span>
              <span>8 payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
