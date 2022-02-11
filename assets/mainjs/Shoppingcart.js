$(document).ready(function () {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    getItemInCart();

    //function to get items in cart
    function getItemInCart(){
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
            $(".total-price table").css('visibility', 'visible'); //Make price visibal
            let content = "";
            let total = 0.00;

            //Go through data
            for(var i = 0; i < response.length; i++){
                content += `<tr>
                <!-- Product -->
                <td>
                    <div class="cart-info">
                        <img src="${response[i].foodid[0].foodimageurl}" alt=""> <!-- item image -->
                        <div>
                            <p>${response[i].foodid[0].foodname}</p> <!-- item name -->
                            <small>$${response[i].foodid[0].foodprice.toFixed(2)}</small><br> <!-- item price-->
                            <button class="remove-cart-btn" type="button">Remove</button>
                        </div>
                    </div>
                </td>
                <!-- Quantity -->
                <td>
                    <div class="cart-item-qty">
                        <p>${response[i].quantity}</p>
                    </div>
                </td>
                <!-- Subtotal -->
                <td class="subtotal">${(response[i].foodid[0].foodprice * response[i].quantity).toFixed(2)}</td>
                </tr>`;
                
                let subtotal = `${(response[i].foodid[0].foodprice * response[i].quantity.toFixed(2))}`;
                total += parseFloat(subtotal);
            }
            // Update html page
            $(".tbody").html(content);
            $(".total-price table .display-total-cost").html(total);

            //function to remove cart item when remove btn is clicked
            var removeCartItemButton = document.getElementsByClassName('remove-cart-btn');
            console.log(removeCartItemButton);
            for(var i = 0; i < removeCartItemButton.length; i++){
                var button = removeCartItemButton[i];
                button.addEventListener('click', function(event){
                    var buttonClicked = event.target;
                    buttonClicked.closest('tr').remove();
                })
            }
        })
    }

    //function to replace cart preloader
    function EmptyCartPreloader(){
        $(".default-cart-preloader").fadeOut(60); //Remove default preloader
        
        let content = `<img src="assets/img/your-cart-is-empty.png" alt="">`;

        //Update html page
        $(".cart-preloader").html(content);
    }

    

})