const { Schema, model } = require("mongoose");

const designationSchema = new Schema({
    name: {
        type: String,
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
    },
});

const designationModel = model("designation", designationSchema);

module.exports = designationModel;