const API_URL = 'http://localhost:3001/reminders';

document.getElementById('searchBar').addEventListener('input', loadReminders);
document
  .getElementById('favoritesToggle')
  .addEventListener('change', loadReminders);
document.getElementById('goBack').addEventListener('click', () => {
  window.location.href = 'index.html';
});

async function loadReminders() {
  const searchTerm = document.getElementById('searchBar').value.toLowerCase();
  const showFavorites = document.getElementById('favoritesToggle').checked;

  try {
    const response = await fetch(API_URL);
    let reminders = await response.json();

    if (showFavorites) {
      reminders = reminders.filter((r) => r.favorite);
    }
    if (searchTerm) {
      reminders = reminders.filter((r) =>
        r.text.toLowerCase().includes(searchTerm)
      );
    }

    displayReminders(reminders);
  } catch (error) {
    console.error('Error loading reminders:', error);
  }
}

function displayReminders(reminders) {
  const reminderList = document.getElementById('reminderList');
  reminderList.innerHTML = '';

  reminders.forEach((reminder) => {
    const listItem = document.createElement('li');

    const leftSide = document.createElement('div');
    leftSide.classList.add('leftListItem');

    const textSide = document.createElement('div');
    textSide.classList.add('textListItem');

    const rightSide = document.createElement('div');
    rightSide.classList.add('rightListItem');

    const reminderSpan = document.createElement('span');
    reminderSpan.classList.add('reminderText');
    reminderSpan.textContent = `${reminder.text}`;

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('reminderDate');
    dateSpan.textContent = `${reminder.dateAdded}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () =>
      editReminder(reminder.id, reminder.text)
    );

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteReminder(reminder.id));

    const favoriteToggle = document.createElement('input');
    favoriteToggle.type = 'checkbox';
    favoriteToggle.checked = reminder.favorite;
    favoriteToggle.addEventListener('change', () =>
      toggleFavorite(reminder.id, favoriteToggle.checked)
    );

    leftSide.appendChild(favoriteToggle);
    textSide.appendChild(reminderSpan);
    textSide.appendChild(dateSpan);
    leftSide.appendChild(textSide);
    rightSide.appendChild(editBtn);
    rightSide.appendChild(deleteBtn);

    listItem.appendChild(leftSide);
    listItem.appendChild(rightSide);
    reminderList.appendChild(listItem);
  });
}

async function editReminder(id, text) {
  const newText = prompt('Edit your reminder:', text);
  if (newText) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newText }),
      });
      loadReminders();
    } catch (error) {
      console.error('Error editing reminder:', error);
    }
  }
}

async function deleteReminder(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadReminders();
  } catch (error) {
    console.error('Error deleting reminder:', error);
  }
}

async function toggleFavorite(id, favorite) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorite }),
    });
    loadReminders();
  } catch (error) {
    console.error('Error updating favorite status:', error);
  }
}

loadReminders();
