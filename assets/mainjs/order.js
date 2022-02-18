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
                        console.log(response)
                        $(".preload-order").css('display', 'none');
                        let content = "";
                        for(var i = 0; i < response.length; i++){
                            let datetime = response[i].arrangedatetime;
                            let voucherarea = ""
                            try {
                                let vouchercost = response[i].voucher[0].cost;
                                voucherarea = `<p>$${vouchercost} off voucher</p>`
                            }
                            catch(err) {
                                voucherarea = "" 
                            }
                
                
                            content += `
                                <div class="orders" id="${response[i]._id}">
                                    <div class="order-info">
                                        <h4>Order ID:</h4>
                                        <p>${response[i]._id}</p>
                                        ${voucherarea}
                                    </div>
                                    <div class="delivery-info">
                                        <h4>Delivery Info:</h4>
                                        <p>${response[i].address}</p>
                                        <p>${datetime}</p>
                                    </div>
                                    <div class="remarks">
                                        <h4>Remarks:</h4>
                                        <p>${response[i].remarks}</p>
                                    </div>
                                    <div class="show-detail">
                                        <button class="btn" id="show-more"  data-product='${JSON.stringify(response[i].product)}'>></button>
                                    </div>
                                </div>
                                <br>`
                
                        }
                
                        //update html page
                        if(response.length > 0){
                            $(".load-data-here").html(content);
                        }
                        else{
                            //display empty message
                            $(".empty").css('display', 'block');
                        }
                    })
                
                    $("div.load-data-here").on("click", "#show-more", function (e) {
                        e.preventDefault();
                        let content = ""
                        let product= $(this).data("product");
                        Object.values(product).map(item => {
                            content = `${content}
                            <div class="orderitem container-md">
                                <div class="order-img">
                                    <img src="${item.foodimageurl}" alt="${item.foodname}">
                                </div>
                                <div class="order-info">
                                    <h4>Product Info:</h4>
                                    <div>
                                        <p>${item.foodname}</p> <!-- item name -->
                                        <p>$${item.foodprice}</p> <!--item price-->
                                        <p>Qty: ${item.qty}</p>
                                    </div>
                                </div>
                            </div>
                            <hr>`;
                        })
                        document.querySelector("#productdetails.modal div.modal-dialog div.modal-content .orderdetails").innerHTML = content;
                        document.querySelector("#productdetails.modal div.modal-dialog div.modal-content .orderdetails")
                        $('#productdetails').modal('show');
                    })
                    
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