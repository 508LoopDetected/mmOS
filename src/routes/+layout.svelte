<script>
	//import '@picocss/pico/css/pico.css'
	// import Desktop from '$lib/components/Desktop.svelte';
  import { onMount } from 'svelte';
  import { theme } from '$lib/themes/themeStore'
  import Cursor from '../lib/components/Cursor.svelte';
  onMount(() => {
    window.addEventListener('click', handleOSClick)
    return () => {
      window.removeEventListener('click', handleOSClick)
    }
  });

  function handleOSClick(e) {
    document.querySelectorAll('.skos-app').forEach(app => app.classList.remove('is-focused'));

    if (!e.target.closest('.skos-app')?.dataset.id) return;

    e.target.closest('.skos-app').classList.add('is-focused');
  }
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
