const rooms = new Map();

const websocketRoutes = (ws) => {

    console.log("new client connected");
    
    ws.on('message', (message) => {

        // const data = JSON.parse(message)

        const data = JSON.parse(message);

        if(data.type == "createRoom"){

        }

        console.log("recieved %s",message);

        let JSONdata = JSON.parse(message);
        console.log(JSONdata)
        
        ws.send(`${message}`)
        

        // if(data.type == 'joinroom'){}

    })

}

module.exports = {websocketRoutes}