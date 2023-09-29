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
const bodyOpacity = document.querySelector("#body-opacity");

if (userData !== null) {
  openModalButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    bodyOpacity.style.display = "flex";

    const modal = document.getElementById("edit-modal");

    if (modal) {
      modal.classList.add("modal");
      modal.style.display = "flex";
      modal.removeAttribute("aria-hidden");
    }

    showModal();
  });
}

/* L'ouverture de la modal rajout une div pour changer l'opacité de l'écran et appeller la fonction de création de la modale */
function showModal() {
  const removeBodyOpacity = document.querySelector("#body-opacity");
  removeBodyOpacity.addEventListener("click", function () {
    fetch("http://localhost:5678/api/works"), closeModal();
  });

  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", function () {
    closeModal();
  });
}

/* Création de la modale */
/* async function fetchAndShowWorksInAModal() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    createModal(works);
  } catch (error) {
    console.error(error);
  }
} */

function fetchAndShowWorksInAModal() {
  fetch("http://localhost:5678/api/works")
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (works) {
      createModal(works);
    });
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
    buttonDelWork.type = "button";
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

fetchAndShowWorksInAModal();

/*********************************************************************************/
/* SUPPRESSION DE L'IMAGE */
function deleteWork(id) {
  console.log("deleteWork", id);

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  }).then(function (response) {
    if (response.status === 204) {
      console.log("Item Deleted");
      const workElement = document.querySelector(".work-" + id);
      if (workElement) {
        workElement.remove();
      }
      console.log("here");
    } else if (response.status === 401) {
      console.log("Error: Unauthorized (401)");
    }
  });
}

/*********************************************************************************/
/* AJOUTER UNE IMAGE */
const ajoutPhotoBtn = document.querySelector(".addPhoto-btn");
ajoutPhotoBtn.addEventListener("click", function () {
  const step1 = document.querySelector("#modal-step1");
  step1.style.display = "none";
  const step2 = document.querySelector("#modal-step2");
  step2.style.display = "flex";
  step2.style.flexDirection = "column";
});

const retourBtn = document.querySelector(".retour-btn");
retourBtn.addEventListener("click", function () {
  const step1 = document.querySelector("#modal-step1");
  step1.style.display = "flex";
  const step2 = document.querySelector("#modal-step2");
  step2.style.display = "none";
});

/* Preview de l'image uploadée */
function readImage() {
  if (this.files && this.files[0]) {
    let file = new FileReader();
    file.onload = function (e) {
      document.querySelector(".preview-img").file = e.target.result;
    };
    file.readAsDataURL(this.files[0]);
    document.querySelector(".upload-instructions").classList.add("d-none");
    document.querySelector(".preview-img").classList.remove("d-none");
  }
}
document.querySelector("#image").addEventListener("change", readImage, false);

/* Validation des champs de formulaires */
let imgUrl = "";
let newImageTitle = "";
let selectedCategoryId = "";

const imgInput = document.querySelector("#image");
const newImage = document.querySelector(".preview-img");
imgInput.addEventListener("change", function () {
  if (imgInput.files.length > 0) {
    const file = imgInput.files[0];
    imgUrl = URL.createObjectURL(file);
    newImage.src = imgUrl;
  }
});

const newImageTitleInput = document.querySelector("#titre");
newImageTitleInput.addEventListener("change", function () {
  newImageTitle = newImageTitleInput.value;
});

const select = document.querySelector("select");
select.addEventListener("change", function () {
  selectedCategoryId = select.options[select.selectedIndex].id;
  enableValidateBtn();
});

const validateBtn = document.querySelector(".validatePhoto-btn");
function enableValidateBtn() {
  if (imgUrl !== "" && newImageTitle !== "" && selectedCategoryId > 0) {
    validateBtn.disabled = false;
  } else {
    validateBtn.disabled = true;
  }
  validateBtn.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    sendData();
  });
}

const erreur = document.querySelector(".erreur-msg-modal"); // A CONFIRMER

/* Envoi des nouveaux projets */
async function sendData() {
  const formData = new FormData(uploadANewWork);

  formData.append("image", newImage.src);
  formData.append("title", newImageTitle);
  formData.append("category", select.options[select.selectedIndex].id);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
      body: formData,
    });
    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("error");
  }
}

/*********************************************************************************/
/* Fermeture de la modale  */
function closeModal() {
  const bodyOpacity = document.querySelector("#body-opacity");
  const modal = document.querySelector(".modal");
  bodyOpacity.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.style.display = "none";
  document.querySelector("#modal-step1").style.display = "";
  document.querySelector("#modal-step2").style.display = "none";
  document.querySelector(".upload-instructions").classList.remove("d-none");
  document.querySelector(".preview-img").classList.add("d-none");
  document.querySelector("form").reset();
}
