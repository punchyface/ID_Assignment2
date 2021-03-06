$(document).ready(function() {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    var  count0 = 0;
    var delsuccess = false;
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


                //get user from okta
                var okuser = res.userId;

                //New codes start here

                //Display the game
                $("#game").on('click', function(e){
                    e.preventDefault();
                    document.getElementById('modal-stw').style.display = "block";
                    //get data from database
                    console.log(okuser);
                    //Start of backend
                    getUserFromDB(okuser);
                })
                
                //to close modal
                $(".close-btn").on('click', function(e){
                    e.preventDefault();
                    document.getElementById('modal-stw').style.display = "none";
                })

                

                /* start of external functions
                -----------------------------------------------------------------------------------------------*/
                function spin(idarray,user,attempt){
                    let arraycounter = -1;
                    let deg = 0;
                    let count = 0;
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
                        count += 1;

                        if(count == 1 && attempt > 0){
                            //disable buttons
                            document.querySelector('.close-btn').style.pointerEvents = 'none';
                            document.querySelector('.spin-btn').style.pointerEvents = 'none';
                            //minus attempt and update page
                            attempt -= 1;
                            $(".no-attempt").html(attempt);
                            //reset counter
                            count = 0;

                            wheel.style.transition = 'all 5s ease-out';
                            deg = spinTheWheel(deg);
                            //remove tuple
                            arraycounter += 1;
                            removeTupleFromGame(idarray[arraycounter], deg);

                            //when spin is over
                            wheel.addEventListener('transitionend', function(){
                                //get actual degree
                                var actualDeg = deg % 360;
                                //remove transition
                                wheel.style.transition = 'none';
                                //make sure wheel is at right position
                                wheel.style.transform = `rotate(${actualDeg}deg)`;
                                //Calculate and get value
                                var wheelValue = valueFromWheel(actualDeg, zoneSize, valueInWheel);
                                //call get voucher method
                                postVoucher(wheelValue, user);
                            })
                            
                            //return attempt
                            return attempt;
                            
                        }

                        
                    })
                    //function to delete tuple
                    function removeTupleFromGame(id){
                        var settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": `https://onlinefood-ef2c.restdb.io/rest/game/${id}`,
                            "method": "DELETE",
                            "headers": {
                                "content-type": "application/json",
                                "x-apikey": APIKEY,
                                "cache-control": "no-cache"
                            },
                            "beforeSend": function(){
                                count0++;
                                if (count0 != 1){
                                    throw new Error("repeated delete");
                                }
                            }
                        }
                        
                        $.ajax(settings).done(function (response) {
                            console.log(response);
                            count0 = 0
                            delsuccess = true
                            
                        });
                    }
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
                        //enable buttons
                        document.querySelector('.close-btn').style.pointerEvents = 'auto';
                        document.querySelector('.spin-btn').style.pointerEvents = 'auto';
                    })
                }

                /* database functions
                -----------------------------------------------------------------------------------------------*/
                //function to get data from game db in restdb
                function getUserFromDB(user){
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": `https://onlinefood-ef2c.restdb.io/rest/game?q={"user":"${user}"}`,
                        "method": "GET",
                        "headers": {
                            "content-type": "application/json",
                            "x-apikey": APIKEY,
                            "cache-control": "no-cache"
                        }
                    }
                    
                    $.ajax(settings).done(function (response) {
                        var attempt = response.length;
                        var idarray = [];
                        for (var i = 0; i < attempt; i++){
                            idarray.push(response[i]._id);
                        }
                        //check if attempt is more than 0
                        if(attempt > 0){
                            //update attempt page
                            $('.no-attempt').html(attempt);
                            //enable button to spin
                            $('.spin-btn').prop('disabled', false);
                            console.log(attempt);
                            //method to spin the wheel
                            attempt = spin(idarray,user,attempt);
                        }
                        else{
                            //disable button to spin
                            $('.spin-btn').prop('disabled', true);
                        }
                        
                        
                    });
                }

                

                //function to post tuple to voucher
                function postVoucher(wheelValue, user){
                    wheelValue = parseFloat(wheelValue);
                    var jsondata = {"user": user, "cost": wheelValue, "status": true};
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://onlinefood-ef2c.restdb.io/rest/voucher",
                        "method": "POST",
                        "headers": {
                            "content-type": "application/json",
                            "x-apikey": APIKEY,
                            "cache-control": "no-cache"
                        },
                        "processData": false,
                        "data": JSON.stringify(jsondata),
                        "beforeSend": function(){
                            if (delsuccess == true){
                                count0++;
                                if (count0 != 1){
                                    throw new Error("repeated post");
                                }
                            }
                            else{
                                throw new Error("game attempt is not deleted")
                            }
                        }
                    }

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                        count0 = 0;
                        delsuccess = false
                        //show pop-up message
                        displayWinMessage(wheelValue);
                    });
                }


                    
                
            }
            else{
                /*-------------------------------------------------------------------------------
                -----------------------------USER IS NOT LOGIN------------------------------------
                -------------------------------------------------------------------------------*/

                $("#game").on("click", function (e) {
                    e.preventDefault();    
                    $('.loginModal').modal('show')
                })  
            }
        });
    }

})