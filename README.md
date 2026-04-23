# 🌊 Echoes — 你此刻的感受，有人在另一个时空早已懂得

> *What you're feeling now, someone across time has already understood.*

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Hackathon Award](https://img.shields.io/badge/Award-高校黑客松北京第六名-ff6b6b)]()
[![ModelScope Demo](https://img.shields.io/badge/Demo-ModelScope-624aff)](https://www.modelscope.cn/studios/fioluuuna/soul-memory/summary)

> **⚠️ 开发状态**：Echoes 处于早期开发阶段，线上Demo体验尚不稳定，正在迭代中。

---

## 💡 这是什么？

**Echoes 不是日记本，是回声。**

你写下心情，它会从文学作品中找到**和你有过同样感受的人**，把他的话说给你听。你得到的不是一个随机金句，而是一个证据：**你此刻的感受不是奇怪的、孤独的。有人在另一个时空，用更精准的语言，说出过你想说但说不出口的东西。**

---

## 🎯 为什么做这个？

我喜欢挑战，喜欢被压力逼到极限的感觉。但我一直说不清这是为什么，"喜欢挑战"这四个字太轻了。

直到有一次，尼采的一句话击中了我：
> *“那杀不死我的，必使我更强大。”*

我突然明白，我不是第一个有这种感觉的人。后来我去读了《查拉图斯特拉如是说》，找到了一个完整的思想体系来理解自己。

这就是 Echoes 想做的事：**不是让AI安慰你，而是帮你找到那些已经把你说不清楚的感受，彻底说透了的人和书。**

---

## 🧭 它有什么不同？

|  | 日记App | 金句App | AI聊天机器人 | **Echoes** |
|:---|:---:|:---:|:---:|:---:|
| 存储日记 | ✅ | ❌ | ❌ | ✅ |
| 理解你的处境 | ❌ | ❌ | ✅ | ✅ |
| 匹配经典文本 | ❌ | ✅ 随机推 | ❌ | ✅ **因你而选** |
| 解释为何匹配 | ❌ | ❌ | ❌ | ✅ |
| 隐私优先 | ✅ | ✅ | ❌ | ✅ |
| 帮你找书 | ❌ | ❌ | ❌ | ✅ |

---

## 🏗️ 技术栈与架构

核心流程：`用户输入 → 多维语义解析(情感/意象/主题) → 向量检索 → 匹配经典段落 → 生成解释`

| 层级 | 技术选型 |
|:---|:---|
| **前端** | React + TypeScript + TailwindCSS |
| **后端** | NestJS |
| **AI模型** | 阿里云通义千问 (Qwen-Max / text-embedding-v3) |
| **数据库** | PostgreSQL + pgvector 向量检索 |
| **部署** | Docker + ModelScope Spaces |

---

## 🚀 本地运行

```bash
git clone https://github.com/fioluuuna/Echoes.git
cd Echoes
cp .env.example .env   # 填入你的阿里云通义千问 API Key
docker compose up --build
# 打开 http://localhost:3000
```

---

##📂 项目结构与文档

项目前后端分离，模块化设计。
更详细的架构图、API设计和数据库Schema，请见 /docs 目录。

```
Echoes/
├── frontend/          # React 前端应用
├── backend/           # NestJS 后端 API
│   ├── journal/       # 日记模块
│   ├── analysis/      # AI 分析服务
│   └── search/        # 向量检索模块
├── database/          # 文学语料库
├── docker/            # Docker 部署配置
├── docs/              # 📂 详细技术文档
├── .env.example       # 环境变量模板
└── README.md
```

---

## 🔮 下一步计划

- [ ] **叙事级隐私保护**：引入正在研究的 Narrative Privacy 框架
- [ ] **文学库扩充**：覆盖更多文化背景的作者与作品
- [ ] **英文版适配**：让非中文用户也能跨时空共鸣

---

## 🙋 关于我

温州肯恩大学 计算机科学（辅修数学）学生。

兴趣方向：**人本人工智能** —— 情感计算、计算心理健康、AI隐私保护。

正在推进：叙事隐私保护的形式化定义、LLM混合情绪理解、Echoes持续开发。

📧 fioluuuna@gmail.com

---

## 📜 许可证与致谢

本项目基于 Apache License 2.0 开源。

感谢阿里云 ModelScope 平台、通义千问模型，以及高校黑客松北京2026的评委与用户反馈。
