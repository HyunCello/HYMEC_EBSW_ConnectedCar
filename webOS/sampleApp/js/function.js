$(function menu() {
  $(".auctions").click(function () {
    $("#menu").slideToggle(300, function () {});
    $("#menu").show();
    console.log("click");
  });
});
