function init(){

    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length-1];
    const moviesPostsIds = [];
    const moviesPosts = [{}];
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

    fetch('http://localhost:10000/api/films', { // fetch za dobijanje filmova
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {
            const sel = document.getElementById("selectId");
            data.forEach( el => {
                movies.push(el);
                sel.innerHTML +=`
                <option value="${el.id}">${el.naziv}</option>
                `;
            });
        }).catch( err => console.log(err) );

    fetch('http://localhost:10000/api/moviesPosts', { // fetch za dobijanje film postova
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('moviesPostsList');
            var naziv;
            data.forEach( el => {
                moviesPostsIds.push(el.id);
                moviesPosts.push(el);
                if(movies.length == 1){
                    window.location.reload(); 
                }
                for(let i = 0; i < movies.length; i++){
                    if(movies[i].id == el.filmId)
                    {
                        naziv = movies[i].naziv;
                    }
                }
                lst.innerHTML += `
                <li id="liId">
                    ID: ${el.id}, Rating: ${el.ocena}, Comment: ${el.komentar}, Recommend: ${el.preporuka}, Points: ${el.lajk}, Movie: ${naziv}, User: ${el.user.username}
                    <button id=${el.id+"d"} class="listButtonDelete">Delete</button>
                    <button id=${el.id} class="listButtonEdit">Edit</button>
                </li>`;
            });
            mojaFunk(); // kad dodam sve dugmice dodajem im eventListener-e
        }).catch( err => console.log(err) ); 

    function mojaFunk(){
        let length = moviesPostsIds.length; 

        for(let i = 0; i < length; i++){
            document.getElementById(moviesPostsIds[i]).addEventListener("click", e => { // kad se apdejtuje film post
                currId = moviesPostsIds[i];
                const rating = document.getElementById("ratingUp"); 
                rating.value = "";
                rating.value += moviesPosts[i+1].ocena; // mora [i+1] jer imam prvi element koji je prazan
                const comment = document.getElementById("commentUp"); 
                comment.value = "";
                comment.value += moviesPosts[i+1].komentar; 
                const recommendationBtn = document.getElementById("recommendationBtnUp"); 
                recommendationBtn.checked = false;
                if(moviesPosts[i+1].preporuka == true){
                    recommendationBtn.checked = true;
                }
                const likes = document.getElementById("likesUp"); 
                likes.value = "";
                likes.value += moviesPosts[i+1].lajk;
            });
            document.getElementById(moviesPostsIds[i]+"d").addEventListener("click", e => { // kad brisem film post
                const data = {"id": moviesPostsIds[i]};
                fetch('http://localhost:10000/api/moviesPosts', {
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
                        window.location.href = "/admin/moviesPosts";
                    }
                });
            });
        }
    }

    document.getElementById("createBtn").addEventListener("click", e => { // dodavanje novog film posta
        e.preventDefault();

        const recBtn = document.getElementById("recommendationBtn");
        var fid = document.getElementById("selectId").value; // vraca filmId iz select-a
        var rec = false;

        if(recBtn.checked){
            rec = true;
        }

        const data = {
            ocena: document.getElementById("rating").value,
            komentar: document.getElementById("comment").value,
            preporuka: rec,
            lajk: document.getElementById("likes").value,
            filmId: fid
        };

        if(data.ocena == ""){
            alert("Enter rating!");
            return;
        }else if(data.komentar == ""){
            alert("Enter comment!");
            return;
        }else if(data.lajk == ""){
            alert("Enter points!");
            return;
        }

        fetch("http://localhost:10000/api/moviesPosts", { 
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
                window.location.href = "/admin/moviesPosts";
            }
        }).catch(err => console.log("Greska = " + err));
    });

    document.getElementById("updateBtn").addEventListener("click", e => { // kad apdejtujem postojeci film post
        e.preventDefault();

        const recBtn = document.getElementById("recommendationBtnUp");

        const data = {
            id: currId,
            ocena: document.getElementById("ratingUp").value,
            komentar: document.getElementById("commentUp").value,
            preporuka: recBtn.checked,
            lajk: document.getElementById("likesUp").value,
        };

        if(data.ocena == ""){
            alert("Enter rating!");
            return;
        }else if(data.komentar == ""){
            alert("Enter comment!");
            return;
        }else if(data.lajk == ""){
            alert("Enter points!");
            return;
        }

        fetch("http://localhost:10000/api/moviesPosts", { 
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
                window.location.href = "/admin/moviesPosts";
            }
        }).catch(err => console.log("Greska = " + err));
    });
}