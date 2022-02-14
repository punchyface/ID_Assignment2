$(document).ready(function () {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    var itemsInLocalStorage = localStorage.getItem('Product Details');

    setTimeout(function(){
        if (itemsInLocalStorage != null){
        itemsInLocalStorage = JSON.parse(itemsInLocalStorage);
        
        $(".default-cart-preloader").fadeOut(60); //Remove default preloader
        getItemInCart(itemsInLocalStorage);

        }
        else{
            EmptyCartPreloader();
        }
    },3100);

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
                //update local storage
                removeItemInStorage(buttonClicked.closest('div').firstElementChild.innerHTML, itemsInLocalStorage)
                //call function to calculate the total cost
                recalculateTotal();
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
        var checkoutButton = document.getElementsByClassName('check-out-btn');
        for(var i = 0; i < checkoutButton.length; i++){
            var button = checkoutButton[i];
            button.addEventListener('click', function(event){
                var checkoutbtnClicked = event.target;
                //Clear local storage
                localStorage.removeItem('NoOfItems');
                localStorage.removeItem('Product Details')
                //show popup/modal
                showModal();
                //remove table row from html
                checkoutbtnClicked.closest('.cart-item-container').firstElementChild.lastElementChild.remove();
                //call function to update total item in cart
                sumUpQty();
                //Refresh page
                refreshTable();
            })
        }

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
        var dismissButton = document.getElementsByClassName('dismiss-btn');
        for(var i = 0; i < dismissButton.length; i++){
            var button = dismissButton[i];
            button.addEventListener('click', function(){
            $('.modal-checkout').fadeOut(80);
            })
        }
        //when x btn clicked
        var closeButton = document.getElementsByClassName('close-btn');
        for(var i = 0; i < closeButton.length; i++){
            var button = closeButton[i];
            button.addEventListener('click', function(){
            $('.modal-checkout').fadeOut(80);
            })
        }
    }

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

})