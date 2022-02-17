
/* ==================================================
Preloader Init
===============================================*/
$(window).on('load', function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");

    //testing
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
    oktaSignIn.session.get(function (res){

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://dev-77878233.okta.com/api/v1/users/me`,
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `SSWS ${res.id}`
            }
        }

        $.ajax(settings).done(function (response){})

    })
})
