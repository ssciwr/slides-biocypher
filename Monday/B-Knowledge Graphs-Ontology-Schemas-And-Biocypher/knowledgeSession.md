---
marp: true
style: |
  section {
    background-image: url('https://biocypher.org/BioCypher/assets/img/biocypher-open-graph.png');
    background-repeat: no-repeat;
    background-position: top 10px right 10px;
    background-size: 70px auto;
  }
  .cite-text {
    font-size: 0.5em;
    color: #aaa;
  }
---
<!-- ask Magdalena: Asparagine → Glycine is the actual amino-acid substitution or not? -->
<!--
# Editor review: added / changed content

Delete these review slides before presenting.

* Added `.cite-text` CSS for small light grey citations.
* Added Guarino ontology citation to ontology definition / shared ontology slides.
* Added Biolink citation for shared biomedical schema / relationships.
* Added BioCypher citation for the purpose and goals of BioCypher.
* Added a bioelectric provenance example using McMillen, Novak & Levin, 2020.
* Changed “Knowledge graphs are statements of fact” to “Knowledge graphs store explicit assertions.”
* Changed IVF / POI wording to FSH / FSHR, with FSHR amino-acid-changing polymorphisms rather than FMR1 / CGG.
* Added Loutradis et al. (2006) citation for FSHR polymorphisms and IVF/ICSI ovarian response.
* Removed the claim that external datasets increase statistical power or act like extra samples.
* Removed the broccoli / cooking ontology example.
* Removed recall / precision / F1 claim from the ML slide.
-->
---

# Editor review: exact added wording

* Ontology is about machine-readable representation.
* Ontology gives the shared biological meaning.
* The BioCypher schema makes that meaning usable for this specific graph.
* Citations are not only slide references.
* They can be stored as graph provenance.
* A relationship can have a source, method, dataset, paper, and confidence.
* Knowledge graphs store explicit assertions.
* They do not make biology absolute.
* Explicit assertions can be queried, filtered, validated, embedded, or used as additional features.
* Formal schemas and constraints can be processed computationally.
* For this lecture, Neo4j queries, schema validation, and graph embeddings are the clearer examples.

---
<!-- ask Magdalena: Asparagine → Glycine is the actual amino-acid substitution or not? -->
<!--
# Editor review: IVF / POI wording

Use this wording:

* We understand some genetic elements behind IVF response.
* We understand a lesser proportion behind POI.
* For IVF patients, we measure follicle response during treatment.
* FSH stimulates follicle development through FSHR.
* FSHR variation has been associated with different ovarian response to stimulation in IVF/ICSI patients.
* Removed the claim that BioCypher or external datasets increase statistical power like extra samples.

Use this question:

**Theoretical study: Can we use known FSH, FSHR, pathway, and phenotype relationships to explore overlap between POI biology and IVF follicle response?**

Removed:

* “previously called POF”
-->
---
<!-- ask Magdalena: Asparagine → Glycine is the actual amino-acid substitution or not? -->
<!--
# Editor review: figure / screenshot suggestions

1. **Ontology / Biolink slide**
   * Biolink Model class / relationship page.
   * One Biolink category page, e.g. gene, disease, chemical entity.

2. **BioCypher schema slide**
   * `schema_config.yaml` screenshot.
   * BioCypher docs screenshot showing schema configuration.

3. **Provenance / citation slide**
   * McMillen, Novak & Levin paper page.
   * A simple provenance table: claim, organism, method, source.

4. **Neo4j query / graph preview slide**
   * Cypher query returning nodes and edges.
   * Neo4j graph preview with labelled nodes.

5. **IVF / POI / follicle response slide**
   * FSHR polymorphism / IVF ovarian response figure.
   * Simple diagram: FSH → FSHR → follicle development → follicle response.
-->
---
<!-- ask Magdalena: Asparagine → Glycine is the actual amino-acid substitution or not? -->
<!--
# Editor review: citations added

