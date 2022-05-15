// setting up express
let express = require("express");
let http = require("http");
let app = express();

// creating http server
let server  = http.createServer(app);

// setting up nedb
let Datastore = require('nedb');


app.use('/',express.static('public'));

// setting up the databases
let userDatabase = new Datastore('users.db'); // for user info
let memoryDatabase = new Datastore('memory.db'); // for memory objects info (image string and description)
let meshDatabase = new Datastore('mesh.db'); // for mesh info (position, color, rotation, scale attributes)

// loading all the databases
userDatabase.loadDatabase();
memoryDatabase.loadDatabase();
meshDatabase.loadDatabase();

// setting limit to 100mb to avoid size bug with image string
app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({
    limit: '100mb',
    extended: true
}));


let currentUser; // variable to store username of current user


// retrieving userInfo from client and checking if it exists
app.post('/userInfo',(req,res) => {

    currentUser = req.body.name;

    // finding username objects inside the users.db database
    userDatabase.find({name:currentUser}, (err, docs) => { 

        // if user doesn't exist, add as a new user to the database
        if (docs.length == 0) { 
            userDatabase.insert(req.body);
            res.send({status:true});
        }

        // if it does check password and send status response to the client accordingly
        else {
            if (docs[0].password==req.body.password){
                res.send({status:true});
            }
            else {
                res.send({status:false});
            }
            
        }
    })
})

// sending memory objects that contain image string and description to the user
app.get('/userMemories', (req, res) => {

    memoryDatabase.find({name:currentUser}, (err, docs) => { // finding the memory objects associated with the current user
        res.send({docs:docs}); // sending to the client side

    })
})

// sending mesh objects that contain image string and description to the user
app.get('/userMeshes', (req,res) => {

    meshDatabase.find({name:currentUser}, (err,docs) => { // finding the mesh objects associated with the current user
        res.send({docs:docs}); // sending to the client side

    })
})

// storing memory objects that contain image string and description in the memory.db database
app.post('/memoryInfo', (req,res) => {

    memoryDatabase.insert(req.body);

})

// storing mesh objects that contain mesh attributes in the mesh.db database
app.post('/meshInfo', (req,res) => {

    meshDatabase.insert(req.body);

})


server.listen(2003, () => {

    console.log("server is now up");

})