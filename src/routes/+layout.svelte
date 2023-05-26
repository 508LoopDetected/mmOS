<script>
	//import '@picocss/pico/css/pico.css'
	// import Desktop from '$lib/components/Desktop.svelte';
  import { theme } from '$lib/themes/themeStore'
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' :
  $theme}/> <link rel="stylesheet" href={`/theme/${$theme}.css`} />
</svelte:head>

<main>  
  <slot />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100vh;
    overflow: hidden;
    /*background: #008081 url('/dol.png');*/
    /*background: #666 url('/bg.jpg');*/
    background-color: #008081;
	background-image: url("https://www.transparenttextures.com/patterns/maze-white.png");
	/* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
  }
</style>
