function convert(text) {
    text = text.toUpperCase().replace(/[^A-Z ]/gi, '');
    
    var root = document.getElementById("root");
    var inner = document.createElement("div");
    // Clear the DOM element faster
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }
    for (var i = 0, n = text.length; i < n; i++) {
        var c = text[i];
        if (c === ' ') {
            inner.innerHTML += '<br>';
        } else {
            var img = window.characters[c];
            if (!img) {
                alert("Invalid character '" + c +"'");
                return;
            }
            inner.appendChild(img.cloneNode());
        }
    }
    window.location.hash = text;
    document.getElementById("txt").value = text;
    // Append to root only once
    root.appendChild(inner);
}
window.onload = function() {
    window.characters = [];
    window.waiting_for = 26;
    for (var i = 0; i < 26; i++) {
        var c = String.fromCharCode(65 + i);
        window.characters[c] = new Image();
        window.characters[c].onload = function() {
            window.waiting_for --;
        }
        window.characters[c].src = "img/" + c + ".png";
    }
    fromhash();
}

window.onhashchange = fromhash;

function fromhash() {
    //Get text from hash in URL
    var hash = window.location.hash.substring(1);
    if(hash!=null){
        convert(hash);
        document.getElementById("txt").value = hash;
    }
}
