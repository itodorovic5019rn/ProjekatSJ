function init(){

    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length-1];
    const tvShowsIds = []; // niz id-ijeva
    const tvShows = [{}]; // lista serija
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

    fetch('http://localhost:10000/api/tvShows', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('tvShowsList');
            
            data.forEach( el => {
                tvShowsIds.push(el.id);
                tvShows.push(el);
                lst.innerHTML += `
                <li id="liId">
                    ID: ${el.id}, Tv Show Title: ${el.naziv}, Rating: ${el.prosecnaOcena}, Director: ${el.reziser}, Seasons: ${el.sezone}, Year: ${el.godina}
                    <button id=${el.id+"d"} class="listButtonDelete">Delete</button>
                    <button id=${el.id} class="listButtonEdit">Edit</button>
                </li>`;
            });
            mojaFunk(); // kad dodam sve dugmice dodajem im eventListener-e
        }).catch( err => console.log(err) ); 

    function mojaFunk(){
        let length = tvShowsIds.length; 

        for(let i = 0; i < length; i++){
            document.getElementById(tvShowsIds[i]).addEventListener("click", e => { // kad se apdejtuje seriju
                currId = tvShowsIds[i];
                const title = document.getElementById("titleUp"); 
                title.value = "";
                title.value += tvShows[i+1].naziv; // mora [i+1] jer imam prvi element koji je prazan
                const avgRating = document.getElementById("avgRatingUp"); 
                avgRating.value = "";
                avgRating.value += tvShows[i+1].prosecnaOcena; 
                const director = document.getElementById("directorUp"); 
                director.value = "";
                director.value += tvShows[i+1].reziser; 
                const seasons = document.getElementById("seasonsUp"); 
                seasons.value = "";
                seasons.value += tvShows[i+1].sezone;
                const year = document.getElementById("yearUp"); 
                year.value = "";
                year.value += tvShows[i+1].godina;
            });
            document.getElementById(tvShowsIds[i]+"d").addEventListener("click", e => { // kad brisem seriju
                const data = {"id": tvShowsIds[i]};
                fetch('http://localhost:10000/api/tvShows', {
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
                        window.location.href = "/admin/tvShows";
                    }
                });
            });
        }
    }

    document.getElementById("createBtn").addEventListener("click", e => { // dodavanje nove serije
        e.preventDefault();

        const data = {
            naziv: document.getElementById("title").value,
            prosecnaOcena: document.getElementById("avgRating").value,
            reziser: document.getElementById("director").value,
            sezone: document.getElementById("seasons").value,
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
        }else if(data.sezone == ""){
            alert("Enter seasons!");
            return;
        }else if(data.godina == ""){
            alert("Enter year!");
            return;
        }

        fetch("http://localhost:10000/api/tvShows", { 
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
                window.location.href = "/admin/tvShows";
            }
        }).catch(err => console.log("Greska = " + err));
    });

    document.getElementById("updateBtn").addEventListener("click", e => { // kad apdejtujem postojecu seriju
        e.preventDefault();

        const data = {
            id: currId,
            naziv: document.getElementById("titleUp").value,
            prosecnaOcena: document.getElementById("avgRatingUp").value,
            reziser: document.getElementById("directorUp").value,
            sezone: document.getElementById("seasonsUp").value,
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
        }else if(data.sezone == ""){
            alert("Enter seasons!");
            return;
        }else if(data.godina == ""){
            alert("Enter year!");
            return;
        }

        fetch("http://localhost:10000/api/tvShows", { // ovo trazi put metodu u serijasRoute.js
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
                window.location.href = "/admin/tvShows";
            }
        }).catch(err => console.log("Greska = " + err));
    });
}