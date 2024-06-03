import nodemailer from 'nodemailer';

export const sendEmail = async (option: any) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      let mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: option.email,
        subject: option.subject,
        text: option.message
      };

      transporter.sendMail(mailOptions);
}

export const generateOTP = () => {
    let otp = ''
        for (let i = 0; i <= 3; i++) {
            const randVal = Math.round(Math.random() * 9)
            otp = otp + randVal
        }
    return otp;
}