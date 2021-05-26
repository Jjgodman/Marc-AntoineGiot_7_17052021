main()

async function main() {
    const token = sessionStorage.getItem('token')
    const info = await getInfo(token)
    isAuthentifier()
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