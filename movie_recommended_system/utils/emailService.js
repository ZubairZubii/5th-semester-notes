const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use 'smtp.gmail.com' as service if needed
  auth: {
    user: "i222591@nu.edu.pk",
    pass: "2250154*Zubair",
  },
});

const sendReminderEmail = async (user, movie) => {
  const mailOptions = {
    from: "i222591@nu.edu.pk",
    to: user.email,
    subject: `Upcoming Movie Release: ${movie.title}`,
    text: `Hi ${user.name},\n\nJust a reminder that the movie "${movie.title}" is releasing soon. Don't miss it!\n\nRelease Date: ${movie.releaseDate}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
};

module.exports = { sendReminderEmail };
