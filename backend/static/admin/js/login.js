function init(){
    document.cookie = `token=;SameSite=Lax`;

    document.getElementById("loginBtn").addEventListener("click", e => {
        e.preventDefault();

        const data = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        if(data.username == "" || data.username.length < 3){
            alert("Invalid username!");
            return;
        }

        if(data.password == "" || data.password.length < 3){
            alert("Invalid password!");
            return;
        }

        fetch("http://localhost:9000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(res => res.json() )
        .then(el => {
            if(el.msg){ // ukoliko udje u else u app_auth.js kad pokusamo da nadjemo user-a
                document.getElementById("password").value = ""; 
                alert(el.msg);
            }else{ // ukoliko sve dobro prodje i ukoliko napravimo i posaljemo token
                document.cookie = `token=${el.token};SameSite=Lax`;
                window.location.href = "/admin/index";
            }
        });
    });
}