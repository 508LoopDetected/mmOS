<script>
  import { onMount, createEventDispatcher } from 'svelte';

  export let title;
  export let width;
  export let height;
  export let zIndex;
  export let key;

  let isDragging = false;
  let startX;
  let startY;
  let initialX;
  let initialY;
  let currentX = (window.innerWidth - width) / 2;
  let currentY = (window.innerHeight - height) / 2;
  let resetX = (window.innerWidth - width) / 2;
  let resetY = (window.innerHeight - height) / 2;
  let windowWidth = width;
  let windowHeight = height;

  const dispatch = createEventDispatcher();
  let isVisible = true;

  // Window Manager
  let windows = [];

  function handleClick() {
    // Dispatch a custom event when the window is clicked
    dispatch('windowMouseDown');
  }

  onMount(() => {
    const windowElement = document.getElementById(`window-${title}`);
    windowElement.addEventListener('mousedown', handleClick);

    return () => {
      // Cleanup: Remove the event listener when the component is unmounted
      windowElement.removeEventListener('mousedown', handleClick);
    };
  });

  let lastX = resetX;
  let lastY = resetY;
  let isMaximized = false;
  let windowClasses = 'window';

  function handleMaximize() {
    if (isMaximized) {
      currentX = lastX; // Use the last known position when unmaximizing
      currentY = lastY; // Use the last known position when unmaximizing
      windowWidth = width;
      windowHeight = height;
      zIndex = getTopZIndex(); // Set the previous z-index value when un-maximized
      setTimeout(function() {
        windowClasses = 'window'; // any delay at all works here so that the class is removed AFTER the un-maximize animation
      }, 100);
    } else {
      windowClasses = 'window maximized';
      lastX = currentX; // Store the current position before maximizing
      lastY = currentY; // Store the current position before maximizing
      currentX = 0;
      currentY = 0;
      windowWidth = window.innerWidth - 2 * 28; // Subtract left and right padding
      windowHeight = window.innerHeight - 2 * 26; // Subtract top and bottom padding
      zIndex = getTopZIndex() + 1; // Set a higher z-index value when maximized
    }
    isMaximized = !isMaximized;
  }

  function handleClose() {
    const windowElement = document.getElementById(`window-${title}`);
    windowElement.remove();
    dispatch('windowClosed');
  }

  function updateWindowManager() {
    windows = windows.map((window, index) => {
      window.zIndex = index + 100; // Set z-index values based on array index
      return window;
    });
  }

  function getTopZIndex() {
    return windows.length + 100 - 1; // Calculate the highest z-index
  }

  function addWindow() {
    windows.push({ zIndex });
    updateWindowManager();
  }

  function removeWindow() {
    windows = windows.filter((window) => window.zIndex !== zIndex);
    updateWindowManager();
  }

  let windowStyles;
  $: {
    windowStyles = `transform: translate(${currentX}px, ${currentY}px); z-index: ${zIndex};`;
  }
  let contentStyles;
  $: {
    contentStyles = `width: ${windowWidth}px; height: ${windowHeight}px;`;
  }

  function handleDrag(node) {
    function handleMouseDown(event) {
      if (event.target.closest('.title-bar') && !isMaximized) {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialX = currentX;
        initialY = currentY;
        updateWindowManager();
      }
    }

    function handleMouseMove(event) {
      if (isDragging) {
        const offsetX = event.clientX - startX;
        const offsetY = event.clientY - startY;
        const newX = initialX + offsetX;
        const newY = initialY + offsetY;
        const maxX = window.innerWidth - windowWidth;
        const maxY = window.innerHeight - windowHeight;
        
        currentX = Math.max(0, Math.min(newX, maxX));
        currentY = Math.max(0, Math.min(newY, maxY));
        resetX = currentX;
        resetY = currentY;
      }
    }

    function handleMouseUp() {
      if (isDragging) {
        isDragging = false;
      }
    }

    node.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Add the current window to the window manager
    addWindow();

    return {
      destroy() {
        node.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        // Remove the current window from the window manager
        removeWindow();
      }
    };
  }

  let isResizing = false;
  let startWidth;
  let startHeight;

  function handleResizeMouseDown(event) {
    if (event.target.classList.contains('resize-handle') && !isMaximized) {
      isResizing = true;
      startWidth = windowWidth;
      startHeight = windowHeight;
      startX = event.clientX;
      startY = event.clientY;
      updateWindowManager();
    }
  }

  function handleResizeMouseMove(event) {
    if (isResizing) {
      const offsetX = event.clientX - startX;
      const offsetY = event.clientY - startY;
      windowWidth = Math.max(startWidth + offsetX, 200); // Minimum width of 200px
      windowHeight = Math.max(startHeight + offsetY, 200); // Minimum height of 200px
    }
  }

  function handleResizeMouseUp() {
    if (isResizing) {
      isResizing = false;
    }
  }

  function handleResize(node) {
    node.addEventListener('mousedown', handleResizeMouseDown);
    window.addEventListener('mousemove', handleResizeMouseMove);
    window.addEventListener('mouseup', handleResizeMouseUp);

    return {
      destroy() {
        node.removeEventListener('mousedown', handleResizeMouseDown);
        window.removeEventListener('mousemove', handleResizeMouseMove);
        window.removeEventListener('mouseup', handleResizeMouseUp);
      }
    };
  }

