let input = document.getElementById("photo");
let preview = document.getElementById("photoPreview");


input.onchange = function(){

let file = this.files[0];

let reader = new FileReader();

reader.onload=function(){

preview.src = reader.result;

}

reader.readAsDataURL(file);

}


function download(){

alert("Téléchargement activé après intégration finale du visuel");

}
