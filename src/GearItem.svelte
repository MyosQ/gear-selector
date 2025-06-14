<!-- GearItem.svelte -->
<script>
  export let item;
  export let is_selected = false;
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<div class="p-4 border rounded-xl flex flex-col w-[250px] cursor-pointer hover:shadow-md transition" on:click={() => dispatch('toggle')}>
  <img src={item.image} alt={item.name} class="w-full h-40 object-cover rounded mb-2" />
  <div class="flex-1">
    <h3 class="text-lg font-bold mb-1">{item.name}</h3>
    <p class="text-sm text-gray-600 mb-1">{item.description}</p>
    <p class="text-sm mb-1">Weight: {item.weight} kg</p>
    <input type="checkbox" bind:checked={is_selected} class="mt-2" />
  </div>
</div>

<style>
  input[type="checkbox"] {
    transform: scale(1.2);
  }
</style>
