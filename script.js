function download(){

let image=document.getElementById("template");

let lien=document.createElement("a");
lien.href=image.src;
lien.download="jy-serai-lim.png";
lien.click();

}
