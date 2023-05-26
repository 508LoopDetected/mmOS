<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';

  import Window from '$lib/components/Window.svelte';
  import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';

  // Define a component mapping object
  const componentMapping = {
    about: () => import('$lib/components/About.svelte'),
    contact: () => import('$lib/components/Contact.svelte'),
    // Add more mappings for other components here
  };

  let windows = writable([]);

  const dispatch = createEventDispatcher();

  function openWindow(windowName) {
    let existingWindow = $windows.find((w) => w.name === windowName);
    console.log('Existing Window:', existingWindow);
    if (!existingWindow) {
      let highestZIndex = Math.max(...$windows.map((w) => w.zIndex), 0);
      let newWindow = {
        name: windowName,
        zIndex: highestZIndex + 1,
        component: null,
      };

      // Load the component dynamically based on the mapping
      const componentLoader = componentMapping[windowName];
      if (componentLoader) {
        componentLoader().then((module) => {
          newWindow.component = module.default;
          windows.update((winArr) => [...winArr, newWindow]);
          console.log('Updated Windows:', $windows);
          dispatch('windowOpened', { window: newWindow });
        });
      }

      console.log('New Window:', newWindow);
    }
  }

  function closeWindow(window) {
    windows.update((winArr) => winArr.filter((w) => w !== window));
  }

  function handleClick(window) {
    let highestZIndex = Math.max(...$windows.map((w) => w.zIndex), 0);
    window.zIndex = highestZIndex + 1;
    windows.update((winArr) => [...winArr]);
  }

  onMount(() => {
    openWindow('Window 1');
  });
</script>

<ThemeSwitch />

<div class="dock">
  <button on:click={() => openWindow('about')} class="about">
    <i class="material-icons">info</i>
    <span class="tooltip">About</span>
  </button>

  <button on:click={() => openWindow('contact')} class="contact">
    <i class="material-icons">mail</i>
    <span class="tooltip">Contact</span>
  </button>
</div>


{#each $windows as window (window.name)}
  <Window
    title={window.name}
    width={600}
    height={400}
    on:windowOpened={() => openWindow(window.name)}
    on:windowClosed={() => closeWindow(window)}
    on:windowMouseDown={() => handleClick(window)}
    zIndex={window.zIndex}
    key={window.name}
  >
    {#if window.component !== null}
      <svelte:component this={window.component} />
    {/if}
  </Window>
{/each}


<style>
  .dock {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f0f0f0;
    padding: 10px;
  }

  .dock button {
    margin: 0 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #ddd;
    font-size: 14px;
    cursor: pointer;
    position: relative;
  }

  .dock button i {
    font-size: 24px;
  }

  .dock button .tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
  }

  .dock button:hover .tooltip {
    opacity: 1;
    pointer-events: auto;
  }
</style>