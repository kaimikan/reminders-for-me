const API_URL = 'http://localhost:3000/reminders';

document
  .getElementById('randomReminderBtn')
  .addEventListener('click', showRandomReminder);
document
  .getElementById('addReminderBtn')
  .addEventListener('click', addReminder);
document.getElementById('viewAllRemindersBtn').addEventListener('click', () => {
  window.location.href = 'reminders.html';
});

// Show a random reminder when the page loads
window.addEventListener('load', showRandomReminder);

async function showRandomReminder() {
  try {
    const response = await fetch(`${API_URL}/random`);
    const reminder = await response.json();

    if (reminder.text) {
      document.getElementById(
        'randomReminder'
      ).innerText = `Reminder: ${reminder.text}`;
    } else {
      document.getElementById('randomReminder').innerText =
        'No reminders available';
    }
  } catch (error) {
    console.error('Error fetching random reminder:', error);
  }
}

async function addReminder() {
  const text = prompt('Enter your reminder:');
  if (text) {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      alert('Reminder added successfully!');
      showRandomReminder(); // Show a new random reminder after adding one
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  }
}
