<script>
  import { onMount } from 'svelte';

  let cursor;

  const mouse = {
    isVisible: false,
    state: 0,
    x: null,
    y: null
  }
  $: mouseImg = `/images/mouse-${mouse.state}.png`;

  const handleMouseOver = e => {
    mouse.isVisible = true;
    cursor = document.querySelector('#cursor');
    window.removeEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseOut)
  }

  const handleMouseOut = e => {
    mouse.isVisible = false;
    window.removeEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
  }

  const handleMouseMove = e => {
    mouse.state = e.target.closest('a, button') ? 1 : 0

    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    cursor.style.left = `${mouse.x}px`;
    cursor.style.top = `${mouse.y}px`;
  }

  onMount(() => {
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    }
  });
</script>

<img id="cursor" class:isVisible={mouse.isVisible} src={mouseImg} alt="Mouse Cursor" />


<style>
  #cursor {
    position: absolute;
    top: 0;
    left: 0; 
    width: 32px;
    height: 32px;
    pointer-events: none;
    z-index: 999999999999999999999;
    visibility: hidden;
  }
  #cursor.isVisible {
    visibility: visible;
  }
</style>