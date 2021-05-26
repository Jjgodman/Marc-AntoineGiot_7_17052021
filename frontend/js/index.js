main()

function main() {
    isAuthentifier()
    affichage()
    affichagePubli()
    addPubli()
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
                <div class="publication">
                    <p class="titrePubli">Test titre</p>
                    <img src="../image/test-img.jpg" alt="image publié">
                    <div class="commentaires">
                        <div class="commentaire">
                            <p class="nomCom">test</p>
                            <p class="contenuCom">test</p>
                        </div>
                    </div>
                </div>
                <div class="publication">
                    <img src="../image/test-img.jpg" alt="image publié">
                    <div class="commentaires">
                        <div class="commentaire">
                            <p class="nomCom">test</p>
                            <p class="contenuCom">test</p>
                        </div>
                    </div>
                </div>
                <div class="publication">
                    <img src="../image/test-img.jpg" alt="image publié">
                    <div class="commentaires">
                        <div class="commentaire">
                            <p class="nomCom">test</p>
                            <p class="contenuCom">test</p>
                        </div>
                    </div>
                </div>
            </div>
            <button class="bouton1">Charger plus...</button>
    `
}

async function affichagePubli(){

}

async function addPubli() {
    const addBtn = document.getElementById("ajoutPosts")
    addBtn.addEventListener('click', (e) => {
        window.location.href="./addPubli.html"
    })
}