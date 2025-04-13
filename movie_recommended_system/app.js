const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth_Routes');
const userRoutes = require('./routes/user_Routes');
const movieRoutes = require('./routes/movieRoutes'); // Import movie routes
const actorRoutes = require('./routes/actorRoutes');
const swaggerSetup = require('./swagger');  // Import the swagger setup file

const reviewRoutes = require('./routes/reviewRoutes');
const bodyParser = require('body-parser');

require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());  // This line is crucial for parsing the request body

// Connect to the database
connectDB();

//done
// Log route loading for debugging
console.log("authRoutes loaded");
app.use('/api/auth', authRoutes);
//done
console.log("userRoutes loaded");
app.use('/api/user', userRoutes);

console.log("movieRoutes loaded");
app.use('/api/movies', movieRoutes); 
//done
console.log("actorRoutes loaded");
app.use('/api/actors', actorRoutes);   // Actor profile routes

//done
const listRoutes = require('./routes/listRoutes');
console.log("listRoutes loaded");
app.use('/api/lists', listRoutes);


//done
const directorRoutes = require('./routes/directorRoutes'); // Make sure it's pointing to the correct file
console.log("directorRoutes loaded");
app.use('/api/directors', directorRoutes); // Ensure this is properly calling the router

//done
console.log("reviewRoutes loaded");
app.use('/api/reviews', reviewRoutes);



//done
// Load additional routes
const recommendationRoutes = require('./routes/recommendationRoutes');
console.log("recommendationRoutes loaded");
app.use('/api/recommendations', recommendationRoutes);


//done
const cron = require('node-cron');
const Reminder = require('./models/Reminder');
const User = require('./models/User');
const Movie = require('./models/Movie');
const { sendReminderEmail } = require('./utils/emailService');

// Cron job that runs every minute to check if any reminder time is due
cron.schedule('* * * * *', async () => {
  try {
    const reminders = await Reminder.find({ isSent: false, reminderTime: { $lte: new Date() } });

    for (let reminder of reminders) {
      const user = await User.findById(reminder.user);
      const movie = await Movie.findById(reminder.movie);

      // Send the reminder email
      await sendReminderEmail(user, movie);

      // Mark the reminder as sent
      reminder.isSent = true;
      await reminder.save();
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
});

const reminderRoutes = require('./routes/reminderRoutes'); // Import the reminder routes
// Use the reminder routes
app.use('/api/reminder', reminderRoutes);






//done

// Forum and Moderation routes
const forumRoutes = require('./routes/forumRoutes');
// Forum routes
console.log("forumRoutes loaded");
app.use('/api/forum', forumRoutes);


//done
// News routes
console.log("newsRoutes loaded");
const newsRoutes = require('./routes/newsRoutes'); // Import the news routes

app.use('/api/news', newsRoutes);



const moderationRoutes = require('./routes/moderationRoutes');

// Moderation routes (restricted to admins)
console.log("moderationRoutes loaded");
app.use('/api/moderation', moderationRoutes);





const adminRoutes = require('./routes/adminRoutes'); // Correct path

// Register the analytics routes
app.use('/admin/analytics', adminRoutes);



const insightsRoutes = require('./routes/insightsRoutes');
app.use('/admin/insights', insightsRoutes);

// Middleware, routes, and other setup go here...

// Set up Swagger UI
swaggerSetup(app);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
