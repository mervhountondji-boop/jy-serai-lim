document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("photo");
  const preview = document.getElementById("photoPreview");
  const bgImg = document.getElementById("bg");
  const overlayImg = document.getElementById("overlay");
  const downloadBtn = document.getElementById("downloadBtn");

  // 1. Charger et afficher la photo sélectionnée
  input.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        preview.src = event.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // 2. Fusionner et télécharger l'image HD
  downloadBtn.addEventListener("click", function () {
    if (!preview.src || preview.style.display === "none") {
      alert("Veuillez d'abord sélectionner une photo !");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Dimensions HD basées sur l'image de fond
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

    // Étape B : Dessiner la photo dans le cercle
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
    };
    userImg.src = preview.src;
  });
});
