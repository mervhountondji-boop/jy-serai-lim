let input = document.getElementById("photo");
let preview = document.getElementById("photoPreview");
let template = document.getElementById("template");

// Quand l'utilisateur choisit une photo
input.onchange = function () {
  let file = this.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block"; // Rend la photo visible
    };
    reader.readAsDataURL(file);
  }
};

// Quand l'utilisateur clique sur "Télécharger mon visuel"
function download() {
  if (!preview.src || preview.style.display === "none") {
    alert("Veuillez d'abord choisir une photo !");
    return;
  }

  // Création du canvas invisible pour fusionner les images
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  // On utilise la taille réelle du fichier flyer (haute résolution)
  let realWidth = template.naturalWidth || 1000;
  let realHeight = template.naturalHeight || 1250;

  canvas.width = realWidth;
  canvas.height = realHeight;

  // Calcul du ratio par rapport aux 400px du CSS
  let scale = realWidth / 400;

  // Position et taille adaptées à la vraie résolution
  let photoX = 102 * scale;
  let photoY = 185 * scale;
  let photoSize = 195 * scale;

  let userImg = new Image();
  userImg.crossOrigin = "anonymous";
  userImg.onload = function () {
    // 1. Découper un cercle pour la photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      photoX + photoSize / 2,
      photoY + photoSize / 2,
      photoSize / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();

    // 2. Dessiner la photo au fond
    ctx.drawImage(userImg, photoX, photoY, photoSize, photoSize);
    ctx.restore();

    // 3. Dessiner le flyer transparent PAR-DESSUS
    let flyerImg = new Image();
    flyerImg.crossOrigin = "anonymous";
    flyerImg.onload = function () {
      ctx.drawImage(flyerImg, 0, 0, realWidth, realHeight);

      // 4. Déclencher le téléchargement
      let link = document.createElement("a");
      link.download = "visuel_jy_serai.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    flyerImg.src = template.src;
  };
  userImg.src = preview.src;
}
