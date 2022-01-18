//==============================================
// Remove background-transparent class from nav
//==============================================
var nav = $(".navbar.navbar-expand-md.navbar-dark.fixed-top.bg-dark.background-transparent");

if (nav.hasClass("background-transparent")){
    $(window).on("scroll", function(){
        var scrollTop = $(window).scrollTop();
            if(scrollTop >34){
                $(".navbar.navbar-expand-md.navbar-dark.fixed-top.bg-dark.background-transparent").removeClass("background-transparent");
            }else {
                $(".navbar.navbar-expand-md.navbar-dark.fixed-top.bg-dark").addClass("background-transparent");
            }
   });
}