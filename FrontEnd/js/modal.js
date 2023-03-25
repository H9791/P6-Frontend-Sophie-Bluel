//generate modal window fallery content
async function GetGalleryThumbnails(id) {
    await fetch("http://localhost:5678/api/works")
        .then(data => data.json())
        .then(jsonListArticle => {
            for (let jsonArticle of jsonListArticle) {
                if (id === 0 || jsonArticle.category.id === id) {
                    CreateModalWindowGallery(jsonArticle);
                }
            }
        });
}

async function TrashWorkFromGalleryEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    let imageToTrashID = e.target.getAttribute("image-to-trash");
    let imageToTrash = document.querySelector(`[image-id="${imageToTrashID}"]`);
    let divOfImageToTrash = document.querySelector(`[image-container-id="${imageToTrashID}"]`);

    const requestOptions = {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + window.sessionStorage.getItem("token") }
    };

    let response = await fetch(`http://localhost:5678/api/works/${imageToTrashID}`, requestOptions)
    let status = response.status;
    console.log("status " + status);
    console.log("status " + " ");
    if (status === 200 || status === 204) {
        //remove element from DOM
        divOfImageToTrash.remove();
    } else {
        console.log(status + " - NOT deleted");
        alert(status + " - deleted");
    }
}


function CreateModalWindowGallery(jsonArticle) {
    let article = new Article(jsonArticle);
    let div = document.createElement("div");
    div.classList.add("modal-content-thumbnail-container");
    div.setAttribute("image-container-id", article.id);
    let trash = document.createElement("div");

    //add arrows icon that will show when hovering over apic
    let arrows = document.createElement("div");
    arrows.classList.add("arrows");
    div.appendChild(arrows)

    //add event listener if user wants to delete work
    trash.classList.add("trash");
    trash.setAttribute("image-to-trash", article.id);
    trash.addEventListener("click", TrashWorkFromGalleryEvent);
    div.appendChild(trash);

    let img = document.createElement("img");
    img.setAttribute("image-id", article.id);
    img.setAttribute("src", article.imageUrl);
    img.setAttribute("alt", article.title);
    img.classList.add("modal-content-thumbnail-img");
    div.appendChild(img);


    let edit = document.createElement("p");
    edit.innerText = "éditer";

    div.appendChild(edit);
    //figure.appendChild(figcaption);
    document.querySelector(".modal-content").appendChild(div);
    /*modalContent.appendChild(figure);*/
}

function PreviewImage() {
    const imageThumbnail = document.querySelector("#image-thumbnail");
    const file = document.querySelector("input[type=file]").files[0];

    function readAndPreview(file) {
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            const reader = new FileReader();
            reader.addEventListener(
                "load",
                () => {
                    const image = new Image();
                    image.title = file.name;
                    image.src = reader.result;
                    imageThumbnail.appendChild(image);
                }, false
            );
            reader.readAsDataURL(file);
        }
    }

    if (file) {
        readAndPreview(file);
    }
}

function AddListenerToAjouterPhotoButton(e) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector("#modal1").style.display = "none";
    document.querySelector("#modal2").style.display = null;
}

async function AddWorkFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    //make sure that the form to add a work in empty from
    //possible previous adding

    //get info about the picture to add to DB
    let formImage = document.querySelector("form #file").files[0];
    let formImageTitle = document.querySelector("form #title-input").value;
    let formImageCategory = document.querySelector("form #input-categories").value;
    //api call

    const formData = new FormData();
    formData.append('image', formImage);
    formData.append('title', formImageTitle);
    formData.append('category', formImageCategory);

    let response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem("token")
        },
        body: formData
    });
    console.log("add work response text:");
    console.log(await response.text());
    console.log(await response.status);
    //if adding of work successful, then go back to the previous modal window
    if (response.status !== 201) {
        alert("Erreur " + response.status);
    }
    //add it to the dom or the main mage and redirect to it
    //show the main page
    document.querySelector("#modal1").style.display = "none";
    document.querySelector("#modal2").style.display = "none";


    //add the image to the main page
    GetWorks(0);

    //clear the form next image
    if (document.querySelector("#image-thumbnail img")) {
        document.querySelector("#image-thumbnail img").remove();
    }
    document.querySelector("input[type=file]").value = null;
    document.querySelector("form #title-input").value = null;
    document.querySelector("form #input-categories").value = null;

}

/*here starts the creation of the modal window*/
async function DisplayModalWindowContent() {
    let modalContent = document.querySelector(".modal-content");
    //make sure the modal window is empty before rendering
    while (modalContent.firstChild)
        modalContent.removeChild(modalContent.firstChild);

    //modalHeading.innerText = "Galerie photo";
    await GetGalleryThumbnails(0);

    let modalWindowButton = document.querySelector("#modal-window-btn");
    //adding works - change of layout (change of <aside>)
    modalWindowButton.addEventListener("click", AddListenerToAjouterPhotoButton);

    //add listener to "Valider" button - "submit action of the form"
    let formSubmitAction = document.querySelector("form");
    formSubmitAction.addEventListener("submit", AddWorkFormSubmit);
    //add listener to know when the entire for has been filled with values
    formSubmitAction.addEventListener("formdata", (e) => {
        console.log("formdata fired");
    });



    //add event listener on file input
    document.querySelector("input[type=file]")
        .addEventListener("change", PreviewImage);
}

