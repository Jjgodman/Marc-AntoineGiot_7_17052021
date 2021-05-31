main()
//fonction d'initialisation
function main() {
    isAuthentifier()
    affichage()
    enregistrementPubli()
}
//affichage du formulaire
function affichage() {
    document.getElementById('addPubli').innerHTML =`
    <form id="formPubli" action="">
        <div class="ligneCon">
            <input type="text" name="titre" id="titre" placeholder="Titre" required>
        </div>
        <div class="ligneCon">
            <input type="file" accept=".jpg,.jpeg,.png,.gif" name="image" id="image" required>
            <label  for="image" class="ajout">Ajouter une image</label>
        </div>
        <div class="ligneCon">
            <input class="bouton1" type="submit" value="Publier" id="publier">
        </div>
    </form>
    `
}

//récuperation des information de la publication
function enregistrementPubli() {
    const form = document.getElementById("formPubli")
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        donneePubli()
    })
}
//envoie des donnee au serveur
async function donneePubli(){

    var myHeaders = new Headers();
    myHeaders.append("Authorization", sessionStorage.getItem('token'));

    var formdata = new FormData();
    formdata.append("titre", document.getElementById('titre').value);
    formdata.append("image", document.getElementById('image').files[0], document.getElementById('image').value);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };
    fetch("http://localhost:3000/api/publi/addPubli", requestOptions)
        .then(response => response.text())
        .then(result => 
            window.location.href="./index.html")
        .catch(error => console.log('error', error));
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