const {Schema,model}=require("mongoose")

const leaveSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    startDate: {
        type:Date,
        require: true
    },
    endDate: {
        type: Date
    },
    status:{
        type:String,
        default:pending
    },
    company_id:{
        type:Schema.Types.ObjectId,
        ref:"companies",
        required:true
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

const leaveModel=model("leave",leaveSchema);

module.exports=leaveModel