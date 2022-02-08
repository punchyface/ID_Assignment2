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
            let content = "";

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
                            <a href="">Remove</a>
                        </div>
                    </div>
                </td>
                <!-- Quantity -->
                <td>
                    <div class="cart-item-qty">
                        <input type="number" value="${response[i].quantity}">
                    </div>
                </td>
                <!-- Subtotal -->
                <td class="subtotal">${(response[i].foodid[0].foodprice * response[i].quantity).toFixed(2)}</td>
            </tr>`
            }

            $(".cart-table tbody").html(content);
        })
    }

})