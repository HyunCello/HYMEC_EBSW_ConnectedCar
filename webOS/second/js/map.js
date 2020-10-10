var zoomsize;

if (window.innerWidth < 700) {
  zoomsize = 10;
} else {
  zoomsize = 11;
}
var map = new naver.maps.Map("map", {
  mapTypeId: naver.maps.MapTypeId.HYBRID,
  center: new naver.maps.LatLng(33.378673, 126.540261),
  zoom: zoomsize,
});
var marker1 = new naver.maps.Marker({
  // 1공3공 사이
  position: new naver.maps.LatLng(37.297567, 126.83671),
  map: map,
});
var circle1 = new naver.maps.Circle({
  strokeColor: "#ffd200",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#ffd200",
  fillOpacity: 0.5,
  center: new naver.maps.LatLng(37.297567, 126.83671),
  radius: 10,
  zIndex: 100,
  clickable: true,
  map: map,
});
$("#menu1").on("click", function () {
  addmenu(name, 1);
});

var marker2 = new naver.maps.Marker({
  // 4공 앞(내부)
  position: new naver.maps.LatLng(37.2972, 126.83626),
  map: map,
});
var circle2 = new naver.maps.Circle({
  strokeColor: "#ffd200",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#ffd200",
  fillOpacity: 0.5,
  center: new naver.maps.LatLng(37.2972, 126.83626),
  radius: 10,
  zIndex: 100,
  clickable: true,
  map: map,
});
var marker3 = new naver.maps.Marker({
  // 5공뒷편
  position: new naver.maps.LatLng(37.2968655, 126.8368147),
  map: map,
});
var circle3 = new naver.maps.Circle({
  strokeColor: "#ffd200",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#ffd200",
  fillOpacity: 0.5,
  center: new naver.maps.LatLng(37.2968655, 126.8368147),
  radius: 10,
  zIndex: 100,
  clickable: true,
  map: map,
});
/*
var marker = new naver.maps.Marker({ // 5공 1공사이
    position: new naver.maps.LatLng(37.2969604,126.8370333),
    map: map
});
var marker = new naver.maps.Marker({ // 4공 5공 사이
    position: new naver.maps.LatLng(37.2967604,126.8365639),
    map: map
});*/
var position1 = new naver.maps.LatLng(37.29705, 126.83667);
var homemarker = {
  // 하수도
  position: position1,
  map: map,
  icon: {
    url: "../images/home.png",
  },
};
var marker = new naver.maps.Marker(homemarker);

var polyline1 = new naver.maps.Polyline({
  map: map,
  path: [
    new naver.maps.LatLng(37.297567, 126.83671), //1공3공사이
    new naver.maps.LatLng(37.29743, 126.8368), //1공멕방쪽과1공사이
    new naver.maps.LatLng(37.2972863, 126.8368992), //1공멕방쪽
    new naver.maps.LatLng(37.297256, 126.8368274), //1공멕반쪽 조금왼쪽
    new naver.maps.LatLng(37.2969604, 126.8370333), // 5공뒷편
    new naver.maps.LatLng(37.2968655, 126.8368147), // 5공뒷편과 4공아래사이
    new naver.maps.LatLng(37.2967624, 126.8365529), // 4공아래
    new naver.maps.LatLng(37.2972, 126.83626), // 4공뒷편
    new naver.maps.LatLng(37.297315, 126.83653), // 3공4공사이
    new naver.maps.LatLng(37.29709, 126.836675), // 하수도관리
    new naver.maps.LatLng(37.296875, 126.8368147), //
  ],
});
var polyline2 = new naver.maps.Polyline({
  map: map,
  path: [
    new naver.maps.LatLng(37.297567, 126.83671),
    new naver.maps.LatLng(37.29743, 126.8368),
    new naver.maps.LatLng(37.2972, 126.83626),
    new naver.maps.LatLng(37.297315, 126.83653),
  ],
  strokeColor: "#5347AA",
});

var locationBtnHtml =
  '<a href="#" class="btn_mylct"><span class="spr_trff spr_ico_mylct">NAVER</span></a>';

naver.maps.Event.once(map, "init_stylemap", function () {
  var customControl = new naver.maps.CustomControl(locationBtnHtml, {
    position: naver.maps.Position.TOP_LEFT,
  });

  customControl.setMap(map);

  naver.maps.Event.addDOMListener(
    customControl.getElement(),
    "click",
    function () {
      map.setCenter(new naver.maps.LatLng(37.29709, 126.836675));
      map.setZoom(19);
    }
  );
});
//////////////////////////////////////////////////////////////////

var onegongthreegong = [
  '<div class="iw_inner">',
  " <h3>1공과 3공 사이</h3>",
  "<div>선택하시려면 다시 눌러주세요</div>",
  "</div>",
].join("");

