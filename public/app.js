// importing threejs library along with orbit controls

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/OrbitControls.js';

// variable declarations

// threejs variables
let container, stats;
let camera, raycaster, renderer;
let INTERSECTED;
let correctUser=false;
let currentIndex;
const geometry = new THREE.OctahedronGeometry( 20, 0 );
const pointer = new THREE.Vector2();
const scene = new THREE.Scene();

// event listener and other front-end variables 
let description=document.getElementById("description");
let logout=document.getElementById("logOut");
let title = document.getElementById('myheader');
let audio= new Audio("./sound.mp3");
let volume = document.querySelector("#volume-control");


let meshlist = []; // stores mesh objects both loaded from the database and the new ones that are added
let objectlist = []; // stores memory objects both loaded from the database and the new ones that are added


let uploadedImage; // for file upload reader


// communicating with the server

// stores username and password entered 
let userInfo={
    "name":sessionStorage.getItem('username'),
    "password":sessionStorage.getItem('password')
}

// stringifying to send to the server
let userInfoJSON=JSON.stringify(userInfo);



window.addEventListener('load', function() {

    // updating the title of the main page with the user's name
    title.innerHTML = userInfo.name + "'s Memory Cube"

    // logout listener
    logout.addEventListener('click', () => {
        window.location="./index.html"
    })

    //sending userInfo to the server
    fetch('/userInfo', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: userInfoJSON
    })
    .then(res=>res.json())
    .then(data=>checkUser(data));

    //checking if user entered the right password
    function checkUser(data){
        correctUser=data.status;
        fetchingCube();
    }

    //fetching the previously stored memory objects and meshes from the server
    function fetchingCube(){
        if (correctUser) {
            fetch('/userMemories').then(res=>res.json())
            .then(data=>reconstructObjects(data)); // reconstruct the objectlist with previous memory objects

            fetch('/userMeshes').then(res=>res.json())
            .then(data=>reconstructMeshes(data)); // reconstruct the meshlist with previous memory objects
        }
        else {
            alert("You entered a wrong password. Please go back to the login page.");
            window.location='/index.html'; // send user back to the landing page
        }
    }

    // function to fill in objectlist with previously retrieved memory objects from database
    function reconstructObjects(data) {
        for (let i=0; i<data.docs.length; i++) {
            objectlist[data.docs[i].index] = new MemoryObject(data.docs[i].image);
            objectlist[data.docs[i].index].text = data.docs[i].text;
        }
    }

    // function to fill in meshlist with previously retrieved meshes from database
    function reconstructMeshes(data){

        for ( let i = 0; i < data.docs.length; i ++ ) {

            // create a new material
            let material = new THREE.MeshPhongMaterial( {
                specular: 0xffffff, shininess: 250,
                side: THREE.DoubleSide, vertexColors: true
            } );

            // create an object using that material
            const object = new THREE.Mesh( geometry, material );

            object.material.color.setHex("0x"+data.docs[i].color); // set color of object using database value

            // update the object's position, rotation, and size exactly as it was form the previous session

            object.position.x = data.docs[i].positions.x;
            object.position.y = data.docs[i].positions.y;
            object.position.z = data.docs[i].positions.z;

            object.rotation.x = data.docs[i].rotations.x;
            object.rotation.y = data.docs[i].rotations.y;
            object.rotation.z = data.docs[i].rotations.z;

            object.scale.x = data.docs[i].scales.x;
            object.scale.y = data.docs[i].scales.y;
            object.scale.z = data.docs[i].scales.z;

            meshlist[parseInt(data.docs[i].index)] = object; // add it to the meshlist

            scene.add( object ); // add it to the scene

        }
        // get the ending index to fill in objectlist and meshlist from that index as new items are added
        currentIndex = data.docs.length; 
    }

});

// threejs 

// calling init and animate functions of threejs

init();
animate();

