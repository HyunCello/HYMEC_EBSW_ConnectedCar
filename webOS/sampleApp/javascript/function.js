$(function () {
  $(".auctions").click(function () {
    $("#menu").slideToggle(300, function () {});
    $("#menu").show();
    console.log("click");
  });
});
console.log("working?");
