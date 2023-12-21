const { Schema, model } = require("mongoose");

const departmentSchema = new Schema({
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
})

const DepartmentModel = model("department", departmentSchema);

module.exports = DepartmentModel;