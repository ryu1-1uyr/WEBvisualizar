console.log("loading!")
window.addEventListener('load', init);

function init() {
    // Canvas未サポート対応
    if (!window.HTMLCanvasElement) return;

    // サイズを指定
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: document.querySelector('#myCanvas')
    });

    renderer.setClearAlpha(0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(70, width / height, 1, 6000);
    camera.position.set(0, 500, 1500);
    camera.lookAt(scene.position);

    //ガイド線
    let gridHelper = new THREE.GridHelper(width, 5); // サイズ, 分割数
    scene.add(gridHelper);

    let axisHelper = new THREE.AxisHelper(width); // サイズ
    scene.add(axisHelper);

    renderer.render(scene, camera);


// コントロールカメラ
    let controlCamera = new THREE.PerspectiveCamera(35, width / height, 1, 6000);
    controlCamera.position.set(0, 500, 1600);
    let controls = new THREE.OrbitControls(controlCamera);


// let geometry = new THREE.PlaneGeometry( 200, 200 );
// let material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// let plane = new THREE.Mesh( geometry, material );
// scene.add( plane );


const X_SIZE = window.innerWidth;
const Y_SIZE = window.innerHeight;
const LENGTH = 80;
const PLANE_SCALE = 10;
const plane = [];

for(let i=0; i<LENGTH; i++){
    let geometry = new THREE.PlaneGeometry( PLANE_SCALE, PLANE_SCALE );
    let material = new THREE.MeshBasicMaterial({
        color: 'black',
        side: THREE.DoubleSide,
        opacity: 0.7,
        transparent: true
    });
    plane[i] = new THREE.Mesh( geometry, material );

    plane[i].position.x = X_SIZE * (Math.random() - 0.5);
    plane[i].position.y = Y_SIZE * (Math.random());
    plane[i].position.z = X_SIZE * (Math.random() - 0.5);
    scene.add( plane[i] );
}

function random(min, max) {
    let rand = Math.floor((min + (max - min + 1) * Math.random()));
    return rand;
}

tick();

const width = window.innerWidth;
const height = window.innerHeight;

function tick() {
    for(let i=0; i<LENGTH; i++){
        plane[i].rotation.y += (Math.random()*0.1);
        plane[i].rotation.x += (Math.random()*0.1);
        plane[i].rotation.z += (Math.random()*0.1);

        plane[i].position.x += (random(-5, 5)*0.1);
        plane[i].position.y += 2.5;
        plane[i].position.z += (random(-5, 5)*0.1);

        if (plane[i].position.y > height) {
            plane[i].position.x = X_SIZE * (Math.random() - 0.5);
            plane[i].position.y = 0;
            plane[i].position.z = X_SIZE * (Math.random() - 0.5);
        }
    }

// コントロールカメラ
// let controlCamera = new THREE.PerspectiveCamera(35, width / height, 1, 6000);
// controlCamera.position.set(0, 500, 1600);
// let controls = new THREE.OrbitControls(controlCamera);

let rot = 0;
let mouseX = 0;

document.addEventListener("mousemove", (event) => {mouseX = event.pageX;});

tick();

function tick() {

    const targetRot = (mouseX / window.innerWidth) * 360;
    rot += (targetRot - rot) * 0.01;
    const radian = rot * Math.PI / 180;

    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 1000 * Math.cos(radian);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    for(let i=0; i<LENGTH; i++){
        plane[i].rotation.y += (Math.random()*0.1);
        plane[i].rotation.x += (Math.random()*0.1);
        plane[i].rotation.z += (Math.random()*0.1);

        plane[i].position.x += (random(-5, 5)*0.1);
        plane[i].position.y += 2.5;
        plane[i].position.z += (random(-5, 5)*0.1);

        if (plane[i].position.y > height) {
            plane[i].position.x = X_SIZE * (Math.random() - 0.5);
            plane[i].position.y = 0;
            plane[i].position.z = X_SIZE * (Math.random() - 0.5);
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

}