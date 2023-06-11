<script>
  import { writable } from 'svelte/store';
  import { Apps } from '$lib/apps/Apps.js';

  const terminalOutput = writable('');
  const commandHistory = writable([]);

  let userInput = '';

  function handleInput() {
    const command = userInput.trim();

    if (command === 'help') {
      terminalOutput.set('A terminal emulator, don\'tcha know. Type commands, receive responses. Try \'apps\' to see a list of currently available applications.');
    } else if (command === 'apps') {
      const appsList = Apps.map(app => `- ${app.label}`).join('<br>');
      terminalOutput.set(`Available apps:<br>${appsList}`);
    } else {
      terminalOutput.set("Command not recognized. Type 'help' for assistance.");
    }

    commandHistory.update(history => [...history, { id: Date.now(), command }]);
    userInput = '';
  }

  function focusInput() {
    const inputField = document.querySelector('.input-field');
    inputField.focus();
  }
</script>

<style>
  .terminal {
    flex: 1;
    background-color: #000;
    color: #fff;
    font-family: monospace;
    overflow-y: auto;
    padding: 10px;
    height: 100%;
  }

  .input-field {
    background-color: transparent;
    border: none;
    color: #fff;
    font-family: monospace;
    outline: none;
    font-size: 16px;
  }

  .input-container {
    bottom: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    z-index: 1;
  }

  .prompt {
    color: #888;
    padding-right: 10px;
  }
  .output {
    color: #888;
  }
</style>

<div class="terminal" on:click="{focusInput}">
  <p class="prompt">Welcome to <span style="color:orangered;">skOS v.α</span>!</p>
  {#each $commandHistory as { id, command } (id)}
    <div class="command" key={id}><span class="prompt" style="color:olivedrab;">~</span>{command}</div>
  {/each}
  <p class="output" style="white-space: pre-wrap; word-wrap: break-word;">{@html $terminalOutput}</p>

  <div class="input-container">
    <span class="prompt" style="color:olivedrab;">~</span>
    <input
      type="text"
      bind:value="{userInput}"
      on:keydown="{event => event.key === 'Enter' && handleInput()}"
      placeholder=""
      autofocus
      class="input-field"
    />
  </div>
</div>
