main()

async function main() {
    const token = sessionStorage.getItem('token')
    const info = await getInfo(token)
    affichageInfo(info)
    deco()
}

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

function affichageInfo(info) {
    console.log(info)
    document.getElementById('monCompte').innerHTML =`
    <img src="../image/user.jpg" alt="photo de profile">
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

function deco(){
    document.getElementById('deco').addEventListener('click', e=>{
        e.preventDefault()
        sessionStorage.clear()
        window.location.href="./connexion.html"
    })
}