$(document).ready(function() {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    var oktaSignIn = new OktaSignIn({
        baseUrl: "https://dev-77878233.okta.com",
        logo: 'assets/img/logo.png',
        logoText: 'Shiok Ah',
        clientId: "0oa3tpe06geyv3Tq25d7",
        authParams: {
        issuer: "default",
        responseType: ['token', 'id_token'],
        display: 'page'
        }
    });

    if(oktaSignIn.token.hasTokensInUrl() != true) {
        oktaSignIn.session.get(function (res) {
        // If we get here, the user is already signed in.
            
            if (res.status === 'ACTIVE') {


                //get user from okta
                var okuser = res.userId;

                //New codes start here

                getOrdered(okuser);

                

                /* start of external functions
                -----------------------------------------------------------------------------------------------*/
                

                /* database functions
                -----------------------------------------------------------------------------------------------*/
                //function to get data from order db in restdb
                function getOrdered(okuser){
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": `https://onlinefood-ef2c.restdb.io/rest/order?q={"user":"${okuser}"}`,
                        "method": "GET",
                        "headers": {
                            "content-type": "application/json",
                            "x-apikey": APIKEY,
                            "cache-control": "no-cache"
                        }
                    }

                    $.ajax(settings).done(function(response){
                        //remove preloader
                        $(".preload-order").css('display', 'none');
                        let count = 0;
                        let content = "";
                        for(var i = 0; i < response.length; i++){
                            var keyname = Object.values(response[i].product)[0];
                            let foodname = keyname.foodname;
                            let itemprice = keyname.foodprice;
                            let qty = keyname.qty;

                            content += `
                            <div class="orders" id="${response[i]._id}">
                                <div class="order-img">
                                    <img src="${response[i].product.Object.keys(response[i].product)[0].foodimageurl}" alt="">
                                </div>
                                <div class="order-info">
                                    <h4>Product Info:</h4>
                                    <div>
                                        <p>${foodname}</p> <!-- item name -->
                                        <p>$${itemprice}</p> <!--item price-->
                                        <p>Qty: ${qty}</p>
                                    </div>
                                </div>
                                <div class="delivery-info">
                                    <h4>Delivery Info:</h4>
                                    <p>${response[i].address}</p>
                                    <p>${response[i].arrangedatetime}</p>
                                </div>
                                <div class="delivery-info">
                                    <h4>Remarks:</h4>
                                    <p>${response[i].remarks}</p>
                                </div>
                                <div class="remove-order">
                                    <button class="remove-single-order">&times;</button>
                                </div>
                            </div>
                            <br>`
                            count += 1;
                        }
                        //update html page
                        if(count > 0){
                            $(".load-data-here").html(content);
                        }
                        else{
                            //display empty message
                            $(".empty").css('display', 'block');
                        }
                        //loop to get onclick function
                        var alldeletebtn = document.getElementsByClassName("remove-single-order");
                        for(var i = 0; i < alldeletebtn.length; i++){
                            alldeletebtn[i].addEventListener('click', function(event){
                                buttonclicked = event.target;
                                //get id of clicked item
                                let thisid = buttonclicked.closest('.orders').id;
                                //remove this item from db
                                removeOrder(thisid);
                                //remove item in html
                                buttonclicked.closest('.orders').remove();
                            })
                        }
                    })
                }

                //function to remvove item from order
                function removeOrder(id){
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": `https://onlinefood-ef2c.restdb.io/rest/order/${id}`,
                        "method": "DELETE",
                        "headers": {
                        "content-type": "application/json",
                        "x-apikey": APIKEY,
                        "cache-control": "no-cache"
                        }
                    }
                    
                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });
                }



                    
                
            }
            else{
                /*-------------------------------------------------------------------------------
                -----------------------------USER IS NOT LOGIN------------------------------------
                -------------------------------------------------------------------------------*/

                $("#game").on("click", function (e) {
                    e.preventDefault();    
                    $('.loginModal').modal('show')
                })  
            }
        });
    }

})