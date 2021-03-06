module.exports = {
	IMAGE_PATH: "public/images",
	DOCUMENT_PATH: "public/document",
	VIDEO_PATH: "public/video",
	AUDIO_PATH: "public/audio",

	HOST: "http://107.113.193.92:3000/",

	// socket event

	SERVER_PUBLIC_MESSAGE: "server-public-msg",

	SERVER_PRIVATE_MESSAGE: "server-private-msg",

	SERVER_NOTIEC_CREATE_ROOM: "server-msg-create-room",

	SERVER_SYSTEM_PUBLIC_MESSAGE: "server-system-msg",

	SERVER_GET_ALL_ROOM: "server-get-all-room",

	SERVER_SEND_DETAIL_ROOM: "server-send-detail-room",

	SERVER_START_GAME: "server-start-game-werewolf",

	SERVER_SEND_INFO_FIRST_VOTE_BY_ROUNF: "server-send-info-fist-vote-by-round",

	SERVER_SEND_INFO_AFTER_NIGHT: "server-send-info-after-night",

	SERVER_SEND_ACTION: "server-send-action",

	CLIENT_PUBLIC_MESSAGE: "client-public-msg",

	CLIENT_PRIVATE_MESSAGE: "client-private-msg",

	CLIENT_INFORMATION: "client-information",

	CLIENT_JOIN_ROOM: "client-join-room",

	CLIENT_CREATE_ROOM: "client-create-room",

	CLIENT_LEAVE_ROOM: "client-leave-room",

	CLIENT_SEND_NAME_ROOM: "client-send-name-room",

	CLIENT_START_GAME: "client-start-game-werewolf",

	CLIENT_FIRST_VOTE: "client-first-vote",

	CLIENT_GET_INFO_FIRST_VOTE_BY_ROUND: "client-get-info-fist-vote-by-round",

	SERVER_SEND_COUND_DOWN: "server-send-cound-down",

	CLIENT_SEND_ACTION: "client-send-action",

	CLIENT_GET_INFO_AFTER_NIGHT: "client-get-info-after-noght",

	CLIENT_GET_DETAIL_ROOM: "client-get-info-after-noght",

	CLIENT_OPEN_FIRST_VOTE: "client-open-first-vote",

	CLIENT_OPEN_SECOND_VOTE: "client-open-second-vote",

	CLIENT_NEXT_ROUND: "client-next-round",

	CLIENT_GET_ALL_ROOM: "client-get-all-room"

	// db.getCollection('posts').aggregate(
	//     [
	//         {
	//             $match: {
	//                 status : "SHOW"
	//             }
	//         },
	//         {
	//             $lookup:{
	//                 from: "users",
	//                 localField: "user",
	//                 foreignField: "_id",
	//                 as: "creator"
	//             }
	//         },
	//         {
	//             $lookup: {
	//                 from : "comments",
	//                 localField: "_id",
	//                 foreignField: "post",
	//                 as: "comments"
	//             }
	//         },
	//         {
	//             $unwind: {
	//                 path: "$comments",
	//                 preserveNullAndEmptyArrays: true
	//             }
	//         },

	//         {
	//             $project:{
	//                 "_id": 1,
	//                 "file_upload": 1,
	//                 "status": 1,
	//                 "create_at": 1,
	//                 "title": 1,
	//                 "content": 1,
	//                 "description": 1,
	//                 "user": "$creator",
	//                 "total_replies": { $ifNull: ["$comments.total_replies"  , 0]},
	//                 "comments" : {$cond : [{$not: ["$comments"]}, 0, 1 ] }
	//                 }
	//         },

	//          {
	//             $group:{
	//                 _id : "$_id",
	//                 file_upload : { $first: '$file_upload' },
	//                 status : { $first: '$status' },
	//                 create_at : { $first: '$create_at' },
	//                 title : { $first: '$title' },
	//                  description : { $first: '$description' },
	//                 content : { $first: '$content' },
	//                 user : { $first: '$user' },
	//                 total_comment: {$sum :{ $sum: [ "$comments", "$total_replies" ] }}
	//             }
	//         }

	//     ]

	// )
};
