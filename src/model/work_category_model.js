const { Schema, model } = require("mongoose");

const workCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret, _option) => {
                delete ret._id;
            },
            virtuals: true,
            versionKey: false,
        },
    }
);


const WorkCategoryModel = model("work-categories", workCategorySchema);

module.exports = WorkCategoryModel;