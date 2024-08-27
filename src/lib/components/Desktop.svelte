<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import DesktopApp from "$lib/components/DesktopApp.svelte";
  import { Apps } from '$lib/apps/Apps.js';
  import Window from '$lib/components/Window.svelte';

  const componentMapping = {};
  Apps.forEach((app) => {
    if (app.slug) {
      componentMapping[app.slug] = () => import(`$lib/apps/${app.slug}.svelte`);
    }
  });

  let windows = writable([]);
  let windowRefs = {};

  const dispatch = createEventDispatcher();

  export function openWindow(windowName) {
    let existingWindow = $windows.find((w) => w.name === windowName);
    if (!existingWindow) {
      let highestZIndex = Math.max(...$windows.map((w) => w.zIndex), 0);
      let newWindow = {
        name: windowName,
        zIndex: highestZIndex + 1,
        component: null,
      };

      const componentLoader = componentMapping[windowName];
      if (componentLoader) {
        componentLoader().then((module) => {
          newWindow.component = module.default;
          windows.update((winArr) => [...winArr, newWindow]);
          dispatch('windowOpened', { window: newWindow });
        });
      }
    }
  }

  function closeWindow(window) {
    if (windowRefs[window.name] && windowRefs[window.name].stopDoom) {
      windowRefs[window.name].stopDoom();
    }
    windows.update((winArr) => winArr.filter((w) => w !== window));
    delete windowRefs[window.name];
  }

  function handleClick(window) {
    let highestZIndex = Math.max(...$windows.map((w) => w.zIndex), 0);
    window.zIndex = highestZIndex + 1;
    windows.update((winArr) => [...winArr]);
  }

  function handleComponentMount(event, window) {
    windowRefs[window.name] = event.detail.component;
  }

  onMount(() => {
    openWindow('Window 1');
  });
</script>

<div id="skos-desktop">
  <div id="skos-app-grid">
    {#each Apps as app}
      {#if app.isOnDesktop}
        <DesktopApp
          id={app.id}
          slug={app.slug}
          icon={app.icon || '/icons/icons8-opened-folder-100.png'}
          label={app.label || 'New Folder'}
          {openWindow}
        />
      {/if}
    {/each}
  </div>
</div>

{#each $windows as window (window.name)}
  <Window
    title={window.name}
    width={640}
    height={400}
    on:windowOpened={() => openWindow(window.name)}
    on:windowClosed={() => closeWindow(window)}
    on:windowMouseDown={() => handleClick(window)}
    zIndex={window.zIndex}
    key={window.name}
  >
    {#if window.component !== null}
      <svelte:component 
        this={window.component} 
        on:mounted={(event) => handleComponentMount(event, window)}
      />
    {/if}
  </Window>
{/each}

<style>
  #skos-desktop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  #skos-app-grid {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: baseline;
    flex-wrap: wrap;
    gap: 2rem 2rem;
    padding: 1.25rem;
    width: 100%;
    height: calc(100% - 75px);
    max-height: calc(100% - 75px);
  }
</style>