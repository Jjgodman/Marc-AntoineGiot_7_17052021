main()
function main() {
    affichage()
    enregistrementPubli()
}
function affichage() {
    document.getElementById('addPubli').innerHTML =`
    <form action="" id="formPubli" enctype="multipart/form-data">
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
    let form = document.getElementById("formPubli")
    let idUSERS=sessionStorage.getItem('userId')
    let titre = document.getElementById("titre").value
    let image = document.getElementById("image").files[0]
    var donnee = {
        idUSERS:idUSERS,
        titre : titre,
        image : image
    }
    let formData = new FormData();    
    formData.append("image", image);
    await fetch('http://localhost:3000/image', {method: "POST", body: image});
}

function enregistrementPubli() {
    const form = document.getElementById("formPubli")
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        donneePubli()
    })
}