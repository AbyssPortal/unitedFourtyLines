main().then(() => {


});


async function main() {
    const tetrioData = await getTetrioLeaderboards();

    const tetrioStandard = tetrioData.data.records.map(standardizeTetrio);
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
    res.time = record.endcontext.finalTime / 1000;
    // res.pieces = record.endcontext.piecesplaced;
    // res.pps = res.pieces / res.time;
    // res.keys = record.endcontext.inputs;
    // res.kpp = res.keys / res.pieces;
    // ^^ commented out because jstris dosen't support this ^^
    res.username = record.user.username;
    res.url = "https://tetr.io/#r:" + record.replayid;
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


async function getTetrioLeaderboards() {
    let url = "https://ch.tetr.io/api/streams/40l_global";
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

async function getJstrisLeaderboards() {
    let url = "https://jstris.jezevec10.com/api/leaderboard/1?mode=1&offset=0";
    let response = await fetch(url);
    let data = await response.json();
    return data;
}