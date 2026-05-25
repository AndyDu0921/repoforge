import { NextRequest, NextResponse } from "next/server";
import { fetchRepoDetails } from "@/lib/github";
import { callDeepSeek, type FetchedRepo } from "@/lib/deepseek";
import { liveSearchGitHubRepo } from "@/lib/gap-search";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { repos, dialogueAnswers, customToken } = body;

    if (!repos || !Array.isArray(repos) || repos.length === 0) {
      return NextResponse.json(
        { error: "至少需要导入一个 GitHub 仓库作为源材料。" },
        { status: 400 }
      );
    }

    const githubToken = customToken || process.env.GITHUB_TOKEN || "";
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY || "";

    if (!deepseekApiKey) {
      return NextResponse.json(
        { error: "服务端未配置 DEEPSEEK_API_KEY 环境变量。" },
        { status: 500 }
      );
    }

    // 1. Fetch all repo metadata in parallel
    const fetchedRepos: FetchedRepo[] = [];
    const fetchErrors: string[] = [];

    await Promise.all(
      repos.map(async (r: { owner: string; repo: string; userNotes?: string }) => {
        try {
          const detail = await fetchRepoDetails(r.owner, r.repo, githubToken);
          fetchedRepos.push({ ...detail, userNotes: r.userNotes || "" });
        } catch (err: any) {
          fetchErrors.push(`${r.owner}/${r.repo}: ${err.message || err}`);
        }
      })
    );

    if (fetchedRepos.length === 0) {
      return NextResponse.json(
        { error: "无法获取指定 GitHub 仓库的元数据包，请检查路径或 GitHub PAT 开源可用性。", details: fetchErrors },
        { status: 404 }
      );
    }

    // 2. Call DeepSeek for semantic analysis
    const answers = {
      audience: dialogueAnswers?.audience || "saas",
      commercial: dialogueAnswers?.commercial || "subscription",
      licenseChoice: dialogueAnswers?.licenseChoice || "strict",
      techPreference: dialogueAnswers?.techPreference || "Pure TypeScript (Next.js / Tailwind)",
      targetGoal: dialogueAnswers?.targetGoal || "打造一个高度整合的全栈平台",
    };

    const parsedData = await callDeepSeek(fetchedRepos, answers, deepseekApiKey);

    // 3. Enrich gaps with live GitHub Search results
    if (parsedData.gaps && Array.isArray(parsedData.gaps)) {
      await Promise.all(
        parsedData.gaps.map(async (gap: any) => {
          const term = gap.github_search_term || gap.title || "";
          if (term) {
            const liveResults = await liveSearchGitHubRepo(term, githubToken);
            if (liveResults.length > 0) {
              gap.suggested_projects = liveResults;
            }
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
  } catch (error: any) {
    console.error("API handler failure:", error);
    return NextResponse.json(
      { error: error?.message || "在执行多物理仓库熔炼分析时遭遇未知错误，请检查网络和 API 配置。" },
      { status: 500 }
    );
  }
}
