function logout() {
    window.localStorage.removeItem("userData");
    window.location.href = "./index.html";
}

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", function (event) {
    event.preventDefault(); 
    logout(); 
});
