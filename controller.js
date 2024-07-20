let peer = new Peer('driverless-controller');
let conn;

peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
});

peer.on('call', answerCall);
peer.on('connection', connection => {
  console.log('connection');
  conn = connection;

  conn.on('open', () => {
    $('#updates').prepend(`Connected to ${conn.peer}<br>`);
  });

  conn.on('data', function(data){
    console.log(data);
  });
  
  conn.on('close', () => { $('#updates').prepend('Connection closed<br>'); });
  conn.on('error', err => { $('#updates').prepend('Connection error<br>'); });
});


function answerCall(call) {
  // Answer the call and send our own audio stream
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    call.answer(stream);

    // When we receive the remote stream, play it in the audio element
    call.on('stream', (remoteStream) => {
      const audioElement = document.getElementById('audio');
      audioElement.srcObject = remoteStream;
      audioElement.play();
    });
  }).catch((err) => {
    console.error('Failed to get local stream', err);
  });
}

$('#send').click(() => {
  let txt = $('#msg').val();
  if (txt && conn) {
    conn.send({ type: 'speak', data: txt});
    console.log(`sending ${txt}`);
  }
});