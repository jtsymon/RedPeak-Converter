function convert(text) {
    text = text.toUpperCase().replace(/[^A-Z ]/gi, '');

    var root = document.getElementById("root");
    var inner = document.createElement("div");
    // Clear the DOM element faster
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }

    var wrap = document.createElement("div");
    wrap.className = "wrapper";
    inner.appendChild(wrap);

    for (var i = 0, n = text.length; i < n; i++) {
        var c = text[i];
        if (c === ' ') {
            wrap = document.createElement("div");
            wrap.className = "wrapper";
            inner.appendChild(wrap);
        } else {
            var img = window.characters[c];
            if (!img) {
                alert("Invalid character '" + c +"'");
                return;
            }
            wrap.appendChild(img.cloneNode());
        }
    }
    window.location.hash = text.replace(/[ ]/gi, '-');
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
        window.characters[c].className = c;
    }
    fromhash();
}

window.onhashchange = fromhash;

function fromhash() {
    //Get text from hash in URL
    var hash = window.location.hash.substring(1);
    hash = hash.replace(/[-]/gi, ' ');
    if(hash!=null){
        convert(hash);
        document.getElementById("txt").value = hash;
    }
}

function tweet() {
    window.open(
        "https://twitter.com/intent/tweet?hashtags=RedPeak&url=" +
        encodeURIComponent(window.location));
}

function showImage() {
    html2canvas(document.getElementById("root")).then(function(canvas) {
        var dataUrl = canvas.toDataURL();
        window.location = dataUrl;
    });
}
