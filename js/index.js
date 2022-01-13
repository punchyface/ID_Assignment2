$(document).ready(function () {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    getMenu();

    function getMenu(limit = 10, all = true){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://onlinefood-ef2c.restdb.io/rest/menu",
            "method": "GET",
            "headers": {
              "content-type": "application/json",
              "x-apikey": APIKEY,
              "cache-control": "no-cache"
            }
        }
          
        $.ajax(settings).done(function (response) {
            console.log(response);
            
            let content = "";

            for (var i = 0; i < response.length && i < limit; i++) {
                content = `${content}
                <div class="col-lg-4">
                    <title>${response[i].foodname}</title>
                    <img class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false" src="https://onlinefood-ef2c.restdb.io/media/${response[i].foodimage}?key=${APIKEY}"/>
                    
                    <h2>${response[i].foodname}</h2>
                    <p>${response[i].fooddescription}</p>
                    <p><a class="btn btn-secondary" href="${response[i]._id}-${response[i].foodname}" target="_blank">View details &raquo;</a></p>
                </div>`
                
            }

            document.querySelector("body > main > div.container.marketing > div").innerHTML = content
            
            
        }); 
    }
})

