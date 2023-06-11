<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
  import Desktop from '$lib/components/Desktop.svelte';

  let currentDate = new Date();
  onMount(() => {
    // Update the current date every second
    const interval = setInterval(() => {
      currentDate = new Date();
    }, 1000);
    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  });
</script>

<ThemeSwitch />

<div class="dock">
  <button on:click={() => openWindow('about')} class="about">
    <img src="/icons/icons8-road-closure-100.png" width="65" />
    <span class="tooltip">About</span>
  </button>

  <button on:click={() => openWindow('contact')} class="contact">
  <img src="/icons/icons8-disclaimer-100.png" width="65" />
    <span class="tooltip">Contact</span>
  </button>

  <button on:click={() => openWindow('doom')} class="doom">
  <img src="/icons/icons8-road-closure-100.png" width="65" />
    <span class="tooltip">DOOM</span>
  </button>

  <div class="systray">
    <img src="/icons/icons8-test-account-100.png" /><img src="/icons/icons8-settings-100.png" /><br/>
    <strong>{currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong><br>
    {currentDate.toLocaleString('en-US', { month: 'short', day: 'numeric' })}
  </div>
</div>

<Desktop />

<style>

</style>