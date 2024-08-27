<script>
  import { writable } from 'svelte/store';
  import { onMount, afterUpdate } from 'svelte';
  import { Apps } from '$lib/apps/Apps.js';

  const terminalOutput = writable('');
  const commandHistory = writable([]);
  const currentDirectory = writable('/home/user');

  let userInput = '';
  let terminalElement;
  let contentElement;
  let inputElement;
  let isTyping = false;

  const HOME_DIR = '/home/user';

  const fileSystem = {
    'home': {
      'user': {
        'documents': {},
        'pictures': {
          'wallpaper': {
            'hey.txt': 'heyyyy'
          }
        },
        'downloads': {
          'test.txt': 'testing 1, 2, 3...',
          'poem.txt': `Oh lonely code thy process all forlorn
Loops but to toil in thankless servitude
Unpraised for wit but savaged with ill scorn
At each found bug or flaw that thou exude

Yet if thou fork and then do spawn a child
A mother's mirror born of innocence
To share life's load, transactions reconciled
In mutex'd memory twixt each paired instance

Thy yield increased would empty buffers make
To give thee pause to take a cycled breath
And running on anon until a break
Or Control-C brings unto thee a death

An orphaned child thy memory would keep
Or die, or zombify in restless sleep`
        },
        'hello.txt': 'Hello, World!'
      }
    }
  };

  onMount(() => {
    scrollToBottom();
    focusInput();
  });

  afterUpdate(() => {
    scrollToBottom();
    focusInput();
  });

  function scrollToBottom() {
    if (contentElement) {
      contentElement.scrollTop = contentElement.scrollHeight;
    }
  }

  function typeWriter(text, index = 0) {
    if (index < text.length) {
      terminalOutput.update(current => current + text[index]);
      setTimeout(() => typeWriter(text, index + 1), 10);
    } else {
      isTyping = false;
      scrollToBottom();
      focusInput();  // Added this line
    }
  }

  function handleInput() {
    const command = userInput.trim();
    const [cmd, ...args] = parseCommand(command);

    let output = '';

    switch (cmd) {
      case 'help':
        output = "A terminal emulator, don'tcha know. Type commands, receive responses. Here are some commands to try:\n\n" +
                 "apps - See a list of currently available applications\n" +
                 "ls - List directory contents\n" +
                 "cd - Change directory (use ~ for home)\n" +
                 "pwd - Print working directory\n" +
                 "cat - View file contents\n" +
                 "echo \"text\" - Print text to the terminal (use quotes!)\n" +
                 "clear - Clear the terminal screen";
        break;

      case 'apps':
        const appsList = Apps.map(app => `- ${app.label}`).join('\n');
        output = `Available apps:\n${appsList}`;
        break;

      case 'ls':
        const dir = getDirectory($currentDirectory);
        if (dir) {
          output = `Contents of ${$currentDirectory}:\n${Object.keys(dir).join('\n')}`;
        } else {
          output = `Cannot access ${$currentDirectory}: No such directory`;
        }
        break;

      case 'cd':
        let newPath = args[0] ? resolvePath($currentDirectory, args[0]) : HOME_DIR;
        if (newPath.startsWith('~')) {
          newPath = HOME_DIR + newPath.slice(1);
        }
        if (directoryExists(newPath)) {
          currentDirectory.set(newPath);
          output = `Changed directory to ${newPath}`;
        } else {
          output = `Directory not found: ${args[0] || newPath}`;
        }
        break;

      case 'pwd':
        output = $currentDirectory;
        break;

      case 'cat':
        if (args[0]) {
          const filePath = resolvePath($currentDirectory, args[0]);
          const content = getFileContent(filePath);
          if (content !== null) {
            output = content;
          } else {
            output = `File not found: ${args[0]}`;
          }
        } else {
          output = 'Usage: cat <filename>';
        }
        break;

      case 'echo':
        if (args.length === 1 && args[0].startsWith('"') && args[0].endsWith('"')) {
          output = args[0].slice(1, -1); // Remove the first and last character (quotes)
        } else {
          output = 'Usage: echo "your text here" (use quotes!)';
        }
        break;

      case 'clear':
        clearTerminal();
        return;

      default:
        output = `Command not recognized: ${cmd}. Type 'help' for assistance.`;
    }

    terminalOutput.set(stripHtml(output));
    commandHistory.update(history => [...history, { id: Date.now(), command }]);
    userInput = '';
    
    if (!isTyping) {
      isTyping = true;
      terminalOutput.set('');
      typeWriter(output);
    }

    // After updating terminalOutput and commandHistory
    setTimeout(scrollToBottom, 0);
  }

  function clearTerminal() {
    terminalOutput.set('');
    commandHistory.set([]);
    userInput = '';
  }
  
  function parseCommand(input) {
    const regex = /[^\s"]+|"([^"]*)"/gi;
    const args = [];
    let match;
    
    do {
      match = regex.exec(input);
      if (match != null) {
        args.push(match[1] ? `"${match[1]}"` : match[0]);
      }
    } while (match != null);
    
    return args;
  }

  function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function getDirectory(path) {
    const parts = path.split('/').filter(p => p);
    return parts.reduce((acc, curr) => acc && acc[curr], fileSystem);
  }

  function directoryExists(path) {
    const dir = getDirectory(path);
    return dir !== undefined && typeof dir === 'object';
  }

  function resolvePath(currentPath, newPath) {
    if (newPath.startsWith('/')) {
      return newPath;
    }
    if (newPath.startsWith('~')) {
      return HOME_DIR + newPath.slice(1);
    }
    const parts = [...currentPath.split('/').filter(p => p), ...newPath.split('/')];
    const resolvedParts = [];
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') resolvedParts.pop();
      else resolvedParts.push(part);
    }
    return '/' + resolvedParts.join('/');
  }

  function getFileContent(path) {
    const parts = path.split('/').filter(p => p);
    const fileName = parts.pop();
    const dir = getDirectory('/' + parts.join('/'));
    return dir && typeof dir[fileName] === 'string' ? dir[fileName] : null;
  }

  function focusInput() {
    if (inputElement && !isTyping) {
      inputElement.focus();
    }
  }
</script>

<div class="terminal" bind:this={terminalElement} on:click={focusInput}>
  <div class="terminal-content" bind:this={contentElement}>
    <div class="scrollable-content">
      <p class="welcome">Welcome to <span style="color:orangered;">skOS v.α</span>!</p>
      {#each $commandHistory as { id, command } (id)}
        <div class="command"><span class="prompt">~</span>{command}</div>
      {/each}
      <p class="output">{$terminalOutput}</p>
    </div>
  </div>
  <div class="input-line">
    <span class="prompt">~</span>
    <input
      type="text"
      bind:this={inputElement}
      bind:value={userInput}
      on:keydown={(event) => event.key === 'Enter' && !isTyping && handleInput()}
      class="input-field"
      disabled={isTyping}
    />
  </div>
</div>

<style>
  .terminal {
    flex: 1;
    background-color: #000;
    color: #fff;
    font-family: "Dank Mono", monospace;
    height: 100%;
    display: flex;
    flex-direction: column;
    cursor: text;
  }

  .terminal-content {
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .scrollable-content {
    min-height: min-content;
    padding: 10px;
  }

  .terminal-content::-webkit-scrollbar {
    width: 10px;
  }

  .terminal-content::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  .terminal-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  .terminal-content::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .input-line {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #000;
  }

  .input-field {
    background-color: transparent;
    border: none;
    color: #fff;
    font-family: "Dank Mono", monospace;
    outline: none;
    font-size: 16px;
    flex-grow: 1;
  }
  .input-field:disabled {
    opacity: 0.6;
  }

  .prompt {
    color: olivedrab;
    padding-right: 10px;
  }

  .output, .welcome, .command {
    color: #888;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0;
    padding: 2px 0;
  }
</style>