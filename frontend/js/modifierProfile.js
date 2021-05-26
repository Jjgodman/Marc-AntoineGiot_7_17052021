main()

function main() {
    isAuthentifier()
    affichageForm()
    envoieForm()
    deleteUser()
}

function affichageForm() {
    document.getElementById('modifierCompte').innerHTML = `
    <img src="../image/user.jpg" alt="photo de profile">
    <div class="ligneProfile">
        <p class="cat">Nom :&nbsp</p>
        <input type="text" name="forNom" id="forNom">
    </div>
    <div class="ligneProfile">
        <p class="cat">Prénom :&nbsp</p>
        <input type="text" name="forPrenom" id="forPrenom">
    </div>
    <div class="ligneProfile">
        <p class="cat">Email :&nbsp</p>
        <input type="email" name="forEmail" id="forEmail">
    </div>
    <button class="bouton1" id="chgmProfile">Valider</button>

    <button class="bouton1" id="delete">Supprimer mon profile</button>
    `
}

function envoieForm() {
    const bouton = document.getElementById('chgmProfile')
    bouton.addEventListener('click', (event) =>{
        event.preventDefault()
        const donnee = recupererInfo()
        changementInfo(donnee)
    })
}

function recupererInfo(){
    const donnee = {
        id:sessionStorage.getItem('userId'),
        nom:document.getElementById('forNom').value,
        prenom:document.getElementById('forPrenom').value,
        email:document.getElementById('forEmail').value
    }
    return donnee
}

function deleteUser() {
    const bouton = document.getElementById('delete')
    bouton.addEventListener('click', async (event) =>{
        event.preventDefault()
        var id={
            id:sessionStorage.getItem('userId')
        }
        try{
            console.log(JSON.stringify(sessionStorage.getItem('userId')))
            let response = await fetch ("http://localhost:3000/api/user/deleteUserProfile", {
                method: "DELETE",
                headers: {
                        "Content-Type" : "application/json",
                    },
                body: JSON.stringify(id)
                });
            if (response.ok) {
                console.log('ca marche')
                window.location.href="./connexion.html"
            }
            else {
                console.error(response.status)
            }
        }
        catch (e) {
            console.log(e)
        }
    })
}

async function changementInfo(donnee) {
    try{
        let response = await fetch ("http://localhost:3000/api/user/updateUserProfile", {
            method: "PUT",
            headers: {
                    "Content-Type" : "application/json",
                },
            body: JSON.stringify(donnee),
        });
        if (response.ok) {
            console.log('ca marche')
            window.location.href="./account.html"
        }
        else {
            if(response.status ==401){
                response.json().then(function(data) {
                    console.log(data)
                    switch (data.error) {
                        case 'bad name' : alert('Entrez un vrai nom');break
                        case 'bad prenom' : alert('Entrez un vrai prenom');break
                        case 'bad email' : alert('Entrez une adresse email correcte');break
                        case 'email already take' : alert('Email déjà utilisée');break
                    }
                })
                
            }
        }
    }
    catch (e) {
        console.log(e)
    }
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