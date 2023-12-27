const { Schema, model } = require("mongoose")

const projectSchema = new Schema({
    projectTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "upcoming",
        enum: ['upcoming', 'complete', 'running']
    },
    returnDate:{
        type:Date
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "companies",
        required: true
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
});

const ProjectModel = model("project", projectSchema);

module.exports = ProjectModel