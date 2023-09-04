/* Cette fonction fait une requette pour obtenir les données depuis l'API et affiche la fonction qui manipule le DOM. Le catch affichera un message en cas d'erreur */ 
async function fetchAndShowWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();

        createWorkElements(works);

    } catch (error) {
        console.error(error);
    }
}

/* Cette fontion manipule le DOM pour créer les éléments HTML à partir de données qui ont été récupérées par la fonction précédente. La boucle for va parcourir les données obtenues et créer les éléments html pour chaque index identifié dans l'array */ 
function createWorkElements(works) {
    const galleryContainer = document.querySelector(".gallery");
    
    for (let i = 0; i < works.length; i++) {
        const figure = works[i]; 
        
        const figureWorks = document.createElement("figure");
        
        const workImg = document.createElement("img");
        workImg.src = figure.imageUrl

        const figCaption = document.createElement("figcaption");
        figCaption.innerText = figure.title

        galleryContainer.appendChild(figureWorks);
        figureWorks.appendChild(workImg);
        figureWorks.appendChild(figCaption);
    }
}
/* Ici la fonction principale est appelée pour afficher les éléments sur la page */ 
fetchAndShowWorks(createWorkElements);
