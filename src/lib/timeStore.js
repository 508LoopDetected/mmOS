import { writable, derived } from 'svelte/store';

export const currentDay = writable('Monday');
export const currentWeek = writable(1);
export const currentChunk = writable(1);

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function advanceTime() {
	currentChunk.update(chunk => {
	  if (chunk < 4) {
	    return chunk + 1;
	  } else {
	    let dayIndex;
	    currentDay.update(day => {
	      dayIndex = days.indexOf(day);
	      return dayIndex < days.length - 1 ? days[dayIndex + 1] : days[0];
	    });
	    if (dayIndex >= days.length - 1) {
	      currentWeek.update(week => week + 1);
	    }
	    return 1;
	  }
	});
}

// Manually advance time for debugging
export function manuallyAdvanceTime() {
	advanceTime();
}

// Separate derived store for the chunk suffix (Morning, Lunch, etc.)
export const currentSuffix = derived(currentChunk, $currentChunk => {
  return ['Morning', 'Lunch', 'Afternoon', 'EOD'][$currentChunk - 1]; // [chunk 1,2,3,4]
});

// Derived store to format the week display
export const displayWeek = derived(currentWeek, $currentWeek => {
  return `Week ${$currentWeek}`;
});
