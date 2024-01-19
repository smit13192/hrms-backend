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
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        default: null
    },
    hours: {
        type: Number,
        default: null
    },
    minutes: {
        type: Number,
        default: null
    }
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