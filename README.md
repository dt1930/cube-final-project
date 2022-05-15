# Project #3 - Connections Lab
### Abraiz and Dixit <br/>
Project #3 using Node, Express, and NeDB <br/>
[Memory Cube](https://clumsy-legend-hedge.glitch.me/) <br/>
For a kitten-like experience 🐈 : username: admin, password: admin 

## Description:

“Memory Cube” is designed to be an online platform where users can upload their photos or “memories” and form a personalized, aesthetic cube-like structure out of those memories over time. The more memories a user adds, the denser the cube becomes. Each individual memory is represented in the form of a smaller box-like object and together, these individual boxes evolve into a larger cube which would eventually store hundreds, or even thousands of moments from the user’s life. 

Each user will have an account with a username and password that they can optionally share with other people with whom they want to form a memory cube. At the beginning, the cube’s “room” would be empty and all members would have the option of adding their memory pieces to the cube. The idea here is that each person in the group would add some sort of picture that would hold meaning to each person in the group so that the final cube becomes meaningful for everyone of them. Each time a person adds a piece, it will be placed in such a way so that eventually, when enough pieces are added, the structure starts to take on the form of a cube. From then on, the more memories the group members add, the larger the cube would get. Essentially, group members will be able to create their own Memory Cube from scratch by adding pieces in this way.

To make this project possible, we implemented Javascript’s [three.js](https://threejs.org/) library along with HTML and CSS on the front-end, and we made use of Node, Express, and NeDB on the back-end in order to send, receive, and store the Memory Cube’s data.

## Inspiration:



* The application would essentially be asynchronous in the sense that every member would be able to visit the Cube at their own time, interact with it, and add pieces to it.
* Users would be able to look back on their favorite memories later, that too in a unique way. This adds a nostalgic aspect to the website’s experience.
* The overall cube structure is meant to be built over time. This adds more meaning to the end-result. For instance, a college student could start making their Memory Cube in their first year, and by the time they graduate, they would have a personalized Cube which would store the valuable memories they made during college.
* Provides a unique way to save memories, and to form a meaningful structure using those memories.
* Users would have the ability to make their own personalized cube or collaborate on a cube with other people so that the final Memory Cube that forms holds memories associated with each person in the group. This way, the people in the group would have a unique, personalized cube that would be shared among them.

## Brainstorming:



* Initially we thought about making the cube structure using triangles. The structure would be formed using the BufferGeometry feature in three.js. However, we soon realized that it was difficult to implement Raycasting on the triangles inside the Buffer cube since the triangles weren’t mesh objects. Moreover, we realized it was a bit difficult to interact with triangles since they were 2D objects. So, we decided not to proceed with the triangles-inside-a-larger-cube idea. 🔺 <br/><br/>

<p align="center">
  <img 
    width="337"
    height="303"
    src="https://github.com/Abraiz01/cube/blob/main/public/images/trianglesCube.png"
  >
</p> <br/><br/>

* We also thought of a “Memory Train” idea in which the individual memories would be placed in order such that the oldest ones would be found at the back end of the Train (which would be made of cubes) and the newest ones would be added to the front of the Train. We made a rough three.js implementation of it, but due to time constraints, we decided to keep our focus on the Memory Cube idea and proceeded to complete it first. <br/><br/>

<p align="center">
  <img 
    width="312.5"
    height="304.5"
    src="https://github.com/Abraiz01/cube/blob/main/public/images/train.png"
  >
</p> <br/>

## Wireframes:



* Wireframe for the landing page: <br/><br/>

<p align="center">
  <img 
    width="500"
    height="600"
    src="https://github.com/Abraiz01/cube/blob/main/public/images/landingpage.jpeg"
  >
</p>

We went for a minimalistic design on the main page since we did not want to diverge the main focus which was meant to be on the cube

* Wireframe for the main page: <br/><br/>

<p align="center">
  <img 
    width="500"
    height="600"
    src="https://github.com/Abraiz01/cube/blob/main/public/images/mainpage.jpeg"
  >
</p>

## Information Flow:

### The following is the ordered information flow of the NeDB implementation for the login system:



1. User enters username and password in the landing page.
2. Client sends username and password information to the server.
3. Server checks to see if the username is already present in the `users.db`
    1. If it’s not, the username and password info is added to the database.
    2. If it is present, the password is compared to the one stored in the database.
        1. If the password is incorrect, the server responds with a `status` of `false`.
        2. If the password is correct, the server responds with a `status` of `true`.
4. Client checks to see if `status` is `true`, and if it is, the cube stored in the `mesh.db` and `memory.db` databases is fetched and loaded (information flow for this process is below), otherwise, the user is sent back to the homepage. <br/>

### The following is the ordered information flow of the NeDB implementation for the **cube-loading** system:



1. Client logs in to their account by entering their correct username and password.
2. Client fetches **memory objects** (containing image strings and description texts) and **meshes** (containing positions, colors, and sizes of the BoxGeometries) from the server.
3. Server responds with the JSON objects of memories and meshes associated with the username.
4. Client reconstructs the latest version of the cube using the memory objects and meshes supplied by the server. <br/>

### The following is the ordered information flow of the NeDB implementation for the **cube-storing** system:



1. User uploads an image and adds an object to the Cube.
2. Client sends the image data `memoryInfo` and and mesh data `meshInfo` to the server 
3. Server inserts both the image and mesh data into their respective databases. <br/>

## Features:



* The application is asynchronous in the sense that users would be able to visit the Cube, interact with it, and add “memory objects” to it at whatever time they would want to.
* Uploading pictures and being able to write a description for that picture.
* Encoding the uploaded pictures inside a cube object.
* Randomizing cube size, color, and rotation so that no cube is the same as another cube, in this way, the experience becomes personalized and unique since no Cube would be the same as another.
* Being able to mute and control the music’s volume.
* Ability for a user to interact with the cube:
    * Zoom in and out of the Memory Cube.
    * Hover over individual memories and they become highlighted with a red color.
    * Clicking on a memory reveals the picture and description associated with it in a pop-up div. At first we added the picture to the background but that sort-of interfered with the cube’s look, so using a pop-up div was a better design idea.
* Multiple users can add to the cube
* Ability to logout and return to the homescreen
* Login feature - unique usernames and passwords, prompting the user upon entering a wrong password, and sending them back to the homescreen

## User Feedback:



* Show the user at the start how the cube structure would look like. 
    * This would grab the attention of the user at the start and would really do a good job in portraying what the full-scope of the application is to the user.
* Displaying the pictures on the background of the three.js canvas hides the memory objects, so we should find another way to display the pictures. 
    * We improved on this by making a separate pop-up div that would contain both the picture and the description associated with the memory. This way, at any time, the user would either be viewing the pop-up, or they would be viewing the Memory Cube without any interference on both ends.
* Work a bit more on the front-end part of the website.
    * We took this as constructive critique and we definitely didn’t want to undermine the overall image of our website just because we spent a lot of time working on the technicalities and back-end. We completely remade the landing page of our website using another three.js canvas and since we found a fix to the “div-overlay” issue, we added front-end work to the main page as well.
* Since we couldn’t overlay the button and slider divs on top of the canvas at first, some of our peers pointed out that the cursor’s intersection with the individual objects wasn’t perfectly aligned. 
    * We realized this was because the Raycaster worked based on the current windowWidth and windowHeight of the browser window. Adding divs separately made way for some scroll which interfered with the Raycaster’s width and height values for the canvas and so the pointer wasn’t properly aligned with the memory objects when the user was trying to hover over them. We found a fix for this issue and it is mentioned under the [Challenges](#key-challenges--things-we-learnt) section.

## Key Challenges / Things We Learnt:

### Abraiz



* Understanding three.js itself and the things that could be done using it were a bit overwhelming.
* Importing the three.js library and making the initial setup was more challenging than I thought it would be. I ended up using cdn to import the various modules I would use, like `{ OrbitControls }` instead of setting up three.js locally because I was getting a lot of errors that way.
* Understanding the working behind BufferGeometry. I made the following notes to understand the working behind this [BufferGeometry Example](https://threejs.org/examples/?q=buffer#webgl_interactive_buffergeometry) available on the three.js site. <br/><br/>

<p align="center">
  <img 
    width="500"
    height="600"
    src="https://github.com/Abraiz01/cube/blob/main/public/images/triangle.jpeg"
  >
</p>

<br/>

* Restricting the positions of each individual “memory” so that they all come together inside a single larger cubic structure. <br/><br/>

<p align="center">
  <img 
    width="500"
    height="600"
    src="https://github.com/Abraiz01/cube/blob/main/public/images/buffernotes1.jpeg"
  >
</p>

<p align="center">
  <img 
    width="500"
    height="600"
    src="https://github.com/Abraiz01/cube/blob/main/public/images/buffernotes2.jpeg"
  >
</p>

<br/>

* Overlaying buttons and other divs on the three.js canvas was not as easy as I thought it would be, and this was causing a lot of problems with raycasting being able to properly align the cursor with the individual objects. So, this was an important issue that had to be fixed, and eventually I did this by importing the “main.css” file that every three.js example uses,  and adding my styles on top of the ones already present. 
* Understanding and using Raycasting:
    * This was a critical feature without which we couldn’t have made interactions with the individual objects possible.
    * Understood that Raycaster first sets up an array `intersects` of meshes that the pointer is intersecting with. Next, we use the mesh at index 0 in this list, which is the current mesh that the pointer is intersecting with, to compare it to the previously intersected mesh `INTERSECTED` and if they aren’t the same, the previous mesh is set back to its original color, the new mesh is assigned to `INTERSECTED`, and the new mesh is given a red color to highlight it.
* Sending and receiving “memory objects” to and from the server, and eventually using them to both display the current structure of the cube and store each of the pictures inside the correct “memory object” every time the user logs in to their Cube.
    * The index of each element in the `objectlist` is perfectly aligned with its corresponding item in the `meshlist`.
    * When the Raycaster stores the mesh the user has clicked inside the `INTERSECTED` variable, the mesh’s index is retrieved from the `meshlist` and the corresponding object is retrieved from the same index from the `objectlist`, this object stores the image string and the description which are then used to display the image and text associated with that “memory object” to the user.

### Dixit

Initially, I thought of working on an individual project, such as bingo or connect 4 which would require the use of sockets and p5.js, both of which I had already used during my project 2 multiplayer game. With motivation from the professor as well as support from my friend Abraiz who had used three.js in one of his weekly assignments, I decided to abandon my initial ideas and go for the tech stack that comprises three.js on the front end and node.js, express, and nedb on the back end. My main inspiration for choosing this stack was that it was completely new for me in the sense that although I had played here and there with both three.js and nedb in the class, I had never included them in my previous projects for the course, so I thought this would be a great learning experience and a good overall use of the things I learned in the course. 

The initial process for me was full of struggles as I learned how to navigate the three js library, including its inclusion in my script file. I started learning how various features in three js work, including different types of geometry, cameras, textures, and raycasting. I found that thinking in 3D is more challenging as well as fun than expected. Since Abraiz and I were not together on campus during the break, we started the project a little differently. While he started working on buffer geometry, I started working on textures and raycasting. This way we made sure that we could achieve all the features we wanted to achieve in our final project as we bring both of our implementations into one. For me personally, using nedb for database was a new element different from all of my previous projects, so the [NeDB Documentation](https://github.com/louischatriot/nedb) in our class GitHub Repo helped a lot, and in this process, I also realized that database designing and querying is something that I enjoy and is an important aspect of the back-end web. Besides the database and three.js, the other thing that I learned or maybe sort of revisioned through this project was the fundamental idea of get and post request we learned when we discussed APIS and fetching them in the first back-end class. Apart from this, designing the landing page’s banner and working with CSS positions was also equally rewarding. 

## Next Steps / More Ideas:



* Add a “collaborate” option that would invite / add people to contribute to the Memory Cube.
* Options to create different kinds of structures as opposed to making only a cube-like structure. For example, we could make a “Memory Tree” which would initially only have the trunk and branches and the individual memories would be represented in the form of leaves on the tree’s branches.
* Although we do not know how we would go about this yet, but it would be great if we could somehow link Google Photos to our Memory Cube project. Essentially, since Google’s AI already has the pictures associated with different people identified in the app (using facial recognition), all the user would have to do is specify the names of the people the user would want to add to the cube and the application would then filter out those images and construct a personalized Memory Cube for them directly.
* Rotating the entire structure using orbit controls by dragging the mouse.
* Add socket implementation so that people can collaborate on making the cube in real-time as well
* Ability to add multiple cubes at the same time, we thought this would conflict a bit with the idea behind our project which was to build a Memory Cube over time, since that would add more meaning to the structure when the user(s) revisit it. However, having this as an optional feature could invite more users to try out the cube.
* Create account option / make group accounts so that people with different usernames can join in on the same account
    * Users can have username and password for their own account and also have a “key” which would allow them to access the group cube.
* Sounding a bit ambitious here but, the project could possibly be transformed into a VR experience where users would be able to interact with the cube in a more life-like experience, or it could also be represented in the form of an interactive-cube hologram displaying the photos as holograms when the individual cubes are touched. Very futuristic, but we thought it would be worth mentioning. 🤖

## References:



* Github for NeDB

[https://github.com/louischatriot/nedb](https://github.com/louischatriot/nedb)



* YT channel Bruno Simon for learning threejs

[https://www.youtube.com/c/BrunoSimon/playlists](https://www.youtube.com/c/BrunoSimon/playlists)



* Stackoverflow for Payload error

[https://stackoverflow.com/questions/50988891/payloadtoolargeerror-with-limit-set](https://stackoverflow.com/questions/50988891/payloadtoolargeerror-with-limit-set)



* YT channel Prismic for learning threejs

[https://www.youtube.com/watch?v=tVr89249gwM](https://www.youtube.com/watch?v=tVr89249gwM)



* YT channel for sleep with async await

[https://www.youtube.com/watch?v=VSpon8DsHvY](https://www.youtube.com/watch?v=VSpon8DsHvY)
