/*****************************************************************/
/* LOGOUT */
function logout() {
  window.localStorage.removeItem("userData");
  window.location.href = "./index.html";
}

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", function (event) {
  event.preventDefault();
  logout();
});

/* VERIFICATION DE LOGIN */
function forceAuthentication() {
  const userData = window.localStorage.getItem("userData");

  if (userData === null) {
    window.location.href = "./login.html";
  }
}

forceAuthentication();
/*****************************************************************/

/* MODAL */
/* Création d'un evenement pour déclancher la fonction openModal */
const openModalButton = document.querySelector(".edition-btn");
openModalButton.addEventListener("click", function (event) {
  event.preventDefault();

  const modal = document.querySelector(".d-none");

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
    worksInModal.appendChild(figureWorks);

    const workImg = document.createElement("img");
    workImg.classList.add("work-miniature")
    workImg.src = figure.imageUrl;
    workImg.id = "work-" + figure.id;
    figureWorks.appendChild(workImg);

    const delWork = document.createElement("button");
    delWork.classList.add("del-btn");
    figureWorks.appendChild(delWork);

    const delIcon = document.createElement("img");
    delIcon.classList.add("del-icon");
    delIcon.src = "./assets/icons/trash-can-solid.svg";
    delWork.appendChild(delIcon);

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
