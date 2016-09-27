var app = {
  server: 'https://api.parse.com/1/classes/messages'
};


app.username = window.location.search.split('').slice(10).join('');
// GO BETTER UNDERSTAND INPUT AND HOW IT RELATES TO FORMS / BUTTONS / SUBMISSION
$('button').on('click', function(event) {
  var text = $('.message').val();
  var message = {
    username: app.username,
    text: text,
    roomname: undefined
  };
  app.send(message);
  app.renderMessage(message);
  event.preventDefault();
});

$('.clear').on('click', function() {
  app.clearMessages();
});


var messageFormatter = function () {

};


app.init = function () {

};
app.send = function(message) {
  $.ajax({
 // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  var chatData;
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    data: {'order': '-createdAt'},
    success: function (data) {
      data.results.forEach(function (data) {
        if ($('.rooms').data().rooms === data.roomname) {
          console.log(data);
          app.renderMessage(data);
        }
      });
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message', data);
    }
  });

  return chatData;
};

app.clearMessages = function() {
  $('.chats').children().remove();
};

app.renderMessage = function(message) {
  console.log(moment(message.createdAt).format('MMM Do, h:mm: a'));
  $('.chats')
    .append('<div class=messages ' + moment(message.createdAt).format('MMM Do, h:mm: a') + 
      '><button class=usernameInMessage>' + '@' + message.username + 
      '</button> <span class=textInMessage>' + ': ' + message.text + 
      '</span> <span class=timeInMessage>' + ': ' + moment(message.createdAt).format('MMM Do, h:mm: a') + '</span> </div>');
    

};


app.renderRoom = function(roomName) {
  $('.roomSelect').append('<option>' + roomName + '</option>');
};

var parseRequest = app.fetch();

