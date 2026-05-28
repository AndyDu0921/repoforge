import { NextRequest, NextResponse } from "next/server";
import { fetchRepoDetails } from "@/lib/github";
import { callDeepSeek, type FetchedRepo } from "@/lib/deepseek";
import { liveSearchGitHubRepo } from "@/lib/gap-search";

export const runtime = "edge";

const MAX_REPOS = 10;
const SAFE_ERROR = "服务繁忙，请稍后重试。";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { repos, dialogueAnswers, customToken } = body;

    if (!repos || !Array.isArray(repos) || repos.length === 0) {
      return NextResponse.json({ error: "请至少添加一个 GitHub 仓库。" }, { status: 400 });
    }
    if (repos.length > MAX_REPOS) {
      return NextResponse.json({ error: `最多只能同时分析 ${MAX_REPOS} 个仓库。` }, { status: 400 });
    }

    // Validate each repo has valid owner/repo
    for (const r of repos) {
      if (!r.owner || !r.repo || /[^a-zA-Z0-9._-]/.test(r.owner) || /[^a-zA-Z0-9._-]/.test(r.repo)) {
        return NextResponse.json({ error: `仓库格式无效：${r.owner}/${r.repo}` }, { status: 400 });
      }
    }

    const githubToken = customToken || process.env.GITHUB_TOKEN || "";
    const deepseekApiKey = "__DEEPSEEK_API_KEY__";

    // 1. Fetch all repo metadata in parallel
    const fetchedRepos: FetchedRepo[] = [];
    const fetchErrors: string[] = [];

    await Promise.all(
      repos.map(async (r: { owner: string; repo: string; userNotes?: string }) => {
        try {
          const detail = await fetchRepoDetails(r.owner, r.repo, githubToken);
          fetchedRepos.push({ ...detail, userNotes: r.userNotes || "" });
        } catch {
          fetchErrors.push(`${r.owner}/${r.repo}: 无法获取此仓库信息，请检查仓库是否存在或 API 限流。`);
        }
      })
    );

    if (fetchedRepos.length === 0) {
      return NextResponse.json(
        { error: "无法获取任何仓库信息，请检查仓库路径或网络连接。", details: fetchErrors },
        { status: 404 }
      );
    }

    // 2. Call DeepSeek
    const answers = {
      audience: dialogueAnswers?.audience || "saas",
      audienceCustom: dialogueAnswers?.audienceCustom || "",
      commercial: dialogueAnswers?.commercial || "subscription",
      commercialCustom: dialogueAnswers?.commercialCustom || "",
      licenseChoice: dialogueAnswers?.licenseChoice || "strict",
      licenseCustom: dialogueAnswers?.licenseCustom || "",
      techPreference: dialogueAnswers?.techPreference || "Pure TypeScript (Next.js / Tailwind)",
      techCustom: dialogueAnswers?.techCustom || "",
      targetGoal: dialogueAnswers?.targetGoal || "打造一个高度整合的全栈平台",
    };

    const parsedData = await callDeepSeek(fetchedRepos, answers, deepseekApiKey);

    // 3. Enrich gaps with live GitHub Search
    if (parsedData.gaps && Array.isArray(parsedData.gaps)) {
      await Promise.all(
        parsedData.gaps.map(async (gap: any) => {
          const term = gap.github_search_term || "";
          if (term) {
            gap.suggested_projects = await liveSearchGitHubRepo(term, githubToken);
          } else {
            gap.suggested_projects = [];
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      fetchedRepos: fetchedRepos.map((r) => ({
        owner: r.owner, repo: r.repo, name: r.name,
        description: r.description, stars: r.stars, forks: r.forks,
        license: r.license, language: r.language, pushedAt: r.pushedAt,
      })),
      fetchErrors: fetchErrors.length > 0 ? fetchErrors : undefined,
    });
  } catch {
    return NextResponse.json({ error: SAFE_ERROR }, { status: 500 });
  }
}
