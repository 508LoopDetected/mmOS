<script>
    import taskStore from '$lib/taskStore';
    import { currentDay, currentChunk, currentWeek, days } from '$lib/timeStore'; // Updated import

    $: {
        $taskStore.forEach(task => {
            if (task.status === 'pending' && isDeadlinePassed({
                week: $currentWeek,
                day: $currentDay,
                chunk: $currentChunk
            }, task.deadline)) {
                taskStore.updateTaskStatus(task.id, 'late');
            }
        });
    }

    let newTaskName = '';
    let newTaskChunksNeeded = 1; // Assuming you specify tasks in terms of chunks needed

    function addTask() {
        const currentTime = {
            week: $currentWeek,
            day: $currentDay,
            chunk: $currentChunk
        };

        // adding 3 gives the player at least 1 full day to get started
        const deadline = calculateDeadline(currentTime, (newTaskChunksNeeded + 3));

        const newTask = {
            id: Date.now(), // simple unique ID generator
            name: newTaskName,
            deadline: deadline, // Using the calculated deadline
            timeRequired: newTaskChunksNeeded, // Using the calculated deadline
            chunksContributed: 0,
            status: 'pending'
        };
        taskStore.add(newTask);
    }

    function contributeChunkToTask(taskId) {
        taskStore.contributeChunk(taskId);
        $taskStore.forEach(task => {
            if (task.id === taskId && task.chunksContributed >= task.timeRequired) {
                taskStore.updateTaskStatus(taskId, 'completed');
            }
        });
    }


    function markTaskAsCompleted(taskId) {
        taskStore.complete(taskId);
    }

    function calculateDeadline(currentTime, chunksNeeded) {
      let deadline = { ...currentTime }; // Copy current time

      // Add chunks to the current chunk and calculate rollover
      deadline.chunk += chunksNeeded;
      while (deadline.chunk > 4) {
        deadline.chunk -= 4;
        deadline.day = getNextDay(deadline.day);
      }

      // Handle day rollover
      function getNextDay(currentDay) {
        const dayIndex = days.indexOf(currentDay);
        if (dayIndex < days.length - 1) {
          return days[dayIndex + 1];
        } else {
          // Roll over to the next week
          deadline.week += 1;
          return days[0];
        }
      }

      return deadline;
    }

    function isDeadlinePassed(currentTime, deadline) {
      if (currentTime.week > deadline.week) return true;
      if (currentTime.week === deadline.week && days.indexOf(currentTime.day) > days.indexOf(deadline.day)) return true;
      if (currentTime.week === deadline.week && currentTime.day === deadline.day && currentTime.chunk > deadline.chunk) return true;
      return false;
    }

    // Function to format deadline for display
    function formatDeadline(deadline) {
        return `Week ${deadline.week}, ${deadline.day}, Chunk ${deadline.chunk}`;
    }

</script>

<div>
    <ul class="taskmanager">
        {#each $taskStore as task}
            <li class="task-item">
                <p><span class={`status-${task.status === 'pending' ? 'pending' : task.status === 'completed' ? 'completed' : 'late'}`}>
                  <span>{task.name} - {task.timeRequired} Chunks - Due: {formatDeadline(task.deadline)}</span>
                </span></p>
                {#if task.status === 'pending'}
                  <p>
                    <button on:click={() => contributeChunkToTask(task.id)}>Contribute Chunk</button>
                    <span>{task.chunksContributed}/{task.timeRequired}</span>
                  </p>
                {/if}
            </li>
        {/each}
    </ul>
</div>

<div class="add-task">
  Name of Task:
  <input type="text" bind:value={newTaskName} placeholder="Task Name"><br/>
  Chunks Required: 
  <input type="number" bind:value={newTaskChunksNeeded} placeholder="Time Required (in Chunks)">
  <button on:click={addTask}>Add Task</button>
</div>

<style>
  .status-pending { color: grey; }
  .status-completed { color: green; }
  .status-late { color: red; }

  .taskmanager {
    padding: 20px;
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: auto;
    background-color: #e1e1e1;
  }

  .task-item {
    border-bottom: 2px solid #ccc;
    padding: 15px 20px;
    cursor: pointer;
    background-color: #f4f4f4;
    margin-bottom: 10px;
    list-style: none;
  }
  .task-item:last-child {
    margin-bottom: 0;
  }

  .task-item:hover {
    background-color: #fff;
  }

  .task-avatar {
    width: 50px;
    height: 50px;
    background-size: cover;
    border-radius: 50%;
    display: inline-block;
  }

  .task-details {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }

  .task-preview {
    color: #666;
  }

  .task-overlay {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    display: flex;
    justify-content: flex-end; /* Align the task content to the right */
  }

  .task-content {
    background-color: white;
    padding: 20px;
    width: 85%;
    box-shadow: -15px 0px 0px 0px rgba(0,0,0,0.3);
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 1.2em;
    color: #333;
  }
</style>