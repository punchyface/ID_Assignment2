
$(document).ready(function() {

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

    if(oktaSignIn.token.hasTokensInUrl() != true) {
        oktaSignIn.session.get(function (res) {
        // If we get here, the user is already signed in.
            
            if (res.status === 'ACTIVE') {
                /*-------------------------------------------------------------------------------
                ---------------------------USER IS LOGIN---------------------------------------
                -------------------------------------------------------------------------------*/
                document.getElementById("messageBox").innerHTML = `Hello, <b>${res.login}</b>! You are logged in!`;
                document.querySelector(".loginModal .modal-content .loginpage").innerHTML= `<a class="btn btn-info" href="https://dev-77878233.okta.com/enduser/settings" role="button" target="_blank" style="margin-right: 1rem;">Edit profile</a><a class="btn btn-primary" href="#" >Logout</a>`
                $(".loginModal .modal-content .loginpage .btn-primary").on("click", function (e) {
                    e.preventDefault();  
                    var win = window.open('https://dev-77878233.okta.com/login/signout', "mywindow","status=1,width=350,height=150");
                    setTimeout(function() {win.close()}, 15);
                    localStorage.clear();
                    location.reload();
                })

                //New codes start here
                $(document).ready(function(){
                    var user = res.userid;
                    //Display the game
                    $("#game").on('click', function(e){
                        e.preventDefault();
                        document.getElementById('modal-stw').style.display = "block";
                        //get data from database
                        getUserFromDB(user);
                    })
                    
                    //to close modal
                    $(".close-btn").on('click', function(e){
                        e.preventDefault();
                        document.getElementById('modal-stw').style.display = "none";
                    })

                    

                    /* start of external functions
                    -----------------------------------------------------------------------------------------------*/
                    function spin(id){
                        let click = false;
                        let deg = 0;
                        let zoneSize = 45;
                        let wheel = document.querySelector('.wheel-border');
                        const valueInWheel = {
                            1: 10, //1st item (class item3)
                            2: 1, //2nd item (anti-clockwise) (class item6)
                            3: 20, //3rd item (class item1)
                            4: 4, //4th item (class item4)
                            5: 2, //5th item (class item7)
                            6: 15, //6th item (class item2)
                            7: 5, //7th item (class item5)
                            8: 8, //8th item (class item8)
                        }
                        $(".spin-btn").on('click', function(e){
                            e.preventDefault();
                            //disable buttons
                            document.querySelector('.close-btn').style.pointerEvents = 'none';
                            document.querySelector('.spin-btn').style.pointerEvents = 'none';
                            wheel.style.transition = 'all 5s ease-out';
                            deg = spinTheWheel(deg);
                            //remove tuple
                            removeTupleFromGame(id);
                            click = true;
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
                            //return click
                            return click;

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

                    /* database functions
                    -----------------------------------------------------------------------------------------------*/
                    //function to get data from game db in restdb
                    function getUserFromDB(user){
                        var settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": "https://onlinefood-ef2c.restdb.io/rest/game",
                            "method": "GET",
                            "headers": {
                                "content-type": "application/json",
                                "x-apikey": APIKEY,
                                "cache-control": "no-cache"
                            }
                        }
                        
                        $.ajax(settings).done(function (response) {
                            var attempt = 0;
                            var id = "";
                                for(var i = 0; i < response.length; i++){
                                    if(response[i].user == user){
                                        //increment attempt
                                        attempt += 1;
                                        //get id
                                        id = response[i].id;
                                        console.log(response);
                                    }
                                }

                                //check if attempt is more than 0
                                if(attempt > 0){
                                    //update attempt page
                                    $('.no-attempt').html(attempt);
                                    //enable button to spin
                                    $('.spin-btn').prop('disabled', false);
                                    //method to spin the wheel
                                    let click = spin(id);

                                    if(click == true){
                                        attempt -= 1;
                                    }
                                }
                                else{
                                    //disable button to spin
                                    $('.spin-btn').prop('disabled', true);
                                }

                            
                        });
                    }

                    //function to delete tuple
                    function removeTupleFromGame(id){
                        var settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": `https://onlinefood-ef2c.restdb.io/rest/game/${id}`,
                            "method": "DELETE",
                            "headers": {
                            "content-type": "application/json",
                            "x-apikey": "<your CORS apikey here>",
                            "cache-control": "no-cache"
                            }
                        }
                        
                        $.ajax(settings).done(function (response) {
                            console.log(response);
                        });
                    }

                    //function to post tuple to voucher
                    function postVoucher(wheelValue){

                    }
                })
                    
                
            }
            else{
                /*-------------------------------------------------------------------------------
                -----------------------------USER IS NOT LOGIN------------------------------------
                -------------------------------------------------------------------------------*/
                document.getElementById("messageBox").innerHTML = "You are not logged in";
                document.querySelector(".loginModal .modal-content .loginpage").innerHTML= `<a class="btn btn-primary" href="signup.html" role="button" >Login/SignUp</a>`
                $("#game").on("click", function (e) {
                    e.preventDefault();    
                    $('.loginModal').modal('show')
                })  
                localStorage.clear();  
            }
        });
    }

})