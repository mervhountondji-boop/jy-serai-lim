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
  // pour un téléchargement de super qualité.
  let realWidth = template.naturalWidth || 1000;
  let realHeight = template.naturalHeight || 1250;

  canvas.width = realWidth;
  canvas.height = realHeight;

  // Calcul du ratio par rapport aux 400px du CSS
  let scale = realWidth / 400;

  // Position et taille adaptées à la vraie résolution
  // (Utilise les mêmes valeurs top/left que dans votre style.css)
  let photoX = 102 * scale; // Correspond à 'left' dans le CSS
  let photoY = 185 * scale; // Correspond à 'top' dans le CSS
  let photoSize = 195 * scale; // Correspond à 'width'/'height'

  let userImg = new Image();
  userImg.crossOrigin = "anonymous"; // Évite les problèmes de droits (CORS)
  userImg.onload = function () {
    
    // --- 1. DESSINER LA PHOTO AU FOND ---
    
    // On découpe un cercle pour que la photo ne dépasse pas du cadre doré
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
    ctx.clip(); // Applique le masque circulaire

    // Dessiner la photo de l'utilisateur
    ctx.drawImage(userImg, photoX, photoY, photoSize, photoSize);
    
    ctx.restore(); // Réinitialise le masque circulaire pour le flyer

    // --- 2. DESSINER LE FLYER PAR-DESSUS ---
    
    let flyerImg = new Image();
    flyerImg.crossOrigin = "anonymous";
    flyerImg.onload = function () {
      // Dessiner le flyer (le PNG transparent) PAR-DESSUS la photo
      ctx.drawImage(flyerImg, 0, 0, realWidth, realHeight);

      // --- 3. DÉCLENCHER LE TÉLÉCHARGEMENT ---
      let link = document.createElement("a");
      link.download = "visuel_final_jy_serai.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    flyerImg.src = template.src; // Charge l'image du flyer (le PNG)
  };
  userImg.src = preview.src; // Charge la photo de l'utilisateur
}
