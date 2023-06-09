<script>
  import DesktopApp from "$lib/components/DesktopApp.svelte";

  let currentFocusedId = '';

  const unfocusIcons = (e) => {
    if (!e.target.closest('.skos-app')) {
      currentFocusedId = '';
      console.log('whoops');
    }

  }

  const focusIcon = (e) => {
    currentFocusedId = e.detail.id;
    // console.log(currentFocusedId);
  }
</script>

<div id="skos-desktop" on:click={unfocusIcons}>
  <div id="skos-app-grid">
    <DesktopApp id="0001" on:highlight={focusIcon} icon="/svg/recyclebin.svg" label="Recycle Bin" {currentFocusedId} />
    <DesktopApp id="0002" on:highlight={focusIcon} icon="/svg/floppydisk.svg" label="My OS" {currentFocusedId} />
    <DesktopApp id="0003" on:highlight={focusIcon} icon="/svg/cd.svg" label="Velvet Revolver - Contraband [2004]" {currentFocusedId} />
    <DesktopApp id="0004" on:highlight={focusIcon} {currentFocusedId} />
    <DesktopApp id="0005" on:highlight={focusIcon} {currentFocusedId} />
    <DesktopApp id="0006" on:highlight={focusIcon} {currentFocusedId} />
    <DesktopApp id="0007" on:highlight={focusIcon} {currentFocusedId} />
    <DesktopApp id="0008" on:highlight={focusIcon} icon="/svg/txt.svg" label="passwords.txt" {currentFocusedId} />
  </div>
</div>

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