var fs = require('fs');
var ytdl = require('ytdl-core');
var express = require('express');
var app = express();


const PORT = process.env.PORT || 3000;


app.use('/', express.static('static'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/html/index.html');
})

app.get('/process', (req, res) => {
    var youtube_url = youtube_parser(req.query.url);                                        // 유튜브 영상 id 가져오기

    
    ytdl.getInfo(`https://www.youtube.com/watch?v=${youtube_url}`)                          // 영상 정보 가져오기
    .then(info => {
        var title = info.videoDetails.title;                                                // 영상 제목 변수에 저장
        title = replaceSpecialChars(title);                                                 // 영상 제목 특수문자 제거
        var audioFiles = fs.readdirSync(__dirname + '/static/audio/');                      // 오디오 저장하는 디렉토리 스캔

        if (audioFiles.includes(`${youtube_url}`)) {                                              // 오디오를 저장하는 폴더에 같은 영상이 있으면
            res.send(sendDownloadRedirect(`/audio/${youtube_url}.wav`, `${title}.wav`));          // 기존에 있던 파일로 다운로드
        } else {                                                                            // 아니면
            ytdl(`https://www.youtube.com/watch?v=${youtube_url}`, { filter: 'audioonly'})  // 파일 새로 다운받고 새로운 파일로 다운로드
            .pipe(fs.createWriteStream(`${__dirname}/static/audio/${youtube_url}.wav`));
            res.send(sendDownloadRedirect(`/audio/${youtube_url}.wav`, `${title}.wav`));
        }
    })
})


app.listen(PORT, () => {
    console.log('Listening on port', PORT);
})

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function sendDownloadRedirect(downloadURL, downloadName) {
    return `
    <script>
        try {
            var a = document.createElement("a");
            a.href = "${downloadURL}
            a.download = "${downloadName}"
            a.click();

            alert("성공적으로 다운로드를 마쳤습니다");
            location.href = '/'
        } catch (e) {
            alert(e.toString());
        }
    </script>
    `;
}

/**
 * @param {String} str String
 */
function replaceSpecialChars(str) {
    str = str.toString();
    return str.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi, '');
}