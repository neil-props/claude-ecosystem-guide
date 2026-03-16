---
title: "Recipe: Build a Deployment Skill"
slug: recipe-deployment-skill
order: 1
description: "End-to-end walkthrough: create a skill that deploys your app"
section: guides
---

# Recipe: Build a Deployment Skill

## What You Will Build

A **deployment skill** that teaches Claude how to deploy your Node.js application to a VPS via SSH. When you say "deploy the app," Claude will follow a structured checklist -- verifying the working tree is clean, running tests, connecting to your server, pulling the latest code, and restarting the service.

Skills are reusable instruction sets stored as markdown files. Once created, this skill activates automatically whenever your prompt matches its trigger patterns.

## Prerequisites

- Claude Code installed and working in your project
- A Node.js project with a test suite
- SSH access to a deployment target (VPS, EC2 instance, etc.)
- Basic familiarity with [Skills](topics/skills.html) concepts

## Step 1: Create the Skill Directory

Every project can have a `.claude/skills/` directory at its root. Claude discovers skill files automatically at session start.

```bash
mkdir -p .claude/skills
touch .claude/skills/deploy.md
```

Your project structure should now look like this:

```plaintext
my-app/
  .claude/
    skills/
      deploy.md       <-- your new skill file
  src/
  package.json
```

## Step 2: Write the Frontmatter

Open `.claude/skills/deploy.md` and add the YAML frontmatter. This metadata tells Claude *when* to activate the skill and *what tools* it may use.

```yaml
---
name: deploy
description: Deploy the application to production via SSH
triggers:
  - deploy
  - push to production
  - ship it
allowed-tools:
  - Bash
---
```

Key fields:

- **name** -- A short identifier Claude uses internally.
- **description** -- Shown when Claude lists available skills. Make it specific.
- **triggers** -- Phrases that activate this skill. Claude matches these against your prompt.
- **allowed-tools** -- Restricts which tools the skill can use. `Bash` is required for SSH and shell commands.

## Step 3: Write the Skill Body

Below the frontmatter, write the deployment instructions in plain markdown. Claude follows these steps in order.

```markdown
## Deployment Checklist

Before deploying, complete every step in order. Stop and report if any step fails.

### Pre-flight checks

1. Run `git status` and confirm the working tree is clean (no uncommitted changes).
2. Run `npm test` and confirm all tests pass.
3. Confirm the current branch is `main`.

### Deploy

4. SSH into the production server:
   ```
   ssh deploy@your-server.example.com
   ```
5. Navigate to the application directory:
   ```
   cd /opt/my-app
   ```
6. Pull the latest code:
   ```
   git pull origin main
   ```
7. Install any new dependencies:
   ```
   npm ci --production
   ```
8. Restart the application service:
   ```
   sudo systemctl restart my-app
   ```
9. Check the service status:
   ```
   sudo systemctl status my-app
   ```

### Post-deploy verification

10. Curl the health endpoint to confirm the app is responding:
    ```
    curl -f http://localhost:3000/health
    ```
11. Report the deployment result: which commit was deployed, whether health check passed.
```

## Step 4: Test the Skill

Open Claude Code in your project directory and type:

```bash
claude "deploy the app"
```

Claude will:

1. Detect that your prompt matches the `deploy` skill triggers.
2. Load the full skill body.
3. Walk through each step, asking for confirmation before destructive operations (like restarting a service).

## Verify It Works

You know the skill is working correctly when:

- Claude mentions it is following the deployment checklist.
- Pre-flight checks run first (git status, tests).
- Claude asks for confirmation before SSHing to the server.
- Each step runs in the order specified.
- Claude reports a summary at the end (commit hash, health check result).

If Claude does not pick up the skill, verify the file is at `.claude/skills/deploy.md` and the frontmatter `triggers` include a phrase matching your prompt.

## Next Steps

- Read the [Skills reference](topics/skills.html) for all available frontmatter fields, including `globs` for file-pattern activation.
- Explore [Agents](topics/agents.html) for more complex multi-step workflows that go beyond a single checklist.
- Add a [pre-commit hook](topics/hooks.html) to enforce test-passing before Claude can deploy.
