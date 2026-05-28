export function downloadMarkdownReport(blueprintResult: any, techPreference: string) {
  if (!blueprintResult) return;

  const techLabel =
    techPreference === "typescript-next" ? "TypeScript (Next.js / Tailwind)" :
    techPreference === "python-ai" ? "Python (FastAPI + React)" :
    techPreference === "go-rust" ? "Go/Rust High Performance" :
    "Container Agnostic microservices";

  const sections = [
    `# ${blueprintResult.product_name} — 项目技术方案`,
    `> 由 RepoForge 生成 | ${new Date().toISOString().slice(0, 10)}`,
    `\n## 一、项目概述`,
    `${blueprintResult.product_description}`,
    `\n## 二、使用的开源项目`,
    `| 仓库 | 角色 | 核心能力 | 技术兼容性 (${techLabel}) |`,
    `|---|---|---|---|`,
    ...(blueprintResult.modules ?? []).map((m: any) =>
      `| ${m.repo} | ${m.role} | ${m.key_features?.join(", ") || "核心功能"} | ${m.technical_compatibility} |`
    ),
    `\n## 三、推荐技术栈`,
    `- **前端**：${blueprintResult.tech_stack?.frontend || "Next.js / Tailwind"}`,
    `- **后端**：${blueprintResult.tech_stack?.backend || "Node.js / Express"}`,
    `- **数据库**：${blueprintResult.tech_stack?.database || "PostgreSQL"}`,
    `- **部署**：${blueprintResult.tech_stack?.deployment || "Docker"}`,
    `- **许可证结论**：${blueprintResult.tech_stack?.license_verdict || "MIT / 安全"}`,
    `\n## 四、能力缺口与补充方案`,
    ...(blueprintResult.gaps ?? []).map((g: any) =>
      `### ${g.title}\n*问题*：${g.description}\n\n*推荐项目*：\n` +
      (g.suggested_projects ?? []).map((p: any) => `- **${p.name}** (${p.url})：${p.description}（⭐ ${p.stars}）`).join("\n")
    ),
    `\n## 五、许可证检查`,
    blueprintResult.conflicts && blueprintResult.conflicts.length > 0
      ? blueprintResult.conflicts.map((c: any) => `### ${c.category}\n- **问题**：${c.description}\n- **建议**：${c.mitigation}`).join("\n\n")
      : `未发现许可证冲突，所有仓库在你的使用场景下互相兼容。`,
    `\n## 六、实施路线图`,
    ...(blueprintResult.step_by_step_roadmap ?? []).map((s: any) =>
      `### ${s.phase}：${s.title}（${s.duration}）\n` + (s.tasks ?? []).map((t: string) => `- ${t}`).join("\n")
    ),
    `\n## 七、AI 开发文档（CL AUDE.md）`,
    `\`\`\`markdown`,
    blueprintResult.prompt_template_claude,
    `\`\`\``,
  ].join("\n");

  const element = document.createElement("a");
  const file = new Blob([sections], { type: "text/plain;charset=utf-8" });
  element.href = URL.createObjectURL(file);
  element.download = `${(blueprintResult.product_name || "方案").toLowerCase().replace(/\s+/g, "-")}-技术方案.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
