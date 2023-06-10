<script>
  import DesktopApp from "$lib/components/DesktopApp.svelte";
  import { Apps } from '$lib/apps/Apps.js';


</script>

<div id="skos-desktop" >
  <div id="skos-app-grid">
    {#each Apps as app }
      {#if app.isOnDesktop }
        <DesktopApp id={app.id} icon={app.icon || '/svg/folder.svg'} label={app.label || 'New Folder'} />
      {/if}
    {/each}
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