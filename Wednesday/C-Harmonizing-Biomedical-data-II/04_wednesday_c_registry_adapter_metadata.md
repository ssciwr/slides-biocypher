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

# What information do you need from different kinds of adapters you plan to or currently use?

Please suggest your ideas: 

---

# How do you expect to find other adapters realistically?

Please suggest existing or new ideas: 

---

# What information about your own adapter do you want to share?

Please share here: 

---

# Looking at others adapters
* Datasets
* Data Provenance
* Applicability
* Nomenclature/Ontology decisions
* Duplication with datasets you already use

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

Minimum information specific to use as an adapter:

- Adapter name
- Maintainer
- Input files or APIs
- Known limitations

---

# Information we can derive from reusing Croissant!:

- Data source
- Version
- Emitted node types
- Emitted edge types
- Identifier assumptions

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

# Registry Design

* What is missing here?
* What information is most important?
* What helps you trust an adapter?
<!-- For the viewing of adapters together and then individually -->
---

# Registry Design 2

* How does this design approach of using a form work for you?
* What do you think of being able to provide sample **<10mb** data for the croissant generation process?
* How do you think you will update your croissant file when data changes?
    * Manually editing?
    * With other/own tool
    * Resubmitting sample data to the form
<!--* We have prioritised speed by using croissant-baker, amongst other backends, under the hood. -->

<!-- For the meta data croissant generation -->
---

# Registry mockup discussion

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
