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

  :root {
    --title-color: #23395d;
  }

  h1 {
    color: var(--title-color);
  }

  h2 {
    color: var(--title-color);
  }

  em {
    color: var(--title-color);
  }

  code {
    font-size: 0.85em;
  }

  table {
    font-size: 0.72em;
  }

  .project-tree {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(243, 247, 255, 0.94));
  border: 1px solid rgba(35, 57, 93, 0.18);
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(35, 57, 93, 0.12);
  color: #23395d;
  font-size: 0.72em;
  line-height: 1.35;
  padding: 16px 20px;
  white-space: pre;
  }

  .project-tree strong {
    background: #ffe08a;
    border-radius: 0.2em;
    color: #14213d;
    padding: 0 0.2em;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }

  /* Optional semantic overrides for other trees */
  .project-tree .node-file,
  .project-tree-legend .node-file {
    background: #bde0fe;
  }

  .project-tree .edge-file,
  .project-tree-legend .edge-file {
    background: #ffc8dd;
  }

  .project-tree .import-script,
  .project-tree-legend .import-script {
    background: #caffbf;
  }

  .project-tree-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.75rem;
    color: #23395d;
    font-size: 0.72em;
  }

  .project-tree-legend strong {
    border-radius: 0.2em;
    color: #14213d;
    padding: 0.05em 0.35em;
  }
---

# Novice Track — BioCypher Tutorial Knowledge Graph

## Learn the BioCypher workflow with a prepared exercise repository

**Goal:** complete TODOs and build a small protein interaction graph.

<!--
Notes:
This deck is now the primary guide for novice participants. The official tutorial remains useful as background, but participants should follow these slides during the session.
-->

---

# Where we are

Monday introduced:

- Semantic knowledge graphs
- Ontologies and schemas
- BioCypher pathways
- Neo4j as graph query and visualization engine

Now we apply those ideas with a guided exercise.

<!--
Notes:
Keep this short. The objective is not to re-teach Monday content, but to connect it to the hands-on activity.
-->

---

# What you will build

A small protein interaction knowledge graph with **one node type** and **five edge types**:

| Element | Label |
|---|---|
| Node | `Protein` |
| Edge | `activation` |
| Edge | `binding` |
| Edge | `inhibition` |
| Edge | `phosphorylation` |
| Edge | `ubiquitination` |

You will complete selected TODOs in a prepared BioCypher project.

<!--
Notes:
Emphasize that this is intentionally simpler than the advanced DrugCentral track. The goal is to learn the mechanics safely. The five edge types come directly from the `type` column in the dataset.
-->

---

# Starting point

Use the prepared workshop repository:

```text
https://github.com/ecarrenolozano/BCWorkshop-Tutorial-Knowledge-Graph
```

The repository already contains:

- A BioCypher project structure
- A protein interaction adapter file
- BioCypher configuration files
- TODO blocks for the exercise

<!--
Notes:
Participants should not create a new project from scratch during this session. They start from the repository and focus on completing the BioCypher workflow.
-->

---

# Fork and clone

1. Fork the repository on GitHub in your personal profile:
```bash
https://github.com/ecarrenolozano/BCWorkshop-Tutorial-Knowledge-Graph
```
2. Clone your fork:

```bash
git clone <your-fork-url>
cd BCWorkshop-Tutorial-Knowledge-Graph
```

3. Install dependencies:

```bash
uv sync
```

<!--
Notes:
Participants must fork the repository, because they can save the work.
-->

---

# Project structure

<pre class="project-tree">
BCWorkshop-Tutorial-Knowledge-Graph/
├── config/
│   ├── <strong>biocypher_config.yaml</strong>
│   └── <strong>schema_config.yaml</strong>
├── src/
│   └── biocypher_tutorial_kg/
│       └── adapters/
│           └── <strong>protein_interaction_adapter.py</strong>
├── <strong>create_knowledge_graph.py</strong>
├── tests/
├── pyproject.toml
└── README.md
</pre>

Focus on four files.

<!--
Notes:
Ask participants to open these files in VS Code before coding. This makes the project structure concrete.
-->

---

# Files you will complete

