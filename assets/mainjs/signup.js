$(document).ready(function () {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    
    $("#submit").on("click", function (e) {
        let userfname = $("#fname").val();
        let userlname = $("#lname").val();
        let useremail = $("#email").val();
        let usercontactno = $("#contactno").val();
        let userpwd = $("#pwd").val();

        var jsondata = {            
            "profile": {
                "firstName": userfname,
                "lastName":userlname,
                "email": useremail,
                "login": useremail,
                "mobilePhone": usercontactno
            },
            "credentials": {
                "password" : { "value": userpwd }
            }
        };

        var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://dev-77878233.okta.com/api/v1/users?activate=true",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "0oa3tpe06geyv3Tq25d7",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
        }
        
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    

        var jsondata = {"email": useremail,"active": true};
        var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://onlinefood-ef2c.restdb.io/rest/users",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
        }

        $.ajax(settings).done(function (response) {
        console.log(response);
        });

    })


})
