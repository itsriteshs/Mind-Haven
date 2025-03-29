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

    // Show progress section
    progressSection.style.display = 'block';
    progressContent.innerHTML = '<p>Analyzing your entries...</p>';
    
    // Scroll to progress section
    progressSection.scrollIntoView({ behavior: 'smooth' });

    // Prepare entries for analysis - now in chronological order
    const sortedEntries = [...entries].reverse(); // Reverse to get oldest first
    const entriesText = sortedEntries.map(entry => {
        const date = new Date(entry.date).toLocaleDateString();
        return `Entry from ${date}: ${entry.content}`;
    }).join('\n\n');

    try {
        const analysis = await analyzeProgress(entriesText);

        progressContent.innerHTML = `
            <div class="analysis-content">
                <h3>Your Personal Progress Analysis</h3>
                <div class="analysis-text">
                    ${analysis.split('\n').map(para => `<p>${para}</p>`).join('')}
                </div>
            </div>
        `;

    } catch (error) {
        progressContent.innerHTML = `
            <div class="error-message">
                <p>Sorry, there was an error analyzing your entries. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
});

// Replace the existing analyzeProgress function with this:
async function analyzeProgress(entriesText) {
    try {
        const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ entries: entriesText })
        });

        if (!response.ok) {
            throw new Error('Failed to analyze entries');
        }

        const data = await response.json();
        return data.analysis;
    } catch (error) {
        throw new Error('Failed to analyze entries');
    }
}

// Initial display
displayEntries(); 