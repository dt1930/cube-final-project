
// let nums = [5,10,15,20]
// console.log(nums.indexOf(20))


import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/OrbitControls.js';

// import Stats from './jsm/libs/stats.module.js';

let container, stats;
let camera, raycaster, renderer;
let correctUser=false;
let currentIndex;

let theta = 0;
let INTERSECTED;
let textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry( 20, 20, 20 );
const pointer = new THREE.Vector2();
const radius = 500;
const frustumSize = 1000;

let meshlist = [];
let objectlist = [];
let uploadedImage;

let canvas = document.querySelector('.webgl');




// // server side 

let userInfo={
    "name":sessionStorage.getItem('username'),
    "password":sessionStorage.getItem('password')
}
let userInfoJSON=JSON.stringify(userInfo);

window.addEventListener('load', function(){

//sending userInfo to the server
fetch('/userInfo',{
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body: userInfoJSON
})
.then(res=>res.json())
.then(data=>checkUser(data));

//checking user
function checkUser(data){
    correctUser=data.status;
    fetchingCube();
}

//fetching the cubes for the user
function fetchingCube(){
    if (correctUser){
        fetch('/userMemories').then(res=>res.json())
        .then(data=>reconstructObjects(data));

        fetch('/userMeshes').then(res=>res.json())
        .then(data=>reconstructMeshes(data));
    }
    else{
        alert("You entered a wrong password. Please go back to the login page.");
        window.location='/index.html';
    }
}

function reconstructObjects(data){
    for (let i=0; i<data.docs.length; i++){
        objectlist[data.docs[i].index] = new MemoryObject(data.docs[i].image);
        objectlist[data.docs[i].index].text = data.docs[i].text;
        // console.log(data.docs[i], "getting old cubes");
    }
}

function reconstructMeshes(data){
    // for (let i=0; i<data.docs.length; i++){
    //     const mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial() );
    //     mesh.material.color.setHex("0x"+data.docs[i].color);
    //     meshlist[data.docs[i].index] = mesh;
    // }
    for ( let i = 0; i < data.docs.length; i ++ ) {

        const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( ) );
        object.material.color.setHex("0x"+data.docs[i].color);

        object.position.x = data.docs[i].positions.x;
        object.position.y = data.docs[i].positions.y;
        object.position.z = data.docs[i].positions.z;

        object.rotation.x = data.docs[i].rotations.x;
        object.rotation.y = data.docs[i].rotations.y;
        object.rotation.z = data.docs[i].rotations.z;

        object.scale.x = data.docs[i].scales.x;
        object.scale.y = data.docs[i].scales.y;
        object.scale.z = data.docs[i].scales.z;

        meshlist[parseInt(data.docs[i].index)] = object;
        scene.add( object );

    }

    currentIndex = data.docs.length;
}

});

init();
animate();

