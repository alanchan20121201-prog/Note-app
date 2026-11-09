let notes = JSON.parse(localStorage.getItem('my_notes')) || [];
let trash = JSON.parse(localStorage.getItem('my_trash')) || [];
let currentNoteId = null;
let currentView = 'notes';

window.onload = function() {
    applyI18n();
    document.getElementById('sidebarTitle').textContent = t('sidebar.notes');
    renderNoteList();
    if (notes.length > 0) {
        loadNote(notes[0].id);
    } else {
        createNewNote();
    }
};

function switchTab(view) {
    currentView = view;
    document.getElementById('tabNotes').className = `tab-btn ${view === 'notes' ? 'active' : ''}`;
    document.getElementById('tabTrash').className = `tab-btn ${view === 'trash' ? 'active' : ''}`;
    document.getElementById('sidebarTitle').textContent = t(view === 'notes' ? 'sidebar.notes' : 'sidebar.trash');
    renderNoteList();
}

function renderNoteList() {
    const listContainer = document.getElementById('noteList');
    listContainer.innerHTML = '';

    const dataSource = currentView === 'notes' ? notes : trash;

    if (dataSource.length === 0) {
        listContainer.innerHTML = `<div style="padding: 15px; color: #999; font-size: 13px; text-align: center;">${t(currentView === 'notes' ? 'empty.notes' : 'empty.trash')}</div>`;
        return;
    }

    dataSource.forEach(note => {
        const item = document.createElement('div');
        item.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
        
        if (currentView === 'notes') {
            item.innerHTML = `
                <div class="note-info" onclick="loadNote('${note.id}')">
                    <div class="note-title">${escapeHtml(note.title || t('note.untitled'))}</div>
                    <div class="note-date">${note.date} ${note.time}</div>
                </div>
                <div class="note-actions">
                    <button class="btn-icon" onclick="exportNoteDirect(event, '${note.id}')" title="${t('title.export')}">📥</button>
                    <button class="btn-icon btn-delete" onclick="moveToTrash(event, '${note.id}')" title="${t('title.delete')}">✕</button>
                </div>
            `;
        } else {
            item.innerHTML = `
                <div class="note-info">
                    <div class="note-title" style="color: #888;">${escapeHtml(note.title || t('note.untitled'))}</div>
                    <div class="note-date">${note.date} ${note.time}</div>
                </div>
                <div class="note-actions">
                    <button class="btn-icon" onclick="restoreNote(event, '${note.id}')" title="${t('title.restore')}">♻️</button>
                    <button class="btn-icon btn-delete" onclick="deleteForever(event, '${note.id}')" title="${t('title.deleteForever')}">🗑️</button>
                </div>
            `;
        }
        listContainer.appendChild(item);
    });
}

function createNewNote() {
    currentNoteId = null;
    document.getElementById('title').value = '';
    
    const now = new Date();
    document.getElementById('noteDate').value = now.toISOString().split('T')[0];
    document.getElementById('noteTime').value = now.toTimeString().split(' ')[0].substring(0, 5);
    
    document.getElementById('content').value = '';
    hideError();
    if (currentView === 'notes') renderNoteList();
}

function loadNote(id) {
    if (currentView !== 'notes') return;
    const note = notes.find(n => n.id === id);
    if (!note) return;

    currentNoteId = note.id;
    document.getElementById('title').value = note.title;
    document.getElementById('noteDate').value = note.date;
    document.getElementById('noteTime').value = note.time;
    document.getElementById('content').value = note.content;
    hideError();
    renderNoteList();
}

function saveNote() {
    const titleInput = document.getElementById('title');
    const title = titleInput.value.trim();
    const date = document.getElementById('noteDate').value;
    const time = document.getElementById('noteTime').value;
    const content = document.getElementById('content').value;

    hideError();

    if (!title) {
        showError(t('error.titleEmpty'));
        return;
    }

    const invalidChars = /[\\/:\*\?"<>|]/;
    if (invalidChars.test(title)) {
        showError(t('error.titleInvalid'));
        return;
    }

    if (currentNoteId) {
        const index = notes.findIndex(n => n.id === currentNoteId);
        if (index !== -1) {
            notes[index] = { id: currentNoteId, title, date, time, content };
        }
    } else {
        const newNote = {
            id: '_' + Math.random().toString(36).substr(2, 9),
            title,
            date,
            time,
            content
        };
        notes.unshift(newNote);
        currentNoteId = newNote.id;
    }

    localStorage.setItem('my_notes', JSON.stringify(notes));
    if (currentView === 'notes') renderNoteList();

    const statusText = document.getElementById('saveStatus');
    statusText.style.display = 'inline';
    setTimeout(() => { statusText.style.display = 'none'; }, 2000);
}

function moveToTrash(event, id) {
    event.stopPropagation();
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex === -1) return;

    const [removedNote] = notes.splice(noteIndex, 1);
    trash.unshift(removedNote);

    localStorage.setItem('my_notes', JSON.stringify(notes));
    localStorage.setItem('my_trash', JSON.stringify(trash));

    if (currentNoteId === id) {
        createNewNote();
    }
    renderNoteList();
}

function restoreNote(event, id) {
    event.stopPropagation();
    const trashIndex = trash.findIndex(n => n.id === id);
    if (trashIndex === -1) return;

    const [restoredNote] = trash.splice(trashIndex, 1);
    notes.unshift(restoredNote);

    localStorage.setItem('my_notes', JSON.stringify(notes));
    localStorage.setItem('my_trash', JSON.stringify(trash));
    renderNoteList();
}

function deleteForever(event, id) {
    event.stopPropagation();
    if (confirm(t('confirm.deleteForever'))) {
        trash = trash.filter(n => n.id !== id);
        localStorage.setItem('my_trash', JSON.stringify(trash));
        renderNoteList();
    }
}

function exportNoteDirect(event, id) {
    event.stopPropagation();
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const timeFormatted = note.time.replace(/:/g, "-") + "-00";
    const fileName = `${note.date}_${timeFormatted}_${note.title}.txt`;
    const fileContent = `${t('export.labelTitle')}${note.title}\n${t('export.labelDateTime')}${note.date} ${note.time}\n----------------------------------------\n\n${note.content}`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showError(message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.textContent = message;
    errorBox.style.display = 'block';
}

function hideError() {
    const errorBox = document.getElementById('errorBox');
    errorBox.style.display = 'none';
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
