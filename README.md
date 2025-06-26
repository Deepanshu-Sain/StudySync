# StudySync - Productivity Dashboard

StudySync is a clean, modern productivity dashboard designed for students and professionals. It features a responsive interface for managing notes and tasks with a focus on simplicity and usability.

## Features

### User Authentication
- **Secure Login/Signup**: User authentication system with client-side validation
- **Form Validation**: Real-time error handling and input validation
- **Protected Routes**: Dashboard content only accessible to authenticated users
- **User Sessions**: Persistent login sessions using localStorage
- **Demo Account**: Pre-configured demo account for easy testing

### Notes Management
- **Create & Edit**: Rich text notes with titles and content
- **Organization**: Notes sorted by creation/edit date (newest first)
- **Search Functionality**: Instant search across all notes (title and content)
- **PDF Export**: Export any note as a professional PDF document
- **Delete with Confirmation**: Safe deletion with confirmation dialog

### Task Management
- **Simple Task Creation**: Quick add tasks with one-click interface
- **Task Status Tracking**: Mark tasks as complete/incomplete
- **Task Filtering**: Filter by All, Pending, or Completed status
- **Clean Task List**: Organized view with visual status indicators

### Modern UI/UX
- **Responsive Design**: Seamlessly adapts to desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between color themes for comfortable viewing
- **Intuitive Navigation**: Tab-based navigation between major features
- **Modal Dialogs**: Clean interface for creating and editing content
- **Notification System**: Toast notifications for user feedback (e.g., successful exports)
- **Accessibility**: Semantic HTML and proper contrast ratios

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla ES6+)
- **Data Storage**: Browser localStorage for persistent data
- **PDF Generation**: jsPDF library for PDF export functionality
- **Icons & Typography**: Font Awesome icons and Google Fonts
- **Design**: Custom CSS with CSS variables for theming

## Getting Started

### Quick Start
1. Clone the repository or download the ZIP file
2. Open `index.html` in your browser
3. Log in with the demo account:
   - Email: `demo@studysync.com`
   - Password: `demo123`

### Local Development
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/studysync.git
   ```
2. Navigate to the project directory:
   ```
   cd studysync
   ```
3. Open the project in your preferred code editor
4. Launch with a local server (optional but recommended):
   - Using Python:
     ```
     python -m http.server
     ```
   - Using VS Code Live Server extension
   - Using any other local development server

### Using the Application

#### Authentication
- **Login**: Enter your credentials on the homepage
- **Signup**: Click "Sign up" to create a new account
- **Logout**: Click the logout button in the sidebar

#### Notes
- **View Notes**: Select the Notes tab in the sidebar
- **Create Note**: Click "Add Note" button and fill in the form
- **Edit Note**: Click on any note or the edit icon
- **Export to PDF**: Click the PDF icon on any note
- **Delete Note**: Click the trash icon (confirmation required)
- **Search**: Type in the search bar to filter notes

#### Tasks
- **View Tasks**: Select the Tasks tab in the sidebar
- **Add Task**: Click "Add Task" button and enter task details
- **Complete Task**: Click the checkbox next to any task
- **Filter Tasks**: Use the filter buttons (All/Pending/Completed)
- **Delete Task**: Click the trash icon on any task

## Project Structure

```
StudySync/
├── assets/                  # Static assets
│   ├── logo.png             # Application logo (PNG format)
│   └── logo.svg             # Application logo (SVG format)
├── css/                     # Stylesheet files
│   ├── dashboard.css        # Dashboard-specific styles
│   ├── main.css             # Main application styles
│   ├── styles.css           # Core styles and utilities
│   └── test.css             # Testing styles
├── js/                      # JavaScript files
│   ├── auth.js              # Authentication functionality
│   ├── dashboard.js         # Dashboard core functionality
│   ├── notes.js             # Notes management
│   └── tasks.js             # Task management
├── index.html               # Login/signup page
├── dashboard.html           # Main application dashboard
└── README.md                # Project documentation
```

## Feature Details

### PDF Export Functionality
The PDF export feature allows users to save their notes as professional PDF documents:
- Preserves formatting and content exactly as entered
- Includes note title, content, and creation date
- Automatic filename generation based on note title
- Success notification upon completion
- Error handling for failed exports

### Authentication System
- Client-side validation ensures proper email format and password strength
- User data stored securely in localStorage (in a production environment, this would use a backend database)
- Session persistence with automatic login/logout redirection
- Demo account pre-configured for testing

### Search Functionality
- Real-time searching as you type
- Searches both note titles and content
- Clear visual indication when no results are found
- Instant restoration of all notes when search is cleared

## Future Enhancements

- **Backend Integration**: Node.js/Express API or Firebase integration
- **Cloud Sync**: Synchronize notes and tasks across devices
- **Rich Text Editing**: Advanced formatting options for notes
- **Categories/Tags**: Organize notes with custom categories
- **Task Priorities**: High/Medium/Low priority levels for tasks
- **Due Dates**: Calendar integration for task deadlines
- **Notifications**: Reminders for upcoming or overdue tasks
- **Collaborative Notes**: Share and co-edit notes with other users
- **Import/Export**: Full data backup and restoration
- **Statistics Dashboard**: Track productivity metrics

## Browser Compatibility

StudySync is compatible with all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT

---

Built with ❤️ as a productivity tool for students and professionals. 