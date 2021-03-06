var socket = io();

var name = getQueryVariable('name') || 'Anonymous';
var group  = getQueryVariable('group');


console.log(name + ' wants to join ' + group );

jQuery('.chat-group-title').text(group);

socket.on('connect',function () {
    console.log('sucessfully connected to socket.io');
    socket.emit('joingroup',{
        name: name,
        group: group
    });
});


socket.on('message',function (message) {

    var timestamp = moment.utc(message.timestamp);


    console.log('new message : ' + message.text );
    jQuery('.message-display').append('<p>'+'<strong>' + message.name + ' ' + timestamp.format('h:mm a') + '<br/>' + '</strong>' + message.text + '</p>');

});

//handles sumbitting of new file
var $form = jQuery('.form-horizontal');

$form.on('submit',function (event) {
    event.preventDefault();
    $message = $form.find('input[name=message]');

    socket.emit('message',{
        text: $message.val(),
        name: name
    });
    $message.val('');

});


