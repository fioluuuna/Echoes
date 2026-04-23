# 🌊 Echoes — 你此刻的感受，有人在另一个时空早已懂得

> *What you're feeling now, someone across time has already understood.*

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Hackathon Award](https://img.shields.io/badge/Award-高校黑客松北京第六名-ff6b6b)]()

---

## 💡 Echoes 是什么？

**Echoes 不是日记本。Echoes 是回声。**

你写下今天的心情，它会从人类文明的文学宝库中，找到那个**和你有过完全相同感受的人**——那个人可能是一百年前的卡夫卡，一千年前的苏轼，或者两千五百年前的孔子——然后把他的话带给你。

你得到的不只是一段名言。你得到的是一个**证据**：你此刻的感受不是奇怪的、孤独的、不可理解的。有人在另一个时空，用比你精准一百倍的语言，说出过你想说但说不出口的东西。

---

## 🎯 为什么做 Echoes？

### 灵感

我一直知道自己喜欢挑战——比赛、科研、同时推进三个项目。周围人说我"太卷了"，但我知道不是。

不是卷。是一种我说不清楚的需要：**我需要被困难击碎，需要被压力逼到极限，需要在那种"快撑不住了"的边缘反复试探。** 每一次撑过去，我都觉得自己更完整了。但我说不清楚这是为什么——我只能说"我喜欢挑战"，这句话太轻了，像在描述一个爱好。

直到有一次，Echoes匹配到尼采的一句话：

> *"那杀不死我的，必使我更强大。"*

我盯着这句话看了很久。不是因为第一次读到，而是因为我突然意识到：**我不是第一个有这种感觉的人。** 一百多年前，有一个人用一句话说出了我写了五百字都没说清楚的东西。

后来又匹配到尼采的《查拉图斯特拉如是说》——我找到了一个完整的思想体系来理解自己。从那以后，挑战对我来说不再是"坚持一下"，而是**一种有哲学根基的自我塑造方式**。

这就是Echoes想做的事：**不是让AI安慰你，是让你知道——你说不清楚的那种渴望，有人在另一个时空已经替你说清楚了，而且说得比你好一百倍。**

### 它解决什么问题？

| 现有产品 | 你得到的是 | Echoes 给你的是 |
|:---------|:----------|:---------------|
| 日记App | 一个存档的地方 | 一个**回应**你的地方 |
| 金句App | 一段和你的处境无关的文字 | 一段**因你的处境而被选中**的文字 |
| AI聊天机器人 | AI生成的安慰 | **经过时间检验的人类思想** |

**核心差异**：Echoes不生成内容。Echoes是一座桥——把你此刻的不可言说，连接到人类文明中已经存在的、最有重量的表达。

---

## 🧭 核心功能

### 1. 记录 → 被理解（此刻）

你写下文字。Echoes 做三件事：

- **读懂你**：识别你文字中的情绪（不只是"开心/难过"，而是"疏离中的一丝释然"）、意象（雨、窗、路、海）、主题（代际沟通、存在性焦虑、自我超越）
- **寻找回声**：在文学库中匹配 Top 3 最能回应你的经典段落
- **告诉你为什么**：不是"算法给你推了这段话"，而是"你写到X，这段文字也写了X，这就是为什么它能回应你"

### 2. 成长系统（回响）

- 当你和某位作家多次产生共鸣，Ta成为你的**文学同伴**
- 你的记录积累到一定量，系统生成你的**文学人格画像**——"你的文字越来越像鲁迅了"
- 没有排行榜，没有积分。激励来自**对自己的好奇**。

### 3. 时间线（长河）

- **30天情绪曲线**：你的情绪不是散点的，是有周期的。看到它，你就看到了自己。
- **日记时间轴**：回看过去的自己

---

## 🏗️ 技术架构

```mermaid
graph TB
    A[用户输入日记] --> B{多维语义解析}
    B --> C[情感识别]
    B --> D[意象提取]
    B --> E[主题识别]
    B --> F[场景理解]
    C & D & E & F --> G[生成查询向量]
    G --> H[文学库向量检索]
    H --> I[多维度精排序]
    I --> J[匹配结果 + 解释生成]
    J --> K[用户获得共鸣]

| 层级 | 技术选型 |
|------|---------|
| 前端 | React + TypeScript + TailwindCSS |
| 后端 | NestJS (Node.js) |
| AI分析 | 通义千问 Qwen-Max / Qwen-VL-Max / text-embedding-v3 |
| 数据存储 | PostgreSQL + pgvector 向量检索 |
| 部署 | Docker |

🚀 快速开始
bash
git clone https://github.com/fioluuuna/Echoes.git
cd Echoes
cp .env.example .env  # 填入阿里云通义千问 API Key
docker compose up --build
# http://localhost:3000

🔮 下一步计划
叙事级隐私保护：引入 Narrative Privacy 框架，在分析情感的同时对敏感细节进行不可逆模糊

离线模式：完全本地运行，数据不出设备

文学库扩充：覆盖更多文化背景的作者与作品

英文版适配：让非中文用户也能跨时空共鸣

📂 项目结构
text
Echoes/
├── frontend/           # React + TypeScript
├── backend/            # NestJS API
├── database/           # 文学语料库 & 预标注
├── docker/             # Docker 部署配置
└── .env.example

🙋 关于我
研究方向：人本人工智能——情感计算、计算心理健康、AI隐私保护。

正在做的事：

🔬 叙事隐私保护的形式化定义与评估框架

🧪 LLM混合情绪理解的干涉约束微调

🏗️ 持续维护 Echoes，作为人本AI的实践实验场

联系我：fioluuuna@gmail.com

💡 What is Echoes?
Echoes is an AI-powered journal that doesn't just store your words — it responds to them.

You write down how you're feeling. Echoes searches through a curated library of literary classics and finds the passage that resonates most deeply with your current emotional state. It then explains why that passage was chosen — connecting your experience to human thought that has stood the test of time.

Core belief: What you're feeling right now, someone across time has already articulated — and said it better than you ever could.

🎯 Why?
The creator of Echoes kept experiencing the same problem: after writing long journal entries about their inner struggles, they were met with silence. Existing journaling apps archive your words. Quote apps give you random inspiration disconnected from your situation. AI chatbots generate generic comfort.

Echoes does something different: it connects your specific, messy, hard-to-articulate feelings with the most precise human expressions in history.

🧭 Key Features
Feature	Description
Deep Parsing	Multi-dimensional analysis: emotion, imagery, theme, scene
Literary Matching	Vector search across curated literary database, ranked by resonance
Explainable AI	Every match comes with a human-readable explanation of why
Growth System	Unlock "Literary Companions" and discover your "Literary Personality"
Timeline	30-day emotion curves, journal timeline

🏗️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + TailwindCSS |
| Backend | NestJS (Node.js) |
| AI | Alibaba Qwen-Max / Qwen-VL-Max / text-embedding-v3 |
| Database | PostgreSQL + pgvector |
| Deployment | Docker |

🚀 Quick Start
bash
git clone https://github.com/fioluuuna/Echoes.git
cd Echoes
cp .env.example .env
docker compose up --build
# Open http://localhost:3000

🔮 Roadmap
Narrative-level privacy protection

Offline mode (fully local)

Expanded literary database

English language support

🙋 About Me
Research: Human-Centered AI — Affective Computing, Computational Mental Health, AI Privacy.

Currently working on narrative privacy formalization and emotion interference constraints in LLMs. Echoes is my practice ground for building AI that serves human emotional needs responsibly.

Contact: fioluuuna@gmail.com

📜 License
Apache 2.0 © 2025 Echoes Contributors

🙏 致谢
阿里云 ModelScope 提供部署平台

通义千问系列模型

黑客松并肩作战的队员们

所有在黑客松中提供反馈的评委和用户
