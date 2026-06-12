---
marp: true
theme: default
paginate: true
header: 'BioCypher Workshop 2026 · Session 3'
footer: 'Harmonizing biomedical data'
---

# Harmonizing Biomedical Data

## From provisional genes to canonical identifiers

**Session 3**  
BioCypher Drug Discovery Knowledge Graph

---

# Where we are

Session 1 created the first real graph:

```text
(:Drug)-[:TARGETS]->(:Gene)
```

But our `Gene` nodes are still provisional:

```text
GENE:KCNH2
GENE:EGFR
GENE:PTGS1
```

They are based on symbols from DrugCentral, not canonical gene identifiers.

---

# Goal of this session

Turn the first graph into a harmonized graph.

```text
DrugCentral genes
        ↓
HGNC canonical gene records
        ↓
Reactome pathway mappings
        ↓
Drug → Gene → Pathway
```

By the end, participants should understand how to integrate multiple biomedical data sources through shared identifiers.

---

# Why harmonization matters

The same biological entity can appear differently across sources.

```text
DrugCentral:  GENE = EGFR
HGNC:         symbol = EGFR, hgnc_id = HGNC:3236
Reactome:     ENSG00000146648 → R-HSA-177929
```

The challenge is not only loading more data.

The challenge is making records point to the same biological entity.

---

# Session 3 graph target

We extend the graph from:

```text
(:Drug)-[:TARGETS]->(:Gene)
```

To:

```text
(:Drug)-[:TARGETS]->(:Gene)-[:PARTICIPATES_IN]->(:Pathway)
```

New elements:

```text
Canonical Gene nodes
Pathway nodes
Gene → Pathway edges
```

---

# Data sources

We add two real datasets.

| Source | Role |
|---|---|
| HGNC | Canonical gene identifiers and metadata |
| Reactome | Gene-to-pathway mappings |

The workflow remains simple:

```text
URLs in create_knowledge_graph.py
→ BioCypher FileDownload
→ local cache
→ adapters
```

No YAML data-source file is used in this session.

---

# Data retrieval pattern

We continue using direct constants in `create_knowledge_graph.py`.

```python
HGNC_URL = "https://storage.googleapis.com/public-download-files/hgnc/tsv/tsv/hgnc_complete_set.txt"

REACTOME_URL = (
    "https://reactome.org/download/current/"
    "Ensembl2Reactome_All_Levels.txt"
)
```

Then create `FileDownload` resources, exactly as in Session 1.

---

# Adapter design

We add two adapters.

```text
HGNCAdapter
├── emits canonical Gene nodes
└── enriches/replaces provisional gene identity

ReactomeAdapter
├── emits Pathway nodes
└── emits Gene → PARTICIPATES_IN → Pathway edges
```

The important teaching point:

```text
Adapters stay source-specific.
Harmonization happens through identifiers and schema design.
```

---

# HGNCAdapter responsibility

Input: `hgnc_complete_set.txt`

Use columns such as:

```text
hgnc_id
symbol
name
ensembl_gene_id
entrez_id
uniprot_ids
```

Recommended node ID:

```text
HGNC:{hgnc_id_number}
```

Example:

```text
HGNC:3236  EGFR
```

---

# What changes for Gene nodes?

Session 1 used provisional IDs:

```text
GENE:EGFR
```

Session 3 should move toward canonical IDs:

```text
HGNC:3236
```

The key mapping is:

```text
DrugCentral GENE symbol
        ↓
HGNC symbol
        ↓
HGNC ID + Ensembl ID
```

---

# Harmonization strategy

Keep the workshop implementation simple:

```text
1. Build a symbol → HGNC ID lookup from HGNC.
2. Normalize DrugCentral gene symbols.
3. Emit canonical Gene nodes from HGNC.
4. Make DrugCentral TARGETS edges point to HGNC IDs when possible.
5. Keep unmatched genes as provisional fallback nodes.
```

This is practical, explainable, and robust.

---

# Updated DrugCentralAdapter

Before:

```text
DRUGCENTRAL:4 → GENE:KCNH2
```

After harmonization:

```text
DRUGCENTRAL:4 → HGNC:6251
```

