function init(){

    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length-1]; // kad neko hoce da pristupi users.html-u moram da uzmem token da bih proveravao koje privilegije ima
    const userIds = [];
    const users = [{}];
    let currId;

    if(!token){
        window.location.href = `/admin/login`;
    }

    document.getElementById("homeBtn").addEventListener("click", e => {
        window.location.href = `/admin/index`;
    });

    document.getElementById("logoutBtn").addEventListener("click", e => {
        document.cookie = `token=;SameSite=Lax`;
        window.location.href = `/admin/login`;
    });

    fetch('http://localhost:10000/api/users', { // uzima sve user-e iz baze preko usersRoute.js
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('userList');
            
            data.forEach( el => {
                userIds.push(el.id);
                users.push(el);
                lst.innerHTML += `
                <li id="liId">
                    ID: ${el.id}, Username: ${el.username}, E-mail: ${el.email}, First name: ${el.firstname}, Last name: ${el.lastname}, Role: ${el.role}
                    <button id=${el.id+"d"} class="listButtonDelete">Delete</button>
                    <button id=${el.id} class="listButtonEdit">Edit</button>
                </li>`;
            });
            mojaFunk(); // kad dodam sve dugmice dodajem im eventListener-e
        }).catch( err =>{ // kad nije admin ulogovan ulazi ovde
            window.location.href = `/admin/index`;
        }); 

    function mojaFunk(){
        let length = userIds.length; 

        for(let i = 0; i < length; i++){
            document.getElementById(userIds[i]).addEventListener("click", e => { // kad se apdejtuje user. Ispisivanje podataka u polja
                currId = userIds[i];
                const username = document.getElementById("usernameUp"); 
                username.value = "";
                username.value += users[i+1].username; // mora [i+1] jer imam prvi element koji je prazan
                const firstname = document.getElementById("firstnameUp"); 
                firstname.value = "";
                firstname.value += users[i+1].firstname; 
                const lastname = document.getElementById("lastnameUp"); 
                lastname.value = "";
                lastname.value += users[i+1].lastname; 
                const email = document.getElementById("emailUp"); 
                email.value = "";
                email.value += users[i+1].email;
                const mod = document.getElementById("moderatorBtnUp");
                mod.checked = false;
                if(users[i+1].role == "moderator"){
                    mod.checked = true;
                }
            });
            document.getElementById(userIds[i]+"d").addEventListener("click", e => { // kad brisem korisnika
                const data = {"id": userIds[i]};
                fetch('http://localhost:10000/api/users', {
                    method: 'DELETE',
                    headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                })
                .then( res => res.json() )
                .then( el => {
                    if (el.msg) {
                        alert(el.msg);
                    } else {
                        window.location.href = "/admin/users";
                    }
                });
            });
        }
    }

    document.getElementById("registerBtn").addEventListener("click", e => { // kad registrujem novog korisnika 
        e.preventDefault();

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

        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // za validaciju mejla

        if(data.username == "" || data.username.length < 3 || data.username.length > 20){
            alert("Invalid username!");
            return;
        }else if(data.password == "" || data.password < 6){
            alert("Invalid password!")
            return;
        }else if(data.firstname == "" || data.firstname < 2){
            alert("Invalid first name!");
            return;
        }else if(data.lastname == "" || data.lastname < 2){
            alert("Invalid last name!");
            return;
        }else if(data.email == "" || !re.test(data.email)){
            alert("Invalid email!");
            return;
        }

        fetch("http://localhost:9000/register", { // ovo trazi post koji se nalazi u app_auth.js(app.post("/register"))
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data) // da bismo mogli u app_auth.js-u da procitamo sta smo napisali
        })
        .then(res => res.json() )
        .then(el => { 
            if(el.err){ // ukoliko validacija u registru ne uspe
                console.log(el.err);
                alert(el.err);
            }else{
                window.location.href = "/admin/users";
            }
        }).catch(err => console.log("Greska = " + err));
    });

    document.getElementById("updateBtn").addEventListener("click", e => { // kad apdejtujem postojeceg korinsika
        e.preventDefault();

        const modBtn = document.getElementById("moderatorBtnUp");
        var role = "";

        if(modBtn.checked){
            role = "moderator";
        }else{
            role = "user";
        }

        const data = {
            id: currId,
            username: document.getElementById("usernameUp").value,
            firstname: document.getElementById("firstnameUp").value,
            lastname: document.getElementById("lastnameUp").value,
            email: document.getElementById("emailUp").value,
            role: role
        };

        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // za validaciju mejla

        if(data.username == "" || data.username.length < 3 || data.username.length > 20){
            alert("Invalid username!");
            return;
        }else if(data.firstname == "" || data.firstname < 2){
            alert("Invalid first name!");
            return;
        }else if(data.lastname == "" || data.lastname < 2){
            alert("Invalid last name!");
            return;
        }else if(data.email == "" || !re.test(data.email)){
            alert("Invalid email!");
            return;
        }

        fetch("http://localhost:10000/api/users", { // ovo trazi put metodu u usersRoute.js
            method: "PUT",
            headers: { "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data) 
        })
        .then(res => res.json() )
        .then(el => { 
            if(el.err){ 
                console.log(el.err);
                alert(el.err);
            }else{
                window.location.href = "/admin/users"; 
            }
        }).catch(err => console.log("Greska = " + err));

    });
}