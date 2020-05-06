var mongoose = require("mongoose");

//메일 인증
const MailAuthSchema = new mongoose.Schema({
  webmail: String,
  authNum: Number,
  isAuth: Boolean
});

const Mail = mongoose.model("Mail", MailAuthSchema);
module.exports = Mail;
