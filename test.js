var ytdl = require('ytdl-core');

ytdl.getInfo('https://www.youtube.com/watch?v=HYfkUCKiVGw')
.then(function(info) {
    console.log(info.videoDetails.title)
})