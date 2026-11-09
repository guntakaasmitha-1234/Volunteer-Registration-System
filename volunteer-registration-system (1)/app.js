// --- Data Initialization ---
// We use localStorage to act as our database so data persists on refresh.
let events = JSON.parse(localStorage.getItem('vol_events')) || [];
let applications = JSON.parse(localStorage.getItem('vol_applications')) || [];
let currentUser = null; // { name: '...', role: '...' }

// --- Authentication & Routing ---
function handleLogin(e) {
    e.preventDefault();
    const name = document.getElementById('username').value.trim();
    const role = document.getElementById('role').value;
    
    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    currentUser = { name, role };
    document.getElementById('welcome-msg').innerText = `Welcome, ${name} (${role})`;
    
    // UI Routing
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    
    if (role === 'admin') {
        document.getElementById('admin-section').classList.remove('hidden');
        renderAdminDashboard();
    } else {
        document.getElementById('volunteer-section').classList.remove('hidden');
        renderVolunteerDashboard();
    }
}

function logout() {
    currentUser = null;
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('admin-section').classList.add('hidden');
    document.getElementById('volunteer-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('login-form').reset();
}

// --- Admin Functions (CRUD & Workflow) ---
function handleCreateEvent(e) {
    e.preventDefault();
    
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const desc = document.getElementById('event-desc').value;
    
    const newEvent = {
        id: Date.now().toString(), // Generate unique ID
        title,
        date,
        description: desc
    };
    
    events.push(newEvent);
    saveData();
    document.getElementById('event-form').reset();
    renderAdminDashboard();
    alert("Event created successfully!");
}

function deleteEvent(eventId) {
    if(confirm("Are you sure you want to delete this event?")) {
        events = events.filter(ev => ev.id !== eventId);
        // Also remove associated applications
        applications = applications.filter(app => app.eventId !== eventId);
        saveData();
        renderAdminDashboard();
    }
}

function updateApplicationStatus(appId, newStatus) {
    const appIndex = applications.findIndex(app => app.id === appId);
    if (appIndex !== -1) {
        applications[appIndex].status = newStatus;
        saveData();
        renderAdminDashboard();
    }
}

function renderAdminDashboard() {
    // Render Events List (Read & Delete)
    const eventsContainer = document.getElementById('admin-events-list');
    eventsContainer.innerHTML = '';
    
    if (events.length === 0) {
        eventsContainer.innerHTML = '<p>No events found.</p>';
    } else {
        events.forEach(ev => {
            eventsContainer.innerHTML += `
                <div class="list-item">
                    <h4>${ev.title}</h4>
                    <p><strong>Date:</strong> ${ev.date}</p>
                    <p>${ev.description}</p>
                    <button class="btn btn-small btn-danger mt-2" onclick="deleteEvent('${ev.id}')">Delete Event</button>
                </div>
            `;
        });
    }

    // Render Applications List (Workflow Approval)
    const appsContainer = document.getElementById('admin-applications-list');
    appsContainer.innerHTML = '';
    
    if (applications.length === 0) {
        appsContainer.innerHTML = '<p>No volunteer registrations yet.</p>';
    } else {
        applications.forEach(app => {
            appsContainer.innerHTML += `
                <div class="list-item">
                    <p><strong>Volunteer:</strong> ${app.volunteerName}</p>
                    <p><strong>Event:</strong> ${app.eventTitle}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></p>
                    ${app.status === 'Pending' ? `
                        <div class="mt-2">
                            <button class="btn btn-small btn-success" onclick="updateApplicationStatus('${app.id}', 'Approved')">Approve</button>
                            <button class="btn btn-small btn-danger" onclick="updateApplicationStatus('${app.id}', 'Rejected')">Reject</button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    }
}

// --- Volunteer Functions (Search, Register, Track) ---
function renderVolunteerDashboard(filterText = '') {
    // Render Available Events (with Search/Filter)
    const eventsContainer = document.getElementById('volunteer-events-list');
    eventsContainer.innerHTML = '';
    
    const filteredEvents = events.filter(ev => 
        ev.title.toLowerCase().includes(filterText.toLowerCase()) || 
        ev.description.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filteredEvents.length === 0) {
        eventsContainer.innerHTML = '<p>No events available.</p>';
    } else {
        filteredEvents.forEach(ev => {
            // Check if user already applied
            const alreadyApplied = applications.find(app => app.eventId === ev.id && app.volunteerName === currentUser.name);
            
            eventsContainer.innerHTML += `
                <div class="list-item">
                    <h4>${ev.title}</h4>
                    <p><strong>Date:</strong> ${ev.date}</p>
                    <p>${ev.description}</p>
                    ${alreadyApplied 
                        ? `<p class="mt-2" style="color: green; font-weight: bold;">✓ Already Applied</p>` 
                        : `<button class="btn btn-small mt-2" onclick="applyForEvent('${ev.id}', '${ev.title}')">Register as Volunteer</button>`
                    }
                </div>
            `;
        });
    }

    // Render My Applications (Status Tracking)
    const myAppsContainer = document.getElementById('volunteer-applications-list');
    myAppsContainer.innerHTML = '';
    
    const myApplications = applications.filter(app => app.volunteerName === currentUser.name);
    
    if (myApplications.length === 0) {
        myAppsContainer.innerHTML = '<p>You have not registered for any events yet.</p>';
    } else {
        myApplications.forEach(app => {
            myAppsContainer.innerHTML += `
                <div class="list-item">
                    <h4>${app.eventTitle}</h4>
                    <p><strong>Status:</strong> <span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></p>
                </div>
            `;
        });
    }
}

function filterEvents() {
    const searchText = document.getElementById('search-events').value;
    renderVolunteerDashboard(searchText);
}

function applyForEvent(eventId, eventTitle) {
    const newApp = {
        id: Date.now().toString(),
        eventId: eventId,
        eventTitle: eventTitle,
        volunteerName: currentUser.name,
        status: 'Pending' // Workflow validation starts as pending
    };
    
    applications.push(newApp);
    saveData();
    renderVolunteerDashboard();
    alert(`Successfully registered for ${eventTitle}! Waiting for admin approval.`);
}

// --- Utility Functions ---
function saveData() {
    localStorage.setItem('vol_events', JSON.stringify(events));
    localStorage.setItem('vol_applications', JSON.stringify(applications));
}
