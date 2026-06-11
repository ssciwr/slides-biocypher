---
marp: true
theme: default
paginate: true
size: 16:9
title: Building BioCypher Adapters with DrugCentral
---

# Building BioCypher Adapters with DrugCentral

## BioCypher Drug Discovery Knowledge Graph

**Session 1**  
From real DrugCentral data to a minimal drug-target graph

---

# Session goal

Build the first working BioCypher adapter using real DrugCentral data.

By the end of this session, we will generate and import:

```text
(:Drug)-[:TARGETS]->(:Gene)
```

This is the foundation for later sessions on harmonization and graph extension.

---

# Where this fits in the full use case

The complete use case is progressive:

```text
Session 1: Drug → Gene
Session 2: Drug → canonical Gene
Session 3: Drug → Gene → Pathway
Session 4: Drug → Gene → Disease
```

In this first session, `Gene` nodes are provisional and will be harmonized later with HGNC.

---

# 1. Adapters in BioCypher

Before coding, we need the adapter mental model.

An adapter is the component that transforms source data into BioCypher-compatible graph elements.

```text
source dataset
    ↓
adapter
    ↓
nodes and edges
    ↓
BioCypher output
```

---

# 1.1 What is an adapter?

An adapter translates source-specific records into graph objects.

For this session:

```text
DrugCentral table
      ↓
DrugCentralAdapter
      ↓
Drug nodes
Gene nodes
TARGETS edges
      ↓
Neo4j graph
```

---

# Why adapters matter

Adapters isolate source-specific logic from graph construction.

They help us separate:

```text
how the data is stored
from
how the graph is modeled
```

This is essential when integrating heterogeneous biomedical datasets.

---

# Adapter responsibilities

| Component | Responsibility |
|---|---|
| Dataset | Provides raw records |
| Adapter | Emits nodes and edges |
| Schema config | Defines graph structure |
| BioCypher | Writes graph import files |
| Neo4j | Stores and queries the graph |

The adapter should not query Neo4j directly.

---

# Adapter output

BioCypher adapters emit Python tuples.

Node tuple:

```python
(node_id, node_label, properties)
```

Edge tuple:

```python
(edge_id, source_id, target_id, edge_label, properties)
```

This edge tuple order is critical.

---

# 2. Hands-on example: DrugCentral

We will build the first adapter for the drug discovery knowledge graph.

Target graph:

```text
(:Drug)-[:TARGETS]->(:Gene)
```

This answers questions such as:

```text
Which genes are targeted by this drug?
Which drugs target this gene?
```

---

# 2.1 Use case

DrugCentral provides drug-target interaction data.

We map the file into:

| Graph element | DrugCentral columns |
|---|---|
| Drug node | `STRUCT_ID`, `DRUG_NAME` |
| Gene node | `GENE`, `TARGET_NAME`, `ORGANISM` |
| TARGETS edge | `STRUCT_ID`, `GENE` |
| Edge properties | `ACT_TYPE`, `ACTION_TYPE`, `ACT_SOURCE` |

---

# 2.2 Learning objectives

By the end of the session, participants should be able to:

- Generate a BioCypher project with Cookiecutter
- Understand the adapter interface
- Retrieve data with BioCypher `FileDownload`
- Emit `Drug` and provisional `Gene` nodes
- Emit `TARGETS` edges
- Configure the schema
- Import and query the graph in Neo4j

---

# 2.3 Prerequisites

Recommended setup:

```text
Python 3.11+
uv
Git
Neo4j Desktop or Neo4j installation
BioCypher project generated from Cookiecutter
```

The DrugCentral file is retrieved through BioCypher download/cache support.

---

# Project generation

Use the BioCypher Cookiecutter template:

```bash
uvx cookiecutter https://github.com/biocypher/biocypher-cookiecutter-template
```

Recommended values:

```text
project_name: BioCypher Drug Discovery Knowledge Graph
package_name: drug_discovery_kg
adapter_name: drugcentral_adapter
data_source_type: file
include_tests: y
```

