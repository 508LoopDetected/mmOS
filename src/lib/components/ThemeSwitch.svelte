<script>
  import { theme } from '$lib/themes/themeStore'
  theme.set('sandy'); // default theme
</script>

<style>
  .dropdown {
    /* display: flex;
    justify-content: center;
    gap: 10px; */
    margin: 20px auto;
    z-index: 2;
  }

  .dropdown-option {
    display: inline;
    /* align-items: center; */
    /* justify-content: center; */
    margin-inline: 0.25rem;
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
    Sandy
  </button>
  <button
    class="dropdown-option"
    data-selected={$theme === 'tempo8'}
    on:click={() => ($theme = 'tempo8')}
  >
    TempOS 8
  </button>
  <!-- Add more options as needed -->
</div>
