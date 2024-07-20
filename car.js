let peer = new Peer('driverless-car');
let conn;

peer.on('open', (id) => {
  $('#updates').prepend(`My ID is: ${id}<br>`);
});

function handleMsg(msg) {
  if (msg.type === 'speak') {
    speak(msg.data, 1);
  }
}

function makeCall() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const call = peer.call('driverless-controller', stream);
  }).catch((err) => {
    console.error('Failed to get local stream', err);
  });
}

$('#start').click(() => {
  $('#start').remove();
  speak('Hello', 0);

  conn = peer.connect('driverless-controller');
  conn.on('open', () => { $('#updates').prepend(`Connected to ${conn.peer}<br>`); });
  conn.on('data', handleMsg);
  conn.on('close', () => { $('#updates').prepend('Connection closed<br>'); });
  conn.on('error', err => { $('#updates').prepend('Connection error<br>'); });

  makeCall();
});


////////////////////////////////////////////////////////////////////////////////////////////// SPEECH

let selectedVoiceIndex = 9999;
let selectedVoice;

window.speechSynthesis.onvoiceschanged = function() {
  let voiceOptions = ['Ava', 'Allison', 'Samantha', 'Susan', 'Vicki', 'Kathy', 'Victoria'];
  let voices = window.speechSynthesis.getVoices();
  for (let v in voices) {
    let ind = voiceOptions.indexOf(voices[v].voiceURI);
    if (ind !== -1 && ind < selectedVoiceIndex) {
      selectedVoice = voices[v];
      selectedVoiceIndex = ind;
    }
  }
};

function speak(msg, vol) {
  $('#updates').prepend(`Speaking: ${msg}<br>`);
  const utterance = new SpeechSynthesisUtterance(msg);
  utterance.volume = vol;
  utterance.rate = 1;
  if (selectedVoice) utterance.voice = selectedVoice;
  speechSynthesis.speak(utterance);
}



