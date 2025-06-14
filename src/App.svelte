<!-- App.svelte -->
<script>
  import GearItem from './GearItem.svelte';
  import { onMount } from 'svelte';
  import { format_weight } from './lib/utils.js';

  let gear_items = $state([]);
  let selected_ids = $state(new Set());
  let number_of_persons = $state(2);
  let number_of_days = $state(3);
  let input_json_url = '/gear.json';

  onMount(() => {
    fetch(input_json_url)
      .then((res) => res.json())
      .then((data) => {
        gear_items = data;

        gear_items.forEach(item => {
          if (item.selected) {
            selected_ids.add(item.id);
          }
        });
      });
  });

  function toggle_selection(id) {
    selected_ids = new Set(
      selected_ids.has(id)
        ? [...selected_ids].filter((i) => i !== id)
        : [...selected_ids, id]
    );
  }

  function selected_items() {
    return gear_items.filter((item) => selected_ids.has(item.id));
  }

  function total_weight() {
    return selected_items().reduce((sum, item) => sum + item.weight, 0);
  }

  function grouped_by_category(items) {
    return items.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }

  function format_category_name(name) {
    if (!name) return '';
    name = name.replace(/-/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }


</script>

<main class="main-container">
  <h1 class="title">🎒 Gear Selector for
    <input
      type="number"
      min="1"
      max="10"
      bind:value={number_of_persons}
      class="number-persons-input" />
    person{number_of_persons > 1 ? 's' : ''}
    on a
    <input
      type="number"
      min="1"
      max="100"
      bind:value={number_of_days}
      class="number-persons-input" />
    day trip
  </h1>

  <div class="food-container">
    <!-- add food. xg per day times number of days -->
  </div>
  <div class="clothes-container">
    <!-- Placeholder for clothes items if needed -->
    </div>
  <div class="gear-container">
    {#if gear_items.length === 0}
      <p>Loading...</p>
    {:else}
      {#each Object.entries(grouped_by_category(gear_items)) as [category, grouped_items]}
        <section class="gear-category">
          <h2 class="category-title">{format_category_name(category)}</h2>
          <div class="gear-items">
            {#each grouped_items as item}
                <GearItem
                  item={item}
                  is_selected={selected_ids.has(item.id)}
                  onToggle={() => toggle_selection(item.id)} />
            {/each}
          </div>
        </section>
      {/each}
    {/if}
  </div>
</main>

<footer class="footer">
    <div class="footer-main">
      <div class="dummy-info"><!-- Placeholder for alignment --></div>
      <div class="total-weight">Total Weight: {format_weight(total_weight())}</div>
    </div>
  {#if number_of_persons > 1}
    <div class="per-person-info">
      <div class="dummy-info"><!-- Placeholder for alignment --></div>
      <div class="per-person-weight">Per person: {format_weight(total_weight() / number_of_persons)}</div>
    </div>
  {/if}
</footer>

<style>
  .main-container {
    padding: 16px;
    padding-bottom: 80px;
    font-family: system-ui, sans-serif;
  }

  .title {
    font-size: 2rem;
    font-weight: bold;
  }

  .gear-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }

  .gear-category {
    flex: 1;
    min-width: 300px;
  }

  .category-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .gear-items {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f1f1f1; /* Lighter background color */
    border-top: 1px solid #e0e0e0; /* Subtle border */
    padding: 16px;
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.7);
    font-family: system-ui, sans-serif;
    z-index: 50;
    color: #333; /* Darker text for better readability */
  }
  .footer-main, .per-person-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .selected-info {
    font-size: 14px;
    font-weight: 500;
  }

  .total-weight, .per-person-weight {
    font-size: 18px;
    font-weight: 700;
  }
  .number-persons-input {
    border: none;
    background: transparent;
    font-size: 1em;
    color: inherit;
    text-align: inherit;
    outline: none;
    padding: 1px;
    width: auto;
  }
  .number-persons-input::-webkit-outer-spin-button,
  .number-persons-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
