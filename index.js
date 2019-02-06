window.addEventListener('load', init);

function init(){
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

    tick();

    function tick() {
        renderer.render(scene, controlCamera);
        requestAnimationFrame(tick);
    }

}
