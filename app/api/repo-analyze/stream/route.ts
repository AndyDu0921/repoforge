import { NextRequest } from "next/server";
import { fetchRepoDetails } from "@/lib/github";
import { callDeepSeek, type FetchedRepo } from "@/lib/deepseek";
import { liveSearchGitHubRepo } from "@/lib/gap-search";

export const runtime = "edge";

const MAX_REPOS = 10;
const SAFE_ERROR = "服务繁忙，请稍后重试。";

function sendEvent(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  event: string,
  data: any
) {
  controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { repos, dialogueAnswers, customToken } = body;

  const githubToken = customToken || process.env.GITHUB_TOKEN || "";
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

  if (!deepseekApiKey) {
    return new Response(
      JSON.stringify({ error: "服务器未配置 AI API，请联系管理员设置 DEEPSEEK_API_KEY。" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!repos || !Array.isArray(repos) || repos.length === 0) {
    return new Response(
      JSON.stringify({ error: "请至少添加一个 GitHub 仓库。" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (repos.length > MAX_REPOS) {
    return new Response(
      JSON.stringify({ error: `最多只能同时分析 ${MAX_REPOS} 个仓库。` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate repo identifiers
  for (const r of repos) {
    if (!r.owner || !r.repo || /[^a-zA-Z0-9._-]/.test(r.owner) || /[^a-zA-Z0-9._-]/.test(r.repo)) {
      return new Response(
        JSON.stringify({ error: `仓库格式无效：${r.owner}/${r.repo}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Stage 1: Fetch repos
        sendEvent(controller, encoder, "stage", {
          stage: "fetching_repos",
          message: `正在读取 ${repos.length} 个仓库的信息...`,
          progress: 15,
        });

        const fetchedRepos: FetchedRepo[] = [];
        const fetchErrors: string[] = [];

        await Promise.all(
          repos.map(async (r: { owner: string; repo: string; userNotes?: string }) => {
            try {
              const detail = await fetchRepoDetails(r.owner, r.repo, githubToken);
              fetchedRepos.push({ ...detail, userNotes: r.userNotes || "" });
            } catch {
              fetchErrors.push(`${r.owner}/${r.repo}: 无法获取` );
            }
          })
        );

        if (fetchedRepos.length === 0) {
          sendEvent(controller, encoder, "error", {
            message: "无法获取任何仓库信息，请检查仓库路径或网络连接。",
            details: fetchErrors,
          });
          controller.close();
          return;
        }

        sendEvent(controller, encoder, "stage", {
          stage: "fetched_repos",
          message: `已读取 ${fetchedRepos.length} 个仓库，正在调用 AI 进行分析...`,
          progress: 35,
        });

        // Stage 2: DeepSeek
        sendEvent(controller, encoder, "stage", {
          stage: "analyzing",
          message: "AI 正在分析仓库结构、依赖关系和技术栈...",
          progress: 50,
        });

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

        sendEvent(controller, encoder, "stage", {
          stage: "deepseek_done",
          message: "AI 分析完成。正在检索开源社区中的补充组件...",
          progress: 75,
        });

        // Stage 3: Live GitHub search for gaps
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

        sendEvent(controller, encoder, "stage", {
          stage: "searching_done",
          message: "补充组件已就位。正在进行许可证合规检查...",
          progress: 90,
        });

        // Stage 4: Done
        sendEvent(controller, encoder, "stage", {
          stage: "done",
          message: "方案已生成！正在整理开发蓝图...",
          progress: 100,
        });

        sendEvent(controller, encoder, "result", {
          data: parsedData,
          fetchedRepos: fetchedRepos.map((r) => ({
            owner: r.owner, repo: r.repo, name: r.name,
            description: r.description, stars: r.stars, forks: r.forks,
            license: r.license, language: r.language, pushedAt: r.pushedAt,
          })),
          fetchErrors: fetchErrors.length > 0 ? fetchErrors : undefined,
        });

        controller.close();
      } catch {
        sendEvent(controller, encoder, "error", { message: SAFE_ERROR });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
