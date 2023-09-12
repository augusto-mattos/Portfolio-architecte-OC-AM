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
/*****************************************************************/

/*****************************************************************/

/* MODAL */
/* Création d'un evenement pour déclancher la fonction openModal */
const openModalButton = document.querySelector(".edition-btn");
openModalButton.addEventListener("click", function (event) {
  event.preventDefault();
  openModal();
});

/* L'ouverture de la modal rajout une div pour changer l'opacité de l'écran et appeller la fonction de création de la modale */
function openModal() {
  const body = document.getElementsByTagName("body")[0];
  const bodyOpacity = document.createElement("div");
  bodyOpacity.classList.add("body-opacity");
  body.appendChild(bodyOpacity);

  createModal();
}

/* Création de la modale */
function createModal() {
    const modal = document.getElementById("portfolio-edition");
  
    const createModal = document.createElement("aside");
    createModal.classList.add("modal");
    modal.appendChild(createModal);
  
    const closeModalButton = document.createElement("img");
    closeModalButton.classList.add("close-btn");
    closeModalButton.src = "./assets/icons/close_button.svg";
    closeModalButton.addEventListener("click", function () {
      closeModal();
    });
    createModal.appendChild(closeModalButton);
  }

/* Fermeture de la modale  */
function closeModal(event) {
  if (
    event.target.classList.contains("body-opacity") ||
    event.target.classList.contains("close-btn")
  ) {
    const closedModal = document.querySelector(".body-opacity");
    if (closedModal) {
      closedModal.remove();
    }
    const closedModalBtn = document.querySelector(".modal");
    if (closedModalBtn) {
      closedModalBtn.remove();
    }
  }
}
document.addEventListener("click", closeModal);
