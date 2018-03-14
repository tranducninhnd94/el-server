var constants = require("../common/constants");
var stantdardRes = require("../common/standard.res");

module.exports = io => {


	// chacracter
	// let wolf = {gamer , bite }

	const action = ["BITE", "PROTECT", "PIN", "SAVE", "ENVENOM"];
	let arrBite = [];
	let arrProtect = [];
	let arrPin = [];
	let savedGamer = "";
	let envenomGamer = "";

	let historyOfRoom = [];

	/*
		arrActionOfroom : [
			nameRoom : ?
			arrAction [
				gamer,
				action,
				victim
			]  
		]
	*/
	let arrActionOfRoom = [];

	const timeWait = 3;

	const ttlOfRound = 10; // secound
	const isInRound = true;

	const ttlOfFirstVote = 10;
	const isInFirstVote = true;

	const ttlOfSecondVote = 10;
	const isInSecondVote = true;

	// [{nameRoom : ? , info : {round : round: ?,  arrVote : {gamer: ?, answer}}}]
	// edit [  ]
	/*
		arrVote1 : [
			nameRoom : ?
			arrVote  : ?
		]
	*/
	let arrVote1 = [];

	let arrGamer = [];

	let arrRoom = [];

	let arrPublicMsg = [];

	let arrPrivateMsg = [];

	const arrCharacters = ["cupid", "fortuneteller", "huntsman", "sheriff", "townsfolk", "werewolf", "witch"];

	var nspLobby = io.of("/game/lobby");

	nspLobby.on("connection", socket => {
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
	});

	var nspRoom = io.of("/game/room");

	nspRoom.on("connection", socket => {
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

		socket.on(constants.CLIENT_PUBLIC_MESSAGE, obj => {
			let publicMsg = obj.publicMsg;
			let nameRoom = obj.nameRoom;
			arrPublicMsg.push(publicMsg);

			let systemResponse = stantdardRes.systemResponse(200, "SUCCESS", arrPublicMsg);
			nspRoom.in(nameRoom).emit(constants.SERVER_PUBLIC_MESSAGE, systemResponse);
		});

		socket.on(constants.CLIENT_START_GAME, info => {
			let nameRoom = info.nameRoom;
			let obj = randomCharacter(info);
			//set role
			let room = setRoleForGamer(obj, arrRoom);
			console.log("after : ", room);

			room.round = 1; // set default round = 1 when start game

			if (room) {
				room.is_started = true;
				let systemResponse = stantdardRes.systemResponse(200, "SUCCESS", room);
				nspRoom.in(nameRoom).emit(constants.SERVER_START_GAME, systemResponse);
			} else {
				let systemResponse = stantdardRes.systemResponse(400, "ROOM_NOT_FOUND", { error: "room not found" });
				nspRoom.in(nameRoom).emit(constants.SERVER_START_GAME, systemResponse);
			}

			// count down
			inRound(nameRoom, 60);
		});

		// vote
		// obj format: let objVote = {round , infoVote: { gamer: this.meInfo, answer: this.answer }, roomName: this.nameRoom };
		// arrVote

		/*
		arrVote1 : [
			nameRoom : ?
			arrVote  : [ { gamer, anwser } ]
		]
		*/
		socket.on(constants.CLIENT_FIRST_VOTE, objVote => {
			let infoVote = objVote.infoVote;
			let roomName = objVote.roomName;
			// let round = objVote.round;

			console.log("object vote : ", objVote);

			// {nameRoom : ? , info : {round : round: ?,  arrVote : {gamer: ?, answer}}}
			let vote = arrVote1.find(tmp => {
				return tmp.roomName == roomName;
			});

			if (vote) {
				let isVoted = 0;
				vote.arrVote.forEach(tmp => {
					if (tmp.gamer._id == infoVote.gamer._id) {
						tmp.answer = infoVote.answer;
						isVoted = 1;
						return;
					}
				})

				if (isVoted == 0) {
					vote.arrVote.push(infoVote);
				}
				let systemResponse = stantdardRes.systemResponse(200, "SUCCESS", vote);
				nspRoom.in(roomName).emit(constants.SERVER_SEND_INFO_FIRST_VOTE_BY_ROUNF, systemResponse);
			} else {
				let arrVote = [];
				arrVote.push(infoVote);
				let vote1 = { roomName, arrVote };
				arrVote1.push(vote1);
				let systemResponse = stantdardRes.systemResponse(200, "SUCCESS", vote1);
				nspRoom.in(roomName).emit(constants.SERVER_SEND_INFO_FIRST_VOTE_BY_ROUNF, systemResponse);
			}
		});

		socket.on(constants.CLIENT_GET_INFO_FIRST_VOTE_BY_ROUND, objRes => {
			let nameRoom = objRes.nameRoom;
			let round = objRes.round;
			let vote = arrVote1.find(tmp => {
				return tmp.nameRoom == nameRoom;
			});

			if (vote) {
				let systemResponse = stantdardRes.systemResponse(200, "SUCCESS", vote);
				nspRoom.in(roomName).emit(constants.SERVER_SEND_INFO_FIRST_VOTE_BY_ROUNF, systemResponse);
			}
		});

		// action for room
		// format obj = {nameRoom, chacracter , action, victim}
		socket.on(constants.CLIENT_SEND_ACTION, obj => {
			let character = obj.character;
			let victim = obj.victim;
			let action = obj.action;
			let nameRoom = obj.nameRoom;

			let rs = arrActionOfRoom.find(tmp => {
				return tmp.nameRoom == nameRoom;
			})

			if (rs) {
				let isVote = 0;
				rs.arrAction.forEach(tmp => {
					if (tmp.character._id == character._id) {
						isVote = 1;
						tmp.action = action;
						tmp.victim = victim;
						return;
					}
				})
				if (isVote == 0) {
					rs.arrAction.push({ character, action, victim });
				}
				socket.emit(constants.SERVER_SEND_ACTION, { character, action, victim })
			} else {
				// first action
				let arrAction = [{ character, action, victim }];
				arrActionOfRoom.push({ nameRoom, arrAction });
				// send info for client
				socket.emit(constants.SERVER_SEND_ACTION, { character, action, victim })
			}

		})

	});

	function calculatorEndOfNight(nameRoom) {
		let rs = arrActionOfRoom.find(tmp => {
			return tmp.nameRoom = nameRoom;
		})

		rs.arrAction.forEach(tmp => {
			if (tmp.action == "BITE") {
				arrBite.push(tmp.victim);
			}

			if (tmp.action == "PROTECT") {
				arrProtect.push(tmp.victim);
			}

			if (tmp.action == "PIN") {
				arrPin.push(tmp.victim);
			}

			if (tmp.action == "SAVE") {
				savedGamer.push(tmp.victim);
			}

			if (tmp.action == "ENVENOM") {
				envenomGamer.push(tmp.victim);
			}
		})

	}

	function inRound(nameRoom, ttl) {
		let count = ttl;

		let time = setInterval(() => {
			let info = {
				name: "In the night",
				ttl: count,
				isInRound: true,
				isInFirstVote: false,
				isInSecondVote: false
			};
			// console.log(count);
			nspRoom.in(nameRoom).emit(constants.SERVER_SEND_COUND_DOWN, info);
			if (count == 0) {
				clearInterval(time);
				// inFirstVote(nameRoom, 10);
			}
			count--;
		}, 1000);
	}

	function inFirstVote(nameRoom, ttl) {
		let count = ttl;

		let time = setInterval(() => {
			let info = {
				name: "In the meeting",
				ttl: count,
				isInRound: false,
				isInFirstVote: true,
				isInSecondVote: false
			};

			// console.log(count);
			nspRoom.in(nameRoom).emit(constants.SERVER_SEND_COUND_DOWN, info);
			if (count == 0) {
				clearInterval(time);
				// inSecondVote(nameRoom, 5);
			}
			count--;
		}, 1000);
	}

	function inSecondVote(nameRoom, ttl) {
		let count = ttl;

		let time = setInterval(() => {
			let info = {
				name: "Find Candidate must to die",
				ttl: count,
				isInRound: false,
				isInFirstVote: false,
				isInSecondVote: true
			};
			// console.log(count);

			nspRoom.in(nameRoom).emit(constants.SERVER_SEND_COUND_DOWN, info);
			if (count == 0) {
				clearInterval(time);
			}
			count--;
		}, 1000);
	}
};

function calculatorVote1(arrVote1, round) { }

function setRoleForGamer(obj, arrRoom) {
	let nameRoom = obj.nameRoom;
	let arrRandom = obj.arrRandom;

	let room = arrRoom.find(tmp => {
		return tmp.name_room == nameRoom;
	});

	if (room) {
		arrRandom.forEach(element => {
			let pos = element.position;
			let name = element.name;
			room.arrGamer[pos].character = name;
		});
	}

	return room;
}

function randomCharacter(obj) {
	let total = obj.totalGamer;
	let arrCharacters = obj.arrCharacters;
	let nameRoom = obj.nameRoom;

	let arrRandom = [];

	let arrCheck = new Array(total).fill(true, 0);

	arrCharacters.forEach(character => {
		let quantity = character.quantity;
		let name = character.name;
		if (quantity > 0 && character.checked) {
			let random = 0;
			for (let i = 0; i < quantity; i++) {
				do {
					random = Math.floor(Math.random() * total);
				} while (!arrCheck[random]);
				console.log(random);
				arrCheck[random] = false;
				arrRandom.push({ position: random, name });
			}
		}
	});

	let rs = { nameRoom, arrRandom };

	return rs;
}

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
