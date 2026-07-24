let input = document.getElementById("photo");
let preview = document.getElementById("photoPreview");
let template = document.getElementById("template");

// 1. Charger l'aperçu de la photo
input.onchange = function () {
  let file = this.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block"; // Affiche l'aperçu à l'écran
    };
    reader.readAsDataURL(file);
  }
};

// 2. Télécharger : Dessiner le FLYER au fond, puis la PHOTO par-dessus
function download() {
  if (!preview.src || preview.style.display === "none") {
    alert("Veuillez d'abord choisir une photo !");
    return;
  }

  // Création du canvas invisible
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  // Taille réelle du flyer (haute résolution)
  let realWidth = template.naturalWidth || 1000;
  let realHeight = template.naturalHeight || 1250;

  canvas.width = realWidth;
  canvas.height = realHeight;

  // Calcul du ratio d'échelle par rapport aux 400px du CSS
  let scale = realWidth / 400;

  // Position et taille de la photo adaptées à la vraie échelle
  let photoX = 102 * scale;  /* Même valeur 'left' du CSS */
  let photoY = 185 * scale;  /* Même valeur 'top' du CSS */
  let photoSize = 195 * scale; /* Même largeur/hauteur */

  let flyerImg = new Image();
  flyerImg.crossOrigin = "anonymous";

  // ÉTAPE A : On charge et on dessine le FLYER d'abord (en dessous)
  flyerImg.onload = function () {
    ctx.drawImage(flyerImg, 0, 0, realWidth, realHeight);

    let userImg = new Image();
    userImg.crossOrigin = "anonymous";

    // ÉTAPE B : On charge et on dessine la PHOTO par-dessus le flyer
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
      ctx.clip(); // Découpe en cercle parfait

      // Dessiner la photo PAR-DESSUS le flyer
      ctx.drawImage(userImg, photoX, photoY, photoSize, photoSize);
      ctx.restore();

      // ÉTAPE C : Déclencher le téléchargement du visuel complet
      let link = document.createElement("a");
      link.download = "visuel_final_jy_serai.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    userImg.src = preview.src; // Lancement du chargement de la photo
  };
  flyerImg.src = template.src; // Lancement du chargement du flyer
}
