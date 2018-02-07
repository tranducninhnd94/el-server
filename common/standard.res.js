module.exports = {
    objectSuccess: (rs, msg, value) => {
        return {
            result: rs,
            message: msg,
            value: value
        }
    },

    objectError: (rs, msg, err) => {
        return { result: rs, message: msg, error: err }
    },

    topicResponse: (topic) => {
        return {
            _id: topic._id,
            name: topic.name,
            image_url: topic.image_url,
            create_at: topic.create_at,
            update_at: topic.update_at ? topic.update_at : undefined
        }
    },

    wordResponse: (word) => {
        return {
            image_url: word.image_url,
            audio: word.audio,
            name: word.name,
            pronunciation: word.pronunciation,
            explanation: word.explanation,
            vocabulary: word.vocabulary,
            example: word.example,
            topic: word.topic
        }
    }
}