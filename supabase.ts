import { query } from '@anthropic-ai/claude-agent-sdk';
import type { HookJSONOutput } from "@anthropic-ai/claude-agent-sdk";
import * as path from "path";

async function main() {
  const q = query({
    prompt: '查询一下 supabae 的项目，通过 mcp 查询,并查询一下 vscode 项目 数据库表',
    options: {
      maxTurns: 100,
      cwd: path.join(process.cwd(), 'supabase'),
      model: "opus",
      executable: "node", // Use the current node binary path
      "mcpServers": {
          "supabase": {
            "command": "npx",
            "args": ["-y", "@supabase/mcp-server-supabase@latest"],
            "env": {
              "SUPABASE_ACCESS_TOKEN": "sbp_b0320546d7ac0af40e9806d4a9a305d0b105bdaf"
            }
          }
      },
      allowedTools: [
        "Task", "Bash", "Glob", "Grep", "LS", "ExitPlanMode", "Read", "Edit", "MultiEdit", "Write", "NotebookEdit",
        "WebFetch", "TodoWrite", "WebSearch", "BashOutput", "KillBash", "mcp__supabase__list_projects","mcp__supabase__list_tables"
      ],
      hooks: {}
    },
  });

  for await (const message of q) {
    if (message.type === 'assistant' && message.message) {
      const textContent = message.message.content.find((c: any) => c.type === 'text');
      if (textContent && 'text' in textContent) {
        console.log('Claude says:', textContent.text);
      }
    }
  }
}

main().catch(console.error);
