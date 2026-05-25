/**
 * Helper utilities for GitHub API interactions
 */

export interface GithubRepoMeta {
  owner: string;
  repo: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  license: string;
  licenseUrl?: string;
  language: string;
  pushedAt: string;
  readme: string;
}

/**
 * Parses GitHub URL into owner and repo name
 */
export function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  if (!url) return null;
  
  const cleanUrl = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
  
  // Handle https://github.com/owner/repo
  // and git@github.com:owner/repo
  const match = cleanUrl.match(/(?:github\.com\/|git@github\.com:)([^/]+)\/([^/]+)/);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
    };
  }
  return null;
}

/**
 * Fetches repository metadata and README content from GitHub
 */
export async function fetchRepoDetails(
  owner: string,
  repo: string,
  customToken?: string
): Promise<GithubRepoMeta> {
  const token = customToken || process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  // 1. Fetch metadata
  const metaUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const metaRes = await fetch(metaUrl, { headers });

  if (!metaRes.ok) {
    const errText = await metaRes.text();
    throw new Error(
      `Failed to fetch metadata for ${owner}/${repo}: ${metaRes.statusText} (${errText})`
    );
  }

  const metaData = await metaRes.json();

  // 2. Fetch README
  let readmeText = "";
  const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
  const readmeRes = await fetch(readmeUrl, { headers });

  if (readmeRes.ok) {
    const readmeData = await readmeRes.json();
    if (readmeData.content && readmeData.encoding === "base64") {
      // Decode base64 UTF-8 safely
      const base64Str = readmeData.content.replace(/\s/g, "");
      const binaryString = atob(base64Str);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decoder = new TextDecoder("utf-8");
      readmeText = decoder.decode(bytes);
    }
  }

  // Truncate README content to max ~6000 chars to save token context
  const maxReadmeLength = 6000;
  const truncatedReadme =
    readmeText.length > maxReadmeLength
      ? readmeText.slice(0, maxReadmeLength) + "\n\n...(truncated for context length limits)..."
      : readmeText;

  return {
    owner,
    repo,
    name: metaData.name || repo,
    description: metaData.description || "No description provided.",
    stars: metaData.stargazers_count || 0,
    forks: metaData.forks_count || 0,
    license: metaData.license?.spdx_id || metaData.license?.name || "Unknown",
    licenseUrl: metaData.license?.url,
    language: metaData.language || "Unknown",
    pushedAt: metaData.pushed_at || "",
    readme: truncatedReadme,
  };
}
