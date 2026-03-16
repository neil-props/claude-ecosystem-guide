---
title: Memory
slug: memory
order: 9
description: Manage Claude's persistent context and learned preferences
color: "#34d399"
section: topics
---

# Memory

## Overview

Memory allows Claude Code to retain information across conversations. When Claude learns something important about your project or preferences, it can store that knowledge for future sessions. Memory operates at multiple levels -- project memory, user memory, and session memory -- each with different persistence and scope.

Memory helps Claude avoid asking the same questions repeatedly and maintain context about long-running projects.

## Quick Example

Claude stores memories in structured files. You can view and manage them:

```bash
# View current project memories
claude memory list --scope project

# Add a manual memory
claude memory add "This project uses pnpm, not npm"

# Clear outdated memories
claude memory clear --before 2024-01-01
```

## Coming Soon

Full content including memory types, storage format, privacy controls, and memory management best practices will be added in Phases 2-4.
