let input = document.getElementById("photo");
let preview = document.getElementById("photoPreview");
let template = document.getElementById("template");

// 1. Afficher l'aperçu dès que la photo est choisie
input.onchange = function () {
  let file = this.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
};

// 2. Générer et télécharger le visuel fusionné
function download() {
  if (!preview.src || preview.style.display === "none") {
    alert("Veuillez d'abord choisir une photo !");
    return;
  }

  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  // Taille réelle du fichier flyer.png pour garder une haute qualité
  let realWidth = template.naturalWidth || 1000;
  let realHeight = template.naturalHeight || 1250;

  canvas.width = realWidth;
  canvas.height = realHeight;

  // Calcul du ratio d'échelle
  let scale = realWidth / 400;

  // Position et dimensions adaptées à la vraie taille de l'image
  let photoX = 102 * scale;
  let photoY = 184 * scale;
  let photoSize = 196 * scale;

  let flyerImg = new Image();
  flyerImg.crossOrigin = "anonymous";
  
  // ÉTAPE A : Dessiner le flyer au fond
  flyerImg.onload = function () {
    ctx.drawImage(flyerImg, 0, 0, realWidth, realHeight);

    let userImg = new Image();
    userImg.crossOrigin = "anonymous";
    
    // ÉTAPE B : Dessiner la photo en cercle PAR-DESSUS
    userImg.onload = function () {
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

      ctx.drawImage(userImg, photoX, photoY, photoSize, photoSize);
      ctx.restore();

      // ÉTAPE C : Télécharger l'image finale
      let link = document.createElement("a");
      link.download = "visuel_jy_serai.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    
    userImg.src = preview.src;
  };
  
  flyerImg.src = template.src;
}
