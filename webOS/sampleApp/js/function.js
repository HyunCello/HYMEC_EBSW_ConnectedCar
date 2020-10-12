// 토글 움직이는 기능
$(function menu() {
  $(".auctions").click(function () {
    $("#menu").slideToggle(300, function () { });
    $("#menu").show();
  });
});

// 백그라운드 재생
var bgplayer;
function onYouTubePlayerAPIReady() {
  player = new YT.Player("bgplayer", {
    width: "100%",
    height: "100%",
    videoId: "I9PwT-MqEjg",
    playerVars: {
      'controls': 0,
      'showinfo': 0,
      'start': 0,
      'loop': 1,
      'playlist': 'I9PwT-MqEjg'
    },
    events: {
      onReady: onPlayerReady
    }
  });
}
function onPlayerReady(event) {
  event.target.mute();
  event.target.playVideo();
}

/////////////////////////////////////////////////////////////

function toast(messg) {
  var bridge = new WebOSServiceBridge();
  var id;
  var createtoast = 'luna://com.webos.notification/createToast';
  bridge.onservicecallback = callback;

  function callback(msg) {
    var response = JSON.parse(msg);
    console.log(response.returnValue);
  }

  var subparams = JSON.stringify({
    "message": messg,
    "noaction": false,
  });

  bridge.call(createtoast, subparams);

}
console.log(document.domain)