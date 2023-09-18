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
    buttonDelWork.addEventListener("click", function (event) {
      // EVENEMENT QUI APPELLE LA FONCTION DELETEWORK
      event.preventDefault();
      event.stopPropagation();
      const buttonId = event.currentTarget.id;
      const workId = buttonId.replace("work-", "");
      deleteWork(workId);
    });
    figureWorks.appendChild(buttonDelWork);

    const delIcon = document.createElement("img");
    delIcon.classList.add("del-icon");
    delIcon.src = "./assets/icons/trash-can-solid.svg";
    buttonDelWork.appendChild(delIcon);
  }
}

fetchAndShowWorksInAModal(createModal);

/*********************************************************************************/
/* SUPPRESSION DE L'IMAGE */
async function deleteWork(id) {
 
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString); 
  const userToken = userData.token;
  
  try {

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response.status === 200) {
      console.log("Item Deleted (200)");
      const workElement = document.querySelector(".work-" + id);
      if (workElement) {
        workElement.remove();
      }
    }
    else if (response.status === 401) {
      console.log("Error: Unauthorized (401)");
    }
  } catch (error) {
    console.error(error);
  }
}
/*********************************************************************************/

/*********************************************************************************/
/* AJOUTER UNE IMAGE */
const ajoutPhotoBtn = document.querySelector(".addPhoto-btn")
ajoutPhotoBtn.addEventListener("click", function() {
  const step1 = document.querySelector("#modal-step1"); 
  step1.classList.add("d-none");
  const step2 = document.querySelector("#modal-step2");
  step2.classList.remove("d-none");
})

const retourBtn = document.querySelector(".retour-btn");
retourBtn.addEventListener("click", function() {
  const step1 = document.querySelector("#modal-step1"); 
  step1.classList.remove("d-none");
  const step2 = document.querySelector("#modal-step2");
  step2.classList.add("d-none");
})

/*********************************************************************************/

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