function init() {

    // looping over the background audio file
    audio.play();
    audio.loop=true;

    // setting up a perspective camera
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
	camera.position.z = 2000;

    // adding lights, fog, and background color to the canvas
    scene.background = new THREE.Color( 0x050505 );
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    scene.add( new THREE.AmbientLight( 0x444444 ) );

    const light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light1.position.set( 1, 1, 1 );
    scene.add( light1 );

    const light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light2.position.set( 0, - 1, 0 );
    scene.add( light2 );

    
    const n = 300, n2 = n / 2; // n defines the outer cube size


    let addButton = document.getElementById('input-file'); // add memory button listener

    addButton.addEventListener('change', insertPhoto);

    async function insertPhoto(e) { // using async await to avoid reading the file too soon

        // setting up file reader for uploading the image

        let reader = new FileReader();
        uploadedImage = "";
        reader.addEventListener('load', (e) => {
            uploadedImage = e.target.result;
        })

        reader.readAsDataURL(this.files[0]);

        // prompt to describe the picture
        let text = prompt("Describe the picture.");

        // waiting for image to upload before proceeding
        while(!uploadedImage) {
            await(sleep(100));
        }

        // creating a memory object that stores the image string and description
        let memory = new MemoryObject(uploadedImage);
        memory.text = text;

        // memory object to pass to the server in order to store it in the database
        let memoryInfo = {
            "name": userInfo.name,
            "image": memory.image,
            "text": memory.text,
            "index": currentIndex
        }

        let memoryInfoJSON=JSON.stringify(memoryInfo); // stringifying before sending to the server

        // sending memory object to the server
        fetch('/memoryInfo',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: memoryInfoJSON
        })

        // adding memory object to the end of the objectlist
        objectlist[currentIndex] = memory;

        // creating a new MeshPhong material 
        let material = new THREE.MeshPhongMaterial( {
            color: Math.random() * 0xffffff, specular: 0xffffff, shininess: 250,
            side: THREE.DoubleSide, vertexColors: true
        } );

        // creating an object using octahedron geometry and mesh phong material
        const mesh = new THREE.Mesh( geometry, material );

        // setting positions of x, y, z so that they stay inside the overall cube structure
        mesh.position.x = Math.random() * n - n2;
        mesh.position.y = Math.random() * n - n2;
        mesh.position.z = Math.random() * n - n2;

        // randomizing rotation of the mesh object
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;

        // randomizing its size
        // random width, depth, height
        mesh.scale.x = Math.random() + 0.5; 
        mesh.scale.y = Math.random() + 0.5;
        mesh.scale.z = Math.random() + 0.5;

        // storing the mesh's info in an object
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

        // stringifying before sending to the server
        let meshInfoJSON=JSON.stringify(meshInfo);

        // sending the mesh object to the server for database storage
        fetch('/meshInfo',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: meshInfoJSON
        })

        // adding the mesh object to the meshlist and adding it to the scene
        meshlist[currentIndex] = mesh;
        scene.add( mesh );

        // updating the currentIndex for the next object to be added to the lists
        currentIndex += 1    
        

    }

    // defining the raycaster
    raycaster = new THREE.Raycaster();

    // setting up the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    // adding an event listener for pointer move
    document.addEventListener( 'pointermove', onPointerMove );

    // adding an event listener for window resize
    window.addEventListener( 'resize', onWindowResize );

    // setting up a variable to allow for orbit control (zooming and rotating the object)
    let controls = new OrbitControls( camera, renderer.domElement );

}

// class to store image string and description inside a memory object
class MemoryObject {
    constructor( image ) {
        this.image = image;
        this.text = "";
    }
}

// function to reset camera aspect and renderer when window resizes 
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

// function to record mouse position (to be used in raycasting)
function onPointerMove( event ) {

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

// function that creates a promise object which resolves after given time
function sleep( ms ) {
    return new Promise(( accept ) => {
        setTimeout( () => {
            accept();
        }, ms );
    });
}

// setting up variables for the popup div that shows the photo and its close button
let infoDiv = document.getElementById('info');
let closeButton = document.getElementById('close-button');

// event listener for the close button
closeButton.addEventListener('click', () => {
    infoDiv.style.display = "none";
})

let intersectIndex; // stores the index of the mesh object the raycaster intersects from the meshlist
let intersectObject; // stores the intersected mesh object itself

let imgContainer = document.getElementById('info-image'); // variable that stores the image container

// check if mouse is clicked for raycasting
window.addEventListener( 'click', onDocumentMouseDown );

// tell raycaster what to do on mouseclick
function onDocumentMouseDown( event ) { 

    raycaster.setFromCamera( pointer, camera ); // setting up raycaster

    // array that stores the objects that are being intersected with the mouse at the moment
    const intersects = raycaster.intersectObjects( scene.children, false );

    // if there is an intersected object
    if ( intersects.length > 0 ) {

        // if that object is first in the list (most recent) and the popup isnt being displayed
        if ( INTERSECTED == intersects[ 0 ].object && window.getComputedStyle(infoDiv, null).display == "none" ) {

            intersectIndex = meshlist.indexOf(INTERSECTED); // update intersectIndex with the new intersected object's index in the meshlist
            intersectObject = objectlist[intersectIndex]; // find the object associated with it in the objectlist

            imgContainer.src = objectlist[meshlist.indexOf(INTERSECTED)].image; // display the image

            description.innerHTML = objectlist[meshlist.indexOf(INTERSECTED)].text; // display the text

            infoDiv.style.display = "inline"; // display the popup

        }

    } else { // no objects are being intersected currently

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex ); // return previously intersected object to it's original color

        INTERSECTED = null;

    }

}

// animate and render functions for threejs

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    // find intersections usinf raycaster the same way as above

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( scene.children, false );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex ); 

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex(); // store its original color
            INTERSECTED.material.emissive.setHex( 0xff0000 ); // highlight the intersected object with red

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex ); // return to original color

        INTERSECTED = null;

    }
 

    renderer.render( scene, camera );

}