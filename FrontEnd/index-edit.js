function RemoveAllWorksFromThePage() {
    let gallery = document.querySelector(".gallery");
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }
}

async function GetWorks(id) {
    await fetch("http://localhost:5678/api/works")
        .then(data => data.json())
        .then(jsonListArticle => {
            for (let jsonArticle of jsonListArticle) {
                if (id === 0 || jsonArticle.category.id === id) {
                    CreateObjectsHTMLStructure(jsonArticle);
                }
            }
        });
}

function CreateObjectsHTMLStructure(jsonArticle) {
    let article = new Article(jsonArticle);

    let figure = document.createElement("figure");

    let img = document.createElement("img");
    img.setAttribute("src", article.imageUrl);
    img.setAttribute("alt", article.title);

    let figcaption = document.createElement("figcaption");
    figcaption.innerText = article.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    document.querySelector(".gallery").appendChild(figure);
}

//remove any works before rendering the page anew
RemoveAllWorksFromThePage();
/* initial render - show all works*/
GetWorks(0);