// Three.js - Load .GLTF
// from https://threejsfundamentals.org/threejs/threejs-load-gltf.html

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/GLTFLoader.js';



function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    //renderer = new THREE.WebGLRenderer({  });

    renderer.setClearColor(0xffffff, 0);
    const fov = 40;
    const aspect = 1;  // the canvas default
    const near = 0.1;
    const far = 100000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 100);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 10);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.WebGLRenderer({ alpha: true })
    //scene.background = new THREE.Color(0xff0000);
    //scene.background = new THREE.Color('skyblue');

    //background.setClearColor(0xb0f442); //default

    let
        model,
        possibleAnims, // Animations found in our file
        mixer, // THREE.js animations mixer
        idle, // Idle, the default state our character returns to
        clock = new THREE.Clock(), // Used for anims, which run to a clock instead of frame rate 
        currentlyAnimating = false, // Used to check whether characters neck is being used in another anim
        raycaster = new THREE.Raycaster(), // Used to detect the click on our character
        loaderAnim = document.getElementById('js-loader');
    {
        const planeSize = 0.01;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('http://www.abc.com/sunflower.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.55;
        scene.add(mesh);

    }

    {
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 0.7;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-2, 4, 2);
        scene.add(light);
        scene.add(light.target);
    }

    function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
        const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.3;
        const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.1);
        const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
        // compute a unit vector that points in the direction the camera is now
        // in the xz plane from the center of the box
        const direction = (new THREE.Vector3())
            .subVectors(camera.position, boxCenter)
            .multiply(new THREE.Vector3(1, 0, 1))
            .normalize();

        // move the camera to a position distance units way from the center
        // in whatever direction the camera was from the center already
        camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

        // pick some near and far values for the frustum that
        // will contain the box.
        camera.near = boxSize / 100;
        camera.far = boxSize * 100;

        camera.updateProjectionMatrix();

        // point the camera to look at the center of the box
        camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
    }

    {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('https://storage.googleapis.com/hyuncello/Hallabong.gltf', (gltf) => {
            const root = gltf.scene;
            scene.add(root);
            model = gltf.scene;
            let fileAnimations = gltf.animations;

            // compute the box that contains all the stuff
            // from root and below
            const box = new THREE.Box3().setFromObject(root);

            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());

            // set the camera to frame the box
            frameArea(boxSize * 0.4, boxSize, boxCenter, camera);

            // update the Trackball controls to handle the new size
            controls.maxDistance = boxSize * 7;
            controls.target.copy(boxCenter);
            controls.update();
            scene.add(model);

            // loaderAnim.remove();

            mixer = new THREE.AnimationMixer(model);

            let clips = fileAnimations.filter(val => val.name !== 'ArmatureAction');
            possibleAnims = clips.map(val => {
                let clip = THREE.AnimationClip.findByName(clips, val.name);



                clip = mixer.clipAction(clip);
                return clip;

            });
            let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'ArmatureAction');


            idle = mixer.clipAction(idleAnim);
            idle.play();
        },

            undefined, // We don't need this function
            function (error) {
                console.error(error);
            });



    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);
        if (mixer) {
            mixer.update(clock.getDelta());
        }
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // {
    //     const objs = [];
    //     const loader = new FBXLoader();
    //     loader.load("Hallabong.fbx", model => {
    //         // model is a THREE.Group (THREE.Object3D)                              
    //         const mixer = new THREE.AnimationMixer(model);
    //         // animations is a list of THREE.AnimationClip                          
    //         mixer.clipAction(model.animations[0]).play();
    //         scene.add(model);
    //         objs.push({ model, mixer });
    //     });

    //     // animation rendering                                                      
    //     const clock = new THREE.Clock();
    //     (function animate() {
    //         // animation with THREE.AnimationMixer.update(timedelta)                
    //         objs.forEach(({ mixer }) => { mixer.update(clock.getDelta()); });
    //         renderer.render(scene, camera);
    //         requestAnimationFrame(animate);
    //     })();
    // }

}

main();