| File | Role |
|---|---|
| `protein_interaction_adapter.py` | Emits nodes and edges |
| `schema_config.yaml` | Defines graph structure |
| `biocypher_config.yaml` | Defines BioCypher/Neo4j settings |
| `create_knowledge_graph.py` | Runs the pipeline |

The TODO comments guide the exercise.

<!--
Notes:
The core idea is separation of responsibilities: adapter transforms data, schema describes graph, config controls output, main script orchestrates the run.
-->

---

# Dataset retrieval

The dataset is downloaded by `create_knowledge_graph.py`.

Expected flow:

```text
dataset URL
→ BioCypher FileDownload
→ .cache/ folder
→ ProteinInteractionAdapter
```

You do not need to download the file manually.

<!--
Notes:
Connect this to the advanced track: both tracks use BioCypher download/cache utilities, but with different datasets.
-->

---

# Dataset overview

The dataset is a TSV file with one row per interaction:

| Column | Description |
|---|---|
| `source` / `target` | UniProt IDs of the two proteins |
| `source_genesymbol` / `target_genesymbol` | Gene symbols |
| `ncbi_tax_id_source` / `ncbi_tax_id_target` | Taxonomy IDs |
| `entity_type_source` / `entity_type_target` | Entity categories |
| `type` | Interaction type — **one of 5 values** |
| `is_directed`, `is_stimulation`, `is_inhibition` | Interaction flags |
| `consensus_direction`, `consensus_stimulation`, `consensus_inhibition` | Consensus flags |

The five values of `type`: `activation`, `binding`, `inhibition`, `phosphorylation`, `ubiquitination`.

<!--
Notes:
This slide explains why there are 5 edge types. The `type` column drives both the edge label in the adapter and the input_label in schema_config.yaml.
-->

---

# Graph model

One node type, five typed edges:

```text
(:Protein)-[:activation]->(:Protein)
(:Protein)-[:binding]->(:Protein)
(:Protein)-[:inhibition]->(:Protein)
(:Protein)-[:phosphorylation]->(:Protein)
(:Protein)-[:ubiquitination]->(:Protein)
```

Each edge type comes from the `type` column in the dataset.

<!--
Notes:
The five edge types map directly to the five `input_label` values in schema_config.yaml. This is the model participants will implement.
-->

---

# Adapter output format

BioCypher adapters emit Python tuples.

Node tuple:

```python
(node_id, node_label, properties)
# example: ("P53", "uniprot_protein", {"genesymbol": "TP53", ...})
```

Edge tuple:

```python
(edge_id, source_id, target_id, edge_label, properties)
# edge_label comes from the dataset `type` column:
# "activation", "binding", "inhibition",
# "phosphorylation", or "ubiquitination"
```

This order matters.

<!--
Notes:
This is one of the most important technical details. In the advanced track, wrong edge tuple order caused Neo4j import errors. The edge_label must exactly match an input_label in schema_config.yaml.
-->

---

# TODO map

You will complete TODOs in this order:

| # | File | Task | Mode |
|---|---|---|---|
| TODO 1 | `biocypher_config.yaml` | Set Neo4j bin prefix | Exercise |
| TODO 2 | `schema_config.yaml` | Add protein node properties | Exercise |
| TODO 3 | `schema_config.yaml` | Complete 4 remaining edge types | Exercise |
| TODO 4 | `protein_interaction_adapter.py` | Implement `get_nodes()` yield | Exercise |
| TODO 5a–5e | `protein_interaction_adapter.py` | Implement `get_edges()` | Exercise |
| TODO 6a–6b | `create_knowledge_graph.py` | Instantiate adapter + collect list | Exercise |
| — | Terminal | Run the pipeline | Run |
| — | Neo4j | Import and query | Query |

*Reference blocks are already implemented — read them, then continue.*

<!--
Notes:
This order follows the official BioCypher tutorial: configuration first, then adapter, then the orchestration script. Reference blocks exist in get_nodes() Steps 1-2.4 and in the download/write-loop steps of create_knowledge_graph.py.
-->

---

# TODO 1 — BioCypher config

