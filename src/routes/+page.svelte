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
  .dock {
    transition: all 0.4s cubic-bezier(.47,1.64,.41,.8);;
    transition-delay: 0.25s;

    transform: translateY(calc(100% + 0px));
  }
  .dock::before {
    content: '⌃';
    position: absolute;
    text-align: center;
    line-height: 2;
    font-size: 1.5rem;
    color: #888;
    left: 50%;
    top: 0;
    width: 50px;
    height: 25px;
    transform: translate(-50%, -80%);
    border-top-left-radius: 50% 100%;
    border-top-right-radius: 50% 100%;
    border: 1px solid #444;
    border-bottom: none;
    background-color: #bbc5aa;

    transition: all 0.3s ease;
    transition-delay: 0.4s;
  }
  :global(body.showDock .dock) {
    transform: translateY(0);
  }
  :global(body.showDock .dock::before) {
    transform: scaleY(0);
    opacity: 0;
    transition-delay: 0.15s;
  }

  .dock:hover {
    transform: translateY(0);
  }
</style>
