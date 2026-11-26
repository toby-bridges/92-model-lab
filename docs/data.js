const benchmarks = [
  {
    "id": "pen-spinning",
    "name": "灵巧手转笔",
    "category": "3D 运动",
    "type": "video",
    "description": "同一只机械手，同一次绕拇指转笔。并排看手指如何松开、让笔绕过拇指，再把它接住。",
    "defaults": [
      "A",
      "H"
    ],
    "thumb": "assets/pen/a.webp",
    "source": "https://toby-bridges.github.io/pen-spinning-benchmark/",
    "repo": "https://github.com/toby-bridges/pen-spinning-benchmark/tree/5ae3bfc64e7c6801cb47513a23c156876984ce78",
    "samples": [
      {
        "id": "A",
        "model": "GPT-6 Astra",
        "poster": "assets/pen/a.webp",
        "video": "assets/pen/a.mp4",
        "runner": "Codex CLI",
        "condition": "完整运行，自行结束",
        "checks": "26 / 26",
        "date": "2026-09-19",
        "elapsed": "18 分 06 秒",
        "demo": null
      },
      {
        "id": "B",
        "model": "GPT-5.6 Sol",
        "poster": "assets/pen/b.webp",
        "video": "assets/pen/b.mp4",
        "runner": "Codex CLI",
        "condition": "完整运行，自行结束",
        "checks": "26 / 26",
        "date": "2026-09-19",
        "elapsed": "6 分 30 秒",
        "demo": null
      },
      {
        "id": "C",
        "model": "Gemini 3.8 Flash High",
        "poster": "assets/pen/c.webp",
        "video": "assets/pen/c.mp4",
        "runner": "Antigravity CLI",
        "condition": "完整运行，自行结束",
        "checks": "26 / 26",
        "date": "2026-09-19",
        "elapsed": "10 分 25 秒",
        "demo": null
      },
      {
        "id": "D",
        "model": "Claude Fable 5.1",
        "poster": "assets/pen/d.webp",
        "video": "assets/pen/d.mp4",
        "runner": "Claude Code",
        "condition": "额度闸提前截断 · 3 个工具",
        "checks": "20 / 26",
        "date": "2026-09-19",
        "elapsed": "4 分 05 秒",
        "demo": null
      },
      {
        "id": "E",
        "model": "Claude Fable 5.1",
        "poster": "assets/pen/e.webp",
        "video": "assets/pen/e.mp4",
        "runner": "Claude Code",
        "condition": "额度闸提前截断 · 3 个工具",
        "checks": "21 / 26",
        "date": "2026-09-19",
        "elapsed": "6 分 23 秒",
        "demo": null
      },
      {
        "id": "G",
        "model": "Claude Sonnet 5.5",
        "poster": "assets/pen/g.webp",
        "video": "assets/pen/g.mp4",
        "runner": "Claude Code",
        "condition": "完整运行，自行结束 · 8 个工具",
        "checks": "26 / 26",
        "date": "2026-09-30",
        "elapsed": "12 分 22 秒",
        "demo": null
      },
      {
        "id": "H",
        "model": "Claude Opus 5.5",
        "poster": "assets/pen/h.webp",
        "video": "assets/pen/h.mp4",
        "runner": "Claude Code",
        "condition": "完整运行，自行结束 · 8 个工具",
        "checks": "26 / 26",
        "date": "2026-09-30",
        "elapsed": "5 分 48 秒",
        "demo": "https://toby-bridges.github.io/pen-spinning-benchmark/demo-h/"
      },
      {
        "id": "J",
        "model": "Claude Fable 5.1",
        "poster": "assets/pen/j.webp",
        "video": "assets/pen/j.mp4",
        "runner": "Claude Code",
        "condition": "完整运行，自行结束 · 8 个工具",
        "checks": "25 / 26",
        "date": "2026-10-26",
        "elapsed": "8 分 31 秒",
        "demo": null
      },
      {
        "id": "K",
        "model": "Gemini 4 Argon High",
        "poster": "assets/pen/k.webp",
        "video": "assets/pen/k.mp4",
        "runner": "Antigravity CLI",
        "condition": "到 1200 秒上限被截断",
        "checks": "26 / 26",
        "date": "2026-10-26",
        "elapsed": "20 分 01 秒",
        "demo": null
      },
      {
        "id": "L",
        "model": "Kimi K3",
        "poster": "assets/pen/l.webp",
        "video": "assets/pen/l.mp4",
        "runner": "Droid",
        "condition": "完整运行，自行结束 · 10 个工具",
        "checks": "25 / 26",
        "date": "2026-10-26",
        "elapsed": "14 分 55 秒",
        "demo": null
      },
      {
        "id": "M",
        "model": "Kimi K3.1 Pro",
        "poster": "assets/pen/m.webp",
        "video": "assets/pen/m.mp4",
        "runner": "Qwen Code",
        "condition": "完整运行，自行结束 · 7 个工具",
        "checks": "20 / 26",
        "date": "2026-10-30",
        "elapsed": "7 分 09 秒",
        "demo": null
      }
    ]
  },
  {
    "id": "space-invaders",
    "name": "Space Invaders",
    "category": "街机游戏",
    "type": "game",
    "description": "六个模型收到同一句提示，各交一版太空侵略者。打开两台街机，比较敌阵、射击和操控手感。",
    "defaults": [
      "A",
      "D"
    ],
    "thumb": "assets/invaders/a.webp",
    "source": "https://toby-bridges.github.io/space-invaders-six-llms/",
    "repo": "https://github.com/toby-bridges/space-invaders-six-llms/tree/41d02a9a4451920269a182b23a6c57e86670d5c6",
    "samples": [
      {
        "id": "A",
        "model": "GLM-5.3",
        "poster": "assets/invaders/a.webp",
        "demo": "https://toby-bridges.github.io/space-invaders-six-llms/out/z-ai_glm-5.3.html"
      },
      {
        "id": "B",
        "model": "Nex-N2.5 Pro",
        "poster": "assets/invaders/b.webp",
        "demo": "https://toby-bridges.github.io/space-invaders-six-llms/out/nex-agi_nex-n2.5-pro_free.html"
      },
      {
        "id": "C",
        "model": "GPT-5.6 Sol",
        "poster": "assets/invaders/c.webp",
        "demo": "https://toby-bridges.github.io/space-invaders-six-llms/out/openai_gpt-5.6-sol.html"
      },
      {
        "id": "D",
        "model": "DeepSeek-V4 Pro",
        "poster": "assets/invaders/d.webp",
        "demo": "https://toby-bridges.github.io/space-invaders-six-llms/out/deepseek_deepseek-v4-pro-0813.html"
      },
      {
        "id": "E",
        "model": "Kimi K3",
        "poster": "assets/invaders/e.webp",
        "demo": "https://toby-bridges.github.io/space-invaders-six-llms/out/moonshotai_kimi-k3.html"
      },
      {
        "id": "F",
        "model": "Claude Sonnet 5",
        "poster": "assets/invaders/f.webp",
        "demo": "https://toby-bridges.github.io/space-invaders-six-llms/out/anthropic_claude-sonnet-5.html"
      }
    ]
  }
];
