const { Schema, model } = require("mongoose");
const { hashPassword } = require("../utils/hash");

const employeeSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: "companies",
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: null,
    },
    publicId: {
        type: String,
        default: null,
    },
    mobileNo: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    departement: {
        type: Schema.Types.ObjectId,
        ref: "department",
        required: true,
    },
    designation: {
        type: Schema.Types.ObjectId,
        ref: "designation",
        required: true,
    },
    isWorking: {
        type: Boolean,
        default: true,
    },
    doj: {
        type: Date,
        required: true,
    },
    dob: {
        type: Date,
        default: null,
    },
    dol: {
        type: Date,
        default: null,
    },
    fatherName: {
        type: String,
        default: null,
    },
    motherName: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        default: null,
    },
    city: {
        type: String,
        default: null,
    },
    state: {
        type: String,
        default: null,
    },
    country: {
        type: String,
        default: null,
    },
    pincode: {
        type: String,
        default: null,
    },
    adharCardNumber: {
        type: String,
        default: null,
    },
    emergencyContactNumber: {
        type: String,
        default: null,
    },
    emergencyPersonContactNumber: {
        type: String,
        default: null,
    },
    bankName: {
        type: String,
        default: null
    },
    acHolderName: {
        type: String,
        default: null
    },
    acNumber: {
        type: String,
        default: null
    },
    ifscCode: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret, _option) => {
            delete ret._id;
            delete ret.password;
        },
        virtuals: true,
        versionKey: false,
    },
});

employeeSchema.pre("save", function (next) {
    if (this.isModified(["password"])) {
        this.password = hashPassword(this.password);
    }
    next();
});

employeeSchema.statics.getCompanyId = async function (employeeId) {
    const employee = await EmployeeModel.findById(employeeId).select(["company"]);
    return employee.company;
}

const EmployeeModel = model("employees", employeeSchema);

module.exports = EmployeeModel;