var onegong = new naver.maps.InfoWindow({
  content: onegongthreegong,
});

var bythethreegong = [
  '<div class="iw_inner">',
  " <h3> 3공 </h3>",
  "<div>선택하시려면 다시 눌러주세요</div>",
  "</div>",
].join("");

var threegong = new naver.maps.InfoWindow({
  content: bythethreegong,
});

var bythefivegong = [
  '<div class="iw_inner">',
  " <h3> 5공 </h3>",
  "<div>선택하시려면 다시 눌러주세요</div>",
  "</div>",
].join("");

var fivegong = new naver.maps.InfoWindow({
  content: bythefivegong,
});

////////////////////////포인터 설정////////////////////////////////////

// naver.maps.Event.addListener(circle1, "mouseover", function (e) {
//     map.setCursor("pointer");
//     if (onegong.getMap()) {
//     } else {
//         onegong.open(map, marker1);
//     }
//     circle1.setOptions({
//         fillOpacity: 0.8
//     });

// });

naver.maps.Event.addListener(circle1, "click", function (e) {
  map.setCursor("pointer");
  if (onegong.getMap()) {
  } else {
    onegong.open(map, marker1);
  }
  circle1.setOptions({
    fillOpacity: 0.5,
  });
  console.log("asdas");
  naver.maps.Event.addListener(circle1, "click", function (e) {
    map.setCursor("pointer");
    if (onegong.getMap()) {
    } else {
      onegong.open(map, marker1);
    }
    circle1.setOptions({
      fillOpacity: 0.5,
    });
    console.log("asdadadasdasd");
    addmenu(name, "1");
    modalopen();
    //location.href = "orderer.html";
  });
  // addmenu(name, "1")
  // location.href = "orderer.html";
});

// naver.maps.Event.addListener(circle1, "mouseout", function (e) {
// map.setCursor("auto");
// onegong.close();

// circle1.setOptions({
// fillOpacity: 0.35
// });
// });
/////////////////////////////////////
// naver.maps.Event.addListener(circle2, "mouseover", function (e) {
//     map.setCursor("pointer");
//     if (threegong.getMap()) {
//     } else {
//         threegong.open(map, marker2);
//     }
//     circle2.setOptions({
//         fillOpacity: 0.8
//     });
// });
naver.maps.Event.addListener(circle2, "click", function (e) {
  map.setCursor("pointer");
  if (threegong.getMap()) {
  } else {
    threegong.open(map, marker2);
  }
  circle1.setOptions({
    fillOpacity: 0.5,
  });
  naver.maps.Event.addListener(circle2, "click", function (e) {
    map.setCursor("pointer");
    if (threegong.getMap()) {
    } else {
      threegong.open(map, marker2);
    }
    circle1.setOptions({
      fillOpacity: 0.5,
    });
    addmenu(name, "3");
    modalopen();
  });
  // addmenu(name, "2")
  // location.href = "orderer.html";
});
// naver.maps.Event.addListener(circle2, "mouseout", function (e) {
//     map.setCursor("auto");
//     threegong.close();
//     circle2.setOptions({
//         fillOpacity: 0.35
//     });
// });
///////////////////////////////////////////////////
// naver.maps.Event.addListener(circle3, "mouseover", function (e) {
//     map.setCursor("pointer");
//     if (fivegong.getMap()) {
//     } else {
//         fivegong.open(map, marker3);
//     }
//     circle3.setOptions({
//         fillOpacity: 0.8
//     });
// });
naver.maps.Event.addListener(circle3, "click", function (e) {
  map.setCursor("pointer");
  if (fivegong.getMap()) {
  } else {
    fivegong.open(map, marker3);
  }
  circle1.setOptions({
    fillOpacity: 0.5,
  });
  naver.maps.Event.addListener(circle3, "click", function (e) {
    map.setCursor("pointer");
    if (fivegong.getMap()) {
    } else {
      fivegong.open(map, marker3);
    }
    circle1.setOptions({
      fillOpacity: 0.5,
    });
    addmenu(name, "5");
    modalopen();
  });
  // addmenu(name, "3")
  // location.href = "orderer.html";
});
// naver.maps.Event.addListener(circle3, "mouseout", function (e) {
//     map.setCursor("auto");
//     fivegong.close();
//     circle3.setOptions({
//         fillOpacity: 0.35
//     });
// });

// naver.maps.Event.addListener(onegong, "mouseover", function (e) {
//     console.log("제발")
//     map.setCursor("pointer");
//     $("#menu1").on("click", function () {
//         addmenu(name, 1)
//     });
// });
/////////////////////////////////////////////////////////////