function init() {

    console.log(meshlist);

    // container = document.createElement( 'div' );
    // document.body.appendChild( container );

    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

    // const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );

    const geometry = new THREE.BoxGeometry( 20, 20, 20 );

    const n = 300, n2 = n / 2;

    // let addButton = document.getElementById('add-button');
    let addButton = document.getElementById('input-file');

    let clickcount = 0;
    // let currentIndex = objectlist.length;

    addButton.addEventListener('change', insertPhoto);

    async function insertPhoto(e) {

        let reader=new FileReader();
        uploadedImage="";
        reader.addEventListener('load', (e) => {
            uploadedImage = e.target.result;
        })

        // console.log(uploadedImage);

        reader.readAsDataURL(this.files[0]);

        let text = prompt("Describe the picture.");

        while(!uploadedImage) {
            await(sleep(100));
        }

        let memory = new MemoryObject(uploadedImage);
        memory.text = text;
        // console.log(memory);
        // let memoryJSON=JSON.stringify(memory);
        // console.log(memoryJSON);
        let memoryInfo = {
            "name": userInfo.name,
            "image": memory.image,
            "text": memory.text,
            "index": currentIndex
        }

        let memoryInfoJSON=JSON.stringify(memoryInfo);

        fetch('/memoryInfo',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: memoryInfoJSON
        })

        objectlist[currentIndex] = memory;

        clickcount += 1;
        // console.log(clickcount);

        const mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        // const mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial() );
        // mesh.material.color.setHex("0x"+"da45cc");
        // console.log(mesh.material.color.getHexString())

        mesh.position.x = Math.random() * n - n2;
        mesh.position.y = Math.random() * n - n2;
        mesh.position.z = Math.random() * n - n2;

        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;

        mesh.scale.x = Math.random() + 0.5; // random width, depth, height
        mesh.scale.y = Math.random() + 0.5;
        mesh.scale.z = Math.random() + 0.5;

        let meshInfo = {
            "name": userInfo.name,
            "index": currentIndex,
            "color": mesh.material.color.getHexString(),
            "positions": {
                "x": mesh.position.x,
                "y": mesh.position.y,
                "z": mesh.position.z
            },
            "rotations": {
                "x": mesh.rotation.x,
                "y": mesh.rotation.y,
                "z": mesh.rotation.z
            },
            "scales": {
                "x": mesh.scale.x,
                "y": mesh.scale.y,
                "z": mesh.scale.z
            }
        }

        let meshInfoJSON=JSON.stringify(meshInfo);

        fetch('/meshInfo',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: meshInfoJSON
        })

        meshlist[currentIndex] = mesh;
        scene.add( mesh );
        currentIndex += 1

        // console.log(meshlist[0].scale.x)
        // console.log(meshlist);
        

    }

    // console.log(meshlist[1].scale.x)
    // console.log(meshlist);

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // container.appendChild( renderer.domElement );

    // stats = new Stats();
    // container.appendChild( stats.dom );

    document.addEventListener( 'pointermove', onPointerMove );

    //

    window.addEventListener( 'resize', onWindowResize );

    let controls = new OrbitControls(camera, canvas);

}

class MemoryObject{
    constructor(image){
        // this.geometry= new THREE.BoxGeometry(2,2,2);
        // this.material= new THREE.MeshBasicMaterial({map:texture});
        // this.mesh=new THREE.Mesh(this.geometry,this.material);
        // this.clock = new THREE.Clock();
        this.image = image;
        this.text = "";
    }
    // display(){
    //     scene.add(this.mesh);
    //     audio.play();
    //     audio.loop=true;
    // }
    // positionObject(){
    //     this.mesh.position.set(incrementX,incrementY,incrementZ);
    //     incrementX+=5;
    //     incrementY+=5;
    //     incrementZ+=5;
    // }

}

function onWindowResize() {

    const aspect = window.innerWidth / window.innerHeight;

    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;

    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onPointerMove( event ) {

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

/* function that creates a promise object which resolves after given ms*/
function sleep( ms ) {
    return new Promise((accept) => {
        setTimeout( () => {
            accept();
        }, ms );
    });
}

let intersectIndex;
let intersectObject;

window.addEventListener( 'click', onDocumentMouseDown );

function onDocumentMouseDown( event ) {

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( scene.children, false );

    if ( intersects.length > 0 ) {

        // console.log("mouse clicked");

        if ( INTERSECTED == intersects[ 0 ].object ) {

            console.log("mouse clicked");

            intersectIndex = meshlist.indexOf(INTERSECTED);
            intersectObject = objectlist[intersectIndex];

            // console.log("mouse clicked");

            let texture = textureLoader.load(objectlist[meshlist.indexOf(INTERSECTED)].image);
            scene.background = texture;

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

    }

    

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    // stats.update();

}

function render() {

    theta += 0.1;

    camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
    camera.lookAt( scene.position );

    camera.updateMatrixWorld();

    // find intersections

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( scene.children, false );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
            // console.log("intersected index: ", meshlist.indexOf(INTERSECTED));
            // console.log(meshlist[meshlist.indexOf(INTERSECTED)].scale.x);
            // console.log(objectlist[meshlist.indexOf(INTERSECTED)])

            // let texture = textureLoader.load(objectlist[meshlist.indexOf(INTERSECTED)].image);
            // scene.background = texture;

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

    }
 

    renderer.render( scene, camera );

}
