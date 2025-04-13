require('dotenv').config();
const { sendReminderEmail } = require('../utils/emailService');



// Sample user and movie data for testing
const sampleUser = {
  email: 'zs970120@gmail.com',
  name: 'Zubair Ali',
};

const sampleMovie = {
  title: 'Inception',
  releaseDate: '2023-12-01',
};

// Call sendReminderEmail to test
sendReminderEmail(sampleUser, sampleMovie)
  .then(() => {
    console.log('Test email sent successfully');
  })
  .catch((error) => {
    console.error('Error sending test email:', error);
  });
