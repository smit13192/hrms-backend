const { Schema, model } = require("mongoose")

const toggleLogSchema = new Schema({
    empId: {
        type: Schema.Types.ObjectId,
        ref: "employees",
        required: true
    },
    updateMessage: {
        type: String,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "project",
    },
    tags: {
        type: String,
        default: null,
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    }
})

const ToggleLogModel = model("toggleLog", toggleLogSchema)

module.exports = ToggleLogModel