main()
function main() {
    affichage()
    enregistrementPubli()
}
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

function enregistrementPubli() {
    const form = document.getElementById("formPubli")
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        donneePubli()
    })
}