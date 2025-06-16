<!-- App.svelte -->
<script>
  import GearItem from './GearItem.svelte';
  import { onMount } from 'svelte';
  import { format_weight } from './lib/utils.js';

  let gear_items = $state([]);
  let selected_ids = $state(new Set());
  let number_of_persons = $state(2);
  let number_of_days = $state(3);
  let food_weight_per_day_per_person = $state(0.5);
  let clothes_weight_per_person = $state(2);
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

  function gear_weight() {
    return selected_items().reduce((sum, item) => sum + item.weight, 0);
  }

  function food_weight() {
    return food_weight_per_day_per_person * number_of_days * number_of_persons;
  }

  function clothes_weight() {
      return clothes_weight_per_person * number_of_persons;
  }

  function total_weight() {
    return gear_weight() + food_weight() + clothes_weight();
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
<div class="layout">
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
    <p class="selected-info">
      Food per day per person:
      <input
        type="number"
        min="0"
        bind:value={food_weight_per_day_per_person}
        class="number-persons-input" />kg<br>
        Total food weight: {format_weight(food_weight())}
    </p>
    <div class="section-divider"></div>
  </div>
  <div class="clothes-container">
    <p class="selected-info">
      Clothes weight per person:
        <input
            type="number"
            min="0"
            bind:value={clothes_weight_per_person}
            class="number-persons-input" />kg<br>
      Total clothes weight: {format_weight(clothes_weight())}
    </p>
    <div class="section-divider"></div>
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
        <div class="section-divider"></div>
      {/each}
    {/if}
  </div>
</main>

<aside class="aside-display">
    <div class="total-weight">
      <div>Total weight: {format_weight(total_weight())}</div>
        <div class="breakdown">
            <div>Gear: {format_weight(gear_weight())}</div>
            <div>Food: {format_weight(food_weight())}</div>
            <div>Clothes: {format_weight(clothes_weight())}</div>
        </div>
    </div>
  {#if number_of_persons > 1}
    <div class="aside-display-divider"></div>
    <div class="per-person-weight">
        <div>Per person: {format_weight(total_weight() / number_of_persons)}</div>
        <div class="breakdown">
            <div>Gear: {format_weight(gear_weight() / number_of_persons)}</div>
            <div>Food: {format_weight(food_weight() / number_of_persons)}</div>
            <div>Clothes: {format_weight(clothes_weight() / number_of_persons)}</div>
        </div>
    </div>
  {/if}
</aside>

</div>

<style>
  .layout {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    padding: 1rem;
  }

  .main-container {
    padding: 16px;
    padding-bottom: 80px;
    font-family: system-ui, sans-serif;
    max-width: 1440px;
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

  .aside-display {
    color: #333;
    position: sticky;
    top: 1rem;
    justify-content: center;
    display: flex;
    gap: 1rem;
    padding: 2rem 3rem;
    background-color: #f9f9f9;
    border-radius: 0.5rem;
    box-shadow: 0 0 4px rgba(0,0,0,0.1);
  }
  .aside-display-divider {
    content: '';
    align-self: stretch;
    border: 1px solid #d3d3d3;
    background-color: #000;
    margin: 6px 0; /* Spacing around the divider */
  }
  .total-weight, .per-person-weight {
    font-size: 18px;
    text-align: right;
    font-weight: 700;

    & .breakdown {
      margin-top: 12px;
      font-weight: 500;
      color: #666;
    }
  }


  .selected-info {
    font-size: 14px;
    font-weight: 500;
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

  .section-divider {
    width: 100%;
    height: 1px;
    background-color: #e0e0e099; /* Subtle divider color */
    margin: 16px 0; /* Spacing around the divider */
  }
</style>