Guarino, N., Oberle, D., & Staab, S. (2009). What is an ontology? In *Handbook on ontologies* (pp. 1–17). Springer.

Unni, D. R., Moxon, S. A., Bada, M., Brush, M., Bruskiewich, R., Caufield, J. H., et al. (2022). Biolink Model: A universal schema for knowledge graphs in clinical, biomedical, and translational science. *Clinical and Translational Science, 15*(8), 1848–1855.

Lobentanzer, S., Aloy, P., Baumbach, J., Bohar, B., Carey, V. J., Charoentong, P., et al. (2023). Democratizing knowledge representation with BioCypher. *Nature Biotechnology, 41*(8), 1056–1059.

McMillen, P., Novak, R., & Levin, M. (2020). Toward decoding bioelectric events in Xenopus embryogenesis: New methodology for tracking interplay between calcium and resting potentials in vivo. *Journal of Molecular Biology, 432*(2), 605–620.

Loutradis, D., Patsoula, E., Minas, V., Koussidis, G. A., Antsaklis, A., Michalas, S., & Makrigiannakis, A. (2006). FSH receptor gene polymorphisms have a role for different ovarian response to stimulation in patients entering IVF/ICSI-ET programs. *Journal of Assisted Reproduction and Genetics, 23*(4), 177–184.
-->
---

# Knowledge Graphs & Ontologies in Biology

![](typesOfGraphsInBiology.png)

---

# Why we use Knowledge Graphs

- Biology is extremely relational: encoding, interaction, affecting, targeting.
- Understanding the full toolchain and how it works with the pure complexity and amount of different entities, such as proteins, genes, and codons, is difficult without automation.
- We can represent a relationship with the concept of graphs that connect our entities by their relationships. In these graphs, our entities are traditionally “nodes”.

---

# Nodes vs Edges

![](nodesAndEdges.png)

* Nodes are the biological entities in the graph, such as proteins, genes, transcription factors, pathways, diseases, or compounds.
* Edges are the typed relationships between nodes, such as `interacts_with`, `regulates`, `expressed_in`, `targets`, or `associated_with`. **You can define this for your own dataset with BioCypher!**

---

# Nodes vs Edges - COLLECTRI Example

* In a regulatory interaction dataset such as COLLECTRI, transcription factors and genes can be represented as nodes, while experimentally supported regulatory relationships can be represented as edges.
* Example: one transcription factor node may activate or inhibit a target gene node.
* Both kinds of data are important: nodes tell us *what* exists, and edges tell us *how entities relate biologically*.

---

# What is an ontology?

* An ontology is a controlled vocabulary for a domain.
* It defines what kinds of things exist, what they mean, and how they can relate to each other.
* In biology, this matters because the same thing can be named, grouped, or interpreted differently across datasets.
* In computational work, an ontology is a formal, explicit specification of a shared conceptualisation.

<p class="cite-text">Guarino, N., Oberle, D., & Staab, S. (2009). What is an ontology? In Handbook on ontologies (pp. 1–17). Springer.</p>

---

# Ontology example: precise medical terminology

* In medicine, precise terminology is not just style, it changes meaning.
* “Seizure”, “epilepsy”, “convulsion”, and “abnormal motor movement” can overlap in everyday speech, but they are not the same thing in structured clinical data.
* An ontology helps decide what concept is being described and how it relates to symptoms, diagnoses, observations, and patient features.

---

# Ontology vs schema

* **Ontology:** the general biological language.
* **Schema:** the project-specific rulebook for how this dataset becomes a graph.
* Ontology gives the shared biological meaning.
* The BioCypher schema makes that meaning usable for this specific graph.

<p class="cite-text">Guarino, N., Oberle, D., & Staab, S. (2009). What is an ontology? In Handbook on ontologies (pp. 1–17). Springer.</p>

---

# Biolink as shared biomedical language

* Biolink gives shared classes and relationships for biomedical knowledge graphs.
* It helps keep terms like gene, disease, phenotype, chemical entity, and pathway consistent.
* This makes comparisons across datasets easier.
* It also makes graph queries more predictable.

