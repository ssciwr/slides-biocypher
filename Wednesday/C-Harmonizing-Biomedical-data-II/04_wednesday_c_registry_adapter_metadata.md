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

# Wednesday C — Registry and Adapter Metadata

## From working adapter to reusable asset

**Goal:** document adapters so others can discover, understand, and reuse them.

---

# Where we are

We have:

- A working adapter
- A dataset understanding workflow
- Metadata concepts from Croissant

Now we ask:

```text
How do we make adapters discoverable and reusable?
```

---

# Why a registry?

A registry helps users answer:

- Which adapters exist?
- What datasets do they use?
- What nodes and edges do they emit?
- Which schema/ontology concepts do they map to?
- Are there limitations or known issues?

---

# Dataset metadata vs adapter metadata

| Metadata type | Describes |
|---|---|
| Dataset metadata | Source, license, fields, version, provenance |
| Adapter metadata | Input data, emitted nodes/edges, assumptions, limitations |

Both are needed for reuse.

---

# What should an adapter registry entry contain?

Minimum information:

- Adapter name
- Data source
- Version
- Maintainer
- Input files or APIs
- Emitted node types
- Emitted edge types
- Identifier assumptions
- Known limitations

---

# Novice track

Document the tutorial adapter.

Tasks:

1. Name the adapter
2. Describe the dummy dataset
3. List emitted nodes
4. List emitted edges
5. Record assumptions

---

# Advanced track

Document `DrugCentralAdapter`.

Include:

- Input: DrugCentral drug-target TSV
- Nodes: `Drug`, `Gene`
- Edge: `TARGETS`
- Identifier limitation: provisional gene symbols
- Data cleaning: multi-gene splitting and delimiter sanitization

---

# Registry mockup discussion

Use the registry mockups to discuss:

- What information should be visible first?
- What helps users trust an adapter?
- Where should issues be reported?
- How should adapter documentation link to source repositories?

---

# Hands-on output

Each group drafts one registry-ready adapter description.

| Track | Adapter |
|---|---|
| Novice | Tutorial adapter |
| Advanced | DrugCentralAdapter |

---

# Bridge to Thursday

A documented adapter is useful.

Multiple documented adapters are more powerful.

Next:

```text
one adapter → multiple adapters → heterogeneous KG
```
