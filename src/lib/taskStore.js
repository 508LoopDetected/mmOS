import { writable } from 'svelte/store';
import { advanceTime } from '$lib/timeStore';

const tasks = writable([
    {
      id: 671,
      name: 'Fix Bug in Module X',
      deadline: { week: 1, day: 'Wednesday', chunk: 3 },
      timeRequired: 1,
      chunksContributed: 0,
      status: 'pending'
    },
    {
      id: 31,
      name: 'Edit Content on Website Y',
      deadline: { week: 2, day: 'Monday', chunk: 2 },
      timeRequired: 3,
      chunksContributed: 0,
      status: 'pending'
    },
    {
      id: 142,
      name: 'Fix Bug in App Z',
      deadline: { week: 1, day: 'Tuesday', chunk: 1 },
      timeRequired: 2,
      chunksContributed: 0,
      status: 'pending'
    }
    // Add more sample tasks here
]);

function addTask(newTask) {
    tasks.update(currentTasks => [...currentTasks, newTask]);
}

function completeTask(taskId) {
    tasks.update(currentTasks => currentTasks.map(
        task => task.id === taskId ? { ...task, status: 'completed' } : task));
}

function updateTaskStatus(taskId, newStatus) {
    tasks.update(currentTasks => currentTasks.map(
        task => task.id === taskId ? { ...task, status: newStatus } : task));
}

function contributeChunk(taskId) {
    tasks.update(currentTasks => currentTasks.map(task => 
        task.id === taskId ? { ...task, chunksContributed: task.chunksContributed + 1 } : task
    ));
    advanceTime();
}

export default {
    subscribe: tasks.subscribe,
    add: addTask,
    complete: completeTask,
    updateTaskStatus: updateTaskStatus,
    contributeChunk: contributeChunk
};