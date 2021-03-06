function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$(document).ready(function() {
    var socket = io.connect("/websocket");
    let voteBorder = "black solid 20px";

    // Server --> Client
    socket.on('msg', function(msg) {
        $("#chat-room").prepend('<p>' + msg.msg + '</p>');
    });

    socket.on('uuid', function(msg) {
        if (getCookie('uuid') == "") {
            document.cookie = 'uuid='+msg.uuid;
        }
    });

    socket.on('candidate', function(msg) {
        $("#current-candidate").html(msg.candidate);
    });

    socket.on('reset', function(msg) {
        $('#vote-yes').css('border', 'none');
        $('#vote-no').css('border', 'none');
    });


    socket.on('vote', function(msg) {
        // Calculate percentage
        var yes_num = Number(msg.yes_vote_count);
        var no_num = Number(msg.no_vote_count);
        var sum = yes_num + no_num;
        var yes_fraction = (yes_num / sum) * 100;
        var no_fraction = (no_num / sum) * 100;
        if (isNaN(no_fraction) || isNaN(yes_fraction)) {
            $("#yes-bar").width("0%")
            $("#no-bar").width("0%")
            $("#yes-vote-count").hide();
            $("#no-vote-count").hide();
        } else {
            var yes_fraction_string = yes_fraction.toString().concat("%");
            var no_fraction_string = no_fraction.toString().concat("%");
            $("#yes-bar").width(yes_fraction_string);
            $("#no-bar").width(no_fraction_string);
            $("#yes-vote-count").html(msg.yes_vote_count);
            $("#no-vote-count").html(msg.no_vote_count);
            $("#yes-vote-count").show();
            $("#no-vote-count").show();
        }
    });

    // Client --> Server
    $('#vote-yes').click(function(){
        socket.emit('vote', {uuid: getCookie('uuid'), vote: 'Yes'}, (data) => {
            if (data == 0) {
                $(this).css('border',voteBorder);
                $('#vote-no').css('border', 'none');
            }
        });
    });

    $('#vote-no').click(function(){
        socket.emit('vote', {uuid: getCookie('uuid'), vote: 'No'}, (data) => {
            if (data == 0) {
                $(this).css('border',voteBorder);
                $('#vote-yes').css('border', 'none');
            }
        });
    });

    $('#candidate-form').bind('submit', function(){
        socket.emit('candidate', {candidate: $('#current-candidate-input').val()});
        socket.emit('vote_reset', {});
    });

    $('#vote-reset').click(function(){
        socket.emit('vote_reset', {});
    });

    $('#msg-form').submit(function(){
        if ($("#name-input").val() == "") {
            name = "anonymous";
        } else {
            name = $("#name-input").val() ;
        }
        msg = name + ": " + $('#msg-input').val() + " (for candidate " + $("#current-candidate").text() + ")";
        socket.emit('msg', {'msg': msg});
        $('#msg-input').val('');
        return false;
    });
});
