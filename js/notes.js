/**
 * StudySync Notes Module
 * Handles note creation, editing, deletion, and display
 */

// Initialize notes functionality
function initNotes() {
    loadNotes();
    setupNoteModal();
    setupNoteSearch();
    setupAddNoteButton();
}

// Load and display notes
function loadNotes() {
    const notesContainer = document.getElementById('notesContainer');
    if (!notesContainer) return;
    
    // Clear container
    notesContainer.innerHTML = '';
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get notes for current user
    const allNotes = JSON.parse(localStorage.getItem('notes')) || {};
    const userNotes = allNotes[currentUser.id] || [];
    
    // Sort notes by timestamp (newest first)
    userNotes.sort((a, b) => b.timestamp - a.timestamp);
    
    if (userNotes.length === 0) {
        // Show empty state
        notesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sticky-note fa-3x"></i>
                <h3>No notes yet</h3>
                <p>Click the "Add Note" button to create your first note.</p>
            </div>
        `;
        return;
    }
    
    // Create note cards
    userNotes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesContainer.appendChild(noteCard);
    });
}

// Create a note card element
function createNoteCard(note) {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.setAttribute('data-id', note.id);
    
    // Format date
    const date = new Date(note.timestamp);
    const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    // Truncate content for preview
    const truncatedContent = note.content.length > 150 
        ? note.content.substring(0, 150) + '...' 
        : note.content;
    
    noteCard.innerHTML = `
        <h3>${note.title}</h3>
        <div class="note-content">${truncatedContent}</div>
        <div class="note-footer">
            <span>${formattedDate}</span>
            <div class="note-actions">
                <button class="export-note" title="Export to PDF"><i class="fas fa-file-pdf"></i></button>
                <button class="edit-note" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="delete-note delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
    
    // Add event listeners
    noteCard.addEventListener('click', (e) => {
        // Prevent event from triggering when clicking on action buttons
        if (!e.target.closest('.note-actions')) {
            openNoteModal('edit', note);
        }
    });
    
    // Edit button
    noteCard.querySelector('.edit-note').addEventListener('click', (e) => {
        e.stopPropagation();
        openNoteModal('edit', note);
    });
    
    // Delete button
    noteCard.querySelector('.delete-note').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this note?')) {
            deleteNote(note.id);
        }
    });
    
    // Export button
    noteCard.querySelector('.export-note').addEventListener('click', (e) => {
        e.stopPropagation();
        exportNoteToPDF(note);
    });
    
    return noteCard;
}

