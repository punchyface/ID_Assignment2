$(document).ready(function () {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    getCategory();



    //create foodcat div.row
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
                
                content = `${content}<div class="row" id="${response[i].foodcat}"><h3>${response[i].foodcatname}</h3></div>`
            }
            document.querySelector("div.container.marketing").innerHTML = content;
        });
        
        getMenu();
    }

    function catarea(foodcat, content){
        console.log(foodcat)
        document.querySelector(`body > main > div.container.marketing > div#${foodcat}`).innerHTML += content;
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
                <div class="col-lg-4">
                    <title>${response[i].foodname}</title>
                    <img class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false" src="${response[i].foodimageurl}"/>
                    
                    <h2>${response[i].foodname}</h2>
                    <p>$${response[i].foodprice.toFixed(2)}</p>
                    <p>
                    <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModalCenter" data-foodname='${response[i].foodname}' data-foodprice='${response[i].foodprice}' data-foodid='${response[i]._id}' data-fooddescription='${response[i].fooddescription}' data-foodimageurl='${response[i].foodimageurl}' >
                        View details &raquo;
                    </button>
                    </p>
                </div>`;

                catarea(response[i].foodcat[0].foodcat, content);  
            }
            removeemptycategory()
        }); 
    }


    //to close pop up
    $(".modal").on("click", "button.close" , function(){
        $('.modal').modal('hide');
    })
    $(".modal").on("click", "button.btn.btn-secondary" , function(){
        $('.modal').modal('hide');
    })

    //for popup when click view details
    $("div.marketing").on("click", ".btn-secondary", function () {
        let foodname = $(this).data("foodname");
        console.log($(this).data());
        let foodprice = $(this).data("foodprice");
        let foodid = $(this).data("_id");
        let foodimageurl = $(this).data("foodimageurl");
        let fooddescription = $(this).data("fooddescription");
        let content = `
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalreLongTitle">${foodname}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-6"><img src="${foodimageurl}" alt="${foodname}" width="200" height="200"></div>
                        <div class="col-md-2 ml-auto"><p class="foodprice">$${foodprice.toFixed(2)}</p></div>
                    </div>
                </div>
                <p>${fooddescription}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Add to Cart</button>
            </div>
        </div>`;
        document.querySelector("div.modal-content").innerHTML = content;
        $('.modal').modal('show');
    })

    function removeemptycategory(){
        let rowlist = document.querySelectorAll("div.row");
        for (i = 0; i < rowlist.length; i++){
            
            if (rowlist[i].querySelector('.col-lg-4') == null) {
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

