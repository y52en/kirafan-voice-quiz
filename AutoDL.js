// // https://database.kirafan.cn/database/NamedList.json?t=1613393063603


// const fs = require('fs');
// let db_text = fs.readFileSync("https://database.kirafan.cn/database/NamedList.json");


// console.log(db_text);

// let https = require('https');
// const URL = '取得するJSONのURL';
// https.get(URL, function (res) {
// });

let isBeforeExitAlreadyFired = false;

process.on('beforeExit', (code) => {
    // beforeExit を1回しか実行させないためのガード条件
    if (isBeforeExitAlreadyFired) {
        return;
    }
    isBeforeExitAlreadyFired = true;
    main()

})


async function main() {
    let https = require('https');
    let fs = require('fs');

    const URL = 'https://database.kirafan.cn/database/NamedList.json';

    // console.log(URL);

    let data = [];
    let db;
    await https.get(URL, function (res) { 
        res.on('data', function (chunk) {
            data.push(chunk);
        }).on('end', async function () {
            let events = Buffer.concat(data);
            db = JSON.parse(events);
            // console.log(db);
            
        // })

            await db.forEach(async chara => {
                let id = chara["m_ResouceBaseName"]

                let path = `./downloadedVoice/voice_${id}_000_0.mp3`
                if (fs.existsSync(path) === false) {
                    // https://cri-asset.kirafan.cn/Voice_Anima_Hizume/voice_000_0.mp3
                    let url = `https://cri-asset.kirafan.cn/Voice_${id}/voice_000_0.mp3`;

                    let outFile = fs.createWriteStream(path);

                    let req =
                        https.get(url, function (res) {
                            res.pipe(outFile);
                            res.on('end', function () {
                                outFile.close();
                            });
                        });
                    req.on('error', function (err) {
                        console.log('Error: ', err); return;
                    });

                }

            });

        })
    });


}

process.on('exit', (code) => {
    console.log('Process exit event with code: ', code);
});