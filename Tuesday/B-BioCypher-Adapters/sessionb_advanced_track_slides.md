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

# Advanced Track — DrugCentral Adapter

## Build a real drug-target graph

**Goal:** create `Drug → Gene` relationships from DrugCentral.

<!--
Notes:
This deck is for participants comfortable with Python, real data, debugging, and BioCypher configuration.
-->

---

# Expected output

By the end of the track, you should have:

```text
DrugCentral TSV
→ DrugCentralAdapter
→ Drug nodes
→ Gene nodes
→ TARGETS edges
→ BioCypher output
→ Neo4j graph
```

Graph pattern:

```text
(:Drug)-[:TARGETS]->(:Gene)
```

<!--
Notes:
Make the final artifact explicit. The graph is intentionally minimal but real.
-->

---

# Step 1 — Create the project

Use the BioCypher Cookiecutter template.

Recommended values:

```text
project_name: BioCypher Drug Discovery Knowledge Graph
package_name: drug_discovery_kg
adapter_name: drug_central_adapter
include_docker: y
include_tests: y
python_version: 3.11
```

<!--
Notes:
If participants already cloned a prepared repo, they can skip this step.
-->

---

# Step 2 — Install dependencies

From the project root:

```bash
uv sync
```

If needed:

```bash
uv add pandas
```

Expected files:

```text
create_knowledge_graph.py
config/biocypher_config.yaml
config/schema_config.yaml
drug_discovery_kg/adapters/drug_central_adapter.py
```

<!--
Notes:
Keep package management simple. The workshop should not become a dependency debugging session.
-->

---

# Step 3 — Define data retrieval

In `create_knowledge_graph.py`, define the DrugCentral URL directly.

```python
DRUGCENTRAL_URL = (
    "https://unmtid-shinyapps.net/download/DrugCentral/2021_09_01/"
    "drug.target.interaction.tsv.gz"
)
```

We are not using a YAML file for data sources in this session.

<!--
Notes:
This is an explicit design decision for Session 1: keep data retrieval simple.
-->

---

# Step 4 — Use FileDownload

```python
drugcentral_resource = FileDownload(
    name="drugcentral-drug-target-interactions",
    url_s=DRUGCENTRAL_URL,
    lifetime=30,
    is_dir=False,
)

downloaded_paths = bc.download(drugcentral_resource)
drugcentral_path = downloaded_paths[0]
```

Then pass the local path to the adapter.

<!--
Notes:
The adapter should receive a local file path. It should not download data itself.
-->

---

# Step 5 — Map DrugCentral columns

| Graph element | Source columns |
|---|---|
| `Drug` node | `STRUCT_ID`, `DRUG_NAME` |
| `Gene` node | `GENE`, `TARGET_NAME`, `ORGANISM` |
| `TARGETS` edge | `STRUCT_ID`, `GENE` |
| Edge properties | `ACT_TYPE`, `ACTION_TYPE`, `ACT_SOURCE` |

Keep the first version minimal.

<!--
Notes:
Avoid long comments, URLs, and many properties in the first successful import.
-->

---

# Step 6 — Implement nodes

The adapter should emit:

```python
("DRUGCENTRAL:4", "drug", {"name": "levobupivacaine"})
```

and provisional gene nodes:

```python
("GENE:KCNH2", "gene", {"symbol": "KCNH2"})
```

Genes are provisional because they come from source symbols.

<!--
Notes:
This prepares the later harmonization discussion.
-->

---

# Step 7 — Implement edges

BioCypher expects this edge tuple order:

```python
(
    edge_id,
    source_id,
    target_id,
    edge_label,
    properties,
)
```

Example:

```text
DRUGCENTRAL:4 → GENE:KCNH2
```

<!--
Notes:
This was the main bug during development. Emphasize it clearly.
-->

---

# Step 8 — Handle real data issues

DrugCentral contains multi-value gene fields:

```text
CACNA1D|CACNA1C
bla; blaT-3; blaT-4
```

Split values on both `|` and `;`.

Sanitize values that may conflict with the CSV delimiter.

<!--
Notes:
This is a concrete example of why real-data adapters require defensive parsing.
-->

---

# Step 9 — Minimal schema

```yaml
drug:
  represented_as: node
  input_label: drug

gene:
  represented_as: node
  input_label: gene

targets:
  represented_as: edge
  input_label: targets
  source: drug
  target: gene
```

The adapter labels and schema labels must match.

<!--
Notes:
Keep ontology mapping optional for the first working import.
-->

---

# Step 10 — Configure BioCypher

For a laptop-friendly first run:

```yaml
biocypher:
  dbms: neo4j
  offline: true
  debug: false
  cache_directory: .cache

neo4j:
  delimiter: ";"
  array_delimiter: "|"
  quote_character: '"'
  skip_duplicate_nodes: true
  skip_bad_relationships: true
```

<!--
Notes:
If the full Biolink ontology slows down the run, disable it for Session 1.
-->

---

# Step 11 — Generate output

Run:

```bash
rm -rf biocypher-out
uv run python create_knowledge_graph.py
```

Inspect:

```bash
head -n 3 biocypher-out/Drug-part000.csv
head -n 3 biocypher-out/Gene-part000.csv
head -n 3 biocypher-out/Targets-part000.csv
```

<!--
Notes:
Always inspect output files before Neo4j import.
-->

---

# Step 12 — Validate CSV structure

Check that row widths match the headers:

```bash
awk -F';' 'NF != 8 {print NR, NF, $0}' \
  biocypher-out/Targets-part000.csv | head
```

If this returns rows, inspect delimiter conflicts or malformed values.

<!--
Notes:
This command saved time during debugging. It is useful for advanced participants.
-->

---

# Step 13 — Import into Neo4j

Stop the Neo4j database if needed, then run:

```bash
bash biocypher-out/neo4j-admin-import-call.sh
```

If a previous import failed, delete the broken store before retrying.

<!--
Notes:
Mention that Neo4j import failures can leave the database store unusable.
-->

---

# Step 14 — Query the graph

```cypher
MATCH (n)
RETURN labels(n) AS labels, count(n) AS count;
```

```cypher
MATCH (d:Drug)-[r]->(g:Gene)
RETURN d.name, type(r), g.symbol
LIMIT 20;
```

<!--
Notes:
These queries validate both counts and relationship direction.
-->

---

# Advanced checkpoint

You are done when you have:

- A working `DrugCentralAdapter`
- `Drug` and `Gene` nodes
- `TARGETS` edges
- BioCypher output files
- A successful Neo4j import
- At least one query result

Next: use MCP to inspect, test, and improve the project.

<!--
Notes:
End with a clear bridge to Tuesday C.
-->
