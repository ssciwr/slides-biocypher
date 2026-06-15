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

  .tree {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(243, 247, 255, 0.94));
    border: 1px solid rgba(35, 57, 93, 0.18);
    border-radius: 16px;
    box-shadow: 0 10px 28px rgba(35, 57, 93, 0.12);
    color: #23395d;
    font-size: 0.78em;
    line-height: 1.35;
    padding: 16px 20px;
    white-space: pre;
  }
---

# Wednesday B — Croissant Metadata

## Metadata for BioCypher datasets and adapters

**Goal:** understand, inspect, and add a `croissant.jsonld` file to your project.

<div class="presenter">
<strong>Presenter:</strong> Edwin Carreño
</div>

<!--
Notes:
This session is not about writing a new adapter. It is about making the adapter and its input datasets understandable through structured metadata.
-->

---

# Where we are

Tuesday B produced working BioCypher projects:

| Track | Adapter | Dataset |
|---|---|---|
| Novice | `ProteinInteractionAdapter` | Synthetic protein interactions |
| Advanced | `DrugCentralAdapter` | DrugCentral drug-target interactions |

Today we describe those projects with structured metadata.

<!--
Notes:
Connect directly to Tuesday B. Participants should reuse the repository they already worked with.
-->

---

# Why metadata now?

A working adapter answers:

```text
Can this code transform data into a graph?
```

A metadata file answers:

```text
What does this adapter do?
Which datasets does it use?
Which files and fields matter?
Who maintains it?
How can another person understand it?
```

<div class="callout">
The adapter makes the data executable. Metadata makes it understandable and reusable.
</div>

<!--
Notes:
Emphasize that metadata is not decoration. It is part of making computational work reusable.
-->

---

# What is MLCroissant?

MLCroissant is a metadata format for ML-ready datasets.

It describes:

- dataset-level information
- file/resource locations
- record sets
- fields and data types
- how data can be loaded or interpreted

It is JSON-LD and builds on `schema.org` dataset vocabulary.

<!--
Notes:
Keep this as a short introduction. The next slides explain the structure in practical terms.
Sources: MLCommons Croissant documentation and specification.
-->

---

# Why Croissant matters

Croissant helps with:

| Goal | Meaning |
|---|---|
| Discoverability | Can people and tools find the dataset? |
| Portability | Can metadata move across platforms? |
| Interoperability | Can different tools interpret it? |
| Reproducibility | Can another person understand and reuse the data? |

It does not change the original data files.

It describes them.

<!--
Notes:
A helpful phrase: Croissant is metadata around data, not a replacement for the data.
-->

---

# Dataset Croissant: big picture

A dataset-centered Croissant file usually describes:

```text
Dataset
├── general metadata
├── distribution / resources
├── recordSet
└── fields
```

The file tells us:

```text
what the dataset is
where the files are
what records exist
what each column or field means
```

<!--
Notes:
This is the standard dataset-centered mental model before introducing the BioCypher adapter-oriented profile.
-->

---

# Dataset-level metadata

Typical dataset metadata:

```json
{
  "@type": "Dataset",
  "name": "Synthetic protein interactions",
  "description": "Protein interaction dataset for a tutorial.",
  "license": "...",
  "creator": [...],
  "keywords": [...]
}
```

This section answers:

- What is this dataset?
- Who created or maintains it?
- How can it be cited or licensed?
- Which keywords help describe it?

<!--
Notes:
Keep the example simple. The goal is to recognize sections, not to memorize all fields.
-->

---

# Distribution / resources

The `distribution` section describes the concrete files.

```json
"distribution": [
  {
    "@type": "FileObject",
    "name": "synthetic_protein_interactions.tsv",
    "contentUrl": "https://...",
    "encodingFormat": "text/tab-separated-values"
  }
]
```

This section answers:

- Which file is used?
- Where is it located?
- What format does it have?

<!--
Notes:
Connect this to FileDownload from Tuesday B: FileDownload retrieves the file; Croissant explains what the file is.
-->

---

