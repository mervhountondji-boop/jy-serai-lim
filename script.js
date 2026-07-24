document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("photo");
  const preview = document.getElementById("photoPreview");
  const photoContainer = document.getElementById("photoContainer");
  const bgImg = document.getElementById("bg");
  const overlayImg = document.getElementById("overlay");
  const downloadBtn = document.getElementById("downloadBtn");
  
  let cropper = null;

  // 1. Charger l'image et activer le glisser/zoomer
  input.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // Détruire l'ancien cropper s'il existe
        if (cropper) {
          cropper.destroy();
        }

        preview.src = event.target.result;
        photoContainer.style.display = "block";

        // Initialiser Cropper.js
        cropper = new Cropper(preview, {
          aspectRatio: 1, // Ratio carré/cercle parfait
          viewMode: 1,
          dragMode: 'move', // Mode déplacement actif par défaut
          autoCropArea: 1,
          cropBoxMovable: false, // Bloque la boîte pour que l'utilisateur déplace la photo DERRIÈRE
          cropBoxResizable: false,
          toggleDragModeOnDblclick: false,
          ready() {
            // Rendre le masque parfaitement circulaire
            document.querySelector('.cropper-container').style.borderRadius = '50%';
          }
        });
      };
      reader.readAsDataURL(file);
    }
  });

  // 2. Générer et Télécharger l'image finale HD
  downloadBtn.addEventListener("click", function () {
    if (!cropper) {
      alert("Veuillez d'abord sélectionner une photo !");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Taille réelle HD du visuel
    const realWidth = bgImg.naturalWidth || 1000;
    const realHeight = bgImg.naturalHeight || 1250;

    canvas.width = realWidth;
    canvas.height = realHeight;

    const scale = realWidth / 400;

    const photoX = 102 * scale;
    const photoY = 212 * scale;
    const photoSize = 196 * scale;

    // Étape A : Dessiner le fond
    ctx.drawImage(bgImg, 0, 0, realWidth, realHeight);

    // Étape B : Récupérer la photo découpée/ajustée par l'utilisateur
    const croppedCanvas = cropper.getCroppedCanvas({
      width: photoSize,
      height: photoSize
    });

    // Dessiner la photo ajustée dans le cercle
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
    ctx.drawImage(croppedCanvas, photoX, photoY, photoSize, photoSize);
    ctx.restore();

    // Étape C : Dessiner le cadre par-dessus (cadre2.png)
    const frameImg = new Image();
    frameImg.onload = function () {
      ctx.drawImage(frameImg, 0, 0, realWidth, realHeight);

      // Étape D : Déclencher le téléchargement
      const link = document.createElement("a");
      link.download = "visuel_LIM.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    frameImg.src = overlayImg.src;
  });
});
