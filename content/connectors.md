---
title: Connectors
slug: connectors
order: 7
description: Connect Claude Code to external services and data platforms
color: "#fbbf24"
section: topics
---

# Connectors

## Overview

Connectors provide Claude Code with access to external services and data platforms through standardized interfaces. While MCP servers handle tool-level integrations, connectors operate at a higher level -- connecting Claude to entire platforms like databases, cloud providers, or SaaS applications with pre-built authentication and data access patterns.

Connectors simplify the process of giving Claude read and write access to your infrastructure.

## Quick Example

Configure a database connector:

```yaml
connectors:
  postgres:
    type: database
    connection_string: postgresql://user:pass@localhost:5432/mydb
    read_only: true
    tables:
      - users
      - orders
      - products
```

## Coming Soon

Full content including connector types, authentication flows, security considerations, and connector vs MCP comparison will be added in Phases 2-4.
