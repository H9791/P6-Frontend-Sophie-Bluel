

/**if no token is present redirects to index.html
 * justin case user want to go to the edit page manually
*/
if (!window.localStorage.getItem("token")){
    window.location.href = "./index.html";
}

/**logout - removes athorisaiton token from
 * local storage and redirects to index.html
*/
document.querySelector("#logout")
    .addEventListener("click", ()=>{
        window.localStorage.removeItem("token");
        window.location.href = "./index.html";
});