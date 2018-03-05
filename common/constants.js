module.exports = {
    IMAGE_PATH: 'public/images',
    DOCUMENT_PATH: 'public/document',
    VIDEO_PATH: 'public/video',
    AUDIO_PATH: 'public/audio',

    HOST: "http://107.113.193.92:3000/",

    // socket event
    SERVER_SEND_MESSAGE: "Server_send_message",
    SERVER_SEND_USER_LIST: "Server_send_user_list",

    CLIENT_SEND_MESSAGE: "Client_send_message",
    CLIENT_SEND_INFO: "Client_send_info",

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

}