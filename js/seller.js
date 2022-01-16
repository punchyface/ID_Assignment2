$(document).ready(function () {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    getCategory()

    function getCategory(){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://onlinefood-ef2c.restdb.io/rest/foodcategory",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
            }
        }
          
        $.ajax(settings).done(function (response) {
            console.log(response);
            let content ="";
            for (var i = 0; i < response.length; i++) {
                
                content = `${content}<div class="row" id="${response[i].foodcat}"><h3>${response[i].foodcat}</h3></div>`
            }
            document.querySelector("div.fooditem .container").innerHTML = content;
            
        });
        
        getMenu();
    }

    function getMenu(){
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
            
            

            for (var i = 0; i < response.length; i++) {
                let content = "";
                content = `
                <div class="col-md-4">
                    <div class="card mb-4 box-shadow">
                        <img class="card-img-top" src="${response[i].foodimageurl}" alt="${response[i].foodname}">
                        <div class="card-body">
                            <p class="card-text">${response[i].fooddescription}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                                </div>
                                <small class="text-muted">$${response[i].foodprice.toFixed(2)}</small>
                            </div>
                        </div>
                    </div>
                </div>`;
                catarea(response[i].foodcat[0].foodcat, content);  
            }
            removeemptycategory()
        }); 
    }

    function catarea(foodcat, content){
        document.querySelector(`main div.fooditem .container div#${foodcat}`).innerHTML += content;
    }

    function removeemptycategory(){
        let rowlist = document.querySelectorAll("div.row");
        for (i = 0; i < rowlist.length; i++){
            
            if (rowlist[i].querySelector('.col-md-4') == null) {
                rowlist[i].remove();
            } 
    
        }
        navcategory();

    }

    function navcategory(){
        let rowlist = document.querySelectorAll("div.row");
        for (i = 0; i < rowlist.length; i++){
            let title = rowlist[i].querySelector('h3').textContent;
            content = `<li><a class="dropdown-item" href="#${rowlist[i].id}">${title}</a></li>`;
            document.querySelector(".dropdown-menu").innerHTML += content;
        } 
    }






})

