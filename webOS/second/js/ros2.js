function rosconnect() {
  var bridge = new WebOSServiceBridge();

  var puburl = "luna://com.webos.service.rosbridge/publish";
  var suburl = "luna://com.webos.service.rosbridge/subscribe";

  var subparams = JSON.stringify({
    "name": "chatter",
    "type": "std_msgs/msg/String",
    "Subscribe": true,
  });


  function callback(msg) {
    var response = JSON.parse(msg);
    console.log(response.returnValue);
  }
  bridge.onservicecallback = callback;
  bridge.call(suburl, subparams);
}
