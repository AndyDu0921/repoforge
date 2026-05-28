/**
 * Real-time GitHub Search API for gap-filling repository recommendations.
 * Includes safety filters to avoid irrelevant or harmful results.
 */

export interface SearchResult {
  name: string;
  url: string;
  description: string;
  stars: number;
}

const MIN_STARS = 10;

const BLOCKED_TERMS = [
  "政治", "民主", "自由", "革命", "维权", "抗议",
  "propaganda", "censorship", "surveillance", "activism",
];

const DEV_SIGNALS = [
  "library", "framework", "SDK", "API", "package", "module", "plugin",
  "tool", "app", "server", "client", "component", "sdk",
  "开源", "库", "框架", "工具", "组件", "插件", "模块", "服务", "接口",
  "集成", "支付", "登录", "认证", "管理", "系统", "平台",
];

function isSafeAndRelevant(item: any): boolean {
  const name = (item.full_name || "").toLowerCase();
  const desc = (item.description || "").toLowerCase();
  const combined = name + " " + desc;

  // Reject if matches any blocked term
  for (const term of BLOCKED_TERMS) {
    if (combined.includes(term.toLowerCase())) return false;
  }

  // Must contain at least one dev-related signal
  for (const signal of DEV_SIGNALS) {
    if (combined.includes(signal.toLowerCase())) return true;
  }

  return false;
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
    if (token) headers["Authorization"] = `token ${token}`;

    const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      searchTerm
    )}&sort=stars&order=desc&per_page=10`;
    const res = await fetch(searchUrl, { headers });

    if (res.ok) {
      const data = await res.json();
      return (data.items || [])
        .filter((item: any) => (item.stargazers_count || 0) >= MIN_STARS)
        .filter(isSafeAndRelevant)
        .slice(0, 3)
        .map((item: any) => ({
          name: item.full_name,
          url: item.html_url,
          description: item.description || "暂无描述。",
          stars: item.stargazers_count || 0,
        }));
    }
  } catch {
    // Silently return empty on failure
  }
  return [];
}
