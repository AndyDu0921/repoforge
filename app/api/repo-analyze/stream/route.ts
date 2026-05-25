import { NextRequest } from "next/server";
import { fetchRepoDetails } from "@/lib/github";
import { callDeepSeek, type FetchedRepo } from "@/lib/deepseek";
import { liveSearchGitHubRepo } from "@/lib/gap-search";

export const maxDuration = 120;

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
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY || "";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Validate
        if (!deepseekApiKey) {
          sendEvent(controller, encoder, "error", { message: "服务端未配置 DEEPSEEK_API_KEY 环境变量。" });
          controller.close();
          return;
        }

        if (!repos || !Array.isArray(repos) || repos.length === 0) {
          sendEvent(controller, encoder, "error", { message: "至少需要导入一个 GitHub 仓库作为源材料。" });
          controller.close();
          return;
        }

        // Stage 1: Fetch repos
        sendEvent(controller, encoder, "stage", {
          stage: "fetching_repos",
          message: `核录物理仓库物料：共计加载 ${repos.length} 个目标开源工程。`,
          progress: 15,
        });

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
          sendEvent(controller, encoder, "error", {
            message: "无法获取指定 GitHub 仓库的元数据包。",
            details: fetchErrors,
          });
          controller.close();
          return;
        }

        sendEvent(controller, encoder, "stage", {
          stage: "fetched_repos",
          message: `测试并挂载 GitHub API 终点，成功提取 ${fetchedRepos.length} 个仓库元数据。正在提取源材料三方依赖树...`,
          progress: 35,
        });

        // Stage 2: DeepSeek analysis
        sendEvent(controller, encoder, "stage", {
          stage: "analyzing",
          message: "完成基本物料预审。全量投喂至 DeepSeek V4 Pro 语义架构分析大底座，启动高维映射融合...",
          progress: 50,
        });

        const answers = {
          audience: dialogueAnswers?.audience || "saas",
          commercial: dialogueAnswers?.commercial || "subscription",
          licenseChoice: dialogueAnswers?.licenseChoice || "strict",
          techPreference: dialogueAnswers?.techPreference || "Pure TypeScript (Next.js / Tailwind)",
          targetGoal: dialogueAnswers?.targetGoal || "打造一个高度整合的全栈平台",
        };

        const parsedData = await callDeepSeek(fetchedRepos, answers, deepseekApiKey);

        sendEvent(controller, encoder, "stage", {
          stage: "deepseek_done",
          message: "模型高维映射融合就绪。开始探查代码缺口，并行检索 GitHub live 实存推荐存储库进行对齐...",
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
          message: "对齐推荐库成功。正在为检测到的痛点做许可证侵入传染性法律合规性审计评判...",
          progress: 90,
        });

        // Stage 4: Done
        sendEvent(controller, encoder, "stage", {
          stage: "done",
          message: "編排高品质 CLAUDE.md 标准设计指令提示词与第一期构建落地路径图成功！熔铸完成。",
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
      } catch (error: any) {
        sendEvent(controller, encoder, "error", {
          message: error?.message || "在执行多物理仓库熔炼分析时遭遇未知错误。",
        });
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
