main()

async function main() {
    var user = await getUserInfo()
    isAuthentifier()
    affichage()
    addPubli()
    getAllPubli(user)
}

function getUserInfo(){
    return fetch("http://localhost:3000/api/user/getUserProfile", {
        methode:"GET",
        headers:{
            "Content-Type" : "application/json",
            "authorization":sessionStorage.getItem('token')
        }
    })
        .then(function(httpBodyResponse) {
            return httpBodyResponse.json()
        })
        .then(function(info) {
            var userInfo={
                userId:info.id,
                userAdmin:info.admin
            }
            return userInfo
        })
        .catch(function(error) {
            alert(error)
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

async function getAllPubli(user){
    await fetch ("http://localhost:3000/api/publi/getAllPubli")
        .then(function(response){
            return response.json()
        })
        .then(function(publis){
            affichagePubli(publis, user)
        })
        .catch(function(e){
            console.error(e)
        })
}

async function affichagePubli(publis, user){
    var mur = document.getElementById("publications")
    for (publi of publis){
        var image = publi.image
        mur.innerHTML+=`
        <div class="publication">
            <p class="auteur">`+publi.User.prenom+` `+publi.User.nom+`</p>
            <button type="submit" class="btnSupr admin" id="btnSupr`+publi.id+`"><i class="fas fa-trash"></i></button>
            <p class="titrePubli">`+publi.titre+`</p>
            <img src="`+image+`" alt="image publié">
            <div class="commentaires">
                <div class="commentaire" id="commentaire`+publi.id+`">
                    <div id="ajoutCom">
                        <form class="formCom" id="formCom`+publi.id+`" >
                            <input type="text" name="com" id="com`+publi.id+`" placeholder="Ajouter un commentaire" required>
                            <button type="submit" class="btn" id="btnCom`+publi.id+`"><i class="fas fa-paper-plane"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `
        if (publi.User.id!=user.userId && !user.userAdmin ){
            let btn = document.getElementById('btnSupr'+publi.id)
            btn.style.display = "none"
        }

        for(com of publi.Commentaires) {
            document.getElementById("commentaire"+publi.id).innerHTML+=`
            <div class="listCom">
                <div class="ctnCom">
                    <p class="nomCom">`+com.prenom+` `+com.nom+`</p>
                    <p class="contenuCom">`+com.message+`</p>
                </div>
                <button class="btnSuprCom admin" id="btnSuprCom`+com.id+`"><i class="fas fa-trash"></i></button>
            </div>
            `
            
            if (com.userId!=user.userId && !user.userAdmin){
                let btn = document.getElementById('btnSuprCom'+com.id)
                btn.style.display = "none"
            }
        }
    }
    var btnCom = document.getElementsByClassName("formCom")
    for(var i = 0; i < btnCom.length; i++) {
        (function(index) {
            btnCom[index].addEventListener("submit", function(e) {
                e.preventDefault()
                var classId=btnCom[index].id
                addCommentaire (classId.substr(7))
                document.location.reload()
           })
        })(i);
      }
    

    var btnSupr = document.getElementsByClassName("btnSupr")
    for(var i = 0; i < btnSupr.length; i++) {
        (function(index) {
            btnSupr[index].addEventListener("click", async function(e) {
                e.preventDefault()
                var classId=btnSupr[index].id.substr(7)
                donnee={
                    publiId:classId
                }
                myHeaders={
                    "Content-Type" : "application/json"
                }
                var requestOptions = {
                    method: 'DELETE',
                    headers:myHeaders,
                    body: JSON.stringify(donnee),
                    redirect: 'follow'
                }
                await fetch("http://localhost:3000/api/publi/deletePost", requestOptions)
                    .then(response => response.text())
                    .then(document.location.reload())
                    .catch(error => console.log('error', error));
            })
        })(i);
    }

    var btnSuprCom = document.getElementsByClassName("btnSuprCom")
    for(var i = 0; i < btnSuprCom.length; i++) {
        (function(index) {
            btnSuprCom[index].addEventListener("click", async function(e) {
                e.preventDefault()
                var classId=btnSuprCom[index].id.substr(10)
                donnee={
                    comId:classId
                }
                console.log(donnee);
                myHeaders={
                    "Content-Type" : "application/json"
                }
                var requestOptions = {
                    method: 'DELETE',
                    headers:myHeaders,
                    body: JSON.stringify(donnee),
                    redirect: 'follow'
                }
                await fetch("http://localhost:3000/api/publi/deleteCom", requestOptions)
                    .then(response => response.text())
                    .then(document.location.reload())
                    .catch(error => console.log('error', error));
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