*Exercise — file: `config/biocypher_config.yaml`*

Set the path to your Neo4j instance binary folder:

```yaml
neo4j:
  import_call_bin_prefix: /path/to/your/neo4j-instance/bin/
```

To find the path: open Neo4j Desktop → Overview tab → copy the instance path → append `/bin/`.

<!--
Notes:
This is a lightweight config step but important: without the correct path, the generated neo4j-admin-import-call.sh will not work. Instructors should have a sample path ready for their OS.
-->

---

# TODO 2 — Schema: protein node properties

*Exercise — file: `config/schema_config.yaml`*

Add properties to the `protein` node entry:

```yaml
protein:
    represented_as: node
    preferred_id: uniprot
    input_label: uniprot_protein
    properties:
        genesymbol: str
        ncbi_tax_id: str
        entity_type: str
```

The property names must match the keys the adapter puts in the properties dict.

<!--
Notes:
Label matching is the most common source of BioCypher errors. The input_label here must equal the second element of each node tuple: "uniprot_protein".
-->

---

# TODO 3 — Schema: complete edge types

*Exercise — file: `config/schema_config.yaml`*

`activation` is already implemented as the **reference template**:

```yaml
activation:
    is_a: protein protein interaction
    inherit_properties: true
    represented_as: edge
    input_label: activation
```

Repeat this pattern for the four remaining types:

```text
binding   inhibition   phosphorylation   ubiquitination
```

<!--
Notes:
The input_label must match exactly the value in the type column of the dataset and the edge_label emitted by the adapter. Case matters.
-->

---

# TODO 4 — Emit protein nodes

*Exercise — file: `protein_interaction_adapter.py` → `get_nodes()`*

Steps 1–2.4 are **reference blocks** — already implemented. Read them.

Your task is **Step 3 (TODO 4)**: yield one 3-tuple per unique protein:

```python
for _, row in proteins_df.iterrows():
    yield (
        str(row["node_id"]),        # node_id
        "uniprot_protein",           # node_label  ← must match schema input_label
        {
            "genesymbol": row["genesymbol"],
            "ncbi_tax_id": str(row["ncbi_tax_id"]),
            "entity_type": row["entity_type"],
        },
    )
```

<!--
Notes:
The reference blocks in get_nodes() show how to build proteins_df from the TSV. Participants only need to implement the yield loop.
-->

---

# TODO 5 — Emit interaction edges

*Exercise — file: `protein_interaction_adapter.py` → `get_edges()`*

All five sub-steps are exercises (5a–5e). Implement them in order:

| Sub-step | Task |
|---|---|
| 5a | Read TSV into a DataFrame |
| 5b | Iterate rows; extract `source_id`, `target_id`, `interaction_type` |
| 5c | Build `edge_id = f"{source_id}_{target_id}_{interaction_type}"` |
| 5d | Build properties dict from 6 boolean flags |
| 5e | Yield `(edge_id, source_id, target_id, interaction_type, properties)` |

*`interaction_type` is the edge label — one of the 5 types from the dataset.*

<!--
Notes:
Stress that interaction_type comes from row["type"] and must match an input_label in schema_config.yaml exactly. The edge_id pattern in 5c is deterministic and debuggable.
-->

---

# TODO 6 — Wire the script

*Exercise — file: `create_knowledge_graph.py`*

Step 1 (download) and Step 4 (write loop) are **reference blocks** — read them.

Your tasks:

**TODO 6a** — Instantiate the adapter:
```python
protein_interaction_adapter = ProteinInteractionAdapter(
    data_source=protein_interaction_file
)
```

**TODO 6b** — Collect adapters into a list:
```python
adapters = [protein_interaction_adapter]
```

<!--
Notes:
The download step (Step 1) is already solved so participants can see how FileDownload and bc.download() work before they wire the adapter. The write loop (Step 4) is also solved — once the list exists, BioCypher does the rest.
-->

---

# Run the pipeline

After completing all TODOs:

```bash
uv run python create_knowledge_graph.py
```

Expected output folder:

