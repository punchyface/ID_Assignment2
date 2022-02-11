
$(document).ready(function () {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    catlist = [];
    getCategory()
    

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
                catlist.push(response[i]._id)
                content = `${content}<button id="${response[i]._id}" data-filter=".${response[i]._id}">${response[i].foodcat}</button>`
            }
            document.querySelector(".food-menu-content .mix-item-menu").innerHTML += content;
        });
        $(document).ready(getMenu());
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
                if (response[i].foodstatus == true){
                    let content = "";
                    content = `
                    <div class="item-single pf-item ${response[i].foodcat[0]._id} recommended${response[i].recommended}">
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
                                <div class="button" data-_id='${response[i]._id}'>
                                    <a href="#">ADD TO CART</a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    document.querySelector("div#portfolio-grid.menu-lists").innerHTML += content;
                    eleremove(response[i].foodcat[0]._id, catlist);
                }
            }
            removecategory();
            filtercat();
            $("body > div > div.se-pre-con").fadeOut("slow");
        }); 
    }

    function eleremove(item, alist){
        if (alist.includes(item)){
            let num = alist.indexOf(item);
            alist.splice(num, 1);
        }
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



    function removecategory(){
        for (i = 0; i < catlist.length; i++){
            $(`.mix-item-menu button#${catlist[i]}`).remove()
        }
    }


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

    if (oktaSignIn.token.hasTokensInUrl()) {
        oktaSignIn.token.parseTokensFromUrl(
            // If we get here, the user just logged in.
            function success(res) {
            var accessToken = res[0];
            var idToken = res[1];

            oktaSignIn.tokenManager.add('accessToken', accessToken);
            oktaSignIn.tokenManager.add('idToken', idToken);

            window.location.hash='';
            document.getElementById("messageBox").innerHTML = "Hello, " + idToken.claims.email + "! You just logged in! :)";
        },
            function error(err) {
                console.error(err);
            }
        );
    } 
    else {
        oktaSignIn.session.get(function (res) {
        // If we get here, the user is already signed in.
        console.log(res)
        if (res.status === 'ACTIVE') {
            document.getElementById("messageBox").innerHTML = "Hello, " + res.login + "! You are *still* logged in! :)";
            return;
        }
            oktaSignIn.renderEl(
                { el: '#okta-login-container' },
                function success(res) {},
                function error(err) {
                    console.error(err);
                }
            );
        });
    }
})

