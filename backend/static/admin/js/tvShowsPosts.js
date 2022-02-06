function init(){

    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length-1];
    const tvShowsPostsIds = [];
    const tvShowsPosts = [{}];
    const tvShows = [{}];
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

    fetch('http://localhost:10000/api/tvshows', { // fetch za dobijanje serija
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {
            const sel = document.getElementById("selectId");

            data.forEach( el => {
                tvShows.push(el);
                sel.innerHTML +=`
                <option value="${el.id}">${el.naziv}</option>
                `;
            });
        }).catch( err => console.log(err) );

    fetch('http://localhost:10000/api/tvShowsPosts', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('tvShowsPostsList');
            var name;

            data.forEach( el => {
                tvShowsPostsIds.push(el.id);
                tvShowsPosts.push(el);
                if(tvShows.length == 1){
                    window.location.reload();
                }
                for(let i = 0; i < tvShows.length; i++){
                    if(tvShows[i].id == el.serijaId) // iz liste serija trazim naziv serije koja mi je potrebna
                    {
                        name = tvShows[i].naziv;
                    }
                }
                lst.innerHTML += `
                <li id="liId">
                    ID: ${el.id}, Rating: ${el.ocena}, Comment: ${el.komentar}, Recommend: ${el.preporuka}, Points: ${el.lajk}, Tv Show: ${name}, User: ${el.user.username}
                    <button id=${el.id+"d"} class="listButtonDelete">Delete</button>
                    <button id=${el.id} class="listButtonEdit">Edit</button>
                </li>`;
            });
            mojaFunk(); // kad dodam sve dugmice dodajem im eventListener-e
        }).catch( err => console.log(err) ); 
    
    function mojaFunk(){
        let length = tvShowsPostsIds.length; 

        for(let i = 0; i < length; i++){
            document.getElementById(tvShowsPostsIds[i]).addEventListener("click", e => { // kad se apdejtuje serija post
                currId = tvShowsPostsIds[i];
                const rating = document.getElementById("ratingUp"); 
                rating.value = "";
                rating.value += tvShowsPosts[i+1].ocena; // mora [i+1] jer imam prvi element koji je prazan
                const comment = document.getElementById("commentUp"); 
                comment.value = "";
                comment.value += tvShowsPosts[i+1].komentar; 
                const recommendationBtn = document.getElementById("recommendationBtnUp"); 
                recommendationBtn.checked = false;
                if(tvShowsPosts[i+1].preporuka == true){
                    recommendationBtn.checked = true;
                }
                const likes = document.getElementById("likesUp"); 
                likes.value = "";
                likes.value += tvShowsPosts[i+1].lajk;
            });
            document.getElementById(tvShowsPostsIds[i]+"d").addEventListener("click", e => { // kad brisem serija post
                const data = {"id": tvShowsPostsIds[i]};
                fetch('http://localhost:10000/api/tvShowsPosts', {
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
                        window.location.href = "/admin/tvShowsPosts";
                    }
                });
            });
        }
    }

    document.getElementById("createBtn").addEventListener("click", e => { // dodavanje novog serija posta
        e.preventDefault();

        const recBtn = document.getElementById("recommendationBtn");
        var sid = document.getElementById("selectId").value; // vraca serijaId iz select-a
        var rec = false;

        if(recBtn.checked){
            rec = true;
        }

        const data = {
            ocena: document.getElementById("rating").value,
            komentar: document.getElementById("comment").value,
            preporuka: rec,
            lajk: document.getElementById("likes").value,
            serijaId: sid
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

        fetch("http://localhost:10000/api/tvShowsPosts", { 
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
                window.location.href = "/admin/tvShowsPosts";
            }
        }).catch(err => console.log("Greska = " + err));
    });

    document.getElementById("updateBtn").addEventListener("click", e => { // kad apdejtujem postojeci serija post
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

        fetch("http://localhost:10000/api/tvShowsPosts", { 
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
                window.location.href = "/admin/tvShowsPosts";
            }
        }).catch(err => console.log("Greska = " + err));
    });
}