var constants = require("../common/constants");
var stantdardRes = require("../common/standard.res");

module.exports = io => {
	let arrGamer = [];

	let arrRoom = [];

	let arrPublicMsg = [];

	let arrPrivateMsg = [];

	const arrCharacters = ["cupid", "fortuneteller", "huntsman", "sheriff", "townsfolk", "werewolf", "witch"];

	var nspLobby = io.of("/game/lobby");

	nspLobby.on("connection", (socket) => {
		console.log("have connection join page lobby : ", socket.id);

		let arrRoomRes = stantdardRes.systemResponse(200, "SUCCESS", arrRoom);
		socket.emit(constants.SERVER_GET_ALL_ROOM, arrRoomRes);

		socket.on(constants.CLIENT_CREATE_ROOM, newRoom => {
			console.log("event create room!");

			// check name room
			let owner = newRoom.owner;
			let name_room = newRoom.name_room;

			socket.join(name_room);

			let checkRoom = arrRoom.find(obj => {
				return obj.name_room == name_room;
			});

			if (checkRoom) {
				console.log("Name room existed");

				let systemResponse = stantdardRes.systemResponse(400, "NAME_ROOM_EXISTED", {
					error: `${name_room} is existed`
				});

				socket.emit(constants.SERVER_NOTIEC_CREATE_ROOM, systemResponse);
			} else {
				let is_owner = true;
				let game = "Werewolf";
				let character = null;
				let is_die = false;
				let is_view = false;
				let gamerInfo = stantdardRes.gamerInfo(
					owner,
					is_owner,
					socket.id,
					game,
					name_room,
					character,
					is_die,
					is_view
				);
				newRoom.arrGamer.push(gamerInfo);
				arrRoom.push(newRoom);
				let systemResponse = stantdardRes.systemResponse(200, "SUCCESS", newRoom);

				socket.emit(constants.SERVER_NOTIEC_CREATE_ROOM, systemResponse);

				systemResponse = stantdardRes.systemResponse(200, "SUCCESS", arrRoom);

				// send to everyone on namespace but sender. have using namspace.emit() send include sender
				socket.broadcast.emit(constants.SERVER_GET_ALL_ROOM, systemResponse);
			}
			console.log("arrRoom : ", arrRoom);
		});

	})


	var nspRoom = io.of("/game/room");

	nspRoom.on("connection", (socket) => {
		console.log("have connection join page room : ", socket.id);


		// GamerInfo {
		//     gamer: GamerRequest
		// }
		// GamerRequest{
		//     _id: string;
		//     email: string;
		//     fullname: string;
		//     avatar_url: string;
		//   }
		socket.on(constants.CLIENT_INFORMATION, gamerInfo => {
			if (arrGamer.length == 0) {
				gamerInfo.socket_id = socket.id;
				arrGamer.push(gamerInfo);
			} else {
				let _id = gamerInfo._id;

				let obj = arrGamer.find(gamer => {
					return gamer._id == _id;
				});

				if (!obj) {
					gamerInfo.socket_id = socket.id;
					arrGamer.push(gamerInfo);
				} else {
					obj.socket_id = socket.id;
				}
			}

			// show arrr gamer
			console.log("arrGamer : ", arrGamer);
		});


		socket.on(constants.CLIENT_JOIN_ROOM, obj => {
			console.log("event Join room");
			let name_room = obj.nameRoom;
			let gamerInfo = obj.gamerInfo;
			// console.log("name Room: ", name_room, " gamerinfor : ", gamerInfo);

			socket.join(name_room);

			let room = arrRoom.find(obj => {
				return obj.name_room == name_room;
			});

			if (room) {
				// console.log("room : ", room);

				let temp = room.arrGamer.find(gamer => {
					return gamer._id == gamerInfo._id;
				});

				console.log("temp : ", temp);

				if (!temp) {
					let is_owner = false;
					let game = "Werewolf";
					let character = null;
					let is_die = false;
					let is_view = false;
					let tmp = stantdardRes.gamerInfo(
						gamerInfo,
						is_owner,
						socket.id,
						game,
						name_room,
						character,
						is_die,
						is_view
					);
					// console.log("tmp undefined", tmp);
					room.arrGamer.push(tmp);
				}

				let systemResponse = stantdardRes.systemResponse(200, "SUCCESS", room);
				console.log(systemResponse);
				console.log(name_room);
				// console.log("sockets in : ", io.sockets.in());
				nspRoom.in(name_room).emit(constants.SERVER_SEND_DETAIL_ROOM, systemResponse);
				// socket.emit(constants.SERVER_SEND_DETAIL_ROOM, systemResponse);
			} else {
				let systemResponse = stantdardRes.systemResponse(400, "ROOM_NOT_FOUND", { error: "room not found" });
				socket.emit(constants.SERVER_SEND_DETAIL_ROOM, systemResponse);
			}
		});

		// handle msg

		socket.on(constants.CLIENT_PUBLIC_MESSAGE, (publicMsg)=>{
			arrPublicMsg.push(publicMsg);
			
			let systemResponse = stantdardRes.systemResponse(200, "SUCCESS", arrPublicMsg);
			nspRoom.emit(constants.SERVER_PUBLIC_MESSAGE, systemResponse);
		})

	})

};



// example
// var customNS = ioserver.of('/chat'); 

// customNS.on('connection', function (socket) {
//    socket.on('message', function (msg) {

//        // Send message to sender 
//        socket.emit(msg);

//        // Send message to everyone on customNS INCLUDING sender
//        customNS.emit(msg);

//        // Send message to everyone on customNS BUT sender
//        socket.broadcast.emit(msg);

//        // Send message to everyone on ROOM chanel of customNS INCLUDING sender
//        customNS.in('ROOM').emit(msg); 

//        // Send message to everyone on ROOM chanel of customNS BUT sender
//        socket.broadcast.in('ROOM').emit(msg); 


//    });
// });