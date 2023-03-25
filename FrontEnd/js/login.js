//window.sessionStorage.setItem("token", null);
window.sessionStorage.removeItem("token");


function AddFormEventListener() {
    console.log("addFormEventListener");
    const loginForm = document.querySelector(".login-form");
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        requestBody = {
            "email": event.target.querySelector("[name=email]").value,
            "password": event.target.querySelector("[name=password]").value
        };
        const requestBodyString = JSON.stringify(requestBody);
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: requestBodyString
        });
        if (response.status === 200) {
            const jsonData = await response.json();
            window.sessionStorage.setItem("token", jsonData.token);
            console.log("status 200");
            /**user authorized - redirect to the index site*/
            console.log("token before redirecting: " + localStorage.getItem("token"));
            window.location.href = "./index.html";
        } else if (response.status === 401) {
            alert("Erreur dans l’identifiant ou le mot de passe");
            window.sessionStorage.removeItem("token");
        } else {
            alert("Erreur");
        }
        console.log("this it token: " + window.sessionStorage.getItem("token"));
    });
}


AddFormEventListener();
