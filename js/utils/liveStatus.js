// js/utils/liveStatus.js
// Client-side reachability probing and GitHub public data fetching with session caching

const GH_CACHE_KEY = 'gh_stats_cache_v2';
const STATUS_CACHE_KEY = 'purpleloop_status_cache_v2';

/**
 * Probes a foreign HTTP/HTTPS endpoint from the client browser without CORS blockage.
 * Uses no-cors mode and a strict AbortController timeout.
 * Returns true if the host is reachable and responded; false on network failure/timeout.
 */
export async function probeEndpoint(url, timeoutMs = 4500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Attempt no-cors fetch (opaque response indicates network reachability)
    await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timer);
    return true;
  } catch (err) {
    clearTimeout(timer);
    return false;
  }
}

/**
 * Checks PurpleLoop API and Frontend live status.
 * Never shows fake online: green = reachable, grey = could not verify.
 */
export async function checkPurpleLoopStatus() {
  const appUrl = 'https://purpleloop-weld.vercel.app';
  const apiUrl = 'https://purpleloop-api.onrender.com';

  const [appReachable, apiReachable] = await Promise.all([
    probeEndpoint(appUrl, 4500),
    probeEndpoint(apiUrl, 4500)
  ]);

  const result = {
    appUrl,
    apiUrl,
    appReachable,
    apiReachable,
    timestamp: Date.now()
  };

  try {
    sessionStorage.setItem(STATUS_CACHE_KEY, JSON.stringify(result));
  } catch (e) {
    // Ignore storage quota errors
  }

  return result;
}

/**
 * Fetches public metrics from the GitHub REST API for the user.
 * Caches in sessionStorage. If the API fails or is rate-limited, fails silently (returns null).
 */
export async function getGitHubLiveStats(username = 'AnupamGupta-Pro00Nation') {
  // Check session cache first
  try {
    const cached = sessionStorage.getItem(GH_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Valid cache for 30 minutes
      if (Date.now() - parsed._cachedAt < 1800000) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore cache parse error
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!userRes.ok) {
      clearTimeout(timer);
      return null;
    }

    const userData = await userRes.json();

    // Fetch repositories for stars & language details
    let reposData = [];
    try {
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (reposRes.ok) {
        reposData = await reposRes.json();
      }
    } catch (e) {
      // Repos list optional
    }

    clearTimeout(timer);

    const projectStats = {};
    if (Array.isArray(reposData)) {
      for (const repo of reposData) {
        projectStats[repo.name.toLowerCase()] = {
          name: repo.name,
          stars: repo.stargazers_count || 0,
          language: repo.language || 'Code',
          forks: repo.forks_count || 0,
          updatedAt: repo.updated_at
        };
      }
    }

    const payload = {
      username: userData.login,
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      projects: projectStats,
      _cachedAt: Date.now()
    };

    try {
      sessionStorage.setItem(GH_CACHE_KEY, JSON.stringify(payload));
    } catch (e) {
      // Ignore sessionStorage errors
    }

    return payload;
  } catch (err) {
    clearTimeout(timer);
    return null;
  }
}
