/*********************************************************************************************************/
/* STRUCTURATION DE LA SECTION VIA DOM */
const sectionPortfolio = document.getElementById("portfolio");

const h2Portfolio = document.createElement("h2");
h2Portfolio.innerText = "Mes projets";
sectionPortfolio.appendChild(h2Portfolio);

const filterPortfolio = document.createElement("div");
filterPortfolio.classList.add("filters");
sectionPortfolio.appendChild(filterPortfolio);

const galleryContainer = document.createElement("div");
galleryContainer.classList.add("gallery");
sectionPortfolio.appendChild(galleryContainer);
/*********************************************************************************************************/

/*********************************************************************************************************/
/* Cette fonction fait une requette pour obtenir les données depuis l'API et affiche la fonction qui manipule le DOM. Le catch affichera un message en cas d'erreur */
async function fetchAndShowWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    createGallery(works);
  } catch (error) {
    console.error(error);
  }
}

/* Cette fontion manipule le DOM pour créer les éléments HTML à partir de données qui ont été récupérées par la fonction précédente. La boucle for va parcourir les données obtenues et créer les éléments html pour chaque index identifié dans l'array */
function createGallery(works) {
  const worksContainer = document.querySelector(".gallery");

  for (let i = 0; i < works.length; i++) {
    const figure = works[i];

    const figureWorks = document.createElement("figure");
    figureWorks.dataset.category = figure.categoryId;
    worksContainer.appendChild(figureWorks);

    const workImg = document.createElement("img");
    workImg.src = figure.imageUrl;
    figureWorks.appendChild(workImg);

    const figCaption = document.createElement("figcaption");
    figCaption.innerText = figure.title;
    figureWorks.appendChild(figCaption);
  }
}

/* Ici la fonction principale est appelée pour afficher les éléments sur la page */
fetchAndShowWorks(createGallery);
/*********************************************************************************************************/

/*********************************************************************************************************/
/* Cette fonction fait une requette pour obtenir les informations des categories depuis l'API et affiche la fonction qui manipule le DOM. Le catch affichera un message en cas d'erreur */
async function fetchAndShowCategory() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    createFilters(categories);
  } catch (error) {
    console.error(error);
  }
}

/* Cette fontion manipule le DOM pour créer les boutons qui serviront des filtres par categorie. La boucle for parcourt les données obtenues et créer les éléments html pour chaque index identifié dans l'array */
function createFilters(categories) {
  const filtersContainer = document.querySelector(".filters");

  const filterAll = document.createElement("button");
  filterAll.innerText = "Tous";
  filterAll.classList.add("selected");
  filtersContainer.appendChild(filterAll);

  for (let c = 0; c < categories.length; c++) {
    const button = categories[c];

    const buttonFilters = document.createElement("button");
    buttonFilters.dataset.id = button.id;
    buttonFilters.innerText = button.name;
    buttonFilters.classList.add("filter-button");
    filtersContainer.appendChild(buttonFilters);
  }
}

/* Ici la fonction principale est appelée pour afficher les éléments sur la page */
fetchAndShowCategory(createFilters);
/*********************************************************************************************************/
