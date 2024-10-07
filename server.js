const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for front-end
app.use(express.static(path.join(__dirname, '.')));

// Function to read reminders from file
function readReminders() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data).reminders;
}

// Function to write reminders to file
function writeReminders(reminders) {
  const data = JSON.stringify({ reminders }, null, 2);
  fs.writeFileSync(DATA_FILE, data);
}

// Get all reminders
app.get('/reminders', (req, res) => {
  const reminders = readReminders();
  res.json(reminders);
});

// Get a random reminder
app.get('/reminders/random', (req, res) => {
  const reminders = readReminders();
  if (reminders.length > 0) {
    const randomReminder =
      reminders[Math.floor(Math.random() * reminders.length)];
    res.json(randomReminder);
  } else {
    res.status(404).json({ error: 'No reminders available' });
  }
});

// Add a new reminder
app.post('/reminders', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const reminders = readReminders();
  const newReminder = {
    id: reminders.length ? reminders[reminders.length - 1].id + 1 : 1,
    text: text,
    dateAdded: new Date().toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    }), // Local date-time format
    favorite: false,
  };

  reminders.push(newReminder);
  writeReminders(reminders);
  res.status(201).json(newReminder);
});

// Edit a reminder
app.put('/reminders/:id', (req, res) => {
  const { id } = req.params;
  const { text, favorite } = req.body;
  const reminders = readReminders();

  const reminderIndex = reminders.findIndex((r) => r.id === parseInt(id));
  if (reminderIndex === -1) {
    return res.status(404).json({ error: 'Reminder not found' });
  }

  reminders[reminderIndex].text = text || reminders[reminderIndex].text;
  reminders[reminderIndex].favorite =
    favorite ?? reminders[reminderIndex].favorite;

  writeReminders(reminders);
  res.json(reminders[reminderIndex]);
});

// Delete a reminder
app.delete('/reminders/:id', (req, res) => {
  const { id } = req.params;
  let reminders = readReminders();

  const newReminders = reminders.filter((r) => r.id !== parseInt(id));
  if (newReminders.length === reminders.length) {
    return res.status(404).json({ error: 'Reminder not found' });
  }

  writeReminders(newReminders);
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
