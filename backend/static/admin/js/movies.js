function init(){

    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length-1];
    const movieIds = [];
    const movies = [{}];
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

    fetch('http://localhost:10000/api/films', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('movieList');
            
            data.forEach( el => {
                movieIds.push(el.id);
                movies.push(el);
                lst.innerHTML += `
                <li id="liId">
                    ID: ${el.id}, Movie Title: ${el.naziv}, Rating: ${el.prosecnaOcena}, Director: ${el.reziser}, Length: ${el.trajanje}, Year: ${el.godina}
                    <button id=${el.id+"d"} class="listButtonDelete">Delete</button>
                    <button id=${el.id} class="listButtonEdit">Edit</button>
                </li>`;
            });
            mojaFunk(); // kad dodam sve dugmice dodajem im eventListener-e
        }).catch( err => console.log(err) ); 

    function mojaFunk(){
        let length = movieIds.length; 

        for(let i = 0; i < length; i++){
            document.getElementById(movieIds[i]).addEventListener("click", e => { // kad se apdejtuje film
                currId = movieIds[i];
                const title = document.getElementById("titleUp"); 
                title.value = "";
                title.value += movies[i+1].naziv; // mora [i+1] jer imam prvi element koji je prazan
                const avgRating = document.getElementById("avgRatingUp"); 
                avgRating.value = "";
                avgRating.value += movies[i+1].prosecnaOcena; 
                const director = document.getElementById("directorUp"); 
                director.value = "";
                director.value += movies[i+1].reziser; 
                const length = document.getElementById("lengthUp"); 
                length.value = "";
                length.value += movies[i+1].trajanje;
                const year = document.getElementById("yearUp"); 
                year.value = "";
                year.value += movies[i+1].godina;
            });
            document.getElementById(movieIds[i]+"d").addEventListener("click", e => { // kad brisem film
                const data = {"id": movieIds[i]};
                fetch('http://localhost:10000/api/films', {
                    method: 'DELETE',
                    headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                })
                .then( res => res.json() )
                .then( el => {
                    if (el.err) {
                        alert(el.msg);
                    } else {
                        window.location.href = "/admin/films";
                    }
                });
            });
        }
    }

    document.getElementById("createBtn").addEventListener("click", e => { // dodavanje novog filma
        e.preventDefault();

        const data = {
            naziv: document.getElementById("title").value,
            prosecnaOcena: document.getElementById("avgRating").value,
            reziser: document.getElementById("director").value,
            trajanje: document.getElementById("length").value,
            godina: document.getElementById("year").value
        };

        if(data.naziv == ""){
            alert("Enter title!");
            return;
        }else if(data.prosecnaOcena == ""){
            alert("Enter average rating!");
            return;
        }else if(data.reziser == ""){
            alert("Enter director!");
            return;
        }else if(data.trajanje == ""){
            alert("Enter length!");
            return;
        }else if(data.godina == ""){
            alert("Enter year!");
            return;
        }

        fetch("http://localhost:10000/api/films", { 
            method: "POST",
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
                window.location.href = "/admin/films"; // necu stalno da ulazim ovde da ne bi korisnik morao da kuca sve iz pocetka ako nesto zaboravi
            }
        }).catch(err => console.log("Greska = " + err));
    });

    document.getElementById("updateBtn").addEventListener("click", e => { // kad apdejtujem postojeci film
        e.preventDefault();

        const data = {
            id: currId,
            naziv: document.getElementById("titleUp").value,
            prosecnaOcena: document.getElementById("avgRatingUp").value,
            reziser: document.getElementById("directorUp").value,
            trajanje: document.getElementById("lengthUp").value,
            godina: document.getElementById("yearUp").value
        };

        if(data.naziv == ""){
            alert("Enter title!");
            return;
        }else if(data.prosecnaOcena == ""){
            alert("Enter average rating!");
            return;
        }else if(data.reziser == ""){
            alert("Enter director!");
            return;
        }else if(data.trajanje == ""){
            alert("Enter length!");
            return;
        }else if(data.godina == ""){
            alert("Enter year!");
            return;
        }

        fetch("http://localhost:10000/api/films", { // ovo trazi put metodu u filmsRoute.js
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
                window.location.href = "/admin/films";
            }
        }).catch(err => console.log("Greska = " + err));
    });
}