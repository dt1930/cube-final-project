let express=require("express");
let http=require("http");
let app=express();
let server=http.createServer(app);
let Datastore=require('nedb');
let currentUser;

let serverObjectList = [];
let serverMeshList = [];


app.use('/',express.static('public'));
let userDatabase=new Datastore('users.db');
let memoryDatabase=new Datastore('memory.db');
let meshDatabase=new Datastore('mesh.db');
userDatabase.loadDatabase();
memoryDatabase.loadDatabase();
meshDatabase.loadDatabase();

// app.use(express.bodyParser({limit:'100mb'}));
app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({
    limit: '100mb',
  extended: true
}));
app.post('/userInfo',(req,res)=>{
    currentUser=req.body.name;
    userDatabase.find({name:currentUser},(err,docs)=>{
        if (docs.length==0){
            userDatabase.insert(req.body);
            res.send({status:true});
        }
        else{
            console.log(docs);
            if (docs[0].password==req.body.password){
                res.send({status:true});
            }
            else{
                res.send({status:false});
            }
            
        }
    })
})
app.get('/userMemories',(req,res)=>{
    memoryDatabase.find({name:currentUser},(err,docs)=>{
        // console.log(docs.length);
        // for (let i=0; i<docs.length; i++){
        //     console.log(docs[i]);
        // }
        res.send({docs:docs});
    })
})
app.get('/userMeshes',(req,res)=>{
    meshDatabase.find({name:currentUser},(err,docs)=>{
        // console.log(docs.length);
        // for (let i=0; i<docs.length; i++){
        //     console.log(docs[i]);
        // }
        res.send({docs:docs});
    })
})
app.post('/memoryInfo',(req,res)=>{
    // console.log(req.body);
    memoryDatabase.insert(req.body);
})
app.post('/meshInfo',(req,res)=>{
    console.log(req.body);
    meshDatabase.insert(req.body);
})
server.listen(2002,()=>{
    console.log("Server running up");
})