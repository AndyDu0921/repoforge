/**
 * DeepSeek API integration — prompt construction and chat completion.
 */

export interface DialogueAnswers {
  audience: string;
  commercial: string;
  licenseChoice: string;
  techPreference: string;
  targetGoal: string;
}

export interface FetchedRepo {
  owner: string;
  repo: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  license: string;
  readme: string;
  userNotes: string;
  pushedAt: string;
}

function buildReposContext(repos: FetchedRepo[]): string {
  return repos
    .map((r, i) => {
      return `
=== Repository [${i + 1}]: ${r.owner}/${r.repo} ===
Name: ${r.name}
Description: ${r.description}
Stars: ${r.stars} | Forks: ${r.forks}
Primary Language: ${r.language}
License: ${r.license}
User Notes: ${r.userNotes || "无"}
--- Truncated README excerpt ---
${r.readme}
===================================
`;
    })
    .join("\n");
}

function buildSystemPrompt(answers: DialogueAnswers): string {
  const { audience, commercial, licenseChoice, techPreference, targetGoal } = answers;

  return `
你是一位享誉全球的传奇全栈系统架构师与首席代码架构师，专精于将多个离散、去中心化的开源 GitHub 仓库融合重组为高内聚、高生产力、高性能的综合产品线。
你需要在宏观、微观层面对输入的开源物料开展高维拓扑关系配准、开源许可证合规排查、依赖版本碰撞分析、功能缺失诊断，并输出一份终极重朔开发蓝图。

对齐与对标重塑目标：
- 聚合总目的: ${targetGoal}
- 目标用户群体: ${audience}
- 商业化/付费定位: ${commercial}
- 开源许可证约束方针: ${licenseChoice}
- 偏好技术栈底盘: ${techPreference}

你必须通过返回规范、合法的 JSON 对象向调用端回传数据。

【重要】关于 Prompt Studio 的输出规范：
你的 JSON 属性 "prompt_template_claude" 必须是一个格式纯正、极其详尽且对 Claude Code, Cursor 与 Windsurf 产生最高效自动驱动力的标准「CLAUDE.md」格式文本。
该文本必须在 Markdown 内完全闭合，并严格包含以下 5 大核心章节（以中文编写）：
1. # CLAUDE.md - 项目全景大纲 (含融合总设计、技术栈选择对齐)
2. ## 1. 融合目标与顶盘综述
3. ## 2. 最终技术栈清单与核心依赖协调
4. ## 3. 重塑后的整体目录树结构 (Directory Tree Structure)
5. ## 4. 全域环境变量模板配置文件 (.env.example 关键字段定义与释义)
6. ## 5. 第一步自动化拉取编译引导任务指令集 (First Step Build Guidance)

【重要】关于系统缺口（gaps）及搜索推荐：
对于分析出的每个重大缺口，你需要列举 1-2 个具体的开源解决方案，并分别为它们提供精确的 "github_search_term"（用于支持服务器端开展真实的 live API 库检索对齐，例如 "nextauthjs/next-auth" 或 "stripe-node"）。

CRITICAL OUTPUT REQUIREMENT:
You MUST output all humanoid-facing text, roadmaps, warnings, and CLAUDE.md developer prompt instructions in high-quality Technical Chinese.
`;
}

function buildUserPrompt(repos: FetchedRepo[]): string {
  const reposInfoForAI = buildReposContext(repos);

  return `
请将以下存储库进行高保真聚合研判：
${reposInfoForAI}

你必须仅输出一个绝对合法、无多余转义符的纯 JSON 对象，其 Schema 规范完全对标如下结构：
{
  "product_name": "融合后的统一名称 (例如: RepoForge-Unify)",
  "product_description": "融合平台的业务综述，清晰呈现结合后的最终高附加值体验。",
  "architecture_diagram_data": {
    "nodes": [
      { "id": "ui_core", "label": "前端控制流顶盘", "type": "frontend", "description": "统一的用户控制前端，引入 Next.js 与 Tailwind 质感" },
      { "id": "auth_service", "label": "认证中间件", "type": "backend", "description": "处理共享安全凭据校验控制点" }
    ],
    "edges": [
      { "from": "ui_core", "to": "auth_service", "label": "HTTPS 动态鉴权请求" }
    ]
  },
  "modules": [
    {
      "repo": "owner/repo",
      "role": "在该综合系统底盘下被分配的具体职责角色 (如：核心通信总线、三方 API 中转站)",
      "key_features": ["提取物料并导入的核心功能特征 1", "核心特征 2"],
      "technical_compatibility": "此物料与偏好技术栈的微观语言兼容性评估报告"
    }
  ],
  "gaps": [
    {
      "title": "鉴权安全隔离缺失",
      "description": "缺乏多物料共享的统一用户凭据底盘，需外接组件补缺对位。",
      "severity": "critical" 或 "moderate" 或 "optional",
      "github_search_term": "next-auth",
      "suggested_projects": [
        { "name": "NextAuth.js", "url": "https://github.com/nextauthjs/next-auth", "description": "Next.js 推荐的主流安全认证和会话框架。" }
      ]
    }
  ],
  "conflicts": [
    {
      "category": "许可证传播风险" 或 "包依赖冲突" 或 "异构语言通信阻尼",
      "description": "检测评估到的明确集成痛点细节",
      "mitigation": "架构师推荐的解耦、中置代理或规避操作手段"
    }
  ],
  "tech_stack": {
    "frontend": "推荐的前端表现框架",
    "backend": "推荐的后端运行环境/开发库",
    "database": "持久化方案分布推荐",
    "deployment": "部署手段 (如 Docker Compose , Vercel )",
    "license_verdict": "综合开源协议传染研判与商业化运作最终放行结论"
  },
  "step_by_step_roadmap": [
    {
      "phase": "第一期 / 第二期 / 第三期",
      "title": "阶段目标标题",
      "duration": "估算时效 (如: 3-5 研发日)",
      "tasks": ["开发子任务 A", "开发子任务 B"]
    }
  ],
  "prompt_template_claude": "【此项严禁缩写，必须输出极为详实的高匹配度标准 CLAUDE.md 多段业务落地方案、环境变量。以中文书写。】"
}
`;
}

export async function callDeepSeek(
  repos: FetchedRepo[],
  answers: DialogueAnswers,
  apiKey: string
): Promise<any> {
  const systemPrompt = buildSystemPrompt(answers);
  const userPrompt = buildUserPrompt(repos);

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API call failed: ${response.statusText} (${errText})`);
  }

  const resJson = await response.json();
  const assistantPayload = resJson.choices?.[0]?.message?.content;
  return JSON.parse(assistantPayload || "{}");
}
