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
            <p class="auteur">`+publi.User.prenom+` `+publi.User.nom+`</p>
            <p class="titrePubli">`+publi.titre+`</p>
            <img src="`+image+`" alt="image publié">
            <div class="commentaires">
                <div class="commentaire" id="commentaire`+publi.id+`">
                    <div id="ajoutCom">
                        <form class="formCom" id="formCom`+publi.id+`" >
                            <input type="text" name="com" id="com`+publi.id+`" placeholder="Ajouter un commentaire" required>
                            <button type="submit" class="btn" id="btnCom"><i class="fas fa-paper-plane"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `
        for(com of publi.Commentaires) {
            document.getElementById("commentaire"+publi.id).innerHTML+=`
            <div class="listCom">
                <p class="nomCom">`+com.prenom+` `+com.nom+`</p>
                <p class="contenuCom">`+com.message+`</p>
            </div>
            `
        }
    }
    var btn = document.getElementsByClassName("formCom")
    for(var i = 0; i < btn.length; i++) {
        (function(index) {
            btn[index].addEventListener("submit", function(e) {
                e.preventDefault()
                var classId=btn[index].id
                addCommentaire (classId.substr(7))
                document.location.reload()
           })
        })(i);
      }
    
}


async function addCommentaire (publiId){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", sessionStorage.getItem('token'));
    myHeaders.append("Content-Type" , "application/json")

    var donnee = {
        message:document.getElementById('com'+publiId).value,
        publiId:publiId
    }
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(donnee),
        redirect: 'follow'
    };

    await fetch("http://localhost:3000/api/publi/addCommentaire", requestOptions)
        .then(response => response.text())
        .catch(error => console.log('error', error));
}
