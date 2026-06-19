
# Datasets

## Novice Track

```mermaid
graph LR
    p1[protein]
    p2[protein]
    Pathway[pathway]

    p1 -->|activation| p2
    p1 -->|inhibition| p2
    p1 -->|ubiquitination| p2
    p1 -->|phosphorilation| p2
    p1 -->|binding| p2
    p1 -->|participates in| Pathway
```

- Synthetic Protein Protein Interactions dataset
    - TSV file
    - Croissant Examples
    - [source](https://zenodo.org/records/20733159)

- Synthetic Pathways dataset
    - TSV file
    - [source](https://zenodo.org/records/20742395)
---

## Advance track

```mermaid
graph LR
    Drug[drug]
    Gene[gene]
    SideEffect[side effect]

    Drug -->|targets| Gene
    Drug -->|has| SideEffect
```

- Drug Central: useful for drug targets gene subgraph!
    - [Source](https://drugcentral.org/download)

- SIDER: useful for drug has side effect subgraph!
    - [Source](http://sideeffects.embl.de/download/) 
