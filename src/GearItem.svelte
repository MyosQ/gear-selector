<!-- GearItem.svelte -->
<script>
  let { item, is_selected, onToggle } = $props();
  import { format_weight } from './lib/utils.js';
</script>

<button class="gear-item" onclick={() => onToggle()} aria-checked={is_selected} role="checkbox" tabindex="0">
  <img src={item.image} alt={item.name} class="gear-image" />
  <div class="gear-info">
    <h3 class="gear-name">{item.name}</h3>
    <p class="gear-weight">{format_weight(item.weight)}</p>
    <div class="gear-checkbox">{is_selected ? '✅' : '⬜️'}</div>
  </div>
</button>

<style>
  .gear-item {
    padding: 16px;
    border: 1px solid #888;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    width: 250px;
    cursor: pointer;
    transition: box-shadow 0.2s;
  }

  .gear-item:hover {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #ddd;
  }

  .gear-item[aria-checked="true"] {
    box-shadow: 0px 4px 12px rgba(0, 128, 0, 0.3);
    border-color: #528d55;
    border-width:  4px;
  }

  .gear-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .gear-info {
    flex: 1;
  }

  .gear-name {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .gear-weight {
    font-size: 12px;
    margin-bottom: 8px;
  }

  .gear-checkbox {
    font-size: 20px;
  }
</style>
