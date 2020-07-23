$(function () {
  $("#auctions1").click(function () {
    $("#menu").animate({ marginLeft: "0%" }, 400);
    $("#menu").show();
    $("#auctions1").hide();
    $("#auctions2").show();
  });
  $("#auctions2").click(function () {
    $("#menu").animate({ marginLeft: "-18%" }, 400);
    $("#auctions2").hide();
    $("#auctions1").show();
  });
});
