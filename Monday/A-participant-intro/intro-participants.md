---

marp: true
style: |
section {
background-image: url('https://biocypher.org/BioCypher/assets/img/biocypher-open-graph.png');
background-repeat: no-repeat;
background-position: top 10px right 10px;
background-size: 70px auto;
<style>
  img[alt~='center'] {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>
<style>
  :root { --title-color: #23395d; }
  h1 { color: var(--title-color); }
  em { color: var(--title-color); }
</style>
---

# Three-minute participant introductions

* Your name
* Your institution
* Your project, or what you would like to work on in the future
* Your goal(s) for this week

<!--
Speaker notes:
- Welcome participants and explain that this opening is meant to make the group visible to itself.
- Mention that three minutes is a guideline, not a strict exam-like limit, but encourage everyone to be concise so all participants have time.
- If the group is large, ask people to focus especially on their project and what they hope to get out of the workshop.
- Transition: after hearing from everyone, we will align on the general learning goals for the week.
-->

--- 

# Learning goals for the workshop

<style scoped>
li { font-size: 0.7em; }
</style>
* Semantic Knowledge Graphs (SKGs): 
    * What they are
    * What needs to be defined
    * How to use them 
    * `neo4j` as a visualization and query engine
* Adapters:
    * Harmonizing data and metadata at different levels
    * [`Croissant`](https://mlcommons.org/working-groups/data/croissant/) for structured metadata
    * How to build them
* Software:
    * Use Python UI / `OntoWeaver` / agentic AI to use `BioCypher`
    * Use `OntoWeaver` for information fusion
    * The `BioCypher` ecosystem and vision
* How to collaborate on Open-Source Software projects
* Software Engineering and AI engineering best practices
* Use cases and scientific insights of the other participants  


<!--
Speaker notes:
- For Semantic Knowledge Graphs, explain that participants will learn what needs to be modeled before data can become a useful graph: entities, relationships, identifiers, metadata, and semantics.

- For adapters, highlight that they are the bridge between heterogeneous source data and a harmonized BioCypher graph.

- Mention that Croissant appears in the workshop as a way to describe datasets and metadata in a structured, reusable form.
-->