---

# Generated project structure

Relevant files:

```text
config/
  biocypher_config.yaml
  schema_config.yaml

drug_discovery_kg/
  adapters/
    drug_central_adapter.py

create_knowledge_graph.py
pyproject.toml
```

The main files for this session are the adapter, schema, and graph creation script.

---

# Data retrieval

For Session 1, keep data retrieval simple and explicit.

```python
DRUGCENTRAL_URL = (
    "https://unmtid-shinyapps.net/download/DrugCentral/2021_09_01/"
    "drug.target.interaction.tsv.gz"
)
```

Then use BioCypher:

```python
drugcentral_resource = FileDownload(
    name="drugcentral-drug-target-interactions",
    url_s=DRUGCENTRAL_URL,
    lifetime=30,
    is_dir=False,
)
```

---

# Pipeline orchestration

`create_knowledge_graph.py` should do four things:

```text
1. Initialize BioCypher
2. Download or retrieve the cached DrugCentral file
3. Initialize DrugCentralAdapter
4. Write nodes and edges
```

Minimal flow:

```python
paths = bc.download(drugcentral_resource)
adapter = DrugCentralAdapter(data_source=paths[0])
bc.write_nodes(adapter.get_nodes())
bc.write_edges(adapter.get_edges())
bc.write_import_call()
```

---

# 2.4 Building the adapter

The adapter has two core methods:

```python
def get_nodes(self):
    ...

def get_edges(self):
    ...
```

For this first graph:

```text
get_nodes() → Drug nodes + provisional Gene nodes
get_edges() → Drug TARGETS Gene relationships
```

---

# Drug nodes

Each unique `STRUCT_ID` becomes one `Drug` node.

```text
STRUCT_ID  → node ID
DRUG_NAME  → name property
```

Example output:

```python
(
    "DRUGCENTRAL:4",
    "drug",
    {"name": "levobupivacaine", "source": "DrugCentral"},
)
```

---

# Gene nodes

Each unique gene symbol becomes one provisional `Gene` node.

```text
GENE         → node ID and symbol
TARGET_NAME  → target_name
ORGANISM     → organism
```

Example output:

```python
(
    "GENE:KCNH2",
    "gene",
    {"symbol": "KCNH2", "target_name": "...", "organism": "Homo sapiens"},
)
```

---

# TARGETS edges

Each unique drug-gene pair becomes one edge.

Correct BioCypher edge tuple:

```python
(
    edge_id,
    source_id,
    target_id,
    "targets",
    properties,
)
```

Conceptually:

```text
DRUGCENTRAL:4 → GENE:KCNH2
```

---

# Minimal schema

```yaml
drug:
  represented_as: node
  preferred_id: drugcentral
  input_label: drug
  properties:
    name: str
    source: str

gene:
  represented_as: node
  preferred_id: gene_symbol
  input_label: gene
  properties:
    symbol: str
    target_name: str
    organism: str
    source: str
```

---

# Minimal schema: edge

```yaml
targets:
  represented_as: edge
  preferred_id: drugcentral
  input_label: targets
  source: drug
  target: gene
  properties:
    act_type: str
    action_type: str
    act_source: str
    source: str
```

Keep the first version small. Add more properties after the import works.

---

# BioCypher configuration

For the first workshop run, keep the configuration lightweight:

```yaml
biocypher:
  dbms: neo4j
  offline: true
  strict_mode: false
  debug: false
  output_directory: biocypher-out
  cache_directory: .cache
```

Load the full Biolink ontology later, after the basic import works.

---

# Neo4j import settings

```yaml
neo4j:
  delimiter: ";"
  array_delimiter: "|"
  quote_character: '"'
  skip_duplicate_nodes: true
  skip_bad_relationships: true
  edge_labels_order: Leaves
```

Important: real data may contain delimiter characters, so adapter sanitization matters.

---

# Real-data issue 1: multi-gene fields

