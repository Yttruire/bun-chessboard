// Access <body>
const body = document.querySelector('body');

// Access the data attribute to retrieve gameId and orientation
const gameId = body.dataset.gameid;
const orientation = body.dataset.orientation;

console.info(`gameId: ${gameId}, orientation: ${orientation}`);

// Handle onDrop
const onDrop = (src, dst, piece) => {
    console.info(`src: ${src}, dst: ${dst}, piece: ${piece}`);

    // Construct the move object
    const move = { src, dst, piece };

    // PATCH /chess/:gameId
    fetch(`/chess/${gameId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(move)
    })
    .then(res => console.info('RESPONSE: ', res))
    .catch(err => console.error('ERROR: ', err));

}

// Create a chess configuration
const config = {
    draggable: true,
    position: 'start',
    orientation,
    onDrop
};

//Create an instance of chess
const chess = Chessboard('chess', config);

// Create an SSE connection
const sse = new EventSource('/chess/stream')
sse.addEventListener(gameId, msg => {
    console.info('>>> SSE msg: ', msg);
    const { src, dst, piece } = JSON.parse(msg.data);
    console.info(`src: ${src}, dst: ${dst}, piece: ${piece}`);
    chess.move(`${src}-${dst}`);
})