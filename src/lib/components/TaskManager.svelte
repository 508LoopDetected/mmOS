<script>
  import { writable } from 'svelte/store';
  import Window from "./Window.svelte";
  import TaskManagerContent from '$lib/components/TaskManagerContent.svelte';

  let ctrl = false;
  let alt = false;
  let meta = false;

  let isOpen = false

  let windows = writable([]);

  const handleKeyDown = (e) => {
    if (!['Control', 'Meta', 'Alt'].includes(e.key)) return;

    switch (e.key) {
      case 'Control':
        ctrl = true;
        break;
      case 'Meta':
        meta = true;
        break;
      case 'Alt':
        alt = true;
        break;
      default:
        break;
    }

    if (ctrl && alt && meta) {
      isOpen = true;
    }
  }

  const handleKeyUp = (e) => {
    if (!['Control', 'Meta', 'Alt'].includes(e.key)) return;

    switch (e.key) {
      case 'Control':
        ctrl = false;
        break;
      case 'Meta':
        meta = false;
        break;
      case 'Alt':
        alt = false;
        break;
      default:
        break;
    }
  }

  export function openWindow(windowName) {
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
    isOpen = false;
    windows.update((winArr) => winArr.filter((w) => w !== window));
  }

  function handleClick(window) {
    let highestZIndex = Math.max(...$windows.map((w) => w.zIndex), 0);
    window.zIndex = highestZIndex + 1;
    windows.update((winArr) => [...winArr]);
  }
</script>

<!-- <h1 style="color: {!isOpen ? 'red' : 'green'}">{ ctrl }</h1> -->
<!-- <h1 style="color: {!isOpen ? 'red' : 'green'}">{ alt }</h1> -->
<!-- <h1 style="color: {!isOpen ? 'red' : 'green'}">{ meta }</h1> -->

{#if isOpen }
  <Window
    title="Task Manager"
    width={640}
    height={400}
    on:windowOpened={() => openWindow(window.name)}
    on:windowClosed={() => closeWindow(window)}
    on:windowMouseDown={() => handleClick(window)}
    zIndex={window.zIndex}
    key={window.name}
  >
    <TaskManagerContent />
  </Window>
{/if}

<!-- <div id="task-manager" class:isOpen class={windowClasses} style={windowStyles} use:handleDrag >
  <div class="window-inner">
    <div class="title-bar" on:click={updateWindowManager}>
      <div class="title">{title}</div>
      <div class="window-controls">
        <button class="close" on:click={handleClose}>
          <span class="material-icons">✕</span>
        </button>
        <button class="maximize" on:click={handleMaximize}>
          <span class="material-icons">{isMaximized ? '⤢' : '⤢'}</span>
        </button>
      </div>
    </div>
    <div class="content" style={contentStyles}>
      <h2>Task Manager & stuff</h2>
    </div>
    <div class="resize-handle" use:handleResize></div>
  </div>
</div> -->

<svelte:window on:keyup={handleKeyUp} on:keydown={handleKeyDown} />

<style>
  #task-manager {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999999999;

    opacity: 0;
    pointer-events: none;
  }
  #task-manager.isOpen {
    opacity: 1;
    pointer-events: all;
  }
</style>