<p class="cite-text">Unni, D. R., Moxon, S. A., Bada, M., Brush, M., Bruskiewich, R., Caufield, J. H., et al. (2022). Biolink Model: A universal schema for knowledge graphs in clinical, biomedical, and translational science. Clinical and Translational Science, 15(8), 1848–1855.</p>

---

# Why schema files exist

* They make the graph predictable.
* They say which labels are valid nodes and edges.
* They prevent every adapter from inventing slightly different labels for the same things.
* They give you a guide as to what you will use to query Neo4j with later.
* You start with the schema.

---

# BioCypher schema example

<pre><code class="language-yaml">gene:
  represented_as: node
  preferred_id: hgnc.symbol
  input_label: gene
  properties:
    name: str

...
</code></pre>

---

# BioCypher schema example

<pre><code class="language-yaml">gene:
  represented_as: node
  preferred_id: hgnc.symbol
  input_label: gene
  properties:
    name: str

transcription factor:
  is_a: gene
  represented_as: node
  preferred_id: hgnc.symbol
  input_label: transcription factor
  properties:
    name: str
    category: str

...
</code></pre>

---

# BioCypher schema example

<pre style="font-size: 0.82rem; line-height: 1.4; padding: 1rem; overflow-x: auto; white-space: pre; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px;"><code class="language-yaml" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">gene:
  represented_as: node
  preferred_id: hgnc.symbol
  input_label: gene
  properties:
    name: str

transcription factor:
  is_a: gene
  represented_as: node
  preferred_id: hgnc.symbol
  input_label: transcription factor
  properties:
    name: str
    category: str

transcriptional regulation:
  is_a: pairwise gene to gene interaction
  represented_as: edge
  source: transcription factor
  target: gene
  input_label: transcriptional regulation
  properties: ...
</code></pre>

---

# BioCypher schema example

<pre><code class="language-yaml">transcriptional regulation:
  is_a: pairwise gene to gene interaction
  represented_as: edge
  source: transcription factor
  target: gene
  input_label: transcriptional regulation
  properties:
    activation_or_inhibition: str
    resources: str
    references: str
    sign_decision: str
</code></pre>

---

# Knowledge graph: With Neo4j

* Neo4j allows you to write queries, which can each match based upon multiple relationships and nodes.
* This asks which transcription factors activate which genes, and what references support the relationship.

<pre><code style="font-size:0.85em" class="language-cypher">MATCH (tf:`transcription factor`)-[r:`transcriptional regulation`]->(g:gene)
WHERE r.activation_or_inhibition = "activation"
RETURN tf.name, g.name, r.references
LIMIT 10
</code></pre>

* These feel human-written and AI can support writing these too when you provide the relevant relationships to query.

---

# Ontologies

* Help us agree upon the way to describe our domain.
* Have specific ways of characterising relationships (*edges*) in their biological context within a dataset consistently.
* Relationships can be defined according to the semantics of the research field and the theories at hand.
* Represent the wider fidelity of data, rather than data without clarified, identified relationships.

<p class="cite-text">Guarino, N., Oberle, D., & Staab, S. (2009). What is an ontology? In Handbook on ontologies (pp. 1–17). Springer.</p>

---

# Encoding relationships

* Relationships in biology help understand the causes of events that we measure in data.
* For much data, like genes or cells, we have a rich ontology of everything that relates to them, such as what the cell is made of, what receptors it has, and what encodes its behaviour, which is relevant for research.
* For those existing, well-defined areas, you can link your data to large third-party datasets and query the connected biological context.

---
<!-- ask Magdalena: Asparagine → Glycine is the actual amino-acid substitution or not? -->
<!--
# We all use relationships to inform research inquiry - Medical study example

IVF is extremely difficult and can be unpredictable for women to undertake, as each treatment round is uncertain. Additionally, treatment response rates are not uniform for IVF.

