const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String, required: true },
        userName: { type: String, required: true },
        numberOfLikes: { type: Number, required: true},
        numberOfDislikes: { type: Number, required: true},
        publishedDate: { type: String, required: true},
        comments: { type: [{
            key: String,
            value: String
          }] , required: true},
        isPublished: { type: Boolean, required: true},
        numberOfViews: { type: Number, required: true},
        userLikes: {type: [String], required: true},
        userDislikes: {type: [String], required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
