const { Schema, model } = require("mongoose");

const designationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "companies",
        required: true,
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

const DesignationModel = model("designation", designationSchema);

module.exports = DesignationModel;