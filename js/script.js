const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const saveButton = document.getElementById('save');
const viewButton = document.getElementById('view');
const saveMessage = document.getElementById('save-message');
const entryResultRow = document.querySelector('.entryResultRow');
const entryResultsSection = document.getElementById('entryResultsSection');

document.addEventListener('DOMContentLoaded', loadEntries);

saveButton.addEventListener('click', saveJournalEntry);
viewButton.addEventListener('click', viewJournalEntry);

function saveJournalEntry() {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        showMessage('Please enter a title', 'error');
        return;
    }

    if (!description) {
        showMessage('Please enter a description', 'error');
        return;
    }

    const entry = {
        id: Date.now(),
        title: title,
        description: description,
        date: new Date().toISOString()
    };
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

    entries.push(entry);

    localStorage.setItem('journalEntries', JSON.stringify(entries));

    titleInput.value = '';
    descriptionInput.value = '';

    showMessage('Journal entry saved successfully!', 'success');

    loadEntries();
}

function viewJournalEntry() {
    loadEntries();
    showMessage('Entries loaded successfully!', 'success');

    if (entryResultsSection) {
        entryResultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function loadEntries() {

    if (entryResultRow) {
        entryResultRow.innerHTML = '';
    }

    const existingHeading = document.querySelector('.heading-results');
    if (existingHeading) {
        existingHeading.remove();
    }

    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

    if (entries.length === 0) {
        const noEntriesMsg = document.createElement('p');
        noEntriesMsg.className = 'no-entries';
        noEntriesMsg.textContent = 'No journal entries yet. Create your first entry!';
        entryResultRow.appendChild(noEntriesMsg);
        return;
    }


    const heading = document.createElement('h2');
    heading.className = 'heading-results';
    heading.textContent = 'Journal Entries';


    entryResultRow.parentNode.insertBefore(heading, entryResultRow);


    entries.reverse().forEach(entry => {
        addEntryToDom(entry);
    });
}

function addEntryToDom(entry) {
    const date = new Date(entry.date);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const entryDiv = document.createElement('div');
    entryDiv.className = 'single-entry-div';
    entryDiv.setAttribute('data-id', entry.id);

    const entryHeading = document.createElement('h3');
    entryHeading.className = 'single-entry-heading';
    entryHeading.textContent = entry.title;
    entryDiv.appendChild(entryHeading);

    const entryDate = document.createElement('p');
    entryDate.className = 'single-entry-date';
    entryDate.textContent = `Date Added: ${month} ${day}, ${year}`;
    entryDiv.appendChild(entryDate);

    const entryParagraph = document.createElement('p');
    entryParagraph.className = 'single-entry-text';
    entryParagraph.textContent = entry.description;
    entryDiv.appendChild(entryParagraph);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-entry';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteEntry(entry.id));
    entryDiv.appendChild(deleteButton);

    entryResultRow.appendChild(entryDiv);
}

function deleteEntry(entryId) {
    if (confirm('Are you sure you want to delete this entry?')) {
        let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        entries = entries.filter(entry => entry.id !== entryId);
        localStorage.setItem('journalEntries', JSON.stringify(entries));

        showMessage('Journal entry deleted successfully!', 'success');
        loadEntries();
    }
}

function showMessage(message, type) {
    saveMessage.textContent = message;
    saveMessage.className = `save-feedback ${type}`;

    setTimeout(() => {
        saveMessage.textContent = '';
        saveMessage.className = 'save-feedback';
    }, 3000);
}