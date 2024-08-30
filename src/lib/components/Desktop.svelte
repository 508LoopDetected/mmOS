<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { writable, get } from 'svelte/store';
  import DesktopApp from "$lib/components/DesktopApp.svelte";
  import { Apps } from '$lib/apps/Apps.js';
  import Window from '$lib/components/Window.svelte';

  let windows = writable([]);
  let windowRefs = {};
  const dispatch = createEventDispatcher();
  const componentMapping = {};

  Apps.forEach((app) => {
    if (app.slug) {
      componentMapping[app.slug] = () => import(`$lib/apps/${app.slug}.svelte`);
    }
  });

  // In your onMount function
  onMount(() => {
    openWindow('hacker_news');
  });


// Helper function to log the current state of the windows store
function logWindowsState(message) {
  console.log(message, get(windows));
}

export function openWindow(windowSlug) {
  let app = Apps.find(app => app.slug === windowSlug);
  if (!app) {
    console.error('No app found with slug:', windowSlug);
    return;
  }

  // Get the current state of the windows store
  let currentWindows = get(windows);
  let existingWindow = currentWindows.find((w) => w.slug === windowSlug);

  if (!existingWindow) {
    let highestZIndex = Math.max(...currentWindows.map((w) => w.zIndex || 0), 0);
    let newWindow = {
      slug: windowSlug,
      label: app.label,
      zIndex: highestZIndex + 1,
      component: null,
    };

    console.log('Opening new window:', newWindow);

    // Update the windows store
    windows.update(winArr => {
      return [...winArr, newWindow];
    });

    // Load the component dynamically based on the mapping
    const componentLoader = componentMapping[windowSlug];
    if (componentLoader) {
      componentLoader().then((module) => {
        windows.update(winArr => {
          return winArr.map(w => 
            w.slug === windowSlug ? {...w, component: module.default} : w
          );
        });
        dispatch('windowOpened', { window: newWindow });
      });
    } else {
      console.error('No component loader found for slug:', windowSlug);
    }
  } else {
    console.log('Window already exists, bringing to front:', existingWindow);
    handleClick(existingWindow);
  }

  // Log the final state of windows after all operations
  console.log('Current windows:', get(windows));
}

function handleClick(window) {  
  windows.update(winArr => {
    let highestZIndex = Math.max(...winArr.map((w) => w.zIndex || 0), 0);
    return winArr.map(w => 
      w.slug === window.slug ? {...w, zIndex: highestZIndex + 1} : w
    );
  });
  console.log('Window brought to front:', window);
}

  function closeWindow(window) {
    if (windowRefs[window.name] && windowRefs[window.name].stopDoom) {
      windowRefs[window.name].stopDoom();
    }
    windows.update((winArr) => winArr.filter((w) => w !== window));
    delete windowRefs[window.name];
  }

  function handleComponentMount(event, window) {
    windowRefs[window.name] = event.detail.component;
  }
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

{#each $windows as window (window.slug)}
  <Window
    title={window.label}
    slug={window.slug}
    width={640}
    height={400}
    on:windowOpened={() => openWindow(window.slug)}
    on:windowClosed={() => closeWindow(window)}
    on:windowMouseDown={() => handleClick(window)}
    zIndex={window.zIndex}
    key={window.slug}
  >
    {#if window.component !== null}
      <svelte:component this={window.component} />
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