* We understand some genetic elements behind IVF response.
* We understand a lesser proportion behind POI, Primary Ovarian Insufficiency.
* For IVF patients, we measure follicle response during treatment.
-->
---
<!-- ask Magdalena: Asparagine → Glycine is the actual amino-acid substitution or not? -->
<!--
# Medical study example part two

* FSH is follicle-stimulating hormone.
* FSH stimulates follicle development through FSHR.
* FSHR variation has been associated with different ovarian response to stimulation in IVF/ICSI patients.
* The specific FSHR variants often discussed are amino-acid-changing polymorphisms, including Thr307Ala and Asn680Ser.
* Those receptor and pathway differences may affect biological functions such as ovarian follicle development and treatment response.
* The point is the chain of events: hormone signal, receptor response, pathway activity, follicle response.

<p class="cite-text">Loutradis, D., Patsoula, E., Minas, V., Koussidis, G. A., Antsaklis, A., Michalas, S., & Makrigiannakis, A. (2006). FSH receptor gene polymorphisms have a role for different ovarian response to stimulation in patients entering IVF/ICSI-ET programs. Journal of Assisted Reproduction and Genetics, 23(4), 177–184.</p>
-->
---
<!-- ask Magdalena: Asparagine → Glycine is the actual amino-acid substitution or not? -->
<!--
# Theoretical study

**Can we use known FSH, FSHR, pathway, and phenotype relationships to explore overlap between POI biology and IVF follicle response?**

* This is a graph-based research question.
* It does not mean POI and IVF response are the same.
* It means we can query shared hormones, receptors, genes, pathways, and phenotypes.
* We can use the graph to find candidates for further investigation.
-->
---
<!-- ask Magdalena: Asparagine → Glycine is the actual amino-acid substitution or not? -->
<!--
# The power of that is querying across a massive range of interconnected entities:

* The fact that POI, Primary Ovarian Insufficiency, is conceptually linked to IVF enables us to explore this research direction, and in this case can be identified as a research question manually.
* But in some cases, we have many different partially related concepts: different amino acids, thousands of genes, and different ways of categorising disease.
* Knowledge graphs can help us identify and filter the *most promising candidates* at scales of relationship traversal we could never achieve ourselves by hand.
-->
---

# Why Knowledge Graphs are useful to you

* If you believe the processes, pathways, and subtypes in your data provide context to research, you can connect your data to other datasets with prescribed ontologies.
* That makes it easier to manage provenance, duplication, and the biological context around candidate relationships.
* Third-party knowledge graphs can provide prior biological context, but they do not become extra experimental samples by default.
* Knowledge graphs work with relationships in any direction.

![](typesOfGraphsInBiology.png)

---

# Knowledge graphs store explicit assertions

* They do not make biology absolute.
* This expresses or leads to that.
* This can express or can lead to that.
* The relationship itself is the data: source node, relationship type, target node.
* Uncertainty can still be represented, but it should be modelled explicitly as evidence, confidence, or provenance.

---

# Computational value of explicit assertions

* Explicit assertions can be queried in Neo4j.
* They can be filtered.
* They can be validated against schema constraints.
* They can be embedded.
* They can be used as additional features.
* Formal schemas and constraints can be processed computationally.
* For this lecture, Neo4j queries, schema validation, and graph embeddings are the clearer examples.

---

# Citations and provenance can be graph content

* Citations are not only slide references.
* They can be stored as graph provenance.
* A relationship can have a source, method, dataset, paper, and confidence.

<pre><code class="language-text">Xenopus embryo ─has_measured_bioelectric_state→ resting membrane potential

source: McMillen, Novak & Levin, 2020
method: in vivo imaging
context: Xenopus embryogenesis
measurement: calcium and resting potential dynamics
</code></pre>

<p class="cite-text">McMillen, P., Novak, R., & Levin, M. (2020). Toward decoding bioelectric events in Xenopus embryogenesis: New methodology for tracking interplay between calcium and resting potentials in vivo. Journal of Molecular Biology, 432(2), 605–620.</p>

---

# Knowledge Graphs

