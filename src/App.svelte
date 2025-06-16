<!-- App.svelte -->
<script>
  import GearItem from './GearItem.svelte';
  import { onMount } from 'svelte';
  import {format_weight, format_weight_summary} from './lib/utils.js';

  let gear_items = $state([]);
  let selected_ids = $state(new Set());
  let number_of_persons = $state(2);
  let number_of_days = $state(3);
  let food_weight_per_day_per_person = $state(1.5);
  let clothes_weight_per_person = $state(7);
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
  <span class="person-toggle">
    <label class:selected={number_of_persons.toString() === '1'}>
      <input
        type="radio"
        name="persons"
        value=1
        bind:group={number_of_persons} />
      1
    </label>
    <label class:selected={number_of_persons.toString() === '2'}>
      <input
        type="radio"
        name="persons"
        value=2
        bind:group={number_of_persons} />
      2
    </label>
  </span>
    person{number_of_persons > 1 ? 's' : ''}
    on a
<!--    <input-->
<!--      type="number"-->
<!--      min="1"-->
<!--      max="100"-->
<!--      bind:value={number_of_days}-->
<!--      class="number-persons-input" />-->
      <span class="days-slider">
          <label for="days">{number_of_days}</label>
          <input
            id="days"
            type="range"
            min="1"
            max="14"
            bind:value={number_of_days}
            class="slider" />
    </span>
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
      <div>Total weight: {format_weight_summary(total_weight())}</div>
        <div class="breakdown">
            <div>🛠 Gear: {format_weight_summary(gear_weight())}</div>
            <div>🍞 Food: <span class="weight">{format_weight_summary(food_weight())}</span></div>
            <div>👕 Clothes: {format_weight_summary(clothes_weight())}</div>
        </div>
    </div>
  {#if number_of_persons > 1}
    <div class="aside-display-divider"></div>
    <div class="per-person-weight">
        <div>Per person: {format_weight_summary(total_weight() / number_of_persons)}</div>
        <div class="breakdown">
            <div>🛠 Gear: {format_weight_summary(gear_weight() / number_of_persons)}</div>
            <div>🍞 Food: {format_weight_summary(food_weight() / number_of_persons)}</div>
            <div>👕 Clothes: {format_weight_summary(clothes_weight() / number_of_persons)}</div>
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
    gap: 1.5rem;
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
    min-width: 15ch;
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

.person-toggle {
  display: inline-flex;
  gap: 0.5rem;
  margin: 0 0.5rem;
}

.person-toggle label {
  padding: 0.3em 0.8em;
  border-radius: 0.4em;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid #111;
}

.person-toggle label.selected {
  background-color: #111;
  color: white;
  border-color: #ccc;
}

.person-toggle input {
  display: none;
}


.days-slider {
  display: inline-flex;
  flex-direction: column;
  gap: 0.4rem;
  max-width: 300px;
    min-width: 200px;
}

.slider {
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #cdeac0; /* light green track */
  outline: none;
  transition: background 0.2s;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
 background: #38a169; /* medium green thumb */
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #38a169; /* medium green thumb */
  border-radius: 50%;
  cursor: pointer;
}


</style>
