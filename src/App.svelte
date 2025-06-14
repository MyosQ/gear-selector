<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';
  import GearItem from './GearItem.svelte';

  let gear_items = [];
  let selected_ids = new Set();

  onMount(async () => {
    const res = await fetch('/gear.json');
    gear_items = await res.json();
  });

  const toggle_selection = (id) => {
    const new_set = new Set(selected_ids);
    new_set.has(id) ? new_set.delete(id) : new_set.add(id);
    selected_ids = new_set;
  };

  $: selected_items = gear_items.filter(item => selected_ids.has(item.id));
  $: total_weight = selected_items.reduce((sum, item) => sum + item.weight, 0);

  function grouped_by_category(items) {
    return items.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }
</script>

<main class="p-4 pb-24 space-y-6">
  <h1 class="text-2xl font-bold">🎒 Gear Selector</h1>

  <div class="flex flex-col gap-10">
    {#each Object.entries(grouped_by_category(gear_items)) as [category, items]}
      <section>
        <h2 class="text-xl font-semibold mb-2">{category}</h2>
        <div class="flex flex-wrap gap-4">
          {#each items as item}
            <GearItem {item} is_selected={selected_ids.has(item.id)} on:toggle={() => toggle_selection(item.id)} />
          {/each}
        </div>
      </section>
    {/each}
  </div>
</main>

<footer class="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md flex justify-between items-center">
  <div class="text-sm font-medium">Selected items: {selected_items.length}</div>
  <div class="text-lg font-bold">Total Weight: {total_weight} kg</div>
</footer>

<style>
  main {
    font-family: system-ui, sans-serif;
  }

  footer {
    font-family: system-ui, sans-serif;
    z-index: 50;
  }
</style>