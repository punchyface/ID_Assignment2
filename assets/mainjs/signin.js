const CLIENTID = "0oa3tpe06geyv3Tq25d7"
$(document).ready(function () {
    var oktaSignIn = new OktaSignIn({
        baseUrl: "https://dev-77878233.okta.com",
        logo: 'assets/img/logo.png',
        logoText: 'Shiok Ah',
        clientId: CLIENTID,
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
                document.querySelector(".loginModal .modal-content .loginpage").innerHTML= `<a class="btn btn-primary" href="#" >Logout</a>`
                $(".loginModal .modal-content .loginpage .btn").on("click", function (e) {
                    e.preventDefault();  
                    var win = window.open('https://dev-77878233.okta.com/login/signout', "mywindow","status=1,width=350,height=150");
                    win.close();
                    localStorage.clear();
                    location.reload();
                });
                return;
            }
            document.getElementById("messageBox").innerHTML = "You are not logged in";
            document.querySelector(".loginModal .modal-content .loginpage").innerHTML= `<a class="btn btn-primary" href="signup.html" role="button" >Login/SignUp</a>`
            $("div#portfolio-grid.menu-lists").on("click", ".add-to-cart", function (e) {
                e.preventDefault();    
                $('.loginModal').modal('show')
            });
        })
    }
})

