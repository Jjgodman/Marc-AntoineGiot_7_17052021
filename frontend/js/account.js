main()
//fonction d'initialisation
async function main() {
    const token = sessionStorage.getItem('token')
    const info = await getInfo(token)
    isAuthentifier()
    affichageInfo(info)
    deco()
}
//recuperation des info de l'utilisateur
function getInfo(token) {
    return fetch("http://localhost:3000/api/user/getUserProfile", {
        methode:"GET",
        headers:{
            "Content-Type" : "application/json",
            "authorization":token
        }
    })
        .then(function(httpBodyResponse) {
            return httpBodyResponse.json()
        })
        .then(function(info) {
            return info
        })
        .catch(function(error) {
            alert(error)
        })
}
//affichage des information de l'utilisateur
function affichageInfo(info) {
    console.log(info)
    document.getElementById('monCompte').innerHTML =`
    <div class="ligneProfile">
        <p class="cat">Nom :&nbsp</p>
        <p class="val">`+info.nom+`</p>
    </div>
    <div class="ligneProfile">
        <p class="cat">Prénom :&nbsp</p>
        <p class="val">`+info.prenom+`</p>
    </div>
    <div class="ligneProfile">
        <p class="cat">Email :&nbsp</p>
        <p class="val">`+info.email+`</p>
    </div>
    <button class="bouton1" id="deco">Déconnexion</button>
    <a href="modifierProfile.html"><button class="bouton1">Modifier le profile</button></a>
    `
}
//boutton pour se déconnecter
function deco(){
    document.getElementById('deco').addEventListener('click', e=>{
        e.preventDefault()
        sessionStorage.clear()
        window.location.href="./connexion.html"
    })
}
//redirection de l'utilisateur si son token de connexion n'est pas valide
async function isAuthentifier() {
    var token=sessionStorage.getItem('token')
    if (token==null){
        window.location.href="./connexion.html"
    }
    else{
        try{
            let response = await fetch ("http://localhost:3000/api/user/authentifier", {
                method: "GET",
                headers: {
                        "Content-Type" : "application/json",
                        "authorization" : token
                    }
            });
            if (!response.ok) {
                window.location.href="./connexion.html"
            }
            else{response.json().then(function(data){
                if (!data.respo.iat) {
                    window.location.href="./connexion.html"
                }
            })}
        }
        catch (e) {
            console.log(e)
        }
    }
}