const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const template = new Image();
template.src = "flyer.png";

let userPhoto = null;


// Charger le template
template.onload = function(){
    ctx.drawImage(template,0,0,1080,1350);
}


// Charger la photo
document.getElementById("photo").onchange = function(e){

const file = e.target.files[0];

const img = new Image();

img.onload=function(){

    // remettre le flyer
    ctx.drawImage(template,0,0,1080,1350);


    // cercle photo
    ctx.save();

    ctx.beginPath();
    ctx.arc(540,850,220,0,Math.PI*2);
    ctx.closePath();
    ctx.clip();


    // placer photo dans cercle
    ctx.drawImage(img,320,630,440,440);


    ctx.restore();


}

img.src=URL.createObjectURL(file);

}



// téléchargement

function download(){

let lien=document.createElement("a");

lien.download="jy-serai-lim.png";

lien.href=canvas.toDataURL("image/png");

lien.click();

}
