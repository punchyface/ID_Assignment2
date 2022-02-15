const APIKEY = '61e0110da0f7d226f9b75dbc';

$(document).ready(function () {
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
            console.log(res)
            
            if (res.status === 'ACTIVE') {

            /*-------------------------------------------------------------------------------
            ---------------------------USER IS LOGIN---------------------------------------
            -------------------------------------------------------------------------------*/
                document.getElementById("messageBox").innerHTML = `Hello, <b>${res.login}</b>! You are logged in!`;
                document.querySelector(".loginModal .modal-content .loginpage").innerHTML= `<a class="btn btn-info" href="https://dev-77878233.okta.com/enduser/settings" role="button" target="_blank" style="margin-right: 1rem;">Edit profile</a><a class="btn btn-primary" href="#" >Logout</a>`
                $(".loginModal .modal-content .loginpage .btn-primary").on("click", function (e) {
                    e.preventDefault();  
                    var win = window.open('https://dev-77878233.okta.com/login/signout', "mywindow","status=1,width=350,height=150");
                    setTimeout(function() {win.close()}, 15);
                    localStorage.clear();
                    location.reload();
                })
                $(document).ready(function () {
                    getMenuItems();

                    function getMenuItems(){
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
                            let dishesAvail = [];
                            
                            //Call function to check no of foodname that are added in cart
                            checkItemQty();

                            for(var d = 0; d < response.length; d++){
                                //Check if food in menu is available or not
                                if(response[d].foodstatus == true){
                                    let dish = response[d];
                                    dishesAvail.push(dish); //append it to array
                                }
                            }

                            let addtocartbtns = document.getElementsByClassName('add-to-cart');
                            for(let i = 0; i < addtocartbtns.length; i++){
                                addtocartbtns[i].addEventListener('click', function(event){
                                    console.log("addtocartbtns")
                                    let btnclicked = event.target;
                                    totalCartItem(dishesAvail[i]);
                                    //get qty of selected item
                                    let qty = parseInt(getdishqty(dishesAvail[i].foodname));
                                    //update html page
                                    let parentElement = btnclicked.closest('.item');
                                    let thumbclass = parentElement.firstElementChild;
                                    thumbclass.lastElementChild.textContent = qty;
                                    
                                })
                            }
                        })

                    }

                    /* start of external functions
                    -----------------------------------------------------------------------*/

                    //function to update cart number/localstorage
                    function totalCartItem(dishes){
                        let itemsincart = localStorage.getItem('NoOfItems')

                        //convert data stored in localstorage to int
                        itemsincart = parseInt(itemsincart);

                        //check if items in cart exist in local storage
                        if (itemsincart){
                            localStorage.setItem('NoOfItems', itemsincart += 1);
                            //update html cart number
                            $(".cart-items").html(itemsincart);
                        }
                        else{
                            localStorage.setItem('NoOfItems', itemsincart = 1);
                            //update html cart number
                            $(".cart-items").html(itemsincart);
                        }

                        //add qty attribute to dishes
                        dishes = {...dishes, "qty":0};
                        //call function to store dish details in local storage
                        getDishDetails(dishes);

                    }

                    //function to check no of items in cart
                    function checkItemsInCart(){
                        let items = localStorage.getItem('NoOfItems');

                        //Check if there is any value in localstorage
                        if (items != null){
                            //update html cart number
                            $(".cart-items").html(items);
                        }
                    }

                    //function to store dish details in localstorage
                    function getDishDetails(dishes){
                        let cartItem = localStorage.getItem('Product Details');
                        cartItem = JSON.parse(cartItem);
                        
                        if (cartItem != null){
                            if(cartItem[dishes.foodname] == undefined){
                                //add previous item + current
                                cartItem = {...cartItem, [dishes.foodname]:dishes};
                            }
                            cartItem[dishes.foodname].qty += 1;
                            
                        }
                        else{
                            dishes.qty = 1;
                            cartItem = {[dishes.foodname]:dishes} ;
                        }

                        localStorage.setItem('Product Details', JSON.stringify(cartItem));
                    }

                    //function to get specific item's qty
                    function getdishqty(foodName){
                        let lsItem = localStorage.getItem('Product Details');
                        let qty = 0;
                        lsItem = JSON.parse(lsItem);

                        Object.values(lsItem).map(item => {
                            if(item.foodname == foodName){
                                qty = parseInt(item.qty);
                                return qty;
                            }
                        })
                        return qty;
                    }

                    //function to display item of each item when page reload
                    function checkItemQty(){
                        let products = localStorage.getItem('Product Details');//get data from local storage
                        products = JSON.parse(products);

                        let infoclass = document.getElementsByClassName('info');

                        //check if local storage is empty
                        if(products != null){
                            //for each food name displayed
                            for(var i = 0; i < infoclass.length; i++){
                                let thisitem = infoclass[i];
                                let qty = 0;
                                //get the food name
                                thisitem = thisitem.firstElementChild.innerHTML;
                                //go through values of local storage
                                Object.values(products).map(item => {
                                    if(item.foodname == thisitem){
                                        qty = parseInt(item.qty);
                                        thisitem = infoclass[i];
                                        //update badge number
                                        thisitem.closest('.item').firstElementChild.lastElementChild.textContent = qty;
                                        thisitem = thisitem.firstElementChild.innerHTML;
                                    }
                                })
                            }
                        }
                    }

                    //Call function to check item in local storage
                    checkItemsInCart();
                })
                return;
            } 
            else{
                /*-------------------------------------------------------------------------------
            -----------------------------USER IS NOT LOGIN------------------------------------
                -------------------------------------------------------------------------------*/
                document.getElementById("messageBox").innerHTML = "You are not logged in";
                document.querySelector(".loginModal .modal-content .loginpage").innerHTML= `<a class="btn btn-primary" href="signup.html" role="button" >Login/SignUp</a>`
                $("div#portfolio-grid.menu-lists").on("click", ".add-to-cart", function (e) {
                    e.preventDefault();    
                    $('.loginModal').modal('show')
                })  
                localStorage.clear();  
            }
        })
    }
})