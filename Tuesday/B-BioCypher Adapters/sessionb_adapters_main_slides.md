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

  .presenter {
    margin-top: 1.8rem;
    color: #23395d;
    font-size: 0.85em;
  }

  .callout {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(243, 247, 255, 0.94));
    border: 1px solid rgba(35, 57, 93, 0.18);
    border-radius: 16px;
    box-shadow: 0 10px 28px rgba(35, 57, 93, 0.12);
    color: #23395d;
    padding: 16px 20px;
  }

  .pipeline {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(243, 247, 255, 0.94));
    border: 1px solid rgba(35, 57, 93, 0.18);
    border-radius: 16px;
    box-shadow: 0 10px 28px rgba(35, 57, 93, 0.12);
    color: #23395d;
    font-size: 0.82em;
    line-height: 1.35;
    padding: 16px 20px;
    white-space: pre;
  }
---

# Tuesday B — Adapters in BioCypher

## Python pathway: from source data to graph

**Goal:** implement the first working adapter and generate graph-ready output.

<div class="presenter">
<strong>Presenter:</strong> Edwin Carreño
</div>

<!--
Notes:
Frame this as the first implementation-focused session.
Monday introduced the concepts; this session turns them into concrete BioCypher artifacts: adapters, emitted nodes and edges, import files, and a queryable Neo4j graph.
-->

---

# Session outline

<pre class="pipeline">Monday concepts
   ↓
BioCypher adapter
   ↓
Nodes + edges
   ↓
BioCypher output
   ↓
Neo4j graph
   ↓
MCP inspection in Session C</pre>

**Today’s focus:** implement the adapter layer.

<!--
Notes:
Use this slide as the session map.
Emphasize that both hands-on tracks follow the same pattern, even though they use different datasets and difficulty levels.
-->

---

# Where we are

Monday introduced:

- Semantic knowledge graphs
- Ontologies and schemas
- BioCypher pathways
- Neo4j as graph query and visualization engine

Today we apply those ideas in Python.

<!--
Notes:
Do not re-teach Monday content. Use this slide as a bridge from concepts to hands-on work.
-->

---

# What is a BioCypher adapter?

An adapter translates source-specific records into BioCypher-compatible graph elements.

```text
source data → adapter → nodes + edges → BioCypher output → Neo4j
```

<div class="callout">
The adapter is the boundary between messy source data and clean graph-ready artifacts.
</div>

<!--
Notes:
Emphasize that an adapter is not just a parser. It maps source records into the graph contract defined by schema_config.yaml.
-->

---

# Adapter responsibilities

| Component | Responsibility |
|---|---|
| Source data | Provides raw records |
| Adapter | Emits node and edge tuples |
| Schema config | Defines valid graph labels and structure |
| BioCypher | Writes import-ready output files |
| Neo4j | Stores and queries the graph |

<!--
Notes:
Use this slide to explain separation of concerns.
Adapters do not define the full KG alone; schema and BioCypher configuration also matter.
-->

---

# Common workflow for both tracks

```text
configure project
→ inspect source data
→ define schema labels
→ implement adapter tuples
→ generate BioCypher output
→ inspect CSV files
→ import into Neo4j
→ run one validation query
```

Both tracks have different data, but the same adapter logic.

<!--
Notes:
This slide connects the novice and advanced decks.
It also prepares participants for the shared checkpoint at the end.
-->

---

# Choose your hands-on track

| Track | Best for | Dataset | Final graph |
|---|---|---|---|
| Novice | First BioCypher adapter | Prepared protein interaction data | `(:Protein)-[:TYPE]->(:Protein)` |
| Advanced | Real-data parsing and debugging | DrugCentral | `(:Drug)-[:TARGETS]->(:Gene)` |

Both tracks finish with one adapter and one queryable Neo4j graph.

<!--
Notes:
The novice track uses a prepared repository and focuses on completing TODOs.
The advanced track uses real DrugCentral data and requires more defensive parsing.
-->

---

# Hands-on materials

| Track | Slide deck | Focus |
|---|---|---|
| Novice | `sessionb_novice_track_slides.md` | Complete TODOs in a prepared BioCypher project |
| Advanced | `sessionb_advanced_track_slides.md` | Build a real DrugCentral adapter |

Follow your track deck for commands and implementation details.

<!--
Notes:
Point participants to the correct track material.
Avoid mixing beginner instructions with advanced real-data debugging in the main deck.
-->

---

# Novice track at a glance

You will complete selected TODOs in a prepared repository.

Expected model:

```text
(:Protein)-[:activation]->(:Protein)
(:Protein)-[:binding]->(:Protein)
(:Protein)-[:inhibition]->(:Protein)
(:Protein)-[:phosphorylation]->(:Protein)
(:Protein)-[:ubiquitination]->(:Protein)
```

**Main learning goal:** understand the BioCypher adapter workflow safely.

<!--
Notes:
The novice deck uses one node type and five edge types.
Participants should focus on tuple format, schema labels, and generated output files.
-->

---

# Advanced track at a glance

You will build a real DrugCentral adapter.

Expected flow:

```text
DrugCentral TSV
→ DrugCentralAdapter
→ Drug nodes
→ Gene nodes
→ TARGETS edges
→ BioCypher output
→ Neo4j graph
```

Expected graph pattern:

```text
(:Drug)-[:TARGETS]->(:Gene)
```

<!--
Notes:
The advanced track adds real-data issues: multi-value fields, delimiter conflicts, provisional gene identifiers, and CSV validation before import.
-->

---

# Shared checkpoint

At the end of this session, both tracks should explain:

- Where the input data comes from
- Which adapter emits nodes and edges
- Which labels appear in `schema_config.yaml`
- Where BioCypher writes output files
- How the graph is imported into Neo4j
- How to run one validation Cypher query

<!--
Notes:
Different datasets, same conceptual workflow.
This shared checkpoint is what makes the two tracks comparable.
-->

---

# What to inspect before Neo4j import

Before importing, always check the generated files:

```text
biocypher-out/<timestamp>/
├── *-header.csv
├── *-part000.csv
└── neo4j-admin-import-call.sh
```

Ask three questions:

1. Do node files contain valid identifiers?
2. Do edge files connect existing source and target nodes?
3. Do row widths match the headers?

<!--
Notes:
This slide reinforces a debugging habit shared by both tracks.
The novice deck visualizes the output folder; the advanced deck adds explicit CSV-width validation.
-->

---

# Bridge to Session C — MCP

Next session: use BioCypher MCP to inspect, debug, and improve the same project.

```text
working adapter → MCP inspection → tests → improved project
```

Keep your project artifacts: source files, schema, generated output, and Neo4j import result.

<!--
Notes:
Session C should not start a new project.
It should operate on the artifact created here.
-->
