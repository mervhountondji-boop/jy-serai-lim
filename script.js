let photo = document.getElementById("photo");
let template = document.getElementById("template");

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");


photo.onchange = function(){

let fichier = photo.files[0];

let reader = new FileReader();

reader.onload = function(e){

let img = new Image();

img.onload=function(){

canvas.width = template.width;
canvas.height = template.height;


// mettre le flyer
ctx.drawImage(template,0,0);


// mettre la photo dans le cercle
ctx.save();

ctx.beginPath();
ctx.arc(540,700,150,0,Math.PI*2);
ctx.clip();


ctx.drawImage(img,390,550,300,300);

ctx.restore();

}

img.src=e.target.result;

}

reader.readAsDataURL(fichier);

}



function download(){

let lien=document.createElement("a");

lien.download="Jy-serai-LIM.png";

lien.href=canvas.toDataURL();

lien.click();

}
