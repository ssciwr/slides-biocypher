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

# Thursday B — Multiple Adapters

## Heterogeneous KGs and information fusion

**Goal:** extend from one adapter to multiple datasets.

---

# Where we are

So far:

1. Built one adapter
2. Used MCP to improve it
3. Inspected metadata and harmonization needs
4. Drafted adapter metadata for reuse

Now we extend the graph.

---

# From one adapter to multiple adapters

One adapter:

```text
DrugCentral → Drug → Gene
```

Multiple adapters:

```text
DrugCentral + Open Targets + Reactome + HGNC
```

Target graph:

```text
Drug → Gene → Disease / Pathway
```

---

# What BioCypher does

BioCypher helps with:

- Schema-based graph construction
- Adapter-based ingestion
- Node and edge generation
- Output for Neo4j
- Ontology-aware structure

---

# What requires additional logic

BioCypher does not automatically solve all information fusion.

You still need decisions about:

- Identifier mappings
- Duplicate resolution
- Conflicting records
- Evidence aggregation
- Source prioritization
- Data provenance

---

# Why OntoWeaver matters

OntoWeaver supports ontology-guided information fusion.

Use it when the problem is not only:

```text
read data → emit nodes and edges
```

but also:

```text
align, transform, and fuse heterogeneous information
```

---

# Novice track

Add a second dummy adapter.

Suggested graph:

```text
(:Drug)-[:TARGETS]->(:Gene)-[:PARTICIPATES_IN]->(:Pathway)
```

Goal: understand how multiple adapters contribute to one graph.

---

# Advanced track

Extend the Drug Discovery KG.

Candidate extensions:

| Adapter | Adds |
|---|---|
| HGNCAdapter | canonical gene identifiers |
| OpenTargetsAdapter | gene-disease associations |
| ReactomeAdapter | gene-pathway associations |

---

# Recommended advanced extension

Use a prepared subset for reliability.

Target:

```text
(:Drug)-[:TARGETS]->(:Gene)-[:ASSOCIATED_WITH]->(:Disease)
```

Scientific question:

```text
Which diseases are connected to genes targeted by a drug?
```

---

# Multi-adapter checkpoints

1. Add second data source
2. Add second adapter
3. Extend schema
4. Regenerate BioCypher output
5. Import into Neo4j
6. Query across adapters

---

# Example final queries

```cypher
MATCH (d:Drug)-[:TARGETS]->(g:Gene)-[:ASSOCIATED_WITH]->(dis:Disease)
RETURN d.name, g.symbol, dis.name
LIMIT 20;
```

```cypher
MATCH (d:Drug)-[:TARGETS]->(g:Gene)
RETURN d.name, count(DISTINCT g) AS targets
ORDER BY targets DESC
LIMIT 10;
```

---

# Session checkpoint

By the end of this session:

| Track | Output |
|---|---|
| Novice | Two-adapter dummy graph |
| Advanced | Extended drug graph or prepared integration |

Next: feedback and future contributions.
