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

function RemoveAllWorksFromThePage() {
    let gallery = document.querySelector(".gallery");
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }
}

async function GetWorks() {
    await fetch("http://localhost:5678/api/works")
        .then(data => data.json())
        .then(jsonListArticle => {
            for (let jsonArticle of jsonListArticle) {
                    CreateObjectsHTMLStructure(jsonArticle);
            }
        });
}

function AddCategoryButtonsToDocument(categories) {
    let categoryButtonsDiv = document.querySelector(".categories");

    for (let categoryButton of categories) {
        /*console.log(categoryButton);*/
        let buttonDiv = document.createElement("div");

        /*add event listener to a category button*/
        AddEventListenerToCategoryButton(buttonDiv, categoryButton[0]);
        /*adds styling class to a category button */
        buttonDiv.classList.add("category-button");
        if (categoryButton[0] === 0) {
            buttonDiv.classList.add("category-btn-selected");
        }
        /*adds id to a category button */
        buttonDiv.setAttribute("category", categoryButton[0]);
        /*adds name to a category button*/
        buttonDiv.innerText = categoryButton[1];
        categoryButtonsDiv.appendChild(buttonDiv);
    }
}

function AddEventListenerToCategoryButton(button, categoryID) {
    button.addEventListener("click", () => {
        document.querySelectorAll(".category-btn-selected")
            .forEach(e => e.classList.remove("category-btn-selected"));

        button.classList.add("category-btn-selected");
        //console.log()
        //conditional css selector -awesome :-D
        if (categoryID === 0) {
            //show all works
            document.querySelectorAll(".gallery figure").
                forEach(item => item.style.display = null);
        } else {
            //SHOWS items that ARE of the category id
            document.querySelectorAll(`.gallery figure[category="${categoryID}"]`)
                .forEach(item => item.style.display = null);
            //REMOVES from display all works that ARE NOT of the category id
            document.querySelectorAll(`.gallery figure:not(:where(figure[category="${categoryID}"]))`)
                .forEach(item => item.style.display = "none");
        }

    });
}

function CreateObjectsHTMLStructure(jsonArticle) {
    let article = new Article(jsonArticle);

    let figure = document.createElement("figure");
    figure.setAttribute("category", article.categoryId);
    figure.setAttribute("figure-id", article.id);

    let img = document.createElement("img");
    img.setAttribute("src", article.imageUrl);
    img.setAttribute("alt", article.title);


    let figcaption = document.createElement("figcaption");
    figcaption.innerText = article.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    document.querySelector(".gallery").appendChild(figure);
}

function AdjustLayoutIfLoggedIn() {
    //make sure that the modal window doesn't display
    //document.querySelector(".modal").style.display="none";
    console.log("adjust: ");
    console.log(window.sessionStorage.getItem("token"));

    if (window.sessionStorage.getItem("token")) {
        console.log("AUTHORIZED");
        /*authorized - layout for edit*/
        document.querySelector(".categories").style.visibility = "hidden";

        document.querySelector("#login").innerText = "logout";
        document.querySelectorAll(".modify-link")
            .forEach(item => item.style.display = "initial");

        //add eventlistener for modify link - it will open the modal window
        document.querySelectorAll(".modify-link")
            .forEach(item => {
                console.log("adjust layout event listener");
                item.addEventListener("click", async () => {
                    //show the modal window
                    document.querySelector(".modal").style.display = null;
                    //and display modal window content
                    await DisplayModalWindowContent();
                })
            })

        //event listener for the arrow back 
        document.querySelector(".arrow-back-icon")
            .addEventListener("click", () => {
                //go to the gallery window
                document.querySelector("#modal1").style.display = null
                document.querySelector("#modal2").style.display = "none";
                //clear form after clicking on arrow back
                ClearForm();

            })

        //event listener to close the modal window
        document.querySelector("#modal1 .close-icon")
            .addEventListener("click", () => {
                document.querySelector("#modal1")
                    .style.display = "none";
                ClearForm();
            });


        document.querySelector("#modal2 .close-icon")
            .addEventListener("click", () => {
                document.querySelector("#modal2")
                    .style.display = "none";
                ClearForm();
            });

        //add event listener - if user logs out, redirect to index.html
        document.querySelector("#login").addEventListener("click", (event) => {
            event.preventDefault();
            console.log("removing token!");
            window.sessionStorage.removeItem("token");
            window.location.href = "./index.html";
        });
    } else {
        /*not authorized*/
        console.log("NOT AUTHORIZED LAYOUT");
        document.querySelector(".black-header").style.display = "none";
        /*document.querySelector(".modify-link").style.display = "none";*/
        document.querySelectorAll(".modify-link").
            forEach(item => item.style.display = "none");
        document.querySelector(".modal").style.display = "none";

        //display: invisible - the gap will stay in place 
        document.querySelector(".categories").style.visibility = "visible";
        document.querySelector("#login").innerText = "login";
    }
}

function ClearForm() {
    //clear image from the form if user already filled something in
    if (document.querySelector("#image-thumbnail img")) {
        document.querySelector("#image-thumbnail img").remove();
    }
    //clear file input
    document.querySelector("input[type=file]").value = null;
    document.querySelector("form #title-input").value = null;
    document.querySelector("form #input-categories").value = null;
}


async function Start() {
    console.log("index html token:");
    console.log(window.sessionStorage.getItem("token"));
    //remove any works before rendering the page anew
    RemoveAllWorksFromThePage();
    /* initial render - show all works*/
    GetWorks();
    let categories = await GetAllCategories();
    AddCategoryButtonsToDocument(categories);

    AdjustLayoutIfLoggedIn();
}

Start();