// Export note to PDF
function exportNoteToPDF(note) {
    try {
        // Create PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set document properties
        doc.setProperties({
            title: note.title,
            subject: 'StudySync Note',
            author: 'StudySync',
            creator: 'StudySync'
        });
        
        // Add title
        doc.setFontSize(18);
        doc.text(note.title, 20, 20);
        
        // Add date
        const date = new Date(note.timestamp);
        const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        doc.setFontSize(10);
        doc.text(`Created: ${formattedDate}`, 20, 30);
        
        // Add content with word wrapping
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(note.content, 170);
        doc.text(splitText, 20, 40);
        
        // Save the PDF
        doc.save(`${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'toast success';
        successMessage.textContent = 'Note exported to PDF successfully!';
        document.body.appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    } catch (error) {
        console.error('Error exporting note to PDF:', error);
        alert('Failed to export note to PDF. Please try again.');
    }
}

// Setup note modal
function setupNoteModal() {
    const modal = document.getElementById('noteModal');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelNoteBtn');
    const form = document.getElementById('noteForm');
    
    // Close modal on X button click
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal on cancel button click
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const noteId = document.getElementById('noteId').value;
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        
        if (title && content) {
            if (noteId) {
                // Edit existing note
                updateNote(noteId, title, content);
            } else {
                // Create new note
                createNote(title, content);
            }
            
            // Close modal
            modal.style.display = 'none';
        }
    });
}

// Open note modal for creating or editing
function openNoteModal(mode, note = null) {
    const modal = document.getElementById('noteModal');
    const modalTitle = document.getElementById('noteModalTitle');
    const noteIdInput = document.getElementById('noteId');
    const noteTitleInput = document.getElementById('noteTitle');
    const noteContentInput = document.getElementById('noteContent');
    
    // Set modal title based on mode
    modalTitle.textContent = mode === 'create' ? 'Add New Note' : 'Edit Note';
    
    // Clear form
    noteIdInput.value = '';
    noteTitleInput.value = '';
    noteContentInput.value = '';
    
    // If editing, populate form with note data
    if (mode === 'edit' && note) {
        noteIdInput.value = note.id;
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
    }
    
    // Show modal
    modal.style.display = 'block';
    
    // Focus on title input
    noteTitleInput.focus();
}

// Setup add note button
function setupAddNoteButton() {
    const addNoteBtn = document.getElementById('addNoteBtn');
    
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', () => {
            openNoteModal('create');
        });
    }
}

// Create a new note
function createNote(title, content) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get notes for current user
    const allNotes = JSON.parse(localStorage.getItem('notes')) || {};
    const userNotes = allNotes[currentUser.id] || [];
    
    // Create new note
    const newNote = {
        id: Date.now().toString(),
        title,
        content,
        timestamp: Date.now()
    };
    
    // Add new note to user's notes
    userNotes.push(newNote);
    
    // Update notes in localStorage
    allNotes[currentUser.id] = userNotes;
    localStorage.setItem('notes', JSON.stringify(allNotes));
    
    // Reload notes
    loadNotes();
}

// Update an existing note
function updateNote(id, title, content) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get notes for current user
    const allNotes = JSON.parse(localStorage.getItem('notes')) || {};
    const userNotes = allNotes[currentUser.id] || [];
    
    // Find note index
    const noteIndex = userNotes.findIndex(note => note.id === id);
    
    if (noteIndex !== -1) {
        // Update note
        userNotes[noteIndex].title = title;
        userNotes[noteIndex].content = content;
        userNotes[noteIndex].timestamp = Date.now();
        
        // Update notes in localStorage
        allNotes[currentUser.id] = userNotes;
        localStorage.setItem('notes', JSON.stringify(allNotes));
        
        // Reload notes
        loadNotes();
    }
}

// Delete a note
function deleteNote(id) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get notes for current user
    const allNotes = JSON.parse(localStorage.getItem('notes')) || {};
    const userNotes = allNotes[currentUser.id] || [];
    
    // Filter out the note to delete
    const updatedNotes = userNotes.filter(note => note.id !== id);
    
    // Update notes in localStorage
    allNotes[currentUser.id] = updatedNotes;
    localStorage.setItem('notes', JSON.stringify(allNotes));
    
    // Reload notes
    loadNotes();
}

// Setup note search functionality
function setupNoteSearch() {
    const searchInput = document.getElementById('noteSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            searchNotes(searchTerm);
        });
    }
}

// Search notes
function searchNotes(searchTerm) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get notes for current user
    const allNotes = JSON.parse(localStorage.getItem('notes')) || {};
    const userNotes = allNotes[currentUser.id] || [];
    
    // Get notes container
    const notesContainer = document.getElementById('notesContainer');
    
    // Clear container
    notesContainer.innerHTML = '';
    
    // If search term is empty, show all notes
    if (!searchTerm) {
        loadNotes();
        return;
    }
    
    // Filter notes by search term
    const filteredNotes = userNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) || 
        note.content.toLowerCase().includes(searchTerm)
    );
    
    if (filteredNotes.length === 0) {
        // Show no results message
        notesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>No results found</h3>
                <p>Try a different search term.</p>
            </div>
        `;
        return;
    }
    
    // Create note cards for filtered notes
    filteredNotes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesContainer.appendChild(noteCard);
    });
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initNotes); 