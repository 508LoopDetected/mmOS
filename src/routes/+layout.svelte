<script>
	//import '@picocss/pico/css/pico.css'
	// import Desktop from '$lib/components/Desktop.svelte';
  import { theme } from '$lib/themes/themeStore'
  import Cursor from '../lib/components/Cursor.svelte';
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' :
  $theme}/> <link rel="stylesheet" href={`/theme/${$theme}.css`} />
</svelte:head>

<Cursor />

<main>  
  <slot />
</main>

<style>
  :global(*) {
    cursor: none !important;
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100vh;
    overflow: hidden;
  }
</style>
