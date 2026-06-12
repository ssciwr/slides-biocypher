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

# Wednesday B — Harmonizing Biomedical Data

## Metadata, Croissant, and dataset selection

**Goal:** understand a second dataset before writing another adapter.

---

# Where we are

We have a first working adapter.

Advanced graph so far:

```text
(:Drug)-[:TARGETS]->(:Gene)
```

But our gene identifiers are still provisional.

---

# Why one adapter is not enough

A single adapter gives one source-specific view.

A useful biomedical KG often requires multiple sources:

```text
DrugCentral → drugs and targets
Open Targets → gene-disease associations
Reactome → gene-pathway associations
HGNC → canonical gene identifiers
```

---

# What harmonization means

Harmonization is the process of making datasets work together.

It involves:

- Identifier alignment
- Metadata understanding
- Schema mapping
- Provenance tracking
- Field selection
- Reusable dataset descriptions

---

# Why metadata matters

Before writing an adapter, we need to know:

- What does this dataset describe?
- What identifiers does it use?
- Which fields are relevant?
- What license or terms apply?
- What is the source and version?
- What should become nodes or edges?

---

# What is Croissant?

Croissant is a structured metadata format for datasets.

For this workshop, use it to describe:

- Dataset name and description
- Download/source information
- Fields and data types
- Licenses
- Provenance
- Intended use in an adapter

---

# Novice track

Use a simple Croissant file and/or CollecTRI.

Tasks:

1. Inspect the metadata
2. Identify dataset fields
3. Identify possible nodes and edges
4. Relate metadata to adapter design

---

# Advanced track

Use Open Targets as the candidate second dataset.

Goal:

```text
(:Gene)-[:ASSOCIATED_WITH]->(:Disease)
```

This extends the DrugCentral graph toward disease context.

---

# Advanced track: Open Targets field selection

Identify only what we need for the drug graph:

| Graph element | Needed fields |
|---|---|
| `Gene` reference | target identifier |
| `Disease` node | disease identifier, disease name |
| Association edge | score, evidence/source |

---

# Identifier mismatch

Current graph:

```text
GENE:KCNH2
```

Potential Open Targets identifiers:

```text
Ensembl gene IDs
Disease identifiers
Association scores
```

This is why harmonization is required.

---

# Hands-on checkpoint

By the end of this session:

| Track | Output |
|---|---|
| Novice | Understand dataset metadata and Croissant |
| Advanced | Scope Open Targets fields for the drug graph |

Next: registry and adapter metadata.
