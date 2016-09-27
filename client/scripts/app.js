  var app = {
    server: 'https://api.parse.com/1/classes/messages',
    $messages: $('.messages'),
    $username: $('.username')
  };

$(document).ready(function() {
  app.username = window.location.search.split('').slice(10).join('');
  // GO BETTER UNDERSTAND INPUT AND HOW IT RELATES TO FORMS / BUTTONS / SUBMISSION
  $('.submit').on('click', function(event) {
    var text = $('.message').val();
    var message = {
      username: app.username,
      text: text,
      roomname: undefined
    };
    app.send(message);
    app.renderMessage(message, true);
    event.preventDefault();
  });
  app.friendsList = {}

  $('.clear').on('click', function() {
    app.clearMessages();
  });


  //BETTER UNDERSTAND EVENT BINDING - ON VS DELEGATE

  $('body').delegate('.usernameInMessage', 'click', function() {
    var user = $(this).text();
    var userName = user.split('').slice(1).join('');
    app.friendsList[userName] = userName;
    $('.messages:contains('+user+')').attr('class', 'friend messages');
  });
});

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
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.fetch = function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: {},
      success: function (data) {
        data.results.forEach(function (data) {
          app.renderMessage(data);
        });
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  };

  app.clearMessages = function() {
    $('.chats').children().remove();
  };

  //Learn to understand and organize appended DOM elements
  app.renderMessage = function(message, internal) {

    $('.chats')

    ('<div class=messages ' + moment(message.createdAt).format('MMM Do, h:mm: a') + 
        '><button class=usernameInMessage>' + '@' + message.username + 
        '</button> <span class=textInMessage>' + ': ' + message.text + 
        '</span> <div class=timeInMessage>' + moment(message.createdAt).format('MMM Do, h:mm: a') + '</div> </div>').text();
  };


  app.renderRoom = function(roomName) {
    $('.roomSelect').append('<option>' + roomName + '</option>');
  };

  var parseRequest = app.fetch();