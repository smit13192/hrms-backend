const { Schema, model } = require("mongoose")

const userlogSchema = new Schema({
    empId: {
        type: Schema.Types.ObjectId,
        ref: "employees",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeBlock: [{
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            default: null,
        }
    }],
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret, _option) => {
            delete ret._id;
        },
        virtuals: true,
        versionKey: false,
    }
})

const UserlogModel = model("userlog", userlogSchema)

module.exports = UserlogModel