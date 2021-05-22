main()

function main() {
    affichageForm()
    connexionUser()
    redirectionIns()
}

function affichageForm(){
    const form = document.getElementById('formCon')
    form.innerHTML=(`
    <div class="ligneCon">
        <input type="email" name="email" id="email" placeholder="Email" required>
    </div>
    <div class="ligneCon">
        <input type="password" name="password" id="password" placeholder="Mot de passe" required>
    </div>
    <div class="ligneCon">
        <input class="bouton1" id="boutonCon" type="submit" value="Connexion">
    </div>
    <div class="ligneCon">
        <input class="bouton1" id="insci" type="button" value="Inscription">
    </div>
    `)
}

function redirectionIns(){
    const boutonRed = document.getElementById('insci')
    boutonRed.addEventListener('click',(e) => {
        window.location.href="./inscription.html"
    })
}

function connexionUser(){
    const boutonCon = document.getElementById("boutonCon")
    boutonCon.addEventListener('click', (e) => {
        e.preventDefault()
        donnee = donneeUser()
        connexion(donnee)
    })
}



function donneeUser(){
    const donnee = {
        email:document.getElementById("email").value,
        password:document.getElementById("password").value,
    }
    return donnee
}

async function connexion(donnee) {
    const jsonDonnee = JSON.stringify(donnee)
    try{
        let response = await fetch ("http://localhost:3000/api/user/login", {
            method: "POST",
            headers: {
                    "Content-Type" : "application/json",
                },
            body: jsonDonnee,
        });
        //si c'est bon cela renvoie vers la page formulaire
        if (response.ok) {
            response.json().then(function(data){
                sessionStorage.setItem('token',data.token)
                sessionStorage.setItem('userId',data.userId)
            })
            window.location.href="./index.html"
        }
        //sinon cela marque leretour serveur
        else {
            if(response.status==403) {
                alert ('Mot de passe invalide')
            }
            else if(response.status==404) {
                alert ('Utilisateur inconnu')
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}
