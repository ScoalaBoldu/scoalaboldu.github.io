# Școala Gimnazială Boldu – sursa site-ului

Site construit cu [Hugo](https://gohugo.io) și tema [Educenter](https://github.com/themefisher/educenter-hugo) (licență MIT), adaptată în limba română.

Conținutul se editează din **Pages CMS** (https://app.pagescms.org), nu direct în fișiere. Manualul pentru editori: pagina `/manual/` a site-ului (și PDF-ul din `static/manual/`). Accesul și rolurile: `ACCES.md`.

- `content/activitati/` – activități (o pagină pe activitate, cu galerie foto)
- `content/erasmus/<proiect>/` – proiectele Erasmus+, separat de activități; `_index.md` = descrierea proiectului, celelalte fișiere = mobilități și diseminări
- `content/avizier/` – anunțuri · `content/proiecte/` – alte proiecte · `data/documente.yml` – documente
- `data/ro/homepage.yml` – prima pagină
- `assets/images/foto/` – fotografii (`fb/<activitate>/` = fotografii preluate de pe Facebook) · `static/fisiere/` – documente

Aspectul: `layouts/`, `assets/scss/_custom.scss`, `assets/scss/_variables.scss` (culori).

Publicare: la fiecare salvare pe ramura `main`, GitHub Actions (`.github/workflows/hugo.yml`) construiește și publică site-ul. Previzualizarea curentă: https://scoalaboldu.github.io/nou/
