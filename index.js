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



const X_SIZE = window.innerWidth;
const Y_SIZE = window.innerHeight;
const LENGTH = 80;
const PLANE_SCALE = 20;
// const plane = [];


let geometry = new THREE.BoxGeometry( PLANE_SCALE,PLANE_SCALE, PLANE_SCALE ); // plane ってなってるがboxGeometryに変えてる(遊び中
let material = new THREE.MeshBasicMaterial({
    color: 'black',
    side: THREE.DoubleSide,
    opacity: 0.7,
    transparent: true
});

const planes = [...new Array(80)].map(()=>{
    const plane = new THREE.Mesh(geometry, material)

    plane.position.x = X_SIZE * (Math.random() - 0.5);
    plane.position.y = Y_SIZE * (Math.random());
    plane.position.z = X_SIZE * (Math.random() - 0.5);
    scene.add( plane );

    return plane
})


/*

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial()
    const cubes = [...new Array(70)].map(() => {
        const cube = new THREE.Mesh(geometry, material)
        cube.scale.set(0.5, 0.5, 0.5)
        cube.position.set(
            4 * Math.random() - 2,
            4 * Math.random() - 2,
            4 * Math.random() - 2
        )
        scene.add(cube)
        cube.castShadow = true
        cube.receiveShadow = true
        return cube
    })

 */




function random(min, max) {
    let rand = Math.floor((min + (max - min + 1) * Math.random()));
    return rand;
}

const tick = function () {
    for(let plane of planes ){
        plane.rotation.y += (Math.random()*0.1);
        plane.rotation.x += (Math.random()*0.1);
        plane.rotation.z += (Math.random()*0.1);

        plane.position.x += (random(-5, 5)*0.1);
        plane.position.y += 2.5;
        plane.position.z += (random(-5, 5)*0.1);

        if (plane.position.y > height) {
            plane.position.x = X_SIZE * (Math.random() - 0.5);
            plane.position.y = -10;
            plane.position.z = X_SIZE * (Math.random() - 0.5);
        }
    }
    renderer.render(scene, controlCamera);
    requestAnimationFrame(tick);
}

tick();
