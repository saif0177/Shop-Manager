// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Setup event listeners first
    setupNotesEventListeners();
    
    // Load notes when on the notes page
    if (document.getElementById('notes').classList.contains('active')) {
        loadNotes();
    }
    
    // If navigating to notes later, load notes
    document.querySelector('[data-page="notes"]').addEventListener('click', () => {
        // Show loading indicator
        const notesGrid = document.getElementById('notesGrid');
        notesGrid.innerHTML = `
            <div class="loading-notes">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading notes...</p>
            </div>
        `;
        
        // Use setTimeout to ensure UI updates before loading notes
        setTimeout(() => {
            loadNotes();
        }, 50);
    });
});

// Sample notes data - in a real app, this would come from the server
const demoNotes = [
    {
        id: 1,
        title: 'Order New Inventory',
        content: 'Need to order more T-shirts in size M and L. Current stock is running low.',
        date: '2023-06-14T09:30:00'
    },
    {
        id: 2,
        title: 'Summer Sale Planning',
        content: 'Start preparing for summer sale. Need to decide on discount percentages and which products to include.',
        date: '2023-06-13T14:45:00'
    },
    {
        id: 3,
        title: 'Website Updates',
        content: 'Schedule meeting with web developer to discuss new features for the shop management system.',
        date: '2023-06-12T11:20:00'
    },
    {
        id: 4,
        title: 'Customer Feedback',
        content: 'Several customers mentioned they would like more color options for the cargo pants. Consider adding new colors.',
        date: '2023-06-11T16:10:00'
    },
    {
        id: 5,
        title: 'Supplier Meeting',
        content: 'Meeting with new supplier on June 20th at 2 PM. Discuss bulk order discounts and delivery times.',
        date: '2023-06-10T13:05:00'
    }
];

// Load notes
function loadNotes() {
    const notesGrid = document.getElementById('notesGrid');
    
    // Clear the existing notes
    notesGrid.innerHTML = '';
    
    // Sort notes by date (newest first)
    const sortedNotes = [...demoNotes].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add notes to the grid
    if (sortedNotes.length > 0) {
        sortedNotes.forEach(note => {
            const noteCard = createNoteCard(note);
            notesGrid.appendChild(noteCard);
        });
    } else {
        // Display a message if no notes found
        notesGrid.innerHTML = `
            <div class="no-notes">
                <i class="fas fa-sticky-note"></i>
                <p>No notes yet. Click the "Add Note" button to create your first note.</p>
            </div>
        `;
    }
}

// Create a note card element
function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.dataset.id = note.id;
    
    // Format date
    const noteDate = new Date(note.date);
    const formattedDate = noteDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // For long content, truncate and add ellipsis
    const maxContentLength = 150;
    let displayContent = note.content;
    
    if (note.content.length > maxContentLength) {
        displayContent = note.content.substring(0, maxContentLength) + '...';
    }
    
    card.innerHTML = `
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${displayContent}</p>
        <p class="note-date">${formattedDate}</p>
        <div class="note-actions">
            <button class="edit-note-btn" title="Edit Note">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-note-btn" title="Delete Note">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Setup event listeners for notes-related functionality
function setupNotesEventListeners() {
    const notesGrid = document.getElementById('notesGrid');
    const noteForm = document.getElementById('noteForm');
    
    // Edit and delete notes
    if (notesGrid) {
        notesGrid.addEventListener('click', (e) => {
            // Edit button clicked
            if (e.target.closest('.edit-note-btn')) {
                const noteCard = e.target.closest('.note-card');
                const noteId = parseInt(noteCard.dataset.id);
                editNote(noteId);
            }
            
            // Delete button clicked
            if (e.target.closest('.delete-note-btn')) {
                const noteCard = e.target.closest('.note-card');
                const noteId = parseInt(noteCard.dataset.id);
                deleteNote(noteId, noteCard);
            }
        });
    }
    
    // Handle note form submission
    if (noteForm) {
        noteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveNote();
        });
    }
}

// Edit a note
function editNote(noteId) {
    const note = demoNotes.find(n => n.id === noteId);
    
    if (note) {
        // Set the modal title
        document.getElementById('noteModalTitle').textContent = 'Edit Note';
        
        // Fill the form with note data
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        
        // Add the note ID to the form for reference
        document.getElementById('noteForm').dataset.id = noteId;
        
        // Open the modal
        openModal(document.getElementById('noteModal'));
    }
}

// Delete a note
function deleteNote(noteId, noteCard) {
    if (confirm('Are you sure you want to delete this note?')) {
        // In a real app, you would send a request to the server
        // For demo, we'll just remove the card from DOM
        noteCard.remove();
        
        // Remove from the array (in a real app, this would be handled by the server)
        const index = demoNotes.findIndex(n => n.id === noteId);
        if (index !== -1) {
            demoNotes.splice(index, 1);
        }
        
        alert('Note deleted successfully!');
    }
}

// Save a note (create or update)
function saveNote() {
    const noteForm = document.getElementById('noteForm');
    const noteId = noteForm.dataset.id ? parseInt(noteForm.dataset.id) : null;
    
    // Get form data
    const noteData = {
        title: document.getElementById('noteTitle').value,
        content: document.getElementById('noteContent').value,
        date: new Date().toISOString()
    };
    
    if (noteId) {
        // Update existing note
        const index = demoNotes.findIndex(n => n.id === noteId);
        if (index !== -1) {
            noteData.id = noteId;
            demoNotes[index] = noteData;
        }
    } else {
        // Add new note
        noteData.id = demoNotes.length > 0 ? Math.max(...demoNotes.map(n => n.id)) + 1 : 1;
        demoNotes.push(noteData);
    }
    
    // Close the modal
    closeModal(document.getElementById('noteModal'));
    
    // Reload the notes
    loadNotes();
    
    // Reset the form
    noteForm.reset();
    delete noteForm.dataset.id;
}

// Modal functions - duplicating from main.js to ensure this file works independently
function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
} 