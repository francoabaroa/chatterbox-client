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
    success: function (data) {
      data.results.forEach(function (data) {
        if ($('.rooms').data().rooms === data.roomname) {
          app.renderMessage(data);
        }
        console.log(data);
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
  $('.chats').append('<div>' + '@' + message.username + ': ' + message.text + '</div>');
};


app.renderRoom = function(roomName) {
  $('.roomSelect').append('<option>' + roomName + '</option>');
};

var parseRequest = app.fetch();

  //console.log(parseRequest);

$(document).ready(function () {
  // serverFetch.forEach(function (value) {
  //   $('.chats').append('<div>' + '@' + value.username + value.text + '</div>');
  // });
});
