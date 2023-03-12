/*import {jsonArticle} from "./js/article.js";*/
/**first get all the data from the API */


fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then(jsonListArticle => {
        for (let jsonArticle of jsonListArticle) {
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

            /*document.querySelector(".gallery").innerHTML += `
            <figure>
                <img src="${article.imageUrl}" alt="${article.title}">
                <figcaption>${article.title}</figcaption>
            </figure>
            `;*/
        }
    });


    /*add categories. With "set" have all the categories, make buttons, add info 
    from the categories to buttons, add event listeners*/