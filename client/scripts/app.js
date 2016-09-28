  var app = {
    server: 'https://api.parse.com/1/classes/messages',
    friendsList : {}
  };

  $(document).ready(function() {
    app.username = window.location.search.split('').slice(10).join('');
    // GO BETTER UNDERSTAND INPUT AND HOW IT RELATES TO FORMS / BUTTONS / SUBMISSION
    $('.submit').on('click', function(event) {
      var text = $('.message').val();
      var message = {
        username: app.username,
        text: text,
        roomname: 'lobby'
      };
      app.send(message);
      event.preventDefault();
    });
    
    $('.clear').on('click', function() {
      app.clearMessages();
    });

    $('.refresh').on('click', function() {
      location.reload();
    });

    $('.createRoom').on('click', function(event) {
      app.createRoom();
    });

    $('#roomSelect').change(function() { 
      var value = $(this).val();
      app.clearMessages();
      app.fetch({where: {roomname: value}});
    });


    //BETTER UNDERSTAND EVENT BINDING - ON VS DELEGATE

    $('body').delegate('.usernameInMessage', 'click', function() {
      var user = $(this).text();
      console.log(this);
      var userName = user.split('').slice(1).join('');
      app.friendsList[userName] = userName;
      $('.messages:contains(' + user + ')').attr('class', 'friend messages');
      //$(this).css({'background-color': '#F24153', 'color': 'white'});
      $(this).css({'background-color': '#F24153', 'color': 'white'});
      $('.friend').css({'background-color': '#F24153', 'color': 'white'});
      $('.friend button').css({'background-color': '#F24153', 'color': 'white'});
    });
  });


  app.createRoom = function() {
    event.preventDefault();
    var roomField = $('.roomField').val();
    var roomSelect = document.getElementById('roomSelect');
    var option = document.createElement('option');
    option.text = roomField;
    roomSelect.add(option);
    $('#roomform')[0].reset();
    app.clearMessages();
    app.fetch({where: {roomname: roomField}});
  };

  app.init = function () {
  };

  app.send = function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('success!!!!');
        app.clearMessages();
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.fetch = function(dataOption = {order: '-createdAt'}) {
    var chatData;
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: dataOption,
      success: function (data) {
        data.results.forEach(function (data) {
          app.renderMessage(data);
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message', data);
      }
    });
    return chatData;
  };

  app.clearMessages = function() {
    $('.chats').children().remove();
  };

  //Learn to understand and organize appended DOM elements
  app.renderMessage = function(message, internal) {
    var $msg = $('<div class=' + message.objectId + '></div>');
    $('.chats').append($msg);
    $($msg).addClass('messages')
    .append('<button class=usernameInMessage>' + '@' + '</button>')
    .append('<span class=textInMessage>' + '</span>')
    .append('<div class=timeInMessage>' + moment(message.createdAt).format('MMM Do, h:mm: a') + '</div>');
    $('.' + message.objectId + ' button').text('' + message.username);
    $('.' + message.objectId + ' span').text(': ' + message.text);
  };


  app.renderRoom = function(roomName) {
    $('.roomSelect').append('<option>' + roomName + '</option>');
  };

  var parseRequest = app.fetch();