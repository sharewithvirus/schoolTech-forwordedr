    const mongoose = require("mongoose");

    const AttendanceSchema = new mongoose.Schema({
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "",
            required: true,
        },
        attendanceTime: {
            type: Date,
            required: true,
        }
    });

    // UserSchema.pre("save", async function (next) {
    // if (!this.isModified("password")) return next();
    // this.password = await bcrypt.hash(this.password, 12);
    // this.passwordConfirm = undefined;
    // next();
    // });

    // UserSchema.methods.correctPassword = async function (
    // candidatePassword,
    // userPassword
    // ) {
    // return await bcrypt.compare(candidatePassword, userPassword);
    // };


    module.exports = mongoose.model("Attendance", AttendanceSchema);
