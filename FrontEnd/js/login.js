// Identification de l'élément dans une variable pour ensuite rajouter en evenement et obtenis les valeurs email et password pour pouvoir identifier l'user
let form = document.getElementById("login-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let user = {
    email: form.elements["email"].value,
    password: form.elements["password"].value,
  };

  // Requette vers l'API avec les données de connexion identifiées dans "user" converties en format json et demande des données en retour dans headers
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      userId: "number",
      token: "string",
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      // si les coordonées user sont ok et correspondent aux infos qui sont dans l'API, l'utilisateur est redirigé vers une autre page
      if (response.ok) {
        window.location.href = "./index.html";
      } else {
        // si les coordonées ne sont pas bonnes, il affiche un message d'erreur
        const erreur = document.querySelector(".erreur-msg");
        erreur.classList.remove("d-none");

        setTimeout(function () {
          erreur.classList.add("d-none");
        }, 3500);
      }
      return response.json();
    })
    // dans la fonction suivante le localStorage sauvegarde le donées de l'utilisateur
    .then(function (data) {
      const userData = {
        userId: data.userId,
        token: data.token,
      };
      window.localStorage.setItem("userData", JSON.stringify(userData));
    });
});