DrugCentral may encode several genes in one field:

```text
CACNA1D|CACNA1C
bla; blaT-3; blaT-4;
```

The adapter should split these into separate gene symbols.

```python
re.split(r"[|;]", value)
```

Otherwise, Neo4j may interpret semicolons as extra columns.

---

# Real-data issue 2: CSV delimiters

Neo4j import is sensitive to delimiters.

If a value contains `;`, and the import delimiter is also `;`, the row may break.

Adapter fix:

```python
value.replace(";", ",")
```

Also remove newlines and tabs from properties before writing.

---

# Real-data issue 3: edge tuple order

Wrong edge tuple:

```python
(source_id, target_id, "targets", "targets", properties)
```

Correct edge tuple:

```python
(edge_id, source_id, target_id, "targets", properties)
```

This was the key fix for creating valid Neo4j relationship files.

---

# Run the pipeline

Regenerate BioCypher output:

```bash
rm -rf biocypher-out
uv run python create_knowledge_graph.py
```

Expected output files:

```text
Drug-header.csv
Drug-part000.csv
Gene-header.csv
Gene-part000.csv
Targets-header.csv
Targets-part000.csv
neo4j-admin-import-call.sh
```

---

# Validate generated files

Check column counts:

```bash
awk -F';' 'NF != 8 {print NR, NF, $0}' biocypher-out/Targets-part000.csv | head
```

This should return no rows.

Check the relationship header:

```bash
cat biocypher-out/Targets-header.csv
```

Expected:

```text
:START_ID;id;act_type;action_type;act_source;source;:END_ID;:TYPE
```

---

# Import into Neo4j

Run the generated import script:

```bash
bash biocypher-out/neo4j-admin-import-call.sh
```

If a previous import failed, stop Neo4j and remove the broken store before retrying.

```bash
rm -rf <dbms-path>/data/databases/neo4j
rm -rf <dbms-path>/data/transactions/neo4j
```

---

# 2.5 Query the graph using Neo4j

Count nodes by label:

```cypher
MATCH (n)
RETURN labels(n) AS labels, count(n) AS count
ORDER BY count DESC;
```

Count relationships:

```cypher
MATCH ()-[r]->()
RETURN type(r) AS relationship_type, count(r) AS count;
```

---

# Query examples

Show drug-gene relationships:

```cypher
MATCH (d:Drug)-[r]->(g:Gene)
RETURN d.name AS drug, type(r) AS relationship, g.symbol AS gene
LIMIT 20;
```

Find drugs targeting a gene:

```cypher
MATCH (d:Drug)-[r]->(g:Gene)
WHERE g.symbol = "KCNH2"
RETURN d.name AS drug, g.symbol AS gene, r.act_type AS activity_type
LIMIT 20;
```

---

# What we built

```text
DrugCentral TSV
      ↓
DrugCentralAdapter
      ↓
Drug nodes
Gene nodes
TARGETS edges
      ↓
BioCypher output
      ↓
Neo4j graph
```

This is the first working checkpoint of the progressive drug discovery knowledge graph.

---

# Troubleshooting checklist

If graph creation or import fails, check:

```text
- Edge tuple order
- Schema labels match adapter labels
- Multi-gene fields are split
- Delimiters are sanitized
- Long properties are removed initially
- BioCypher output was regenerated
- Failed Neo4j store was deleted before retry
```

---

# Session checkpoint

At the end of Session 1, participants should have:

```text
- a working BioCypher project
- a DrugCentralAdapter
- Drug nodes
- provisional Gene nodes
- TARGETS edges
- generated Neo4j import files
- a queryable Neo4j graph
```

---

# Bridge to the next session

Current limitation:

```text
Gene nodes are provisional.
They are based on DrugCentral gene symbols.
```

Next session:

```text
Use HGNC to harmonize and enrich Gene nodes.
```

The graph evolves from:

```text
Drug → Gene
```

to:

```text
Drug → canonical Gene
```
