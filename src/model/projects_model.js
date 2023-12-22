const {Schema,model}=require("mongoose")

const projectSchema=new Schema({
    projectTitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    clientName:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:"upcoming",
        enum: ['upcoming', 'complete', 'running']
    },
    company_id:{
        type:Schema.Types.ObjectId,
        ref:"companies"
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

const projectModel=model("project",projectSchema)

module.exports=projectModel