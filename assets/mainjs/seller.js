$(document).ready(function () {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    getCategory();
    var content0;

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
                content = `${content}<button id="${response[i]._id}" data-filter=".${response[i]._id}">${response[i].foodcat}</button>`
            }
            document.querySelector(".food-menu-content .mix-item-menu").innerHTML += content;
            
            //for the options in add food
            for (var i = 0; i < response.length; i++) {
                content0 = `${content0}<option value='${JSON.stringify(response[i])}' id="${response[i]._id}">${response[i].foodcat}</option>`
            }
            document.querySelector("select#add-foodcat").innerHTML = content0;
        });
        $("select#add-foodcat").ready(function () {
            getMenu()
        })
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
                <div class="item-single pf-item ${response[i].foodcat[0]._id} a${response[i].foodstatus}">
                    <div class="item">
                        <div class="thumb">
                            <a href="#">
                                <img src="${response[i].foodimageurl}" alt="Thumb" height="300" width="400">
                            </a>
                            <div class="price">
                                <h5>$${response[i].foodprice.toFixed(2)}</h5>
                            </div>
                        </div>
                        <div class="info">
                            <h4><a href="#">${response[i].foodname}</a></h4>
                            <p>
                                ${response[i].fooddescription}
                            </p>
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary" id="update" data-toggle="modal" data-target="#exampleModalCenter" data-foodname='${response[i].foodname}' data-foodprice='${response[i].foodprice}' data-foodid='${response[i]._id}' data-fooddescription='${response[i].fooddescription}' data-foodimageurl='${response[i].foodimageurl}' data-foodcat='${JSON.stringify(response[i].foodcat)}' data-foodstatus='${response[i].foodstatus}'>Edit</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary" id="delete" data-toggle="modal" data-target="#exampleModalCenter" data-foodid='${response[i]._id}'>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                document.querySelector("div#portfolio-grid.menu-lists").innerHTML += content;
            }
            filtercat()
        }); 
    }


    /*imagesLoaded active*/
    function filtercat() 
    {
        $('#portfolio-grid,.blog-masonry').imagesLoaded(function() {

            /* Filter menu */
            $('.mix-item-menu').on('click', 'button', function() {
                var filterValue = $(this).attr('data-filter');
                $grid.isotope({
                    filter: filterValue
                });
            });

            /* filter menu active class  */
            $('.mix-item-menu button').on('click', function(event) {
                $(this).siblings('.active').removeClass('active');
                $(this).addClass('active');
                event.preventDefault();
            });

            /* Filter active */
            var $grid = $('#portfolio-grid').isotope({
                itemSelector: '.pf-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.pf-item',
                }
            });

        });

    }

    $("div#portfolio-grid.menu-lists").on("click", "#update", function (e) {
        e.preventDefault();
        let foodname = $(this).data("foodname");
        let foodprice = $(this).data("foodprice");
        let foodid = $(this).data("foodid");
        let foodimageurl = $(this).data("foodimageurl");
        let fooddescription = $(this).data("fooddescription");
        let foodcat = $(this).data("foodcat");
        let foodstatus = $(this).data("foodstatus");
        let content = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exampleModalLongTitle">Edit</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form" id="update-food">
                    <form id="update-food-form">
                        <div class="form-group">
                            <label for="update-foodname">Food Name</label>
                            <input type="text" id="update-foodname" class="form-control" required></input>
                            <input type="hidden" id="update-foodid"></input>
                        </div>
                        <div class="form-group">
                            <label for="update-foodprice">Food Price</label>
                            <input type="number" min="0" step="0.01" id="update-foodprice" class="form-control" required></input>
                        </div>
                        <div class="form-group">
                            <label for="update-fooddescription">Food Description</label>
                            <textarea id="update-fooddescription" class="form-control" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="update-foodcat">Food Category</label>
                            <select class="form-control" id="update-foodcat">
                                <!--Food category options-->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="update-foodimageurl">Food Image Link Address</label>
                            <input type="url" id="update-foodimageurl" class="form-control" required></input>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="update-foodstatus">
                            <label class="form-check-label" for="update-foodstatus">Available</label>
                        </div>
                    </form>
                </div> 
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" id="update-food-submit" class="btn btn-primary">Save changes</button>
            </div>
        </div>`;
        document.querySelector("div.modal-dialog").innerHTML = content;
        document.querySelector("select#update-foodcat").innerHTML = content0;
        $("#update-foodname").val(foodname);
        $("#update-foodprice").val(foodprice);
        $("#update-fooddescription").val(fooddescription);
        $("#update-foodimageurl").val(foodimageurl);
        $(`#update-foodcat option#${foodcat[0]._id}`).attr('selected', true);
        $("#update-foodstatus").attr('checked', foodstatus);
        $("#update-foodid").val(foodid);
        $('.modal').modal('show');

        $("button#update-food-submit").on("click", function (e) {
            e.preventDefault();
            let foodname = $("#update-foodname").val();
            let foodprice = $("#update-foodprice").val();
            let foodid = $("#update-foodid").val();
            let foodimageurl = $("#update-foodimageurl").val();
            let fooddescription = $("#update-fooddescription").val();
            let foodcat = $('#update-foodcat').val();
            let foodstatus =  $("#update-foodstatus").is(":checked");
            updatemenu(foodid, foodname, foodprice, fooddescription, foodcat, foodimageurl, foodstatus)
        })
    })
    
    function updatemenu(foodid, foodname, foodprice, fooddescription, foodcat, foodimageurl, foodstatus){
        foodcat = [JSON.parse(foodcat)];
        var jsondata = {
            "foodname": foodname,
            "foodprice": Number(foodprice),
            "fooddescription": fooddescription,
            "foodstatus": foodstatus,
            "foodimageurl": foodimageurl,
            "foodcat": foodcat
        };
        console.log(foodid)
        console.log(jsondata)
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://onlinefood-ef2c.restdb.io/rest/menu/${foodid}`,
            "method": "PUT",
            "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(jsondata),
            "beforeSend": function(){
              $("#update-food-submit").prop( "disabled", true);
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
            location.reload();
        });
    }

    

    






})

