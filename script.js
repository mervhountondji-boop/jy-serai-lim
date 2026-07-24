document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("photo");
  const preview = document.getElementById("photoPreview");
  const template = document.getElementById("template");
  const downloadBtn = document.getElementById("downloadBtn");

  // A. Quand l'utilisateur choisit sa photo
  input.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        preview.src = event.target.result;
        preview.style.display = "block"; // Affiche l'image dans le cercle
      };

      reader.readAsDataURL(file);
    }
  });

  // B. Quand l'utilisateur clique sur Télécharger
  downloadBtn.addEventListener("click", function () {
    if (!preview.src || preview.style.display === "none") {
      alert("Veuillez d'abord sélectionner une photo !");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Dimensions réelles HD du flyer
    const realWidth = template.naturalWidth || 1000;
    const realHeight = template.naturalHeight || 1250;

    canvas.width = realWidth;
    canvas.height = realHeight;

    const scale = realWidth / 400;

    // Coordonnées ajustées selon la taille réelle de l'image HD
    const photoX = 102 * scale;
    const photoY = 212 * scale; // Alignement à 212px
    const photoSize = 196 * scale;

    // 1. Dessiner le flyer au fond
    ctx.drawImage(template, 0, 0, realWidth, realHeight);

    // 2. Dessiner la photo découpée en cercle par-dessus
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

      // 3. Lancer le téléchargement
      const link = document.createElement("a");
      link.download = "visuel_jy_serai.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    userImg.src = preview.src;
  });
});
