import nodemailer from "nodemailer";

const sendMail = async(email,subject,text,userId) => {
    try {
        const transporter = nodemailer.createTransport({
            host : process.env.HOST,
            service : process.env.SECURE,
            post : Number(process.env.EMAIL_PORT),
            secure : process.env.SECURE,
            auth : {
                user : process.env.USER,
                pass : process.env.PASS
            }
        })

        let info = await transporter.sendMail({
            from : process.env.USER,
            to : email,
            subject : subject,
            text : text,
            headers: {
                'X-User-ID': userId 
            }
        })

        console.log(info);

        console.log("Email Sent Successfully");
    } catch (error) {
        console.log("Email Not Send");
        console.log(error);
        return null
    }
}

export {
    sendMail
}