var fs = require('fs');
var ytdl = require('ytdl-core');
var express = require('express');
var id = require('short-id');
var app = express();


const PORT = process.env.PORT || 5000;


app.use('/', express.static('static'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/html/index.html')
})

app.get('/process', (req, res) => {
    var youtube_url = youtube_parser(req.query.url)
    var gen_id = id.generate()
    var ytdl_pipe = ytdl(`https://www.youtube.com/watch?v=${youtube_url}`, { filter: 'audioonly'})
    .pipe(fs.createWriteStream(`${__dirname}/static/audio/${gen_id}.mp3`))
    
    ytdl.getInfo(`https://www.youtube.com/watch?v=${youtube_url}`)
    .then(info => {
        res.send(`
        <script>
            try {
                var a = document.createElement("a");
                a.href = "/audio/${gen_id}.mp3"
                a.download = "${info.videoDetails.title}.mp3"
                a.click();

                alert("성공적으로 다운로드를 마쳤습니다");
                location.href = '/'
            } catch (e) {
                alert(e)
            }
        </script>
        `)
    })
})


app.listen(PORT, () => {
    console.log('Listening on port', PORT)
})

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}