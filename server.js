const express=require('express');

const PORT=8080;
const app=express()
const server=app.listen(PORT,function(){console.log(`http://localhost:${PORT}`)})

app.use(express.static("public"))


const socket=require('socket.io')
const io=socket(server)
var users=new Set()

var turn = null;


io.on('connection',(socket)=>{console.log('nouvelle connexion '+socket.id)

    socket.on("new User",function(data){
        socket.userId=data
        users.add(data)
        if(turn==null){
            turn = socket.userId
        }
        io.emit("new User",[...users])
    })

    socket.on('disconnect',()=>{
        console.log("user disconnected",socket.userId)
        users.delete(socket.userId)
        io.emit("new User",[...users])
    })

    socket.on('playerMove', function(data) {
        const usersArray = Array.from(users); 
    
        if (turn == socket.userId) {
            console.log("Joueur", socket.userId, "a joué sur la case", data);
            console.log("Tour actuel :", turn);
            
            if (usersArray[0] == turn) {
                turn = usersArray[1];
            } else {
                turn = usersArray[0];
            }

            io.emit("move", data)
            
        } else {
            console.log("Ce n'est pas au joueur", socket.userId, "de jouer");
        }

        
    });

})