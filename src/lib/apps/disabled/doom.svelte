<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let dosboxElement;
  let dosboxProps;
  let ci;

  onMount(() => {
    dosboxProps = Dos(dosboxElement, {
      wasm: '/wasm/dosbox.wasm',
      url: 'https://js-dos.com/cdn/upload/DOOM-@evilution.zip',
      autolock: true,
      onEvent: async (event, commandInterface) => {
        if (event === 'emu-ready') {
          ci = commandInterface;
          await ci.run('CD DOOM');
          await ci.run('DOOM.EXE');
        }
      },
    });

    dispatch('mounted', { component: { stopDoom } });
  });

  onDestroy(() => {
    stopDoom();
  });

  function requestFullScreen() {
    if (dosboxProps) {
      dosboxProps.setFullScreen(true);
    }
  }

  export function stopDoom() {
    if (ci) {
      ci.exit();
    }
    if (dosboxProps) {
      dosboxProps.stop();
    }
    ci = null;
    dosboxProps = null;
  }
</script>

<div class="dosbox-container">
  <div bind:this={dosboxElement}></div>
</div>
<br />
<button on:click={requestFullScreen}>Make fullscreen</button>

<style>
  .dosbox-container {
    width: 100%;
    height: 100% !important;
    position: relative;
  }
  .dosbox-container > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>