* A knowledge graph becomes useful because entities are not treated as isolated rows; they are connected through typed, interpretable relationships.
* Queries can follow biologically meaningful paths across genes, proteins, pathways, phenotypes, treatments, and diseases.
* Knowledge graphs are useful when data for a specific subtype is sparse because they can point to related conditions, phenotypes, mechanisms, or prior evidence.
* This supports hypothesis generation and comparator discovery, but it does not increase the experimental sample size by itself.

---

# Example 1: Query the Knowledge Base for candidates to investigate:

* Which ion channels or gap-junction proteins are connected to certain phenotypes,
* are expressed in the relevant tissue,
* and are targetable by known compounds?

= a list of gap-junction proteins to investigate further for research applicability.

---

# Moving from sparse data to relevant evidence

* BioCypher can help structure heterogeneous biomedical data as a knowledge graph.
* This makes it easier to connect a rare subtype to related conditions, pathways, phenotypes, or historical evidence.
* This does not increase your experimental sample size by itself.
* External datasets are not automatically additional samples.
* Provenance, batch effects, population differences, and measurement differences still matter.
* These graph connections can support **cohort discovery**, **comparator group selection**, and **feature engineering**.
* Whereas LLMs are stochastic and unpredictable, graph queries are predictable and rules-based.

<p class="cite-text">Lobentanzer, S., Aloy, P., Baumbach, J., Bohar, B., Carey, V. J., Charoentong, P., et al. (2023). Democratizing knowledge representation with BioCypher. Nature Biotechnology, 41(8), 1056–1059.</p>

---

# Using graph-informed evidence for model training

* **For model training**, graph-derived relationships can be used as additional features.
* They should not be treated as extra experimental samples unless a separate statistical integration method justifies that.
* These features can represent genes, pathways, variants, diseases, or prior biological relationships.
* The model still needs empirical validation.

---

# Using graph-informed evidence for prediction

* **For prediction**, when a subtype has few direct cases, the graph can help identify related diagnoses, phenotypes, laboratory findings, or clinical relationships.
* Example feature: `count_of_related_negative_case_patterns`
* This is prior context for the model, not automatic extra sample size.

---

# Knowledge graphs can have spatial data: Mediterranean map

![](mediterranianExample.png)

---

# Knowledge Graphs can still be exposed in spatial interfaces:

![](mediterranianExample2.png)

---

# Difference from spatial data:

Clustering algorithms can cluster different cell types under analysis and link them to different genes.

That is useful too, and it is different. Clustering based on expression does appear on a 2D graph, but the actual entities, for example two points near each other, are not actually necessarily related. Even if the distance between cells tells us something about how they are related or their group, this is not a knowledge graph, especially when the relationship has not been described with an edge type. “part of” or “has a” are extremely different and not possible to encode with spatial data.

---

# Challenges with knowledge graphs

Different ways of describing the same ontologies, or different levels of data granularity for knowledge graph content.

Sometimes, the same biological “unit” can be described at slightly different, overlapping scales.

Different datasets doing this makes managing and drawing insights across omics difficult.

* Without schema discipline that BioCypher enforces, large graphs can become difficult to trust, query, and maintain.

---

# The goal of BioCypher is to resolve the difficulty of:

(A) understanding the applicability of knowledge graphs for biological research inquiry in your subdomain
(B) enabling rapid research with knowledge graphs
(C) supporting the provision of your own data to this analysis
(D) sharing your data with the wider scientific community to achieve faster overall progress in biology

<p class="cite-text">Lobentanzer, S., Aloy, P., Baumbach, J., Bohar, B., Carey, V. J., Charoentong, P., et al. (2023). Democratizing knowledge representation with BioCypher. Nature Biotechnology, 41(8), 1056–1059.</p>

---

# BioCypher goal / purpose

* BioCypher does not try to make one universal biology graph.
* BioCypher standardises how biomedical knowledge graphs are built.
* It keeps source provenance while mapping data onto biomedical ontologies.
* It supports task-specific knowledge graphs.

