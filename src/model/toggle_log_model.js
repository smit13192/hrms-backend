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
    tags: [
      {  type: Schema.Types.ObjectId,
        ref: "tags",}
    ],
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        // required: true
    },
    endTime: {
        type: String,
        // default: null
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

const ToggleLogModel = model("toggleLog", toggleLogSchema)

module.exports = ToggleLogModel