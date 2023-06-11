<script>
  import { onMount } from 'svelte';

  let dosbox;

  onMount(() => {
    dosbox = new Dosbox({
      id: 'dosbox',
      onload: function (dosbox) {
      	dosbox.run("https://js-dos.com/cdn/upload/DOOM-@evilution.zip", "./DOOM/DOOM.EXE");
      },
      onrun: function (dosbox, app) {
        console.log(app + " is running...");
      }
    });
  });

  function requestFullScreen() {
    dosbox.requestFullScreen();
  }
</script>

<div class="dosbox-container">
  <div id="dosbox"></div>
</div>
<br />
<button on:click={requestFullScreen}>Make fullscreen</button>

<style>
  .dosbox-container {
    width: 100%;
    height: 100% !important;
    position: relative;
  }
  #dosbox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .dosbox-container > .dosbox-overlay {
    background: url('https://js-dos.com/cdn/DOOM.png');
  }
</style>