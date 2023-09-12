function logout() {
    window.localStorage.removeItem("userData");
    window.location.href = "./index.html";
}

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", function (event) {
    event.preventDefault(); 
    logout(); 
});

function createModal() {
    const modal = document.getElementById("portfolio-edition");
    
    const createModal = document.createElement("aside");
    createModal.classList.add("modal");
    modal.appendChild(createModal);

    const btnCloseModal = document.createElement("img");
    btnCloseModal.classList.add("close");
    btnCloseModal.src = "./assets/icons/close_button.svg";

    createModal.appendChild(btnCloseModal);
    btnCloseModal.appendChild(imgClose);
} 

/* Ouverture de la modale et ajout d'une div pour couvrir l'intégralité de l'écran */ 
const openModal = document.querySelector(".btn-edition")
openModal.addEventListener("click", function (event) {
    event.preventDefault();
    
    const body = document.getElementsByTagName("body")[0];
    const bodyOpacity =  document.createElement("div");
    bodyOpacity.classList.add("body-opacity")
    body.appendChild(bodyOpacity);

    createModal();
})
