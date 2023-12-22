const { Schema, model } = require("mongoose");

const holidaySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        require: true
    },
    endDate: {
        type: Date,
    },
    holidayType: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "companies",
        required: true
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
        }
    })

const holidayModel = model("holiday", holidaySchema)

module.exports = holidayModel