# RecordSet and fields

The `recordSet` describes logical records, often table-like data.

```json
"recordSet": [
  {
    "@type": "RecordSet",
    "name": "protein_interactions",
    "field": [
      {"@type": "Field", "name": "source"},
      {"@type": "Field", "name": "target"},
      {"@type": "Field", "name": "type"}
    ]
  }
]
```

This section answers:

- Which columns exist?
- What do they mean?
- Which columns are relevant for the adapter?

<!--
Notes:
This slide is essential for hands-on: participants will map fields to adapter code.
-->

---

# BioCypher adapter metadata profile

For BioCypher adapters, our metadata file describes:

```text
SoftwareSourceCode
├── adapter-level metadata
└── hasPart
    ├── Dataset 1
    ├── Dataset 2
    └── Dataset n
```

The root describes the adapter as software.

Each `hasPart` entry describes a dataset consumed by the adapter.

<!--
Notes:
Use this slide to clarify why the root is not only Dataset. This profile combines adapter software metadata with dataset metadata.
-->

---

# Adapter-level structure

The adapter root describes the software component.

Important fields:

| Field | Meaning |
|---|---|
| `@type` | `SoftwareSourceCode` |
| `name` | Adapter name |
| `description` | What the adapter does |
| `version` | Adapter version |
| `license` | Code license |
| `codeRepository` | Source code repository |
| `creator` | Maintainers / developers |
| `keywords` | Search and discovery terms |
| `hasPart` | Datasets used by the adapter |

<!--
Notes:
This mirrors the current v1 adapter schema. Do not discuss changing the schema.
-->

---

# Dataset blocks through `hasPart`

Each dataset consumed by the adapter is listed in `hasPart`.

Minimum dataset information:

| Field | Meaning |
|---|---|
| `name` | Dataset name |
| `description` | Dataset purpose |
| `version` | Dataset release/version |
| `license` | Dataset license |
| `url` | Dataset page or resource |

Richer entries may include:

```text
distribution, recordSet, datePublished, citeAs, creator
```

<!--
Notes:
Emphasize that adapter metadata and dataset metadata are connected but distinct.
-->

---

# Example: one adapter, many datasets

The OmniPath example follows this pattern:

```text
OmniPath Adapter
├── Networks
├── Enzyme-PTM
├── Complexes
├── Annotations
└── Intercell
```

One adapter can integrate several datasets.

The metadata file makes that structure visible before reading the code.

<!--
Notes:
Use the OmniPath example as a real-data illustration. Do not go deep into all fields; focus on the pattern.
-->

---

# Root-level `croissant.jsonld`

For this workshop, the metadata file should be placed at the root of the repository:

<pre class="tree">project-repository/
├── <strong>croissant.jsonld</strong>
├── create_knowledge_graph.py
├── config/
├── src/
├── tests/
└── pyproject.toml</pre>

The filename is part of the project convention for this exercise.

<!--
Notes:
Do not mention the registration process in this deck. Just state the repository convention.
-->

---

# Track-specific metadata files

Each track receives a different Croissant metadata file.

| Track | Adapter | Metadata focus |
|---|---|---|
| Novice | `ProteinInteractionAdapter` | Synthetic protein interaction dataset |
| Advanced | `DrugCentralAdapter` | DrugCentral drug-target interaction dataset |

Both files describe:

```text
adapter software + consumed dataset(s)
```

<!--
Notes:
This is where participants understand why the two tracks have different metadata files.
-->

---

# Novice track: what to inspect

For `ProteinInteractionAdapter`, inspect:

| Question | Where to look |
|---|---|
| Which dataset is used? | `hasPart.name` |
| Which file is used? | `distribution` |
| Which columns define proteins? | `recordSet.field` |
| Which column defines edge type? | `type` field |
| Which graph elements are emitted? | adapter description / keywords / fields |

Expected graph:

```text
(:Protein)-[:activation|binding|inhibition|phosphorylation|ubiquitination]->(:Protein)
```

