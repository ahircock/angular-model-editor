function getQueryParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

async function callRestAPI ( httpRequestMethod, url, sendData ) {
    
    return new Promise( 
        function( resolveFunction, rejectFunction ) {
            
            // make sure that the URL is OK
            url = encodeURI(url);

            // send data to the server
            var xhttp = new XMLHttpRequest();

            // this is the function that gets called when the server responds
            xhttp.onreadystatechange = function() {

                // if this is still waiting
                if (this.readyState != 4 ) {
                    return;
                } 

                // if everything worked OK (HTTP status 200)
                else if ( this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    resolveFunction( response );
                } 

                // if there was an error
                else {
                    var err = new Error("HTTP ERROR: code=" + this.status + ", message=" + this.responseText);
                    rejectFunction( err );
                }
            };

            // send the request to the server
            xhttp.open(httpRequestMethod, url, true);
            if ( httpRequestMethod == "POST" || httpRequestMethod == "PUT" ) {
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(sendData));
            } else if ( httpRequestMethod = "GET" ) {
                xhttp.send();    
            } else {
                var err = new Error( "Invalid httpRequestMethod parameter provided to callRestAPI. Must be POST, PUT or GET" );
                rejectFunction( err );
            }
        }
    );
}