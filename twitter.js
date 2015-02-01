var Twit = require('twit');
var io = require('./app').io;
var config = require('./config')
var FeedParser = require('feedparser');
var http = require('http');
var selected_default = require('./app').selected_default;

// Starting with no requests and bunny default, over
var current_song;
var requested_list = [];
var default_list = [{id: "GVFWai1jVfs", time: "43", title: "30 Second Bunnies: Terminator"}];
var shuffle = false;

//Connection to twitter
var T = new Twit({
    consumer_key: config.twitter_api_key,
    consumer_secret: config.twitter_api_secret,
    access_token: config.twitter_access_token,        
    access_token_secret: config.twitter_access_token_secret 
});

// Initializes and starts twitter stream
var stream = T.stream('user', {track: config.twitter_account });

function sendLoadPlaylist() {
  io.sockets.emit('get_selected_default');    
}

fillDefault();

//Connection to the browser
io.sockets.on('connection', function (socket) {

  socket.on('disconnect', function (socket) {
    console.log("disconnected a client");
  });

  socket.on('next_song', function (data) {
    playNext();
  });

  socket.on('load_playlist', function(data) {
    sendLoadPlaylist();
  });

  socket.on('current_song', function(data) {
    socket.emit('current_song', current_song);
  });

  socket.on('add_song_to_start', function(data) {
    ytSearch(data.q, function (r) {
      requested_list.unshift(r);
      sendLoadPlaylist();
    });
  });

  socket.on('add_song_to_end', function(data) {
    ytSearch(data.q, function (r) {
      requested_list.push(r);
      sendLoadPlaylist();
    });
  });

  socket.on('update_playlist', function(data) {
    if (requested_list.length > 0) {
      requested_list = data; 
    } else {
      default_list = data; 
    }
    sendLoadPlaylist();
  });
  
  socket.on('shuffle_status', function(data) {
    setShuffle();
  });
  
  
});

function setShuffle() {
  if(shuffle){ shuffle = false; }
  else { shuffle = true; }
}

function playNext() {
  if (requested_list.length > 0) {
    sendRequested();
  } else {
    sendDefault();
  }
  sendLoadPlaylist();
}

function sendLoadPlaylist() {
  io.sockets.emit('load_playlist', activePlaylist());    
}

function sendDefault() {
  if(shuffle) {
	current_song = default_list[Math.floor(Math.random()*default_list.length)];
  }else {
	current_song = default_list.shift();
  }
  io.sockets.emit('next_song', current_song);
  default_list.push(current_song);
}

function sendRequested() {
  current_song = requested_list.shift();
  io.sockets.emit('next_song', current_song);
}

function activePlaylist() {
  if (requested_list.length > 0) {
    return requested_list;
  } else {
	if(default_list.length == 0) {
		fillDefault();
	}
    return default_list;
  }
}

stream.on('tweet', function(tweet) {
  if (tweet.entities.user_mentions.length > 0) {
    console.log(tweet.text);
    var removeName = RegExp("@"+config.twitter_account, 'gi');
    var songName = tweet.text.replace(removeName, "");
    console.log(songName);
    ytSearch(songName, function (r) {
      requested_list.push(r);
      sendLoadPlaylist();
    });
  } else {

  }
});

function fillDefault() {
	if(selected_default.length > 0) {
		default_list = require('./setPlaylist').setPlaylist(selected_default);
		if(default_list.length == 0){
			billboardDefault();
		}
	}else {
		billboardDefault();
	}
}

// PRIMARY DATA SOURCES
function billboardDefault() {
  http.get('http://www.billboard.com/rss/charts/hot-100', function (res) {
    default_list = [];
    res.pipe(new FeedParser({}))
    .on('readable', function() {
      var stream = this, item;
      while (item = stream.read()){
        var songName = item["rss:chart_item_title"]["#"] + " " + item["rss:artist"]["#"];
        ytSearch(songName, function (r) {
          default_list.push(r);
          sendLoadPlaylist();
        });
      }
    });
  });
}

function ytSearch(songName, dataFun) {
  songName = songName.split(" ").join("+");
  http.get('http://gdata.youtube.com/feeds/api/videos?q=' + songName  + '&max-results=1&v=2', function (res) {
    res.pipe(new FeedParser({})).on('readable', function(){
      var stream = this, item;
      while (item = stream.read()){
        var vID = item.guid.substr(item.guid.lastIndexOf(":") + 1);
        var vTime = item['media:group']['yt:duration']['@'].seconds;
        var vTitle = item['media:group']['media:title']['#'];
        var val = ({id: vID, time: vTime, title:vTitle});
        dataFun(val);
      }
    });
  });
}