The adapter can receive a lookup:

```python
DrugCentralAdapter(
    data_source=drugcentral_path,
    gene_symbol_to_hgnc_id=gene_lookup,
)
```

---

# ReactomeAdapter responsibility

Input: `Ensembl2Reactome_All_Levels.txt`

Typical fields include:

```text
Ensembl gene ID
Reactome pathway ID
Reactome pathway URL
Pathway name
Evidence code
Species
```

For this workshop, filter to:

```text
Homo sapiens
```

---

# Pathway nodes

Each unique Reactome pathway becomes a node.

```text
REACTOME:R-HSA-177929
```

Properties:

```text
name
species
url
source
```

Example graph element:

```text
(:Pathway {id: "REACTOME:R-HSA-177929", name: "EGFR signaling"})
```

---

# Gene → Pathway edges

Reactome connects Ensembl gene IDs to pathways.

```text
ENSG00000146648 → R-HSA-177929
```

HGNC gives us:

```text
HGNC ID ↔ Ensembl gene ID
```

So the final edge is:

```text
(:Gene)-[:PARTICIPATES_IN]->(:Pathway)
```

---

# Updated schema

New graph elements:

```yaml
gene:
  represented_as: node
  input_label: gene

pathway:
  represented_as: node
  input_label: pathway

participates_in:
  represented_as: edge
  input_label: participates_in
  source: gene
  target: pathway
```

The schema is the contract between adapters and BioCypher.

---

# Hands-on checkpoints

| Checkpoint | Output |
|---|---|
| 1 | Add HGNC URL and download resource |
| 2 | Create HGNCAdapter |
| 3 | Build symbol → HGNC ID lookup |
| 4 | Update DrugCentralAdapter to use canonical gene IDs |
| 5 | Add Reactome URL and adapter |
| 6 | Emit Pathway nodes |
| 7 | Emit Gene → Pathway edges |
| 8 | Import and query in Neo4j |

---

# Validation queries

Do we have canonical genes?

```cypher
MATCH (g:Gene)
RETURN g.id, g.symbol
LIMIT 10;
```

Which pathways are connected to drug targets?

```cypher
MATCH (d:Drug)-[:TARGETS]->(g:Gene)-[:PARTICIPATES_IN]->(p:Pathway)
RETURN d.name, g.symbol, p.name
LIMIT 20;
```

---

# Useful analysis query

Which pathways are targeted by the largest number of drugs?

```cypher
MATCH (d:Drug)-[:TARGETS]->(g:Gene)-[:PARTICIPATES_IN]->(p:Pathway)
RETURN p.name AS pathway,
       count(DISTINCT d) AS drugs,
       count(DISTINCT g) AS genes
ORDER BY drugs DESC
LIMIT 20;
```

This is the first query that uses the integrated graph.

---

# Expected final graph

```text
(:Drug)-[:TARGETS]->(:Gene)-[:PARTICIPATES_IN]->(:Pathway)
```

What changed from Session 1?

```text
Gene nodes are no longer just local symbols.
They are grounded through HGNC.
Reactome adds biological context.
```

---

# Common problems

| Problem | Cause | Fix |
|---|---|---|
| Missing Reactome edges | no Ensembl ID mapping | inspect HGNC columns |
| Duplicate genes | symbol-only IDs | use HGNC IDs |
| Import failure | delimiters in values | sanitize adapter output |
| Too many species | unfiltered Reactome data | keep Homo sapiens only |

---

# Recap

Today we moved from building an adapter to harmonizing data.

```text
Session 1: DrugCentral adapter
Session 2: MCP-assisted inspection
Session 3: HGNC + Reactome harmonization
```

The graph now supports:

```text
Drug → Gene → Pathway
```

Next: connect genes or pathways to disease context.

---

# References

- HGNC complete dataset: https://www.genenames.org/download/statistics-and-files/
- Reactome downloads: https://reactome.org/download-data
- Reactome Ensembl mapping: https://reactome.org/download/current/Ensembl2Reactome_All_Levels.txt
- BioCypher schema configuration: https://biocypher.org/BioCypher/reference/schema-config/
