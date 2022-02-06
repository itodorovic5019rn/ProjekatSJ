function init(){
    
    document.getElementById("registerBtn").addEventListener("click", e => {

        const modBtn = document.getElementById("moderatorBtn");
        var role = "";

        if(modBtn.checked){
            role = "moderator";
        }else{
            role = "user";
        }

        const data = {
            username: document.getElementById("username").value,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            role: role
        };

        fetch("http://localhost:9000/register", { // ovo trazi post koji se nalazi u app_auth.js(app.post("/register"))
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data) // da bismo mogli u app_auth.js-u da procitamo sta smo napisali
        })
        .then(res => res.json() )
        .then(el => { // da bi ovde usao mora u app_auth.js u metodi post /register da ima neki res.json(), nece uci ako je error u pitanju(res.status(500).json())
            // ovde mogu da uzmem token koji sam napravio u app_auth.js pri registraciji(el.token) i stavim ga u cookies
            if(el.err){ // ukoliko validacija u registru ne uspe
                console.log(el.err);
                window.location.href = "/admin/register";
            }else{
                document.cookie = `token=${el.token};SameSite=Lax`; // u cookie stavljamo nas token koji se u cookie-ju zove token
                window.location.href = "/admin/index";
            }
        }).catch(err => console.log("Greska = " + err));
    });
}