<pre class="project-tree">biocypher-out/&lt;timestamp&gt;/
├── <strong class="node-file">Protein-header.csv</strong>          <strong class="node-file">Protein-part000.csv</strong>
├── <strong class="edge-file">Activation-header.csv</strong>       <strong class="edge-file">Activation-part000.csv</strong>
├── <strong class="edge-file">Binding-header.csv</strong>          <strong class="edge-file">Binding-part000.csv</strong>
├── <strong class="edge-file">Inhibition-header.csv</strong>       <strong class="edge-file">Inhibition-part000.csv</strong>
├── <strong class="edge-file">Phosphorylation-header.csv</strong>  <strong class="edge-file">Phosphorylation-part000.csv</strong>
├── <strong class="edge-file">Ubiquitination-header.csv</strong>   <strong class="edge-file">Ubiquitination-part000.csv</strong>
└── <strong class="import-script">neo4j-admin-import-call.sh</strong></pre>

<div class="project-tree-legend">
  <span><strong class="node-file">Node files</strong></span>
  <span><strong class="edge-file">Edge files</strong></span>
  <span><strong class="import-script">Import script</strong></span>
</div>

<!--
Notes:
Six node/edge types produce 11 CSV files plus the import script. Ask participants to inspect the folder and count the files before running the import.
-->

---

# Check the generated files

Inspect the output before importing:

```bash
ls biocypher-out
head -n 5 biocypher-out/*part000.csv
```

Check that:

- Protein rows contain protein IDs
- Edge rows connect existing proteins
- The number of columns matches the headers

<!--
Notes:
This is a good debugging habit. It also helps participants understand that BioCypher writes import files before Neo4j stores the graph.
-->

---

# Import into Neo4j

Use the generated import script:

```bash
bash biocypher-out/neo4j-admin-import-call.sh
```

If you use Neo4j Server, stop the service before import:

```bash
sudo systemctl stop neo4j
```

Then start it again after import:

```bash
sudo systemctl start neo4j
```

<!--
Notes:
Mention that Neo4j Desktop and Neo4j Server behave differently. Instructors may need to provide OS-specific support.
-->

---

# Validate in Neo4j

Open Neo4j Browser: `http://localhost:7474`

```cypher
-- count all nodes and relationships
MATCH (n) RETURN labels(n) AS label, count(n) AS count;
MATCH ()-[r]->() RETURN type(r) AS type, count(r) AS count;
```

```cypher
-- browse a specific edge type
MATCH (a)-[r:Activation]->(b) RETURN a, r, b LIMIT 20;
MATCH (a)-[r:Binding]->(b)    RETURN a, r, b LIMIT 20;
```

```cypher
-- count by interaction type
MATCH ()-[r:Phosphorylation]->() RETURN count(r);
MATCH ()-[r:Ubiquitination]->()  RETURN count(r);
```

<!--
Notes:
The relationship label in Cypher is the CamelCase version BioCypher produces from the schema. The first query block is the fastest way to confirm all 5 edge types were imported.
-->

---

# Troubleshooting checklist

If something fails, check:

- Did `uv sync` complete?
- Does `create_knowledge_graph.py` run?
- Do adapter labels match `schema_config.yaml`?
- Is the edge tuple order correct?
- Does `biocypher-out/` exist?
- Is Neo4j stopped before offline import?

<!--
Notes:
Keep troubleshooting calm and systematic. Most issues are configuration, label mismatch, or Neo4j import state.
-->

---

# Session checkpoint

By the end of this track, you should have:

- Forked or cloned the exercise repository
- Completed the TODO blocks
- Generated BioCypher output files
- Imported the graph into Neo4j
- Run at least one Cypher query

You now understand the basic BioCypher adapter workflow.

<!--
Notes:
This is the novice track completion checkpoint. Link it to the next MCP session: MCP can inspect and improve this project.
-->

---

# Bridge to the next session

Next, we will use BioCypher MCP to inspect and improve the same project.

Possible MCP tasks:

- Explain the project structure
- Review adapter and schema consistency
- Suggest tests
- Help debug common errors

```text
working project → MCP-assisted improvement
```

<!--
Notes:
Make the continuity explicit. The artifact created here is reused in the MCP session.
-->