</script>

{#if isVisible}
<div class={windowClasses} style={windowStyles} use:handleDrag id={`window-${title}`}>
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
      <slot></slot>
    </div>
    <div class="resize-handle" use:handleResize></div>
  </div>
</div>
{/if}


<style>
  #window-doom.window .content {
    padding: 0;
    overflow: hidden;
    width: 640px;
    height: 400px;
    background-color: #333;
  }
  #window-terminal.window .content {
    padding: 0;
    overflow: hidden;
  }
/*  .window {
    position: absolute;
    background-color: #bbc5aa;
    border: 1px solid #000;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 10px 10px 0px rgba(0,0,0,0.1);
    font-family: "Dank Mono", monospace;
    font-size: 16px;
    color: #000;
    z-index: 100;
  }
  .window.maximized {
    transition:
      width 0.1s ease-out,
      height 0.1s ease-out,
      transform 0.1s ease-out;
  }

  .window-inner {
    height: 100%;
    padding: 0 7px 7px;
    box-shadow: inset 1px 1px 0 #dde2c6;
    border-radius: 5px;
    overflow: hidden;
  }

  .title-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 7px;
    margin: 1px auto;
    cursor: move;
    user-select: none;
    position: relative;
  }

  .title-bar .title {
    font-weight: bold;
    color: #000;
    background-color: #bbc5aa;
    padding: 0 20px;
    z-index: 2;
    font-size: 18px;
    text-shadow: 1px 1px 0 #dde2c6;
  }

  .title-bar::before,
  .title-bar::after {
    content: "";
    position: absolute;
    height: 1px;
    background-color: #dde2c6;
    border-top: 1px solid rgba(0,0,0,0.4);
    left: 0;
    right: 0;
    width: calc(100% - 60px);
    margin: auto;
  }

  .title-bar::before {
    top: calc(50% - 5px);
  }

  .title-bar::after {
    top: calc(50% + 3px);
  }

  .window-controls {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 100%;
    justify-content: space-between;
  }

  .window-controls button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: 20px;
    height: 20px;
    border: 1px solid rgba(0,0,0,0.6);
    border-radius: 3px;
    background-color: #a72608;
    cursor: pointer;
    margin-right: 5px;
    color: #e6eed6;
    font-size: 10px;
    text-shadow: 1px 1px 0 rgba(0,0,0,0.4);
    box-shadow: inset 1px 1px 0 rgba(255,255,255,0.4), 1px 1px 0 rgba(0,0,0,0.2);
  }

  .window-controls button.maximize {
    border: 1px solid rgba(0,0,0,0.4);
    background-color: #cfd7c1;
    color: #000;
    margin-right: 0;
    text-shadow: 1px 1px 0 rgba(255,255,255,0.4);
    box-shadow: 1px 1px 0 rgba(255,255,255,0.4), inset 1px 1px 0 rgba(0,0,0,0.2);
  }

  .window-controls button.maximize {
    border: 1px solid rgba(0,0,0,0.4);
    background-color: #a2ad8e;
    color: #e6eed6;
    margin-right: 0;
    text-shadow: 1px 1px 0 rgba(0,0,0,0.4);
    box-shadow: 1px 1px 0 rgba(255,255,255,0.4), inset 1px 1px 0 rgba(0,0,0,0.2);
  }

  .content {
    padding: 5px 20px;
    background-color: #e6eed6;
    height: calc(100% - 55px);
    overflow: auto;
    border: 1px solid rgba(0,0,0,0.6);
    border-radius: 4px;
    box-shadow: 1px 1px 0 rgba(255,255,255,0.4), inset 1px 1px 0 rgba(0,0,0,0.2);
  }
  .window.maximized .content {
    transition:
      width 0.1s ease-out,
      height 0.1s ease-out;
  }

  .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 22px;
    height: 22px;
    background-color: #bbc5aa;
    cursor: nwse-resize;
    border-radius: 4px;
  }
  .resize-handle::before,
  .resize-handle::after {
    content: "";
    position: absolute;
    height: 1px;
    background-color: #dde2c6;
    border-top: 1px solid rgba(0,0,0,0.4);
    left: 0;
    right: 0;
    width: 60%;
    margin: auto;
  }
  .resize-handle::before {
    top: calc(50% - 3px);
    left: -15%;
    transform: rotate(-45deg);
  }
  .resize-handle::after {
    top: calc(50% + 1px);
    left: 25%;
    width: 40%;
    transform: rotate(-45deg);
  }*/
</style>
