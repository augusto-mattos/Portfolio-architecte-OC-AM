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
    buttonDelWork.addEventListener("click", function (event) { // EVENEMENT QUI APPELLE LA FONCTION DELETEWORK
      const buttonId = event.currentTarget.id;
      console.log(buttonId); 
      deleteWork(); 
    });
    figureWorks.appendChild(buttonDelWork);

    const delIcon = document.createElement("img");
    delIcon.classList.add("del-icon");
    delIcon.src = "./assets/icons/trash-can-solid.svg";
    buttonDelWork.appendChild(delIcon);
  }
}

fetchAndShowWorksInAModal(createModal);

/* SUPPRESSION DE L'IMAGE */
/*********************************************************************************/
  
async function deleteWork() {

  try {
    const response = await fetch("http://localhost:5678/api/works/{i}", {
      method: "DELETE",
      body: JSON.stringify(user),
      headers: {
        userId: "number",
        token: "string",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      console.log("Item Deleted (200)")
    }
    if (response.status === 401) {
      console.log("Error: Unauthorized (401)")
    }
  } catch (error) {
    console.log("Unexpected Behaviour")
  }
}

/*********************************************************************************/
/*********************************************************************************/
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
