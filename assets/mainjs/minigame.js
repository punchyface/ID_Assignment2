$(document).ready(function() {

    //Display the game
    $("#game").on('click', function(e){
        e.preventDefault();
        document.getElementById('modal-stw').style.display = "block";
    })
    
    //to close modal
    $(".close-btn").on('click', function(e){
        e.preventDefault();
        document.getElementById('modal-stw').style.display = "none";
    })

    spin();

    

    /*var oktaSignIn = new OktaSignIn({
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

    if(oktaSignIn.token.hasTokensInUrl() != true) {
        oktaSignIn.session.get(function (res) {
        // If we get here, the user is already signed in.
            console.log(res)*/
            
            //if (res.status === 'ACTIVE') {
                /*-------------------------------------------------------------------------------
                ---------------------------USER IS LOGIN---------------------------------------
                -------------------------------------------------------------------------------*/
                /*document.getElementById("messageBox").innerHTML = `Hello, <b>${res.login}</b>! You are logged in!`;
                document.querySelector(".loginModal .modal-content .loginpage").innerHTML= `<a class="btn btn-info" href="https://dev-77878233.okta.com/enduser/settings" role="button" target="_blank" style="margin-right: 1rem;">Edit profile</a><a class="btn btn-primary" href="#" >Logout</a>`
                $(".loginModal .modal-content .loginpage .btn-primary").on("click", function (e) {
                    e.preventDefault();  
                    var win = window.open('https://dev-77878233.okta.com/login/signout', "mywindow","status=1,width=350,height=150");
                    setTimeout(function() {win.close()}, 15);
                    localStorage.clear();
                    location.reload();
                })

                let spin = document.querySelector('.spin-btn');
                spin.addEventListener('click', function(){
                    spinTheWheel();
                })

                //function to spin the wheel
                function spinTheWheel(){
                    
                    var x = 1024; //Min value
                    var y = 5000; //Max value

                    var deg = Math.floor(Math.random() * (x-y)) + y;

                    //rotate wheel
                    document.querySelector('.wheel-border').style.transform = "rotate("+deg+"deg)";
                }
            }
        });
    }*/
    /* start of external functions
    -----------------------------------------------------------------------------------------------*/
    function spin(){
        let deg = 0;
        let zoneSize = 45;
        let wheel = document.querySelector('.wheel-border');
        const valueInWheel = {
            1: 30, //1st item 
            2: 60, //2nd item (anti-clockwise)
            3: 10, //3rd item
            4: 40, //4th item
            5: 70, //5th item
            6: 20, //6th item
            7: 50, //7th item
            8: 80, //8th item
        }
        $(".spin-btn").on('click', function(e){
            e.preventDefault();
            //disable buttons
            document.querySelector('.close-btn').style.pointerEvents = 'none';
            document.querySelector('.spin-btn').style.pointerEvents = 'none';
            wheel.style.transition = 'all 5s ease-out';
            deg = spinTheWheel(deg);
        })
    
        //when spin is over
        wheel.addEventListener('transitionend', function(){
            //enable buttons
            document.querySelector('.close-btn').style.pointerEvents = 'auto';
            document.querySelector('.spin-btn').style.pointerEvents = 'auto';

            //get actual degree
            var actualDeg = deg % 360;
            //remove transition
            wheel.style.transition = 'none';
            //make sure wheel is at right position
            wheel.style.transform = `rotate(${actualDeg}deg)`;
            //Calculate and get value
            var wheelValue = valueFromWheel(actualDeg, zoneSize, valueInWheel);
            //show pop-up message
            displayWinMessage(wheelValue);

        })
    }

    //function to spin the wheel
    function spinTheWheel(deg){

        var x = 1024; //min value
        var y = 9999; //max value
        
        deg = Math.floor(Math.random() * (x-y)) + y;

        //rotate wheel
        document.getElementById('wheel-border').style.transform = "rotate("+deg+"deg)";
        return deg;
    }

    //function to get value from wheel
    function valueFromWheel(actualDeg, zoneSize, valueInWheel){
        let numberInWheel = Math.ceil(actualDeg/ zoneSize);
        let wheelValue = valueInWheel[numberInWheel];
        return wheelValue;
    }

    //function to display popup message
    function displayWinMessage(wheelValue){
        //Update value in pop-up
        document.querySelector('.display-reward').textContent = wheelValue;
        $('.win-message').css('display', 'flex');

        //on dismiss btn click close
        document.querySelector('.close-reward-btn').addEventListener('click', function(e){
            e.preventDefault();
            $('.win-message').css('display', 'none');
        })
    }
})