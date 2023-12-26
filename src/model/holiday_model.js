const { Schema, model } = require("mongoose");

const holidaySchema = new Schema({
    title: {
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
    holidayType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
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

const HolidayModel = model("holiday", holidaySchema)

module.exports = HolidayModel