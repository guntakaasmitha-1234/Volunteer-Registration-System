# Volunteer Registration System

## About the Project
The Volunteer Registration System is a web-based application developed using HTML, CSS, and JavaScript. It helps administrators manage volunteer events and allows volunteers to register for events and track their application status.

## Features

### Admin Dashboard
- Admin login.
- Create new volunteer events.
- View all events.
- Delete events.
- View volunteer applications.
- Approve or reject volunteer registrations.

### Volunteer Dashboard
- Volunteer login.
- View available events.
- Search and filter events.
- Register for volunteer events.
- Track application status.
- Prevent duplicate registrations.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Browser LocalStorage

## Project Structure

```text
Volunteer-Registration-System/
│
├── index.html
├── style.css
├── app.js
├── README.md
│
└── screenshots/
    ├── login-screen.png
    ├── admin-dashboard.png
    ├── volunteer-dashboard.png
    ├── pending-status.png
    └── approved-status.png
```

## How to Run the Project

1. Download or clone this repository.
2. Open the project folder.
3. Open `index.html` in your browser.
4. Enter your name.
5. Select your role:
   - Administrator
   - Volunteer
6. Click Login to access the dashboard.

## Application Workflow

1. Admin logs into the system.
2. Admin creates volunteer events.
3. Volunteers view available events.
4. Volunteers register for events.
5. Admin reviews applications.
6. Admin approves or rejects registrations.
7. Volunteers track their application status.

## Data Storage
This project uses browser LocalStorage to store event details and volunteer registration information. Data remains available after refreshing the browser on the same device and browser.

## Future Improvements
- User authentication with passwords.
- Database integration.
- Email notifications.
- Volunteer profile management.
- Event attendance tracking.

## Author
Developed as a web development project.

## License
This project is created for educational purposes.
