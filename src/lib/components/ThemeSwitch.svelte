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
    text-align: center;
  }

  .dropdown h3 {
    background: rgba(0,0,0,0.5);
    color: #fff;
    border-radius: 5px;
    padding: 5px 10px;
  }

  .dropdown-option {
    display: inline;
    /* align-items: center; */
    /* justify-content: center; */
    margin-inline: 0.25rem;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;
  }
</style>

<div class="dropdown">
  <h3>Choose Your Flavor</h3>
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
    Tempo
  </button>
  <!-- Add more options as needed -->
</div>
