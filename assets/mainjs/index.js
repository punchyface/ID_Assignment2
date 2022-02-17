
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

        (async function () {
            try {
                const response = await fetch('https://dev-77878233.okta.com/api/v1/users/me', {
                    credentials: 'include'
                });
                const me = await response.json();
                console.log(me);
            } catch (err) {
                console.error(err);
            }
        })();

    })
})
