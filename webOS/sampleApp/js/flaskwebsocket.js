
function request(name) {
    var socket = io.connect("http://" + "192.168.0.10" + ":" + "5000");
    socket.emit(name);
    console.log("messge " + name + " sent");
}
function makeiframe(content, id) {
    console.log("sdasd")
    if (id == 'my_modal1') {
        $("#my_modal1").append('<iframe style="width=150%;"src="http://192.168.0.10:5000/' + content + '"></iframe>');
        modal_is = 1
    } else if (id == 'my_modal5') {
        $("#my_modal5").append('<iframe src="http://192.168.0.10:5000/"></iframe>');
        modal_is = 5
    }
}
function makeidiv(content, id) {
    console.log("sdasd")
    if (id == 'my_modal1') {
        $("#my_modal1").append('<iframe style="width=150%;"src="http://192.168.0.10:5000/' + content + '"></iframe>');
        modal_is = 1
    }
}
$(document).ready(function () {
    var socket = io.connect("http://192.168.0.10:" + 5000);

    socket.on('response', function (msg) {
        $("#received").append('<p> ' + msg.data + '</p>');
        console.log("message " + msg.data + " recieved");
        // toast(msg.text);
    });
    socket.on('toast', function (msg) {
        console.log(msg.data);

        if (msg.check == '1') {
            $("#auctions1").append('<p>' + msg.data + '님<p>');
            toast(msg.data + "님 환영합니다");
        }
        if (msg.image == '1') {
            $("#in_my_modal1").append('<a>' + msg.data + '</a>');
            $("#in_my_modal1").append('<div> &nbsp</div>');

        }
        else if (msg.image == '2') {
            if (msg.data == "camera")
                toast("트렁크를 확인합니다");
            else
                toast("풍경을 인식합니다")
        }

        else {
            toast(msg.data);
        }
    });


    $("form#broadcast").submit(function (event) {
        if ($("#input-data").val() == "") {
            return false;
        }
        socket.emit("request", { data: $("#input-data").val() });
        $("#input-data").val("");
        return false;
    });

});

$(document).ready(function () {
    var socket = io.connect("http://192.168.0.10:" + 5000);

    socket.on('eye', function (msg) {
        console.log("뭐가 문제야")
        closemodal();
        toast("사용자가 눈을 감아 프로그램을 종료합니다");
    });

});

$(document).ready(function () {
    var socket = io.connect("http://192.168.0.10:" + 5000);

    socket.on('yolo', function (msg) {
        console.log(msg.data);

        if (msg.image == '1') {
            $("#in_my_modal1").append('<a>' + msg.data + '</a>');
            $("#in_my_modal1").append('<div> &nbsp</div>');
        }
    });
});

$(document).ready(function () {
    var socket = io.connect("http://192.168.0.10:" + 5000);

    socket.on('user', function (msg) {
        console.log(msg.data);
        if (msg.check == '1') {
            $("#auctions1").append('<p>' + msg.data + '님<p>');
            toast(msg.data + "님 환영합니다");
        }
    });
});        