document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("photo");
  const preview = document.getElementById("photoPreview");
  const template = document.getElementById("template");
  const downloadBtn = document.getElementById("downloadBtn");

  // 1. CHARGEMENT ET AFFICHAGE DE LA PHOTO
  input.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        // Applique l'image lue
        preview.src = event.target.result;
        // FORCE l'affichage de la balise <img>
        preview.style.display = "block";
      };

      reader.readAsDataURL(file);
    }
  });

  // 2. GÉNÉRATION DU TÉLÉCHARGEMENT
  downloadBtn.addEventListener("click", function () {
    if (!preview.src || preview.style.display === "none") {
      alert("Veuillez d'abord sélectionner une photo !");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Taille réelle HD du flyer
    const realWidth = template.naturalWidth || 1000;
    const realHeight = template.naturalHeight || 1250;

    canvas.width = realWidth;
    canvas.height = realHeight;

    const scale = realWidth / 400;

    const photoX = 102 * scale;
    const photoY = 184 * scale;
    const photoSize = 196 * scale;

    // A. Dessiner le flyer en fond
    ctx.drawImage(template, 0, 0, realWidth, realHeight);

    // B. Dessiner la photo chargée par-dessus dans le cercle
    const userImg = new Image();
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

      // C. Télécharger
      const link = document.createElement("a");
      link.download = "visuel_jy_serai.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    userImg.src = preview.src;
  });
});
