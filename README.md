# BioCypher Workshop Slides

Rendered slide decks for the BioCypher workshop. Each link below opens the
HTML version produced by the Marp rendering CI workflow and deployed to GitHub
Pages.

## Monday

- [Talks — Introduction](Monday/Talks/intro.html)
- [Participant introductions](Monday/A-participant-intro/intro-participants.html)
- [Knowledge Graphs, Ontologies, Schemas and BioCypher](Monday/B-Knowledge%20Graphs-Ontology-Schemas-And-Biocypher/knowledgeSessionAlt.html)
- [BioCypher pathways](Monday/C-biocypher-pathways/intro-bc-pathways.html)

---

The decks are authored as [Marp](https://marp.app/) markdown (files that opt in
via the Marp front-matter flag). On every push to `main` the workflow in
`.github/workflows/render-marp.yml` renders each deck to HTML, builds this page
as `index.html`, and deploys everything to GitHub Pages.
