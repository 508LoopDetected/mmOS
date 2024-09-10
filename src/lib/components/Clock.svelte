<script>
  import {
    currentDay,
    currentSuffix,
    displayWeek,
    manuallyAdvanceTime
  } from '$lib/timeStore';
  import { derived } from 'svelte/store';
</script>

<!-- Display the formatted time and a button to advance time -->
<strong>{$currentSuffix}</strong><br/>
{$currentDay}, {$displayWeek}<br/>
<button on:click={manuallyAdvanceTime}>Advance Time</button>

<style>
  div {
    text-align: center;
  }
</style>