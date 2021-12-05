const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommunityListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        numberOfLikes: { type: Number, required: true},
        numberOfDislikes: { type: Number, required: true},
        updatedDate: { type: String, required: true},
        comments: { type: [{
            key: String,
            value: String
          }] , required: true},
        numberOfViews: { type: Number, required: true},
        userLikes: {type: [String], required: true},
        userDislikes: {type: [String], required: true},
        itemPointPairs: { type: [{
            key: String,
            value: Number
        }], required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('CommunityList', CommunityListSchema)
