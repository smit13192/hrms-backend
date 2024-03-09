const {Schema,model}=require("mongoose")

const teamSchema=new Schema({
    companyId:{
        type:Schema.Types.ObjectId,
        ref:"companies",
        required:true
    },
    projectTitle:{
        type:Schema.Types.ObjectId,
        ref:"project",
        required:true
    },
    startDate:{
        type:Date,
        require:true
    },
    endDate:{
        type:Date,
        default:null
    },
    leader:{
        leaderId:{
            type:Schema.Types.ObjectId,
            ref:"employees",
            required:true
        },
        members:[{
            type:Schema.Types.ObjectId,
            ref:"employees",
            required:true
        }],
    },
    isWorking:{
        type:Boolean,
        default:true
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

const TeamModel=model("team",teamSchema)

module.exports=TeamModel