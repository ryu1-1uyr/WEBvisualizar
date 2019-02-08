let source, animationId;
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext;

let analyser = audioContext.createAnalyser();
analyser.fftSize = 128;
analyser.connect(audioContext.destination);

let gainNode = audioContext.createGain();
gainNode.connect(analyser);

let audioTag = document.getElementById('usermusic');
let pausebtn = document.getElementById('mplaypause');

source = audioContext.createMediaElementSource(audioTag);
source.connect(gainNode);

function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function execDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    audioContext.resume().then(() => {
        console.log('Playback resumed successfully');
    });

    pausebtn.setAttribute('src' , 'img/Orion_play.png');

    let files = e.dataTransfer.files;
    let mimecheck = files[0].type;

    if (mimecheck.startsWith('audio')) {
        pausebtn.style.display = 'inline';
        document.getElementById('output').innerHTML = files[0].name;
        let audiourl = URL.createObjectURL(files[0]);
        audioTag.setAttribute('src' , audiourl);
        // document.querySelector('body').style.backgroundImage = 'url(img/landscape.jpg)';
        // document.getElementById('lpimg').setAttribute('src' , 'img/lpimg.png');
    }
}

let isPlay = false;

pausebtn.addEventListener('click', function(event){
    if (!isPlay) {
        audioTag.play();
        pausebtn.setAttribute('src' , 'img/Orion_pause.png');
    } else {
        audioTag.pause();
        pausebtn.setAttribute('src' , 'img/Orion_play.png');
    }
    isPlay = !isPlay;
});

let canvas = document.getElementById('visualizer');
let canvasContext = canvas.getContext('2d');
canvas.setAttribute('width', analyser.frequencyBinCount * 10);

function render(){
    let spectrums = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(spectrums);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0, len=spectrums.length; i<len; i++){

        canvasContext.fillStyle = 'rgba(255, 255, 255, 0.7)';
        if (i%3 === 0){
            canvasContext.fillRect(i*10, 80, 4, spectrums[i]/6);
            canvasContext.fillRect(i*10, 70, 4, 10);
            canvasContext.fillRect(i*10, 70, 4, -(spectrums[i]/6));
        } else if (i%5 === 0) {
            canvasContext.fillRect(i*10, 80, 4, spectrums[i]/2);
            canvasContext.fillRect(i*10, 70, 4, 10);
            canvasContext.fillRect(i*10, 70, 4, -(spectrums[i]/2));
        } else {
            canvasContext.fillRect(i*10, 80, 4, spectrums[i]/5);
            canvasContext.fillRect(i*10, 70, 4, 10);
            canvasContext.fillRect(i*10, 70, 4, -(spectrums[i]/5));
        }
    }
    animationId = requestAnimationFrame(render);
};
render();