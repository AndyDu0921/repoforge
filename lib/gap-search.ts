/**
 * Real-time GitHub Search API for gap-filling repository recommendations.
 */
export interface SearchResult {
  name: string;
  url: string;
  description: string;
  stars: number;
}

export async function liveSearchGitHubRepo(
  searchTerm: string,
  token: string
): Promise<SearchResult[]> {
  if (!searchTerm) return [];

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "RepoForge",
    };
    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      searchTerm
    )}&sort=stars&order=desc`;
    const res = await fetch(searchUrl, { headers });

    if (res.ok) {
      const data = await res.json();
      return (data.items || []).slice(0, 3).map((item: any) => ({
        name: item.full_name,
        url: item.html_url,
        description: item.description || "无项目描述。",
        stars: item.stargazers_count || 0,
      }));
    }
  } catch (err) {
    console.error(`Live GitHub Search failed for term "${searchTerm}":`, err);
  }
  return [];
}
