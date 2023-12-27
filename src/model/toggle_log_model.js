const { Schema, model } = require("mongoose")

const toggleLogSchema=new Schema({
    empId: {
        type: Schema.Types.ObjectId,
        ref: "employees",
        required: true
    },
    updateMessage:{
        type:String,
        required:true
    },
    project:{
        type: Schema.Types.ObjectId,
        ref: "projects",
    },
    tags:{
        type:String,
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        default:null
    }
},{
    timestamps: true,
    toJSON: {
        transform: (_doc, ret, _option) => {
            delete ret._id;
        },
        virtuals: true,
        versionKey: false,
    }
})

const ToggleLogModel=model("toggleLog",toggleLogSchema)

module.exports=ToggleLogModel