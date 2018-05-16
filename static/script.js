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
    var url = "http://" + document.domain + ":" + location.port;
    var socket = io.connect(url + "/app");

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

    socket.on('vote', function(msg) {
        $("#yes-vote-count").html(msg.yes_vote_count);
        $("#no-vote-count").html(msg.no_vote_count);
    });

    // Client --> Server
    $('#vote-yes').click(function(){
        socket.emit('vote', {uuid: getCookie('uuid'), vote: 'Yes'});
    });

    $('#current-candidate-input').bind('input', function(){
        socket.emit('candidate', {candidate: $(this).val()});
    });

    $('#vote-no').click(function(){
        socket.emit('vote', {uuid: getCookie('uuid'), vote: 'No'});
    });

    $('#vote-reset').click(function(){
        socket.emit('vote_reset', {});
    });

    $('#vote-undo').click(function(){
        socket.emit('vote_undo', {'uuid': getCookie('uuid')});
    });

    $('#msg-form').submit(function(){
        if ($("#name-input").val() == "") {
            name = "anonymous";
        } else {
            name = $("#name-input").val() ;
        }
        msg = name + ": " + $('#msg-input').val()
        socket.emit('msg', {'msg': msg});
        $('#msg-input').val('');
        return false;
    });
});
