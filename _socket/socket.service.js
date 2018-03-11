var constants = require("../common/constants");

module.exports = (io) => {
    let arrGamer = [];

    let room = [];

    io.on("connection", (socket) => {
        console.log("socket have connected with id : ", socket.id);

        // GamerInfo {
        //     gamer: GamerRequest
        // }
        // GamerRequest{
        //     _id: string;
        //     email: string;
        //     fullname: string;
        //     avatar_url: string;
        //   }

        socket.on(constants.CLIENT_INFORMATION, (gamerInfo) => {

        })

        // class NewRoom {
        //     owner: GamerRequest;
        //     room: Room
        // }
        // class Room {
        //     name_room: string;
        //     password: string;
        //     create_at: Date
        // }

        socket.on(constants.CLIENT_CREATE_ROOM, (newRoom) => {
            // socket.join(nameRoom);
        })

        socket.on(constants.CLIENT_JOIN_ROOM, (room) => {
            // socket.join(nameRoom);
        })



        // class PublicMsgRequest {
        //     sender: GamerResponse;
        //     content: any;
        //     create_at: Date
        // }
        socket.on(constants.CLIENT_PUBLIC_MESSAGE, (publicMsgReq) => {
            
        })

    })
}