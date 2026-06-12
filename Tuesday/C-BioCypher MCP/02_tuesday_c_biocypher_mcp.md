---
marp: true
theme: default
paginate: true
style: |
  section {
    background-image: url('https://biocypher.org/BioCypher/assets/img/biocypher-open-graph.png');
    background-repeat: no-repeat;
    background-position: top 10px right 10px;
    background-size: 70px auto;
    font-size: 28px;
  }
  :root { --title-color: #23395d; }
  h1 { color: var(--title-color); }
  h2 { color: var(--title-color); }
  em { color: var(--title-color); }
  code { font-size: 0.85em; }
  table { font-size: 0.72em; }
---

# Tuesday C — BioCypher MCP

## AI-assisted BioCypher development

**Goal:** use MCP to inspect and improve the adapter project created earlier.

---

# Where we are

Previous session:

```text
source data → adapter → BioCypher output → Neo4j graph
```

Now we use MCP to support the development workflow.

---

# What MCP adds

MCP connects an AI assistant to project-specific tools and context.

For BioCypher, this means support for:

- Project inspection
- Schema and adapter guidance
- BioCypher-specific debugging
- Test generation
- Safer agentic coding workflows

---

# Use MCP as an assistant layer

```text
VS Code / Claude
      ↓
BioCypher MCP
      ↓
BioCypher project files
      ↓
Human review + tests
```

MCP should assist. It should not replace review.

---

# VS Code setup

Workspace-level MCP configuration:

```text
.vscode/mcp.json
```

Example pattern:

```json
{
  "servers": {
    "biocypher": {
      "type": "stdio",
      "command": "uvx",
      "args": ["biocypher-mcp"]
    }
  }
}
```

---

# Start MCP in VS Code

1. Open Command Palette
2. Run `MCP: List Servers`
3. Select the BioCypher server
4. Start the server
5. Open VS Code Chat / Agent mode
6. Ask BioCypher-specific questions

---

# Safe agentic coding workflow

Before using MCP:

```bash
git status
git add .
git commit -m "Working adapter before MCP session"
```

Then:

1. Ask MCP to inspect first
2. Ask for a proposed patch
3. Review manually
4. Run tests
5. Commit only working changes

---

# Hands-on task 1: inspect the project

Prompt:

```text
Use BioCypher MCP to inspect this project.
Explain the role of create_knowledge_graph.py,
schema_config.yaml, biocypher_config.yaml,
and drug_central_adapter.py.
Do not modify files yet.
```

---

# Hands-on task 2: compare adapter and schema

Prompt:

```text
Compare the output labels emitted by the adapter with
schema_config.yaml. Identify mismatches between node labels,
edge labels, properties, source, and target definitions.
```

Expected outcome:

```text
adapter output ↔ schema definition consistency check
```

---

# Hands-on task 3: explain real-data bugs

Prompt:

```text
Explain why Neo4j import can fail when the input data contains
multi-gene fields or delimiter characters. Use this project as context.
```

Key lessons:

- Edge tuple order
- Multi-value fields
- Delimiter sanitization
- CSV import constraints

---

# Hands-on task 4: generate tests

Ask MCP to propose tests for:

- Drug node generation
- Gene node generation
- `TARGETS` edge generation
- Splitting `A|B`
- Splitting `A; B; C`
- Sanitizing delimiter characters

---

# Novice track

Use MCP to:

- Understand the tutorial project
- Complete or repair the first adapter
- Explain the schema
- Generate simple tests

---

# Advanced track

Use MCP to:

- Review the DrugCentral adapter
- Add adapter tests
- Check schema consistency
- Prepare the project for the next dataset

---

# Session checkpoint

By the end of this session:

| Track | Output |
|---|---|
| Novice | Adapter understood, fixed, or tested |
| Advanced | DrugCentralAdapter reviewed and tested |

Next: metadata, Croissant, and harmonization.
