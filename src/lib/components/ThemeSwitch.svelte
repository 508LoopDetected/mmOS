<script>
  import { theme } from '$lib/themes/themeStore'
  theme.set('tempo8'); // default theme
</script>

<style>
  .dropdown {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }

  .dropdown-option {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    background-color: #f5f5f5;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;
  }

  .dropdown-option:hover,
  .dropdown-option[data-selected="true"] {
    background-color: #e0e0e0;
  }
</style>

<div class="dropdown">
  <button
    class="dropdown-option"
    data-selected={$theme === 'sandy'}
    on:click={() => ($theme = 'sandy')}
  >
    Sandy (Default)
  </button>
  <button
    class="dropdown-option"
    data-selected={$theme === 'tempo8'}
    on:click={() => ($theme = 'tempo8')}
  >
    Tempo 8.0
  </button>
  <!-- Add more options as needed -->
</div>