<!--
Notes:
Tie the metadata directly to Tuesday B novice adapter TODOs.
-->

---

# Advanced track: what to inspect

For `DrugCentralAdapter`, inspect:

| Question | Where to look |
|---|---|
| Which dataset is consumed? | `hasPart.name` |
| Which file is downloaded? | `distribution.contentUrl` |
| Which columns define Drug nodes? | `STRUCT_ID`, `DRUG_NAME` |
| Which columns define Gene nodes? | `GENE`, `TARGET_NAME`, `ORGANISM` |
| Which columns define edges? | `STRUCT_ID`, `GENE` |

Expected graph:

```text
(:Drug)-[:TARGETS]->(:Gene)
```

<!--
Notes:
Mention that metadata should make the adapter understandable without reading every line of code.
-->

---

# Hands-on goal

Add a track-specific `croissant.jsonld` file to your project root.

You should be able to explain:

- adapter-level metadata
- dataset-level metadata
- which file is consumed
- which fields are relevant
- how fields relate to nodes and edges

No new adapter implementation is required in this session.

<!--
Notes:
Keep the hands-on scoped. Participants inspect and connect metadata to code, not write new adapter logic.
-->

---

# Hands-on step 1 — Open the file

Open the provided Croissant metadata file for your track.

Find the adapter-level section:

```text
@type
name
description
version
license
codeRepository
creator
keywords
hasPart
```

Question:

```text
Can you understand what the adapter does from this section alone?
```

<!--
Notes:
Ask participants to spend a few minutes reading the top-level fields first.
-->

---

# Hands-on step 2 — Inspect datasets

Inside `hasPart`, identify:

```text
name
description
version
license
url
distribution
recordSet
```

Questions:

- Which dataset does the adapter consume?
- Which files are described?
- Which fields are important for graph construction?

<!--
Notes:
This connects the dataset block to adapter inputs.
-->

---

# Hands-on step 3 — Connect metadata to code

Open your adapter file and compare:

| Metadata | Adapter code |
|---|---|
| `distribution.contentUrl` | `FileDownload` URL |
| `recordSet.field` | DataFrame columns |
| dataset fields | node properties |
| dataset fields | edge properties |
| graph elements | yielded labels |

Question:

```text
Does the metadata describe what the adapter really uses?
```

<!--
Notes:
This is the practical harmonization step: metadata, data columns, adapter code, and schema should tell the same story.
-->

---

# Hands-on step 4 — Add it to your repo

Copy the track-specific file to the repository root:

```bash
cp <provided-file>.jsonld croissant.jsonld
```

Check:

```bash
ls
cat croissant.jsonld | head
```

Commit:

```bash
git add croissant.jsonld
git commit -m "Add Croissant metadata"
```

<!--
Notes:
Keep the filename and location explicit. Do not mention the next session workflow here.
-->

---

# Reflection questions

Discuss in pairs:

1. What was easy to understand from the metadata?
2. What required looking at the adapter code?
3. Which fields helped connect data to graph elements?
4. Which information would help another developer reuse the adapter?
5. What assumptions are still implicit?

<!--
Notes:
This discussion prepares participants to think critically about metadata quality.
-->

---

# Session checkpoint

By the end of this session, you should have:

- inspected a Croissant metadata file
- identified adapter-level metadata
- identified dataset-level metadata
- connected fields to adapter code
- added `croissant.jsonld` to the repository root

You now have a working project plus machine-readable metadata.

<!--
Notes:
End with the artifact: a repository that includes both executable adapter code and structured metadata.
-->

---

# Sources

- MLCommons Croissant overview: https://mlcommons.org/working-groups/data/croissant/
- Croissant specification: https://docs.mlcommons.org/croissant/docs/croissant-spec.html
- Croissant GitHub repository: https://github.com/mlcommons/croissant
- BioCypher adapter metadata schema v1: `croissant_v1.json`
- Example real-data adapter metadata: `croissant_omnipath.jsonld`

<!--
Notes:
Use this slide only if needed. It is helpful for participants who want to read more after the session.
-->
