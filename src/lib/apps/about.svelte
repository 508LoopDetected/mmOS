<script>
  function raw(strings) {
    return strings.raw[0];
  }

  // avoid HTML tag errors and having to escape slashes
  const asciiArt = raw`
┌─┐┬┌─╔═╗╔═╗
└─┐├┴┐║ ║╚═╗
└─┘┴ ┴╚═╝╚═╝
`;
</script>

<pre>{asciiArt}</pre>
<p>v0.1 :: <a href="https://github.com/508loopdetected/skOS" target="_blank">Visit on GitHub</a></p>

<style>
  pre {
    font-family: monospace;
    white-space: pre;
  }
</style>