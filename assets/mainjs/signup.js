$(document).ready(function () {
    const APIKEY = '61e0110da0f7d226f9b75dbc';
    
    $("#submit").on("click", function (e) {
        let userfname = $("#fname").val();
        let userlname = $("#lname").val();
        let useremail = $("#email").val();
        let usercontactno = $("#contactno").val();
        let userpwd = $("#pwd").val();

        
        var ajsondata = {            
            "profile": {
                "firstName": userfname,
                "lastName":userlname,
                "email": useremail,
                "login": useremail,
            },
            "credentials": {
                "password" : { "value": userpwd }
            }
        };

        var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://dev-77878233.okta.com/api/v1/users",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "00-y8UrgC8AbPZzQ2rSzHQxpNKqZFScHuw5p9cIjTf",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(ajsondata)
        }
        
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    
        var bjsondata = {"email": useremail};
        var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://onlinefood-ef2c.restdb.io/rest/customers",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(bjsondata)
        }

        $.ajax(settings).done(function (response) {
        console.log(response);
        });

    })


})
