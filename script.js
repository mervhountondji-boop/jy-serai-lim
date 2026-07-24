let input = document.getElementById("photo");
let preview = document.getElementById("photoPreview");
let template = document.getElementById("template");

// Chargement de la photo choisie par l'utilisateur
input.onchange = function() {
    let file = this.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function() {
        preview.src = reader.result;
        preview.style.display = "block"; // Affiche l'image
    };
    reader.readAsDataURL(file);
};

// Fonction pour fusionner la photo et le cadre, puis télécharger l'image
function download() {
    if (!preview.src || preview.style.display === "none") {
        alert("Veuillez sélectionner une photo d'abord !");
        return;
    }

    let canvas = document.getElementById("exportCanvas");
    let ctx = canvas.getContext("2d");

    // On utilise les dimensions originales du template pour une bonne qualité
    let originalWidth = template.naturalWidth || 1080;
    let originalHeight = template.naturalHeight || 1080;

    canvas.width = originalWidth;
    canvas.height = originalHeight;

    // Calcul du ratio d'échelle entre la taille d'affichage CSS (400px) et la taille réelle
    let scale = originalWidth / 400;

    // Dimensions et positions à l'échelle réelle
    let photoX = 105 * scale;
    let photoY = 205 * scale;
    let photoSize = 190 * scale;
    let radius = photoSize / 2;
    let centerX = photoX + radius;
    let centerY = photoY + radius;

    // 1. Dessiner la photo dans un masque circulaire
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip(); // Découpe en cercle

    // Dessin de l'image utilisateur
    let img = new Image();
    img.src = preview.src;
    img.onload = function() {
        ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
        ctx.restore(); // Retire le masque circulaire

        // 2. Dessiner le template par-dessus
        ctx.drawImage(template, 0, 0, originalWidth, originalHeight);

        // 3. Déclencher le téléchargement du résultat
        let link = document.createElement("a");
        link.download = "visuel-jy-serai.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };
}
