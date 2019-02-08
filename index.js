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

    // console.log(spectrums)

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


////////////////

const width = window.innerWidth;
const height = window.innerHeight;


// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: document.querySelector('#myCanvas')
});

renderer.setSize(width, height)
renderer.setClearColor(0x222222)
renderer.shadowMap.enabled = true
renderer.shadowMapType = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

// シーンを作成
const scene = new THREE.Scene();

// カメラを作成
const camera = new THREE.PerspectiveCamera(70, width / height, 1, 6000);
camera.position.set(1000, 500000, 150000);
camera.lookAt(scene.position);

const light = new THREE.DirectionalLight(0xffffff)
light.position.set(2, 4, 1)
scene.add(light)
light.castShadow = true
light.shadowMapWidth = light.shadowMapHeight = 1024

//ガイド線
// let gridHelper = new THREE.GridHelper(width, 5); // サイズ, 分割数
// scene.add(gridHelper);
//
// let axisHelper = new THREE.AxisHelper(width); // サイズ
// scene.add(axisHelper);

renderer.render(scene, camera);

// コントロールカメラ
let controlCamera = new THREE.PerspectiveCamera(35, width / height, 1, 6000);
controlCamera.position.set(0, 1600, 1600);
let controls = new THREE.OrbitControls(controlCamera);



const X_SIZE = window.innerWidth;
const Y_SIZE = window.innerHeight;
const PLANE_SCALE = 20;

let geometry = new THREE.BoxGeometry( PLANE_SCALE,PLANE_SCALE, PLANE_SCALE ); // plane ってなってるがboxGeometryに変えてる(遊び中
let material = new THREE.MeshPhongMaterial({
    // color: 'black',
    // side: THREE.DoubleSide,
    // opacity: 0.4,
    // transparent: true
});


const planes = [...new Array(64)].map(()=>{
    const plane = new THREE.Mesh(geometry, material)

    plane.position.x = 0
    plane.position.y = Y_SIZE * (Math.random());
    plane.position.z = 0

    // plane.position.set(
    //     800 * Math.random() - 2,
    //     800 * Math.random() - 2,
    //     800 * Math.random() - 2
    // )
    scene.add( plane );

    return plane
})

function random(min, max) {
    let rand = Math.floor((min + (max - min + 1) * Math.random()));
    return rand;
}

const tick = function () {
    let spectrums = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(spectrums);


    console.log(spectrums)

    let counter = 0

    // if (spectrums[57] > 57) {
    //     for(let plane of planes ){
    //         // plane.scale.set(spectrums[counter]/30 || 1,spectrums[counter]/30 || 0.2,spectrums[counter]/700 || 1)
    //         plane.position.x += (spectrums[counter]/700 * 0.1);
    //         plane.position.z += (spectrums[counter]/600 * 0.1);
    //         plane.position.y += 2.5;
    //
    //         // plane.material.color.setHex(0x777777);
    //
    //         if (plane.position.y > height) {
    //             plane.position.x = 0
    //             plane.position.y = -20;
    //             plane.position.z = 0
    //         }
    //
    //     }
    // } else {

    for (let plane of planes) {
        // plane.material.color.setHex(0x000000);

        plane.rotation.y += (Math.random()*0.01) * (counter%2?-1:1);
        // plane.rotation.x += (Math.random()*0.01);
        // plane.rotation.z += (Math.random()*0.01);

        plane.position.x += (random(-5, 5)*0.01);
        // plane.position.y += 2.5;
        plane.position.z += (random(-5, 5)*0.01);


        // plane.rotation.y += (Math.random() * 0.03 *(Math.random()*10 > 5?-1:1));
        // plane.rotation.x += (Math.random() * 0.1);
        // plane.rotation.z += (0.1);

        // plane.position.x += (random(50, -50) * 0.1);
        // plane.position.y += 1;
        // plane.position.z += (random(50, -50) * 0.1);

        // const x = plane.position.x
        // const y = plane.position.y
        // const z = plane.position.z
        // let w, dx = 0, dy = 0, dz = 0
        // w=1/(1+2*(z-0.3)*(z-0.3)); dx+=-w*y; dy+=+w*x
        // w=1/(1+2*(z+0.3)*(z+0.3)); dx+=+w*y; dy+=-w*x
        // w=1/(1+8*(x-0.2)*(x-0.2)); dy+=-w*z; dz+=+w*y
        // w=1/(1+8*(y+0.1)*(y+0.1)); dz+=-w*x; dx+=+w*z
        // plane.position.x += 0.01 * dx
        // plane.position.y += 0.01 * dy
        // plane.position.z += 0.01 * dz

        plane.scale.set(spectrums[counter] /10 || 1, spectrums[counter] /250||0.5, spectrums[counter] /10 ||1,)

        if (plane.position.y > height) {
            // plane.position.x = random(- spectrums[counter], spectrums[counter])
            plane.position.y = -20;
            // plane.position.z = random(- spectrums[counter], spectrums[counter])
        }
        // if (plane.position.y < 0) {
        //     // plane.position.x = random(- spectrums[counter], spectrums[counter])
        //     plane.position.y = -20;
        //     // plane.position.z = random(- spectrums[counter], spectrums[counter])
        // }
        // if (plane.position.x > -width || plane.position.x < width) {
        //     plane.position.x = 0
        // }
        counter++
    }
// }
    renderer.render(scene, controlCamera);
    requestAnimationFrame(tick);
}

tick();
