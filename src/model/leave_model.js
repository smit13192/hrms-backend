const {Schema,model}=require("mongoose")

const leaveSchema=new Schema({
    empId:{
       type:Schema.Types.ObjectId,
       require:true
    },
    leaveReason:{
        type:String,
        require:true
    },
    startDate:{
        type:Date,
        require:true
    },
    endDate:{
        type:Date,
        default:null
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","approved","rejected"]
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

const leaveModel=model("leave",leaveSchema)

module.exports=leaveModel