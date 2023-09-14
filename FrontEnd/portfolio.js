const userData = window.localStorage.getItem("userData");

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
    figureWorks.classList.add("category-" + figure.categoryId);
    worksContainer.appendChild(figureWorks);

    const workImg = document.createElement("img");
    workImg.src = figure.imageUrl;
    workImg.id = "work-" + figure.id;
    figureWorks.appendChild(workImg);

    const figCaption = document.createElement("figcaption");
    figCaption.innerText = figure.title;
    figureWorks.appendChild(figCaption);
  }
}

/* Ici la fonction principale est appelée pour afficher les éléments sur la page */
fetchAndShowWorks(createGallery);

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

/* Cette fontion manipule le DOM pour créer les boutons qui serviront des filtres par categorie. La boucle for parcourt les données obtenues et créer les éléments html pour chaque index identifié dans l'array. Dans la boucle il y a aussi les eventListeners qui suppriment ou ajoutent une classe aux boutons */
function createFilters(categories) {
  const filtersContainer = document.querySelector(".filters");
  
  if (userData !== null) {
    filtersContainer.classList.add("d-none");
  } else {

    const buttonAll = document.createElement("button");
    buttonAll.innerText = "Tous";
    buttonAll.id = "all";
    buttonAll.classList.add("selected", "category-filter");
    filtersContainer.appendChild(buttonAll);
  
    for (let c = 0; c < categories.length; c++) {
      const category = categories[c];
  
      const buttonFilters = document.createElement("button");
      buttonFilters.id = "category-" + category.id;
      buttonFilters.classList.add("category-filter");
      buttonFilters.innerText = category.name;
      filtersContainer.appendChild(buttonFilters);
  
      buttonFilters.addEventListener("click", () => {
        resetFilters();
        buttonFilters.classList.add("selected");
        updateGallery();
      });
  
      buttonAll.addEventListener("click", () => {
        resetFilters();
        buttonAll.classList.add("selected");
        updateGallery();
      });
    }
  }
}


/* Ici la fonction principale est appelée pour afficher les éléments sur la page */
fetchAndShowCategory(createFilters);

/* Cette fonction supprime la classe selected des tous les filtres */
function resetFilters() {
  const filters = document.querySelectorAll(".filters button");
  filters.forEach((filter) => filter.classList.remove("selected"));
}

/* Cette fonction prend tous les éléments qui ont la classe selected, c'est à dire le filtre selectionné. Ensuite j'identifie l'id du filtre selectionné dans la const filterId. Ensuite j'identifie toutes les figures dans la const figures pour pouvoir travailler les conditions. SI l'id du filtre selectionné est égal à "all", je supprime la classe d-none de toutes les figures. ELSE, je verifie pour chaque image SI la classe de la figure correspond/contient l'id du filtre. Si oui, la classe d-none est supprimée pour que l'image puisse être affichée, sinon la classe de la figure ne correspond pas à l'id du filtre, j'ajoute la classe d-none pour cacher la figure de la galerie  */
function updateGallery() {
  const selectedFilter = document.querySelector(".selected");
  const filterId = selectedFilter.id;

  const figures = document.querySelectorAll(".gallery figure");

  if (filterId === "all") {
    figures.forEach((figure) => {
      figure.classList.remove("d-none");
    });
  } else {
    figures.forEach((figure) => {
      if (figure.classList.contains(filterId)) {
        figure.classList.remove("d-none");
      } else {
        figure.classList.add("d-none");
      }
    });
  }
}

/* COMPORTEMENT QUAND L'USER EST CONNECTE */

/* Logout */
function userAuth() {

  const userLoggedIn = document.querySelector("#login-btn");
  const userLoggedOut = document.querySelector("#logout-btn");

  if (userData !== null) {
    userLoggedIn.classList.add("d-none");
    userLoggedOut.classList.remove("d-none");
  }
}
userAuth();

function logout() {
  window.localStorage.removeItem("userData");
  window.location.href = "./index.html";
} 

const logoutButton = document.querySelector("#logout-btn");
logoutButton.addEventListener("click", function (event) {
  event.preventDefault();
  logout();
});

function editionMode() {
  const blackBarEdition = document.querySelector("#black-bar");
  const modifierBtn = document.querySelector("#edition-btn");

  if (userData !== null) {
    blackBarEdition.classList.remove("d-none");
    blackBarEdition.classList.add("edition-mode");
    modifierBtn.classList.remove("d-none");
    modifierBtn.classList.add("edition-btn");
  }
}
editionMode();

/* MODAL D'EDITION*/

const openModalButton = document.querySelector(".edition-btn");
openModalButton.addEventListener("click", function (event) {
  event.preventDefault();

  const modal = document.getElementById("edit-modal");

  if (modal) {
    modal.classList.add("modal");
    modal.classList.remove("d-none");
    modal.removeAttribute("aria-hidden");
  }

  openModal();
});

/* L'ouverture de la modal rajout une div pour changer l'opacité de l'écran et appeller la fonction de création de la modale */
function openModal() {
  const body = document.getElementsByTagName("body")[0];
  const bodyOpacity = document.createElement("div");
  bodyOpacity.classList.add("body-opacity");
  body.appendChild(bodyOpacity);
}

/* Création de la modale */
async function fetchAndShowWorksInAModal() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    createModal(works);
  } catch (error) {
    console.error(error);
  }
}

function createModal(works) {
  const worksInModal = document.querySelector(".works-modal");
  for (let i = 0; i < works.length; i++) {
    const figure = works[i];

    const figureWorks = document.createElement("figure");
    figureWorks.classList.add("category-" + figure.categoryId);
    figureWorks.classList.add("work-" + figure.id);
    worksInModal.appendChild(figureWorks);

    const workImg = document.createElement("img");
    workImg.classList.add("work-miniature");
    workImg.src = figure.imageUrl;
    workImg.classList.add("work-" + figure.id);
    figureWorks.appendChild(workImg);

    const buttonDelWork = document.createElement("button");
    buttonDelWork.classList.add("del-btn");
    buttonDelWork.id = "work-" + figure.id;
    buttonDelWork.addEventListener("click", function () {
      console.log("funciona") /* <====== ====== ====== aqui vai a funcao que deleta */ 
    })
    figureWorks.appendChild(buttonDelWork);

    const delIcon = document.createElement("img");
    delIcon.classList.add("del-icon");
    delIcon.src = "./assets/icons/trash-can-solid.svg";
    buttonDelWork.appendChild(delIcon);
  }
}

fetchAndShowWorksInAModal(createModal);

/* Fermeture de la modale  */
function closeModal(event) {
  const bodyOpacity = document.querySelector(".body-opacity");
  const modal = document.querySelector(".modal");

  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", function () {
    bodyOpacity.remove();
    modal.classList.remove("modal");
    modal.classList.add("d-none");
    modal.setAttribute("aria-hidden", "true");
  });

  if (event.target.classList.contains("body-opacity")) {
    bodyOpacity.remove();
    modal.classList.remove("modal");
    modal.classList.add("d-none");
    modal.setAttribute("aria-hidden", "true");
  }
}

document.addEventListener("click", closeModal);
