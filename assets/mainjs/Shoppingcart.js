$(document).ready(function () {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    var itemsInLocalStorage = localStorage.getItem('Product Details');

    if (itemsInLocalStorage != null){
        itemsInLocalStorage = JSON.parse(itemsInLocalStorage);
        
        getItemInCart(itemsInLocalStorage)

    }
    else{
        EmptyCartPreloader();
    }

    //function to get items in cart
    function getItemInCart(itemsInLocalStorage){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://onlinefood-ef2c.restdb.io/rest/Cart",
            "method": "GET",
            "headers": {
              "content-type": "application/json",
              "x-apikey": APIKEY,
              "cache-control": "no-cache"
            }
        }

        $.ajax(settings).done(function(response){
            console.log(response);
            $(".default-cart-preloader").fadeOut(60); //Remove default preloader
            $(".total-price table").css('visibility', 'visible'); //Make price visible
            let content = "";
            let total = 0.00;

            //Go through local storage and update page
            Object.values(itemsInLocalStorage).map(item => {
                $(".default-cart-preloader").fadeOut(60); //Remove default preloader
                $(".total-price table").css('visibility', 'visible'); //Make price visible
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

            /*to remove cart item when remove btn is clicked
            -------------------------------------------------------------------------------*/
            var removeCartItemButton = document.getElementsByClassName('remove-cart-btn');
            for(var i = 0; i < removeCartItemButton.length; i++){
                var button = removeCartItemButton[i];
                button.addEventListener('click', function(event){
                    var buttonClicked = event.target;
                    buttonClicked.closest('tr').remove();
                    //update local storage and refresh page
                    removeItemInStorage(buttonClicked.closest('div').firstElementChild.innerHTML, itemsInLocalStorage)
                    //call function to calculate the total cost
                    recalculateTotal();
                    //call function to update total item in cart
                    sumUpQty();
                })
            }

            /*to update cart page when plus btn is clicked
            -------------------------------------------------------------------------------*/
        })
    }


    /* start of external functions
    -------------------------------------------------------------------------------*/

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
            if(clonelocalstorage.length == 1){
                count = 0;
            }
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

        let checkstorage = localStorage.getItem('Product Details');
        checkstorage = JSON.parse(checkstorage);
        if(checkstorage == null || checkstorage == []){
            $(".total-price table").css('visibility', 'hidden'); //Make price hidden
            $(".default-cart-preloader").css('display', 'block'); //show default preloader
            EmptyCartPreloader();
        }
        else{
            
            getItemInCart(checkstorage);
        }
    }

})