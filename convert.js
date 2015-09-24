function convert(text) {
    text = text.toUpperCase();
    var root = document.getElementById("root");
    root.innerHTML = "";
    for (var i = 0, n = text.length; i < n; i++) {
        var c = text[i];
        if (c === ' ') {
            root.innerHTML += '<br>';
        } else {
            var img = window.characters[c];
            if (!img) {
                alert("Invalid character '" + c +"'");
                return;
            }
            root.appendChild(img.cloneNode());
        }
    }
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
}
