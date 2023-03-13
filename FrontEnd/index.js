async function GetAllCategories() {
    let categories = new Array();

    await fetch("http://localhost:5678/api/categories")
        .then(data => data.json())
        .then(jsonCategoriesList => {
            /**add the name of the first category button */
            categories.push([0, "Tous"]);

            for (let jsonCategory of jsonCategoriesList) {
                categories.push([jsonCategory.id, jsonCategory.name]);
            }
        });
        return categories;
}


function AddCategoryButtonsToDocument(categories) {
    let categoryButtonsDiv = document.querySelector(".categories");

    for (let categoryButton of categories) {
        console.log(categoryButton);
        let button = document.createElement("div");

        /**add event listener to a category button*/
        AddEventListenerToCategoryButton(button, categoryButton[0]);
        /**adds styling class to a category button */
        button.classList.add("categoryButton");
        /**adds id to a category button */
        button.setAttribute("categoryId", categoryButton[0]);
        /**adds name to a category button*/
        button.innerText = categoryButton[1];
        categoryButtonsDiv.appendChild(button);
    }
}

function AddEventListenerToCategoryButton(button, categoryID){
    button.addEventListener("click", ()=>{
        GetWorks(categoryID);
    });
}

async function GetWorks(id) {
    let gallery = document.querySelector(".gallery");
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }

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


async function Start() {
    GetWorks(0);
    let categories = await GetAllCategories();
    AddCategoryButtonsToDocument(categories);

}

Start();




