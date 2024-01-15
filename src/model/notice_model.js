const { Schema, model, SchemaType } = require("mongoose")

const noticeSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "companies"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
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
})

const NoticeModel = model("notice", noticeSchema)

module.exports = NoticeModel