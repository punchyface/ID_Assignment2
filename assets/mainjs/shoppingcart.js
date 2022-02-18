$(document).ready(function () {
    $(".se-pre-con").fadeOut("slow");
    const APIKEY = '61e0110da0f7d226f9b75dbc';

    listdatetime()
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
    var itemsInLocalStorage = localStorage.getItem('Product Details');
    if (itemsInLocalStorage != null){
        itemsInLocalStorage = JSON.parse(itemsInLocalStorage);
        
        getItemInCart(itemsInLocalStorage);
        /*to Update drop down box for voucher
        -------------------------------------------------------------------------------*/
        oktaSignIn.session.get(function (res){
            updateTotal()
            var okuser = res.userId;
            console.log(okuser);
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": `https://onlinefood-ef2c.restdb.io/rest/voucher?q={"user":"${okuser}"}`,
                "method": "GET",
                "headers": {
                    "content-type": "application/json",
                    "x-apikey": APIKEY,
                    "cache-control": "no-cache"
                }
            }

            $.ajax(settings).done(function (response){
                console.log(response)
                for (var i = 0; i < response.length; i++){
                    //add info to html page
                    document.querySelector("select#voucher.form-control").innerHTML += `
                    <option value=${JSON.stringify(response[i])}>$${response[i].cost} off</option>`;
                }
            })

        })

        /*autofil address
        -------------------------------------------------------------------------------*/
        fetch('https://dev-77878233.okta.com/api/v1/users/me', {
                credentials: 'include'
            })
            .then(response => response.json()) 
            .then(function(me){
                console.log(me);
                address = me.profile.Address;
                if (address != null){
                    $("#address.form-control").val(address);
                }
        });

        $(document).ready(function(){
            $(".default-cart-preloader").fadeOut(60); //Remove default preloader
        })


    }
    else{
        EmptyCartPreloader();
    }

    //function to get items in cart
    function getItemInCart(itemsInLocalStorage){
        itemsInLocalStorage = JSON.parse(localStorage.getItem('Product Details'));
        $(".default-cart-preloader").fadeOut(60); //Remove default preloader
        $(".total-price table").css('visibility', 'visible'); //Make price visible
        let content = "";
        let total = 0.00;

        //Go through local storage and update page
        Object.values(itemsInLocalStorage).map(item => {
            //$(".default-cart-preloader").fadeOut(60); //Remove default preloader
            $(".cart-footer").css('visibility', 'visible'); //Make price visible
            content += `<tr>
            <!-- Product -->
            <td>
                <div class="cart-info">
                    <img src="${item.foodimageurl}" alt=""> <!-- item image -->
                    <div>
                        <p>${item.foodname}</p> <!-- item name -->
                        <small>$${item.foodprice.toFixed(2)}</small><br> <!-- item price-->
                        <button class="remove-cart-btn" type="button">Remove</button>
                    </div>
                </div>
            </td>
            <!-- Quantity -->
            <td>
                <div class="cart-item-qty">
                    <button class="cart-qty-minus" type="button">-</button>
                    <input type="number" min="1" class="qty qty-btn" value="${item.qty}" readonly>
                    <button class="cart-qty-plus" type="button">+</button>
                </div>
            </td>
            <!-- Subtotal -->
            <td class="subtotal">${(item.foodprice * item.qty).toFixed(2)}</td>
            </tr>`;

            let subtotal = `${(item.foodprice.toFixed(2) * item.qty)}`;
            total += parseFloat(subtotal);
        })
        // Update html page
        $(".tbody").html(content);
        $(".total-price table .display-total-cost").html(total.toFixed(2));
        sumUpQty();
        updateTotal();

        /*to remove cart item when remove btn is clicked
        -------------------------------------------------------------------------------*/
        var removeCartItemButton = document.getElementsByClassName('remove-cart-btn');
        for(var i = 0; i < removeCartItemButton.length; i++){
            var button = removeCartItemButton[i];
            button.addEventListener('click', function(event){
                var buttonClicked = event.target;
                buttonClicked.closest('tr').remove();
                //update local storage
                removeItemInStorage(buttonClicked.closest('div').firstElementChild.innerHTML, itemsInLocalStorage)
                //call function to calculate the total cost
                recalculateTotal();
                //call function to update final cost
                updateTotal();
                //call function to update total item in cart
                sumUpQty();
                //refresh page
                refreshTable()
            })
        }

        /*to update cart page when plus btn is clicked
        -------------------------------------------------------------------------------*/
        var plusItemButton = document.getElementsByClassName('cart-qty-plus');
        for(var i = 0; i < plusItemButton.length; i++){
            var button = plusItemButton[i];
            button.addEventListener('click', function(event){
                var plusbtnClicked = event.target;
                //increase food qty in local storage
                increaseItemQty(plusbtnClicked);
                //refresh page
                refreshTable();
            })
        }

        /*to update cart page when minus btn is clicked
        -------------------------------------------------------------------------------*/
        var minusItemButton = document.getElementsByClassName('cart-qty-minus');
        for(var i = 0; i < minusItemButton.length; i++){
            var button = minusItemButton[i];
            button.addEventListener('click', function(event){
                var minusbtnClicked = event.target;
                //decrease food qty in local storage
                decreaseItemQty(minusbtnClicked);
                //refresh page
                refreshTable();
            })
        }

        /*to clear all items in local storage and cart (checkout)
        -------------------------------------------------------------------------------*/
        $('.check-out-btn button').on('click', function(event){

            oktaSignIn.session.get(function (res) {
                user = res.userId
                product = JSON.parse(localStorage.getItem('Product Details'))
                let voucher = $("#voucher.form-control").val();
                voucher = JSON.parse(voucher);
                let address = $("#address.form-control").val();
                let remarks = $("#remarks.form-control").val();
                //{datetime book in 24h format (DD/MM/YYYY HH:mm:ss)}
                let arrangedate = $("#arrangedate.form-control").val();
                let arrangetime = $("#arrangetime.form-control").val();
                let arrangedatetime = new Date(arrangedate + ' ' + arrangetime);
                console.log(address);
                console.log(voucher);
                console.log(arrangedatetime);
                tocheck(address, order-error);

                //change voucher status
                var jsondata = {"status": false};
                var settings = {
                "async": true,
                "crossDomain": true,
                "url": `https://onlinefood-ef2c.restdb.io/rest/voucher/${voucher._id}`,
                "method": "PATCH",
                "headers": {
                    "content-type": "application/json",
                    "x-apikey": APIKEY,
                    "cache-control": "no-cache"
                },
                "processData": false,
                "data": JSON.stringify(jsondata),
                "beforeSend": function(){
                    $(".check-out-btn button").prop( "disabled", true);
                    $(".default-cart-preloader").show();
                    //make body tag unscrollable
                }
                }

                $.ajax(settings).done(function (response) {
                console.log(response);
                    
                    //post to order entity
                    var jsondata = {
                            "user": user,
                            "product": product,
                            "address": address,
                            "arrangedatetime": arrangedatetime,
                            "voucher" : [voucher._id],
                            "remarks" : remarks
                        };
                    var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://onlinefood-ef2c.restdb.io/rest/order",
                    "method": "POST",
                    "headers": {
                        "content-type": "application/json",
                        "x-apikey": APIKEY,
                        "cache-control": "no-cache"
                    },
                    "processData": false,
                    "data": JSON.stringify(jsondata)
                    }
                    $.ajax(settings).done(function (response) {
                        console.log(response);
                        let totalsum = 0.00;
                        var allsubtotals = document.getElementsByClassName('subtotal')
                        for(var i = 0; i < allsubtotals.length; i++){
                            var subtotal = allsubtotals[i];
                            totalsum += parseFloat(subtotal.innerHTML);
                        }

                        let minspend = 50
                        if (totalsum >= minspend){
                            var jsondata = {"user": user};
                            var settings = {
                                "async": true,
                                "crossDomain": true,
                                "url": "https://onlinefood-ef2c.restdb.io/rest/game",
                                "method": "POST",
                                "headers": {
                                    "content-type": "application/json",
                                    "x-apikey": APIKEY,
                                    "cache-control": "no-cache"
                                },
                                "processData": false,
                                "data": JSON.stringify(jsondata)
                            }
                            $.ajax(settings).done(function (response) {
                                console.log(response);
                                document.querySelector("#modal-checkout .modal-para").innerHTML += `<p><a class="btn btn-primary" href="#" id="game">You earn a chance to spin the wheel</a></p>`
                                //Clear local storage
                                localStorage.clear();
                                //show popup/modal
                                $(document).ready(showModal());
                            });
                        }
                        else{
                            //Clear local storage
                            localStorage.clear();
                            //show popup/modal
                            showModal();
                        }
                    })
                })
                    
            })
        })

    }




    /* start of external functions
    -------------------------------------------------------------------------------*/
    
    
    
    function listdatetime(){
        //format 18/01/2022 13:00:00
        
        //store opening hour
        const openhour = 8;
        //store closing hour
        const closehour = 22;
        //store opening min (must be a factor of time slots interval)
        const openmin = 30;
        //store closing min (must be a factor of time slots interval)
        const closemin = 0;
        //duration for delivery and preperation
        const prepareduration = 30;
        //interval between time slots 
        const timeslotsinterval = 10;
        //how mays day before you can pre-order excluding today
        const preorderday = 2;

        let starthour = openhour;
        nextopenmin = openmin;

        openingtime = moment({hour: openhour,minute: openmin}).format("HH:mm")

        closingtime = moment({hour: closehour,minute: closemin}).format("HH:mm")

        listdate();
        // on first time
        selecteddate = $("select#arrangedate.form-control").val();
        listtimeslots(selecteddate);

        //subsequent time
        $("select#arrangedate.form-control").on("change", function(e){
            e.preventDefault()
            selecteddate = $("select#arrangedate.form-control").val();
            listtimeslots(selecteddate)
        })

        function listdate(){
            datelist = [];
            time = moment().format("HH:mm");
            document.querySelector("select#arrangedate.form-control").innerHTML = null;
            date = moment()
            if ((time >= openingtime && time <= closingtime) === false){
                if (date.format("HH") < moment({hour: openhour}).format("HH")){
                    datelist.push(date.format("DD/MM/YYYY"));
                    for (i = 1; i <= preorderday; i++ ){
                        datelist.push(date.add( 1,'days').format("DD/MM/YYYY"))
                    }
                }
                else{
                    for (i = 1; i <= preorderday + 1; i++ ){
                        datelist.push(date.add( 1,'days').format("DD/MM/YYYY"))
                    }
                }
            }
            else{
                datelist.push(date.format("DD/MM/YYYY"));
                for (i = 1; i <= preorderday; i++ ){
                    datelist.push(date.add( 1,'days').format("DD/MM/YYYY"))
                }
            }
            
            for (i = 0; i < datelist.length; i++){
                document.querySelector("select#arrangedate.form-control").innerHTML += ` <option value='${datelist[i]}'>${datelist[i]}</option>`
            }
        }


        function listtimeslots(selecteddate){
            time = moment().add(prepareduration, 'minutes')
            document.querySelector("select#arrangetime.form-control").innerHTML = null;
            if ((selecteddate == time.format("DD/MM/YYYY")) && (time.format("HH:mm") >= openingtime && time.format("HH:mm") <= closingtime)){
                diff = Number(time.format("mm")) % timeslotsinterval;
                diffmin = timeslotsinterval - diff
                diffsec = 60 - Number(time.format("ss"));
                
                timeouttime = diffsec * 1000 + diffsec * 60000;
                setTimeout(function(){listtimeslots(selecteddate)}, timeouttime);

                nextopentime = time.add(diffmin, 'minutes');
                starthour = Number(nextopentime.format("HH"));
                nextopenmin = Number(nextopentime.format("mm"));
            }
            else{
                starthour = openhour
                nextopenmin = openmin
            }

            let endmin = 60;
            let timeslots = [];
            for(let hour = starthour; hour < closehour; hour++) {
                if (hour == closehour -1 ){
                    endmin = closemin + timeslotsinterval;
                }
                let startmin = 0;
                if (hour == starthour){
                    startmin = nextopenmin;
                } 
                for(min = startmin; min < endmin; min += timeslotsinterval){
                    timeslots.push(
                        moment({
                            hour,
                            minute: min
                        }).format('HH:mm')
                    );
                }
            }
            for (i = 0; i < timeslots.length; i++)
            {
                document.querySelector("select#arrangetime.form-control").innerHTML += ` <option value='${timeslots[i]}'>${timeslots[i]}</option>`
            }
        }   
    }

    //function to replace cart preloader
    function EmptyCartPreloader(){
        $(".default-cart-preloader").fadeOut(60); //Remove default preloader
        
        let content = `<img src="assets/img/your-cart-is-empty.png" alt="">`;

        //Update html page
        $(".cart-preloader").html(content);
    }

    //function to recalculate total 
    function recalculateTotal(){
        let totalsum = 0.00;
        var allsubtotals = document.getElementsByClassName('subtotal')
        for(var i = 0; i < allsubtotals.length; i++){
            var subtotal = allsubtotals[i];
            totalsum += parseFloat(subtotal.innerHTML);
        }

        //Update html page
        $(".total-price table .display-total-cost").html(totalsum.toFixed(2));
    }

    //function to add upp all qty
    function sumUpQty(){
        let totalqty = 0;
        var allqty = document.getElementsByClassName('qty');
        for(var i = 0; i < allqty.length; i++){
            var qty = allqty[i];
            totalqty += parseInt(qty.attributes[3].value);
        }
        //update html page
        $(".cart-items").html(totalqty);
    }

    //function to remove item in localstorage
    function removeItemInStorage(foodName, itemsInLocalStorage){
        var clonelocalstorage = [];
        let count = 0;

        //Create a clone of local storage
        Object.values(itemsInLocalStorage).map(item => {
            clonelocalstorage.push(item);
        });

        //To remove items from clone localstorage
        Object.values(itemsInLocalStorage).map(item => {
            
            //Get the correct food item that is clicked
            if(item.foodname == foodName){
                //remove that item in clone storage
                clonelocalstorage.splice(count, 1);
                //update and refresh local storage
                localStorage.removeItem('Product Details'); //clear actual localstorage

                for(var i = 0; i < clonelocalstorage.length; i++){//update and set local storage
                    let cartItem = JSON.parse(localStorage.getItem('Product Details'));

                    if(cartItem != null){
                        cartItem = {...cartItem, [clonelocalstorage[i].foodname]:clonelocalstorage[i]};
                    }
                    else{
                        cartItem = {[clonelocalstorage[i].foodname]:clonelocalstorage[i]};
                    }
                    localStorage.setItem('Product Details', JSON.stringify(cartItem));
                }
                //update no of items in localstorage
                if (parseInt(localStorage.getItem('NoOfItems')) == 0){
                    localStorage.removeItem('NoOfItems');
                }
                else{
                    localStorage.setItem('NoOfItems', parseInt(localStorage.getItem('NoOfItems')) - parseInt(item.qty));
                }
                
                
            }
            count += 1;
        })

    }

    //function to increase number of item qty in storage and html
    function increaseItemQty(plusbtnClicked){
        let iteminstorage = localStorage.getItem('Product Details');
        iteminstorage = JSON.parse(iteminstorage);
        let foodname = plusbtnClicked.closest('tr').firstElementChild.firstElementChild.lastElementChild.firstElementChild.innerHTML;
        let clonestorage = [];
        let input = plusbtnClicked.previousElementSibling;

        //store information from localstorage to clone
        Object.values(iteminstorage).map(item => {
            clonestorage.push(item);
        })

        //get specific food obj
        let food = clonestorage.findIndex((obj => obj.foodname == foodname))
        //Update qty of specific food
        clonestorage[food].qty = parseInt(clonestorage[food].qty) + 1;
        //update html page
        input.value = clonestorage[food].qty;

        //Update actual local storage
        for(var i = 0; i < clonestorage.length; i++){
            let cartItem = JSON.parse(localStorage.getItem('Product Details'));

            if(cartItem != null){
                cartItem = {...cartItem, [clonestorage[i].foodname]:clonestorage[i]};
            }
            else{
                cartItem = {[clonestorage[i].foodname]:clonestorage[i]};
            }
            localStorage.setItem('Product Details', JSON.stringify(cartItem));
        }

        //update no of  items in cart
        localStorage.setItem('NoOfItems', parseInt(localStorage.getItem('NoOfItems')) + 1);

    }

    //function to decrease qty of food item and qty in local storage
    function decreaseItemQty(minusbtnClicked){
        let iteminstorage = localStorage.getItem('Product Details');
        iteminstorage = JSON.parse(iteminstorage);
        let foodname = minusbtnClicked.closest('tr').firstElementChild.firstElementChild.lastElementChild.firstElementChild.innerHTML;
        let clonestorage = [];
        let input = minusbtnClicked.nextElementSibling;

        //store information from localstorage to clone
        Object.values(iteminstorage).map(item => {
            clonestorage.push(item);
        })

        //get specific food obj
        let food = clonestorage.findIndex((obj => obj.foodname == foodname))
        //check if qty is 1
        if(parseInt(clonestorage[food].qty) == 1){

        }
        else{
            //Update qty of specific food
            clonestorage[food].qty = parseInt(clonestorage[food].qty) - 1;
            //update html page
            input.value = clonestorage[food].qty;

            //Update actual local storage
            for(var i = 0; i < clonestorage.length; i++){
                let cartItem = JSON.parse(localStorage.getItem('Product Details'));

                if(cartItem != null){
                    cartItem = {...cartItem, [clonestorage[i].foodname]:clonestorage[i]};
                }
                else{
                    cartItem = {[clonestorage[i].foodname]:clonestorage[i]};
                }
                localStorage.setItem('Product Details', JSON.stringify(cartItem));
            }

            //update no of  items in cart
            localStorage.setItem('NoOfItems', parseInt(localStorage.getItem('NoOfItems')) - 1);
        }
        
    }

    //functin to show popup/modal
    function showModal(){
        $('.modal-checkout').css('display', 'block');
        //when dismiss btn clicked
        $('.modal-checkout .dismiss-btn').on('click', function(){
            location.reload();
        })
        
        //when x btn clicked
        $('.modal-checkout .close-btn').on('click', function(){
            location.reload();
        })
    }

    //function to update total
    function updateTotal(){
        var subtotal = document.querySelector(".display-total-cost").innerHTML;
        var voucher = document.getElementById("voucher").value;
        voucher = JSON.parse(voucher);
        var total = parseFloat(subtotal);

        //update pages
        if(voucher == null){
            $(".display-voucher-value").html("-0.00");
        }
        else{
            $(".display-voucher-value").html("-" + (voucher.cost).toFixed(2));
            total -= voucher.cost
            if (total < 0){
                total = 0
            }
        }
        $(".display-final-cost").html(total.toFixed(2));
    }

    $("select#voucher").on("change", function (e) {
        e.preventDefault();
        updateTotal();
        recalculateTotal();
    })

    //function to fresh table
    function refreshTable(){
        let checkstorage = JSON.parse(localStorage.getItem('Product Details'));
        if(checkstorage == null || checkstorage == []){
            $(".total-price table").css('visibility', 'hidden'); //Make price hidden
            $(".default-cart-preloader").css('display', 'block'); //show default preloader
            EmptyCartPreloader();
        }
        else{
            
            getItemInCart(checkstorage);
        }
    }

    //validator
    function tocheck(idcheck, area) {
        const inpObj = document.getElementById(idcheck);
        if (!inpObj.checkValidity()) {
        document.getElementById(area).innerHTML = `<b>${inpObj.validationMessage} Located in (${idcheck})</b>`;
        throw new Error();
        } 
    } 

})
