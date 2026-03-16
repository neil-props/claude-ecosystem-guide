---
title: Commands
slug: commands
order: 8
description: Define reusable prompt shortcuts and workflow triggers
color: "#38bdf8"
section: topics
---

# Commands

## Overview

Commands are reusable prompt shortcuts that let you invoke complex instructions with a simple name. Instead of typing the same detailed prompt every time, you define a command once and call it by name. Commands can include parameters, reference files, and chain multiple actions together.

Commands are ideal for repetitive tasks where the prompt structure stays the same but the target changes.

## Quick Example

Define a command in `.claude/commands/`:

```markdown
# Generate Tests

Generate comprehensive tests for the specified file:

1. Read the source file: $FILE
2. Identify all exported functions and classes
3. Write tests using the project's test framework
4. Include edge cases and error scenarios
5. Save tests to the corresponding test directory
```

Then use it:

```bash
claude /generate-tests FILE=src/utils/auth.ts
```

## Coming Soon

Full content including command syntax, parameter handling, file references, and command vs agent comparison will be added in Phases 2-4.
