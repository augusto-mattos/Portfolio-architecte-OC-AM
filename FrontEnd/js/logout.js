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
