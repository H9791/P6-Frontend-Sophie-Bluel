function AddFormEventListener() {
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
            window.localStorage.setItem("token", jsonData.token);
            /**user authorized - redirect to the index site*/
            window.location.href = "./index.html";
        } else if (response.status === 401) {
            alert("Erreur dans l’identifiant ou le mot de passe");
            window.localStorage.removeItem("token");
        } else {
            alert("Erreur inconnue");
        }

    });
}


AddFormEventListener();
