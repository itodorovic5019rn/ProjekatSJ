function init(){

    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length-1];
    var check = true;

    if(!token){
        window.location.href = `/admin/login`;
    }

    document.getElementById("logoutBtn").addEventListener("click", e => {
        document.cookie = `token=;SameSite=Lax`;
        window.location.href = `/admin/login`;
    });

    document.getElementById("homeBtn").addEventListener("click", e => {
        window.location.href = `/admin/index`;
    });

    document.getElementById("usersBtn").addEventListener("click", e => {
        window.location.href = `/admin/users`;
    });

    document.getElementById("moviesBtn").addEventListener("click", e => {
        window.location.href = `/admin/films`;
    });

    document.getElementById("seriesBtn").addEventListener("click", e => {
        window.location.href = `/admin/tvShows`;
    });

    document.getElementById("moviesPostsBtn").addEventListener("click", e => {
        window.location.href = `/admin/moviesPosts`;
    });

    document.getElementById("seriesPostsBtn").addEventListener("click", e => {
        window.location.href = `/admin/tvShowsPosts`;
    });
}