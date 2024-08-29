<script>
  import { onMount } from 'svelte';

  let stories = [];
  let loading = true;
  let error = null;
  let section = 'front'; // Default section

  // Convert UNIX timestamp to a human-readable time string
  function timeAgo(timestamp) {
    const now = Math.floor(Date.now() / 1000);
    const difference = now - timestamp;
    const intervals = [
      { label: 'second', seconds: 60 },
      { label: 'minute', seconds: 3600 },
      { label: 'hour', seconds: 86400 },
      { label: 'day', seconds: 604800 },
      { label: 'week', seconds: 2419200 },
      { label: 'month', seconds: 29030400 },
      { label: 'year', seconds: 290304000 }
    ];
    
    for (const interval of intervals) {
      const value = Math.floor(difference / interval.seconds);
      if (value > 1) return `${value} ${interval.label}s ago`;
      if (value === 1) return `1 ${interval.label} ago`;
    }
    return 'Just now';
  }

  // Fetch stories from Hacker News API
  async function fetchStories(section) {
    let url = '';
    switch (section) {
      case 'newest':
        url = 'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty';
        break;
      case 'front':
        url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
        break;
      case 'ask':
        url = 'https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty';
        break;
      case 'show':
        url = 'https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty';
        break;
      case 'jobs':
        url = 'https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty';
        break;
      default:
        url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const storyIds = await response.json();
      if (!Array.isArray(storyIds)) {
        throw new Error('Unexpected response format');
      }
      const topStories = await Promise.all(storyIds.slice(0, 30).map(async (id) => {
        const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        if (!storyResponse.ok) {
          throw new Error(`HTTP error! status: ${storyResponse.status}`);
        }
        return storyResponse.json();
      }));
      stories = topStories;
    } catch (err) {
      error = `Failed to fetch stories: ${err.message}`;
    } finally {
      loading = false;
    }
  }

  function handleNavigation(event, newSection) {
    event.preventDefault();
    if (newSection !== section) {
      loading = true;
      section = newSection;
      fetchStories(newSection);
    }
  }

  onMount(() => {
    fetchStories(section);
  });
</script>

<!-- Hacker News Header -->
<header class="header">
  <div class="logo">
    <img src="https://news.ycombinator.com/y18.svg" width="18" height="18" alt="Hacker News logo" />
    <b class="hnname">
      <a href="https://news.ycombinator.com" target="_blank">hacker news</a>
    </b>
  </div>
  <nav class="nav">
    <a href="#" on:click={(e) => handleNavigation(e, 'front')}>front</a> |
    <a href="#" on:click={(e) => handleNavigation(e, 'newest')}>new</a> |
    <a href="#" on:click={(e) => handleNavigation(e, 'ask')}>ask</a> |
    <a href="#" on:click={(e) => handleNavigation(e, 'show')}>show</a> |
    <a href="#" on:click={(e) => handleNavigation(e, 'jobs')}>jobs</a>
  </nav>
</header>

<!-- Stories Section -->
<div id="stories">
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p>{error}</p>
  {:else}
    <ul>
      {#each stories as story (story.id)}
        <li>
          <a href={story.url} target="_blank" class="story-link">
            {story.title}
          </a>
          <div class="story-details">
            {story.score} points by <a href={`https://news.ycombinator.com/user?id=${story.by}`} target="_blank">{story.by}</a> {timeAgo(story.time)} | 
            <a href={`https://news.ycombinator.com/item?id=${story.id}`} target="_blank">{story.kids ? story.kids.length : 0} comments</a>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 30px 10px;
    background-color: #222;
    color: #fff;
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo img {
    margin-right: 10px;
  }

  .hnname {
    font-size: 16px;
    font-weight: bold;
  }

  .hnname a {
    text-decoration: none;
    color: #fff;
  }

  .hnname a:hover {
    text-decoration: underline;
  }

  .nav {
    display: flex;
    gap: 10px;
    font-size: 0.9rem;
    color: rgb(255, 102, 0);
  }

  .nav a {
    text-decoration: none;
    color: #fff;
  }

  .nav a:hover {
    text-decoration: underline;
  }

  #stories {
    padding: 5px 30px;
    text-shadow: 0 1px 0 rgba(255,255,255,0.5);
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }

  li:last-child {
    border-bottom: none;
  }

  .story-link {
    text-decoration: none;
    color: #222;
    font-weight: bold;
  }

  .story-link:hover {
    text-decoration: underline;
  }

  .story-details {
    font-size: 14px;
    color: #6c757d;
  }

  .story-details a {
    color: rgb(255, 102, 0);
    text-decoration: none;
  }

  .story-details a:hover {
    text-decoration: underline;
  }
</style>
