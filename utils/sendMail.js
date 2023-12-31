const nodemailer=require('nodemailer');
const dotenv=require('dotenv');
dotenv.config();
class sendMail {
    constructor(user){
        this.user=user;
    };
    createTransport(){
        return nodemailer.createTransport({
            host: "smtp-mail.outlook.com", 
            secureConnection: false, 
            port: 587, 
            service: "outlook",
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
            tls: {
                ciphers: "SSLv3",
            },
        });
    };
    createRandomCode(){
        let i=0;
        let resetCode='';
        while(i<6){
            resetCode += Math.trunc(Math.random()*9);
            i++;
        };
        return resetCode;
    };
    sendCode(code){
        return this.createTransport().sendMail({
            from: "facebook clone",
            subject:"change your facebook clone password",
            text:`your reset code to set your facebook clone password is ${code}`,
            to:this.user.email,
        });
    };
};

module.exports=sendMail;