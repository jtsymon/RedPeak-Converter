function convert(text) {
    text = text.toUpperCase().replace(/[^A-Z ]/gi, '');

    var root = document.getElementById("root");
    var inner = document.createElement("div");
    inner.id = "innerResult";
    inner.className = "innerResult";
    
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
    document.getElementById("tweetImageButton").addEventListener("click", function(e) {
        generateTwitterImage(e.target);
    });
    
    document.getElementById("tweetLinkButton").addEventListener("click", tweetLink);
    document.getElementById("imageButton").addEventListener("click", showImage);
    
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

function tweetLink() {
    window.open(
        "https://twitter.com/intent/tweet?hashtags=RedPeak&url=" +
        encodeURIComponent(window.location));
}

function generateImage(callback) {
    var result = document.getElementById("innerResult");
    
    // Have to resize the page body to get the full width of the image
    if (document.body.offsetWidth < result.offsetWidth) {
        document.body.style.width = result.offsetWidth + "px";
    }
    
    html2canvas(result).then(function() {
        html2canvas(result).then(function(canvas) {
            document.body.style.width = "";
            var dataUrl = canvas.toDataURL();
            
            if (callback) {
                callback(dataUrl);
            }
        });
    });
}

function showImage() {
    generateImage(function(url) {
        window.location = url;
    });
}

var isUploading = false;

function uploadImage(onSuccess) {
    if (isUploading) {
        return;
    }
    
    isUploading = true;
    
    generateImage(function(url) {
        var img = url.split(',')[1];
        
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                isUploading = false;
                if(xhr.status == 200 && onSuccess){
                    var response = JSON.parse(xhr.responseText);
                   
                    if (response.success) {
                        onSuccess(response.data.link);
                    }
                }
                else {
                    alert('something went wrong')
                }
            }
        }
        
        var imgururl = "https://api.imgur.com/3/image";
        var params = "image=" + 

        xhr.open("POST", imgururl, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", "Client-ID ed2cb862c8bffdf");
        xhr.send(JSON.stringify({image:img}));
    });
}

function generateTwitterImage(button) {
    button.classList.add("loading");
    button.innerHTML = "Loading...";

    uploadImage(function(url) {
        button.classList.remove("loading");
        button.innerHTML = "Done!";
        window.location = 
        "https://twitter.com/intent/tweet?hashtags=RedPeak&url=" +
        encodeURIComponent(url)
    });
}
