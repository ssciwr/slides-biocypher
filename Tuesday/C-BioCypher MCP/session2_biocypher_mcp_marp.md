---
marp: true
theme: default
paginate: true
size: 16:9
header: "BioCypher Workshop · Session 2"
footer: "BioCypher MCP · Drug Discovery KG"
---

# BioCypher MCP
## Using domain-specific AI assistance in VS Code

**Session 2**  
Continue the Drug Discovery Knowledge Graph use case

---

# Starting point

From Session 1, we already have:

```text
DrugCentral TSV.GZ
  → FileDownload in create_knowledge_graph.py
  → DrugCentralAdapter
  → (:Drug)-[:TARGETS]->(:Gene)
  → Neo4j import
```

Today we do **not** start a new graph.

We use BioCypher MCP to improve the same project.

---

# Session goal

Use **BioCypher MCP** to guide and validate BioCypher development.

By the end, participants should know how to:

- configure BioCypher MCP in VS Code
- inspect the available MCP tools
- ask MCP for adapter and schema guidance
- use MCP to review the current DrugCentral project
- prepare the next step: `HGNCAdapter`

---

# What BioCypher MCP is

BioCypher MCP is an **MCP server for BioCypher workflows**.

It provides structured guidance for:

- BioCypher project creation
- adapter creation workflows
- schema configuration
- resource management and caching
- reusable implementation patterns
- decision guidance for adapter design

> The repository currently describes it as an incomplete demonstration prototype.

---

# What MCP adds to the workflow

Without MCP:

```text
Developer reads docs → writes adapter → debugs schema/import issues
```

With MCP:

```text
Developer asks VS Code Agent
  → BioCypher MCP exposes workflow tools
  → Agent gives BioCypher-specific guidance
  → Developer reviews and applies changes
```

MCP is guidance and tooling, not automatic correctness.

---

# Available BioCypher MCP tools

Core workflow tools:

```text
get_available_workflows
get_adapter_creation_workflow
get_phase_guidance
get_implementation_patterns
get_decision_guidance
```

Project and configuration tools:

```text
check_project_exists
get_cookiecutter_instructions
get_schema_configuration_guidance
get_resource_management_guidance
```

---

# VS Code configuration file

Create:

```text
.vscode/mcp.json
```

VS Code uses this file to define MCP servers for the current workspace.

For the workshop, workspace-level configuration is useful because everyone works inside the same BioCypher project.

---

# Option A: Remote BioCypher MCP

Use this for the workshop if the remote service is available:

```json
{
  "servers": {
    "biocypherMcp": {
      "type": "http",
      "url": "https://mcp.biocypher.org/mcp"
    }
  }
}
```

This follows the remote service option documented by BioCypher MCP.

---

# Option B: Local development server

Use this if you cloned `biocypher-mcp` locally:

```json
{
  "servers": {
    "biocypherMcp": {
      "type": "stdio",
      "command": "uv",
      "args": ["run", "python", "-u", "-m", "biocypher_mcp.main"],
      "cwd": "/path/to/biocypher-mcp",
      "env": { "PYTHONUNBUFFERED": "1" }
    }
  }
}
```

Replace `/path/to/biocypher-mcp` with the local clone path.

---

# Start MCP in VS Code

Open the Command Palette:

```text
Ctrl + Shift + P
```

Useful commands:

```text
MCP: Open Workspace Folder MCP Configuration
MCP: List Servers
MCP: Reset Cached Tools
MCP: Reset Trust
```

After starting the server, use VS Code Chat in **Agent mode**.

---

# Verify MCP is working

Ask VS Code Agent:

```text
Use the BioCypher MCP server and list the available BioCypher workflows.
```

Expected MCP tool:

```text
get_available_workflows
```

Then ask:

```text
Use BioCypher MCP to retrieve the adapter creation workflow.
```

Expected MCP tool:

```text
get_adapter_creation_workflow
```

---

# Hands-on 1: review the project

Prompt:

```text
Use BioCypher MCP to check whether this BioCypher project follows the expected structure.
Focus on create_knowledge_graph.py, config/schema_config.yaml,
config/biocypher_config.yaml, and the DrugCentral adapter.
Do not modify files yet.
```

Expected MCP tool:

```text
check_project_exists
```

---

# Hands-on 2: review the schema

Prompt:

```text
Use BioCypher MCP schema guidance to review config/schema_config.yaml.
Check whether the adapter labels drug, gene, and targets match the schema input labels.
Do not rewrite the schema automatically.
```

Expected MCP tool:

```text
get_schema_configuration_guidance
```

---

# Hands-on 3: adapter design guidance

Prompt:

```text
Use the BioCypher MCP adapter creation workflow to review the DrugCentralAdapter.
Focus on get_nodes(), get_edges(), identifier construction, and property extraction.
```

Expected MCP tools:

```text
get_adapter_creation_workflow
get_phase_guidance
get_implementation_patterns
```

---

# Hands-on 4: resource management

Our project defines the DrugCentral URL directly in `create_knowledge_graph.py`:

```python
DRUGCENTRAL_URL = (
    "https://unmtid-shinyapps.net/download/DrugCentral/2021_09_01/"
    "drug.target.interaction.tsv.gz"
)
```

Prompt:

```text
Use BioCypher MCP resource management guidance to review our FileDownload usage.
We are not using a YAML file for data sources.
```

---

# Hands-on 5: debugging checklist

Prompt:

```text
Use BioCypher MCP implementation patterns to produce a short debugging checklist
for this adapter. Include edge tuple order, multi-gene fields, delimiter safety,
and schema-label alignment.
```

Expected result:

```text
A compact checklist participants can use during adapter development.
```

---

# Concrete issue from Session 1

We fixed real-data problems:

```text
CACNA1D|CACNA1C      → split into two genes
bla; blaT-3; blaT-4 → split into three genes
```

We also fixed BioCypher edge tuple order:

```python
(edge_id, source_id, target_id, edge_label, properties)
```

This is exactly the type of issue MCP should help identify earlier.

---

# Rules for using MCP safely

Use MCP to:

- inspect first
- ask for workflow guidance
- generate small patches
- explain schema/adapter mismatches
- propose tests

Do not use MCP to:

- rewrite the full project at once
- change working code without review
- hide BioCypher or Neo4j errors

---

# Recommended Git checkpoint

Before using MCP:

```bash
git status
git add .
git commit -m "Working DrugCentral graph before MCP session"
```

After each accepted change:

```bash
uv run python create_knowledge_graph.py
bash biocypher-out/neo4j-admin-import-call.sh
```

Commit only working checkpoints.

---

# Session deliverable

By the end of Session 2, participants should have:

```text
- BioCypher MCP configured in VS Code
- verified access to MCP tools
- reviewed the current DrugCentral project
- a short adapter debugging checklist
- a plan for the next adapter: HGNCAdapter
```

---

# Bridge to Session 3

Current graph:

```text
(:Drug)-[:TARGETS]->(:Gene)
```

Limitation:

```text
Gene nodes are provisional because they use symbols.
```

Next session:

```text
Add HGNCAdapter to create canonical Gene nodes and harmonize identifiers.
```
