<script>
  export let icon = '/svg/folder.svg';
  export let label = 'New Folder';
  export let id;
</script>

<div data-id={ id } class="skos-app">
  <div id="folder" style={ `background-image: url(${icon})` }></div>
  <p id="label">{ label }</p>
</div>

<style>
  .skos-app {
    padding-block: 0.5rem;
    width: 125px;
    border-radius: 0.5rem;
  }
  :global(.skos-app.is-focused) {
    outline: 1px solid #cccccc99;
    background-color: #cccccc44;
  }
  #folder {
    --icon-size: 65px;
    width: var(--icon-size);
    height: var(--icon-size);
    background-size: contain;
    background-repeat: no-repeat;
    margin-inline: auto;
  }
  #label {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    margin-bottom: 0;
  }
</style>