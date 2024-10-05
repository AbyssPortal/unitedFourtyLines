main().then(() => {


});


async function main() {
    const tetrioData = await getTetrioLeaderboards();

    const tetrioStandard = tetrioData.map(standardizeTetrio);
    const jstrisData = await getJstrisLeaderboards();
    const jstrisStandardNull = jstrisData.map(standardizeJstris);
    const jstrisStandard = jstrisStandardNull.filter((game) => game.username != null)

    const jstrisUnique = jstrisStandard.filter((game) => {
        const matchingTetrio = tetrioStandard.find((tetrioGame) => tetrioGame.username.toLowerCase() == game.username.toLowerCase())
        if (matchingTetrio != undefined && matchingTetrio.time < game.time) {
            return false;
        }
        return true;
    })

    const tetrioUnique = tetrioStandard.filter((game) => {
        const matchingJstris = jstrisStandard.find((jstrisGame) => jstrisGame.username.toLowerCase() == game.username.toLowerCase())
        if (matchingJstris != undefined && matchingJstris.time < game.time) {
            return false;
        }
        return true;
    })


    console.log(JSON.stringify(tetrioUnique.concat(jstrisUnique).sort((a,b) => a.time - b.time)));

}

function standardizeTetrio(record) {
    let res = {};
    res.time = record.results.stats.finaltime /1000;
    // res.pieces = record.endcontext.piecesplaced;
    // res.pps = res.pieces / res.time;
    // res.keys = record.endcontext.inputs;
    // res.kpp = res.keys / res.pieces;
    // ^^ commented out because jstris dosen't support this ^^
    res.username = record.user.username;
    res.url = "https://tetr.io/#R:" + record.replayid;
    res.platform = "tetrio"
    return res;
}

function standardizeJstris(record) {
    let res = {};
    res.time = record.game;
    res.username = record.name;
    res.url = "https://jstris.jezevec10.com/replay/" + record.id;
    res.platform = "jstris"
    return res;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getTetrioLeaderboards() {

    let url = "https://ch.tetr.io/api/records/40l_global";
    let session = (new Date() / 1000) + "_UNITED_FORTY_LINES";
    let options = {
        headers: {
            'X-Session-ID': session,
        }
    };
    let res = [];
    for (let i = 0; i < 10; i++) {
        if (i == 0) {
            let curr_url = url + "?limit=100";
            let response = await fetch(curr_url, options);
            if (response.ok) {
                let data = await response.json();
                res = res.concat(data.data.entries);
            } else {
                console.log("HTTP-Error: " + response.status);
            }
            await sleep(1000);
            continue;
        }
        let after_parm = "?after="  + res[res.length - 1].p.pri + ":" + res[res.length - 1].p.sec + ":" + res[res.length - 1].p.ter;
        let curr_url = url + after_parm + "&limit=100"  ;
        let response = await fetch(curr_url, options);
        if (response.ok) {
            let data = await response.json();
            res = res.concat(data.data.entries);
        } else {
            console.log("HTTP-Error: " + response.status);
        }
        await sleep(1000);
    }
    return res;
}

async function getJstrisLeaderboards() {
    let url = "https://jstris.jezevec10.com/api/leaderboard/1?mode=1&offset=0";
    let response = await fetch(url);
    let data = await response.json();
    return data;
}
