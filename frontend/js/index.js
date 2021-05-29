main()

function main() {
    isAuthentifier()
    affichage()
    addPubli()
    getAllPubli()
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

function affichage() {
    document.getElementById('fil').innerHTML = `
    <input class="bouton2" id="ajoutPosts" type="button" value="+">
            <div id="publications">
                
            </div>
    `
}


async function addPubli() {
    const addBtn = document.getElementById("ajoutPosts")
    addBtn.addEventListener('click', (e) => {
        window.location.href="./addPubli.html"
    })
}

async function getAllPubli(){
    await fetch ("http://localhost:3000/api/publi/getAllPubli")
        .then(function(response){
            return response.json()
        })
        .then(function(publis){
            affichagePubli(publis)
        })
        .catch(function(e){
            console.error(e)
        })
}

async function affichagePubli(publis){
    var mur = document.getElementById("publications")
    for (publi of publis){
        var image = publi.image
        mur.innerHTML+=`
        <div class="publication">
            <p class="auteur">`+publi.prenomAuteur+` `+publi.nomAuteur+`</p>
            <p class="titrePubli">`+publi.titre+`</p>
            <img src="`+image.substr(28)+`" alt="image publié">
            <div class="commentaires">
                <div class="commentaire">
                    <div id="ajoutCom">
                        <form id="formCom">
                            <input type="text" name="com" id="com" placeholder="Ajouter un commentaire" required>
                            <button class="btn"><i class="fas fa-paper-plane"></i></button>
                        </form>
                    </div>
                    <div class="listCom">
                        <p class="nomCom">Patrick Test</p>
                        <p class="contenuCom">ahaha trop drole ca</p>
                    </div>
                    <div class="listCom">
                        <p class="nomCom">Patrick Test</p>
                        <p class="contenuCom">ahaha trop drole ca</p>
                    </div>
                    <div class="listCom">
                        <p class="nomCom">Patrick Test</p>
                        <p class="contenuCom">ahaha trop drole ca</p>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}