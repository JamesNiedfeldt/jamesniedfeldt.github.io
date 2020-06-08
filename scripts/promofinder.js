function search() {
    const Http = new XMLHttpRequest();
    const url = "https://api.scryfall.com/cards/search?q=";

    var search = document.getElementById("name");
    var options = "";

    if (search.value != "") {
        var req = url + search.value;

        for (o of document.getElementById("options")) {
            if (o.selected) {
                options += o.value + " or ";
            }
        }

        if (options != "") {
            options = " (" + options.slice(0, -4) + ")";
        }

        req += options + "+not:digital&unique=prints"
        req = encodeURI(req);

        Http.open("GET", req);
        Http.send();

        document.getElementById("status").innerHTML = "Loading...";
        document.getElementById("spinner").style.display = "inline-block";
    
        Http.onreadystatechange=(e)=>{
            document.getElementById("results").innerHTML = "";
            document.getElementById("pic").src = "";
            document.getElementById("spinner").style.display = "none";
            var res = JSON.parse(Http.response);
    
            if (res['object'] == "error") {
                document.getElementById("status").innerHTML = "No cards found.";
                return;
            }

            document.getElementById("status").innerHTML = res['total_cards'] + " hits";
    
            for (c of res['data']) {
                var opt = document.createElement("option");
                if (c['layout'] == "transform") {
                    opt.value = `${c['card_faces']['0']['image_uris']['normal']},${c['scryfall_uri']}`;
                } else {
                    opt.value = `${c['image_uris']['normal']},${c['scryfall_uri']}`;;
                }
                opt.innerHTML = c['set_name'];
                document.getElementById("results").appendChild(opt);
            }
    
            document.getElementById("results").selectedIndex = "0";
            display();
        }
    } else {
        document.getElementById("status").innerHTML = "Card name field must not be blank.";
    }
}

function display() {
    document.getElementById("pic").src = document.getElementById("results").value.split(",")[0];
    document.getElementById("link").href = document.getElementById("results").value.split(",")[1];
}