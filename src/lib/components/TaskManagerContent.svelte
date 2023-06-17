<script>
  import { onMount } from 'svelte';

  let lastPoint = 60;
  let inverse = 100 - lastPoint;

  const points = [];

  onMount(() => {
    const canvas = document.querySelector('#cpu');
    const c = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 100;
    canvas.style.border = '1px solid lime';
    
    const percentCanvas = document.querySelector('#current-cpu');
    const ctx = percentCanvas.getContext('2d');
    
    percentCanvas.width = 75;
    percentCanvas.height = 100;

    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      update() {
        this.x -= canvas.width / 100;
      }
    }

    const gridSize = 100 / 7;

    const monitor = () => {
      c.fillStyle = '#222';
      c.fillRect(0,0,canvas.width,canvas.height);
      // c.clearRect(0,0,canvas.width,canvas.height);
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          c.lineWidth = 1;
          c.strokeStyle = '#00FF0011';
          c.strokeRect(x, y, gridSize, gridSize);
        }
      }
      
      setTimeout(() => {
        const range = 45;
        let y = Math.random() * range - (range / 2) + lastPoint;
        while (y < canvas.height * 0.1 || y > canvas.height * 0.9) {
          console.log('rechecking: ', y);
          y = Math.random() * 30 - 15 + lastPoint;
        }
        lastPoint = y;
        points.push(new Point(canvas.width, y))
        requestAnimationFrame(monitor);
      }, 500);
      
      points.forEach( (point, i) => {
        if (i < points.length - 1) {
          c.beginPath();
          c.strokeStyle = 'lime';
          c.lineWidth = 1;
          c.moveTo(point.x, point.y)
          c.lineTo(points[i + 1].x, points[i + 1].y);
          c.stroke();
          c.closePath();
        }
        point.update();
        
        if (point.x < -50) {
          points.splice(i, 1);
        }
      })

      // current cpu usage metric
      inverse = 100 - lastPoint;
      const padding = 10;
      ctx.fillStyle = '#222';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = inverse < 75 ? 'lime' : 'red';
      ctx.fillRect(padding, percentCanvas.height - padding, percentCanvas.width - (padding * 2), (Math.trunc(inverse) * -1) * 0.8);
      
    }
    monitor();
  });
</script>

<div id="task-manager-content">
  <div id="cpu-metrics">
    <div id="cpu-percent">
      <p class="title">CPU Usage</p>
      <canvas id="current-cpu"></canvas>
      <p>{ Math.trunc(inverse) }%</p>
    </div>
    <div id="cpu-history">
      <p class="title">CPU Usage History</p>
      <canvas id="cpu"></canvas>
    </div>
  </div>
</div>

<style>
  #task-manager-content {
    padding: 2rem;
  }
  #cpu-metrics {
    width: 100%;
    display: flex;
  }
  #cpu-percent {
    width: 200px;
  }
  .title {
    margin: 0;
  }
</style>