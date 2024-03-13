const { Schema, model } = require("mongoose")

const leaveSchema = new Schema({
    empId: {
        type: Schema.Types.ObjectId,
        ref: "employees",
        required: true
    },
    leaveTitle: {
        type: String,
        required: true
    },
    leaveReason: {
        type: String,
        default: null
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "approved", "rejected"]
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    }
})

const LeaveModel = model("leave", leaveSchema)

module.exports = LeaveModel