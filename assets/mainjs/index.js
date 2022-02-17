
/* ==================================================
Preloader Init
===============================================*/
$(window).on('load', function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");
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
    oktaSignIn.users.get(function (res){
        confirm.log(res)
    })
})
