main()

function main() {
    affichageForm()
    enregistrementUser()
}

function affichageForm(){
    const form = document.getElementById('formIns')
    form.innerHTML=(`
    <div class="ligneCon">
        <input type="text" name="Nom" id="nom" placeholder="Nom" required>
    </div>
    <div class="ligneCon">
        <input type="text" name="Prenom" id="prenom" placeholder="Prenom" required>
    </div>
    <div class="ligneCon">
        <input type="email" name="email" id="email" placeholder="Email" required>
    </div>
    <div class="ligneCon">
        <input type="password" name="password" id="password" placeholder="Mot de passe" required>
    </div>
    <div class="ligneCon">
        <input class="bouton1" type="submit" value="Inscription" id="envoieIns">
    </div>
    `)
}

function enregistrementUser(){
    const btnEnvIns = document.getElementById("envoieIns")
    btnEnvIns.addEventListener('click', (e) => {
        e.preventDefault()
        donnee = donneeUser()
        addUserToBdd(donnee)
    })
}

function donneeUser(){
    const donnee = {
        email:document.getElementById("email").value,
        nom:document.getElementById("nom").value,
        prenom:document.getElementById("prenom").value,
        password:document.getElementById("password").value,
    }
    return donnee
}

async function addUserToBdd(donnee) {
    const jsonDonnee = JSON.stringify(donnee)
    try{
        let response = await fetch ("http://localhost:3000/api/user/signup", {
            method: "POST",
            headers: {
                    "Content-Type" : "application/json",
                },
            body: jsonDonnee,
        });
        //si c'est bon cela renvoie vers la page formulaire
        if (response.ok) {
            window.location.href="./connexion.html"

        }
        //sinon cela marque leretour serveur
        else {
            if(response.status ==401){
                response.json().then(function(data) {
                    switch (data.error) {
                        case 'weak password':alert('Veuillez saisir un mot de passe de 8 caractère minimum avec une majuscule, une minuscule et un chiffre');break
                        case 'bad name' : alert('Entrez un vrai nom');break
                        case 'bad prenom' : alert('Entrez un vrai prenom');break
                        case 'bad email' : alert('Entrez une adresse email correcte');break
                    }
                })
                
            }
            else if(response.status==409) {
                alert('Vous avez déjà un compte')
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}
