const { Schema, model } = require("mongoose")

const leaveSchema = new Schema({
    empId: {
        type: Schema.Types.ObjectId,
        ref: "employees",
        required: true
    },
    leaveTitle:{
        type: String,
        required: true
    },
    leaveReason: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "approved", "rejected"]
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

const LeaveModel = model("leave", leaveSchema)

module.exports = LeaveModel