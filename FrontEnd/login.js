// Identification de l'élément dans une variable pour ensuite rajouter en evenement et obtenis les valeurs email et password pour pouvoir identifier l'user 
let form = document.getElementById("login-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let user = {
    "email": form.elements["email"].value,
    "password": form.elements["password"].value,
  }

  // Requette vers l'API avec les données de connexion identifiées dans "user" converties en format json et demande des données en retour dans headers
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "userId": "number",
      "token": "string",
      "Content-Type": "application/json",
    },
  })


    .then(function (response) {
      // si les coordonées user sont ok et correspondent aux infos qui sont dans l'API, l'utilisateur est redirigé vers une autre page
      if (response.ok) {
      console.log(response.json())
      window.location.href = "./homepage_edit.html";
      } else {
        // si les coordonées ne sont pas bonnes, il affiche un message d'erreur
        alert("Erreur dans l’identifiant ou le mot de passe");
      }
      return response.json();
    })
    // dans la fonction suivante sera fait le traitement du data reçu quand la connexion est valide 
    .then(function (data) {
      
    });
});
