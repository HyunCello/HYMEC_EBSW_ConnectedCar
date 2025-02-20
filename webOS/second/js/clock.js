function clock() {
  var bridge = new WebOSServiceBridge();
  /*
   *  getTimeApi calls gettime of systemservice, a module in the platform.
   */
  var getTimeApi = "luna://com.webos.service.systemservice/clock/getTime";
  var getTimeParams = "{}";

  /*
   *  helloApi calls the hello method of js_service template provided by CLI.
   *  In this case, the service name is used as default name "com.domain.app.service" is.
   *  If you change this service name, you need to change the service name of the following API.
   *
   *  If you change the name to helloparmas as you want, the contents will be reflected on the screen.
   */
  var helloApi = "luna://com.domain.app.service/hello";
  var helloParams = '{"name":"webOS"}';

  function getTime_callback(msg) {
    var arg = JSON.parse(msg);
    if (arg.returnValue) {
      console.log(
        "[APP_NAME: example web app] GETTIME_SUCCESS UTC : " + arg.utc
      );
      //webOSSystem.PmLogString(6, "GETTIME_SUCCESS", '{"APP_NAME": "example web app"}', "UTC : " + arg.utc);
    } else {
      console.error(
        "[APP_NAME: example web app] GETTIME_FAILED errorText : " +
        arg.errorText
      );
      //webOSSystem.PmLogString(3, "GETTIME_FAILED", '{"APP_NAME": "example web app"}', "errorText : " + arg.errorText);
    }
  }

  function hello_callback(msg) {
    var arg = JSON.parse(msg);
    if (arg.returnValue) {
      document.getElementById("txt_msg").innerHTML = arg.Response;
      console.log(
        "[APP_NAME: example web app] CALLHELLO_SUCCESS response : " +
        arg.Response
      );
      //webOSSystem.PmLogString(6, "CALLHELLO_SUCCESS", '{"APP_NAME": "example web app"}', "response : " + arg.Response);
    } else {
      console.error(
        "[APP_NAME: example web app] CALLHELLO_FAILED errorText : " +
        arg.errorText
      );
      //webOSSystem.PmLogString(3, "CALLHELLO_FAILED", '{"APP_NAME": "example web app"}', "errorText : " + arg.errorText);
    }
  }

  bridge.onservicecallback = getTime_callback;
  bridge.call(getTimeApi, getTimeParams);
  document.getElementById("txt_msg").onclick = function () {
    bridge.onservicecallback = hello_callback;
    bridge.call(helloApi, helloParams);
  };
};
