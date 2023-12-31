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

    openModal();
  });
}

function fetchAndShowWorksInAModal() {
  fetch("http://localhost:5678/api/works")
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (works) {
      showWorks(works);
    });
}

/* L'ouverture de la modal ajoute des evenements pour appeler sa fermeture et fait aussi appel à la fonction qui met à jour les images de la modale à chaque ouverture */
function updateModalWorks() {
  const worksInModal = document.querySelector(".works-modal");
  worksInModal.innerHTML = "";
  fetchAndShowWorksInAModal();
}

const removeBodyOpacity = document.querySelector("#body-opacity");
removeBodyOpacity.addEventListener("click", function () {
  closeModal();
});

const closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", function () {
  closeModal();
});

const erreurModal = document.querySelector(".erreur-msg-modal");

function openModal() {
  updateModalWorks();
  removeBodyOpacity;
  closeBtn;
  validateBtn.disabled = true;
  erreurModal.style.display = "none";
}

// Dans cette fonction sont créés tous les éléments qui font partie de la gallery de la modale, y compris les boutons de suppression d'image
function showWorks(works) {
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
      event.preventDefault();
      event.stopPropagation();
      const buttonId = event.currentTarget.id;
      const workId = buttonId.replace("work-", "");
      deleteWork(workId);
    });
    figureWorks.appendChild(buttonDelWork);

    const delIcon = document.createElement("img");
    delIcon.classList.add("del-icon");
    delIcon.src = "./FrontEnd/assets/icons/trash-can-solid.svg";
    buttonDelWork.appendChild(delIcon);
  }
}

/* SUPPRESSION DE L'IMAGE */
function deleteWork(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  }).then(function (response) {
    if (response.status === 204) {
      const workElement = document.querySelector(".work-" + id);
      if (workElement) {
        workElement.remove();
      }
    } else if (response.status === 401) {
      console.log("Error: Unauthorized (401)");
    }
  });
}

/* Passer à l'étape 2 de la modale pour AJOUTER UNE IMAGE */
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
  resetModalForm();
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

/* Validation des champs du formulaire pour l'envoi d'une nouvelle image */
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
  validateBtn.disabled = false;
});

const newImageTitleInput = document.querySelector("#titre");
newImageTitleInput.addEventListener("keyup", function () {
  newImageTitle = newImageTitleInput.value;
  validateBtn.disabled = false;
  if (erreurModal.style.display === "flex") {
    validateForm();
  }
});

const select = document.querySelector("select");
select.addEventListener("change", function () {
  selectedCategoryId = select.options[select.selectedIndex].id;
  validateBtn.disabled = false;
  if (erreurModal.style.display === "flex") {
    validateForm();
  }
});

const validateBtn = document.querySelector(".validatePhoto-btn");
validateBtn.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  sendData(event);
});

function validateForm() {
  if (imgUrl !== "" && newImageTitle !== "" && selectedCategoryId > 0) {
    erreurModal.style.display = "none";
  } else {
    erreurModal.style.display = "flex";
  }
};

/* Envoi des nouveaux projets */
async function sendData(event) {
  event.preventDefault();

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
    console.log(response.status);
    if (response.status === 201) {
      const result = await response.json();
      console.log("Success:", result);
      closeModal();
    } else {
      console.error("Error:", response.status);
      erreurModal.style.display = "flex";      
      validateBtn.disabled = true;
    }
  } catch (error) {
    console.error("error");
  }
}

/* Nettoye le formulaire de la modale de l'etape 2 et reviens à l'etape 1, sans la fermer. A utiliser après l'envoi d'une image et dans le bouton de retour */
function resetModalForm() {
  document.querySelector("#modal-step1").style.display = "";
  document.querySelector("#modal-step2").style.display = "none";
  document.querySelector(".upload-instructions").classList.remove("d-none");
  document.querySelector(".preview-img").classList.add("d-none");
  document.querySelector("form").reset();
  newImageTitle = "";
  newImageTitleInput.value = "";
}

// Mise à jour de la gallery d'images. A appeler quand la modale est fermée.
function updateGallery() {
  const worksInGallery = document.querySelector(".gallery");
  worksInGallery.innerHTML = "";
  fetchAndShowWorks();
}

/* Fermeture de la modale  */
function closeModal() {
  const bodyOpacity = document.querySelector("#body-opacity");
  const modal = document.querySelector(".modal");
  bodyOpacity.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.style.display = "none";
  resetModalForm();
  updateGallery();
}
