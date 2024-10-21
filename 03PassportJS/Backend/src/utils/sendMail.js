import nodemailer from "nodemailer";
import Imap from 'imap';
import { simpleParser } from 'mailparser';

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

const checkEmailBounce = (email) => {
    return new Promise((resolve, reject) => {
        const imap = new Imap({
            user: process.env.USER,
            password: process.env.PASS,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        });

        console.log(`Checking for bounced email: ${email}`);

        imap.once('ready', () => {
            imap.openBox('INBOX', true, (err, box) => {
                if (err) return reject(err);

                const lastEmail = box.messages.total;
                const fetchRange = `${Math.max(1, lastEmail - 4)}:${lastEmail}`;
                const f = imap.seq.fetch(fetchRange, {bodies: '', markSeen: false});

                let hasBounced = false;
                let messagesProcessed = 0; // Track processed messages
                const totalMessages = lastEmail >= 5 ? 5 : lastEmail; 

                f.on('message', (msg) => {
                    msg.on('body', (stream) => {
                        simpleParser(stream, (err, mail) => {
                            if (err) return reject(err);

                            console.log(`Subject: ${mail.subject}`);
                            const normalizedSubject = mail.subject ? mail.subject.toLowerCase() : '';
                            if (normalizedSubject.includes('delivery status notification') || normalizedSubject.includes('address not found')) {
                                console.log("Processing bounce email...");
                                if (mail.text && mail.text.includes('550 5.1.1 The email account that you tried to reach does not exist')) {
                                    console.log('Email bounce detected in body content');
                                    const bouncedEmailMatch = mail.text.match(/(?:To:|Final-Recipient:)\s*rfc822;?\s*([^\s<>]+)/i);
                                    if (bouncedEmailMatch) {
                                        const bouncedEmail = bouncedEmailMatch[1].trim();
                                        console.log(`Bounced email from body: ${bouncedEmail}`);
                                        if (bouncedEmail.toLowerCase() === email.toLowerCase()) {
                                            hasBounced = true;
                                            console.log(`Bounced email matched in body: ${bouncedEmail}`);
                                        }
                                    }  
                                }
                            }
                            messagesProcessed++; // Increment processed messages
                            console.log('Finished processing message');
                            if (messagesProcessed === totalMessages) {
                                imap.end(); // End connection only when all messages are processed
                                resolve(hasBounced); // Resolve once all messages are done
                            }
                        });
                    });
                });

                f.once('error', (err) => reject(err));
                f.once('end', () => {
                    if (messagesProcessed === totalMessages) { // Double-check all messages processed
                        console.log('All messages processed.');
                        imap.end();
                        resolve(hasBounced);
                    }
                });
            });
        });

        imap.once('error', (err) => reject(err));
        imap.connect();
    });
};


export {
    sendMail,
    checkEmailBounce
}