// Get current user
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

// Initialize entries array from localStorage or create empty array
let entries = JSON.parse(localStorage.getItem(`entries_${currentUser.username}`) || '[]');

// DOM Elements
const newEntryTextarea = document.getElementById('new-entry');
const saveEntryBtn = document.getElementById('save-entry');
const entriesGrid = document.getElementById('entries-grid');
const previousEntriesSection = document.querySelector('.previous-entries-section');
const getProgressBtn = document.getElementById('get-progress');
const progressSection = document.getElementById('progress-section');
const progressContent = document.getElementById('progress-content');

// Save new entry
saveEntryBtn.addEventListener('click', () => {
    const content = newEntryTextarea.value.trim();
    if (!content) {
        alert('Please write something before saving.');
        return;
    }

    const entry = {
        id: Date.now(),
        content: content,
        date: new Date().toISOString(),
        username: currentUser.username
    };

    entries.unshift(entry);
    localStorage.setItem(`entries_${currentUser.username}`, JSON.stringify(entries));
    
    newEntryTextarea.value = '';
    displayEntries();
});

// Display entries in grid
function displayEntries() {
    if (entries.length === 0) {
        previousEntriesSection.style.display = 'none';
        return;
    }

    previousEntriesSection.style.display = 'block';
    entriesGrid.innerHTML = '';

    entries.forEach(entry => {
        const entryCard = document.createElement('div');
        entryCard.className = 'entry-card';
        
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        entryCard.innerHTML = `
            <div class="entry-date">${formattedDate}</div>
            <div class="entry-content">${entry.content}</div>
        `;

        entriesGrid.appendChild(entryCard);
    });
}

// Get Progress Analysis
getProgressBtn.addEventListener('click', async () => {
    if (entries.length === 0) {
        alert('Please add some journal entries first.');
        return;
    }

    // Prepare entries for analysis
    const entriesText = entries.map(entry => {
        const date = new Date(entry.date).toLocaleDateString();
        return `Entry from ${date}: ${entry.content}`;
    }).join('\n\n');

    console.log('Sending entries:', entriesText);

    try {
        // Show loading state
        progressSection.style.display = 'block';
        progressContent.innerHTML = 'Analyzing your entries...';
        
        // Scroll to progress section
        progressSection.scrollIntoView({ behavior: 'smooth' });

        const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ entries: entriesText })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received response:', data);

        if (data.analysis) {
            progressContent.innerHTML = data.analysis;
        } else {
            throw new Error('No analysis received');
        }
    } catch (error) {
        console.error('Error:', error);
        progressContent.innerHTML = `Error analyzing entries: ${error.message}`;
    }
});

// Initial display
displayEntries(); 