<p class="cite-text">Lobentanzer, S., Aloy, P., Baumbach, J., Bohar, B., Carey, V. J., Charoentong, P., et al. (2023). Democratizing knowledge representation with BioCypher. Nature Biotechnology, 41(8), 1056–1059.</p>

---

# The power of ontology:

* Having relationships defined in an ontology schema means confusion over similar entities, entities that are part of each other, dissimilar but similarly named entities, a recurrent risk in biology, or the same entity with different names, such as “human” vs “Homo sapiens”, can be approached systemically for better **data consistency**.
* You can trust your data itself better when you have approached how relationships are defined for the whole dataset together, rather than manually adding nodes or graph relationships - which works at first but can result in large discrepancies or data provenance issues down the line.

![](labelingConfusion.jpeg)

---

# BioCypher configures stringent regulation, with project-specific schemas

* Rather than having questions later, such as “is seizure a Symptom, Clinical Finding, or PatientFeature in this context?”, you decide when integrating data.
* Being able to have an explicit record of what decision was made means you can make sure queries are exhaustive for your data, and slight semantic differences cannot prevent finding everything that actually satisfies the query in your dataset.
* Example: recording seizure as a Clinical Finding, but only looking for “Symptoms” and not finding it.
* Are disease IDs coded IDs or free text? This may not matter, but all must be consistent.

---

# But, my data would take a long time to convert into ontology concepts...

It can take time, but we do not need to do everything manually.

* Entity linking can automatically map text or labels to ontology/database IDs, e.g. “seizure” → HPO: Seizure; “EGFR” → UniProt/HGNC gene/protein ID.

---

# Further ways to make your data work with ontologies:

* You can use tools to convert text into a graph node, edge, or property. For free text, it can be partially automated: scispaCy, MetaMap, CLAMP, MedCAT. You can also cluster text embeddings or use prompt-based local text classification.

* For tabular data, OntoWeaver can map tables into semantic knowledge graphs in BioCypher.

* Your pipeline for data does not need to be perfect, but with BioCypher and other tools it can be a reproducible mapping pipeline where assumptions about data and relationships are consistent, recorded, and can be applied identically to additional data you collect.

---

# Example 2: BioCypher for historic, as-yet unconnected, integratable work in reanalysis papers

* 1. Imagine you have 3 different datasets from different experiments focusing on different genes.
* 2. You can use an adapter to bring the information in, and then use ontology data from, e.g. UniProt, to understand what genetics, proteins, and pathways occur in common between those different separate datasets.
* 3. You can make conclusions with the proteins between these 3 datasets in a 4th paper.

---

# Quick topic: Adapters

* Adapters provide an ontology-aligned way to bring existing biological resources into your graph.
* After using an adapter, Neo4j queries can use extra relationship data matched to entities in your dataset.
* Example: an adapter has information on which ion channels are expressed in different tissues, and which compounds can target them. Your data has some of the ion channels, so your queries can use that linked tissue and compound context.

---

# What the community adapters allow you to do:

* This allows you to ask richer biological questions immediately, without manually rebuilding all known relationships yourself.
* It provides a model of how relationships are often defined in this area of biology.
* It lets your dataset link to useful context from established biological resources, such as tissue expression, protein function, disease links, and compound targeting.

---

# Summary

- Knowledge graphs help us make data with relationships navigable and queryable.
- Defining schemas for your ontology in BioCypher lets us enforce data consistency and establish data provenance. Schemas give you powerful insight into what queries you can make.
- BioCypher brings community adapters that let existing ontologies and datasets be linked to your research data with provenance.
- This supports richer queries, candidate discovery, and biological context, but not automatic sample expansion.
- Now we understand the theory here, we will cover how these actually interact in practice, from your CSV to adapter-supported graph construction.

<!-- maybe don't cover: batch effects and why extended datasets that analyzed the same data you have(e.g. but 10x more) cannot simply contribute to your data samples, even if you use exactly the same Ontology (e.g. BioLink -->
