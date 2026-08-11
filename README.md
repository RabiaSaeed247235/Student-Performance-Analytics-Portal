# Student Performance Analytics Portal

A complete front-end web application for managing and presenting student performance data. The project was developed as a progressive internship task from Week 1 to Week 8 using HTML5, CSS3, JavaScript (ES6), and a local Chart.js-compatible renderer.

## Project Overview

EduTrack Analytics is a Student Performance Analytics Portal that demonstrates a professional academic dashboard experience. It includes authentication screens, role-based dashboards, student record management, performance reports, charts, filters, profile pages, notifications, responsive layouts, and final demonstration documentation.

Week 8 finalization focuses on reviewing, polishing, organizing, documenting, and preparing the complete web application for final evaluation and presentation.

## Features

- Responsive Home, About, Dashboard, Reports, Profile, Contact, and Final Demo pages
- Functional Login, Registration, Forgot Password, and Reset Password interfaces
- Local Storage simulation for user registration, login session, role routing, and theme preference
- Role-based dashboards for Administrator, Teacher, and Student users
- Role-specific navigation and dashboard actions
- Dynamic student performance cards generated with JavaScript
- Student information tables with search, advanced filters, sorting, and pagination
- CSV export and PDF/print export interface
- Interactive chart widgets
- Notification panel with unread counter and mark-all-read action
- Recent activity widgets
- Profile management page
- Dark Mode / Light Mode toggle
- Loading, success, error, and empty-state interface examples
- Accessibility improvements for labels, keyboard focus, skip links, ARIA status messages, and tables
- Final demo page that explains the complete user flow
- Project documentation, testing notes, and screenshots

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Local Storage API
- Canvas-based local Chart.js-compatible chart script
- VS Code / Live Server compatible setup
- GitHub-ready folder structure

## Installation Steps

1. Download or clone the project folder.
2. Open the folder in VS Code.
3. Open `index.html` directly in a browser, or right-click `index.html` and select **Open with Live Server**.
4. Use the demo accounts below to test role-based dashboards.

No Node.js, database, package installation, or internet connection is required.

## Demo Role Logins

| Role | Email | Password |
|---|---|---|
| Student | `student@edutrack.com` | `Student123` |
| Teacher | `teacher@edutrack.com` | `Teacher123` |
| Administrator | `admin@edutrack.com` | `Admin123` |

You may also register a new account from `register.html`; registered users are stored in browser Local Storage for simulation.

## Folder Structure

```text
student-performance-analytics-portal/
├── index.html
├── about.html
├── login.html
├── register.html
├── forgot-password.html
├── reset-password.html
├── dashboard.html
├── admin-dashboard.html
├── teacher-dashboard.html
├── student-dashboard.html
├── reports.html
├── profile.html
├── account-profile.html
├── contact.html
├── final-demo.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── chart.min.js
└── docs/
    ├── BUG_FIX_REPORT.md
    ├── BROWSER_TESTING_REPORT.md
    ├── FINAL_DEMO_SCRIPT.md
    ├── FINAL_PROJECT_REPORT.md
    ├── WEEK_6_DOCUMENTATION.md
    ├── WEEK_7_FINAL_DEMO_GUIDE.md
    ├── WEEK_8_FINALIZATION_CHECKLIST.md
    └── screenshots/
```

## Internship Week Summary

### Week 1 — Project foundation
- Home, About, Dashboard, Reports, Contact, navigation, footer, responsive layout, cards, tables, and forms.

### Week 2 — Interactive components
- Functional login form, validation, dynamic cards, student tables, search/filter, mobile navigation, and responsive improvements.

### Week 3 — Authentication and dynamic UI
- Registration, forgot/reset password UI, Local Storage simulation, dynamic student profiles, JavaScript performance cards, sorting, advanced search, and UI animations.

### Week 4 — Role-based dashboard
- Administrator, Teacher, and Student dashboards, role-based menus, profile management, dark/light mode, notification panel, accessibility, and JavaScript performance improvements.

### Week 5 — Advanced reporting and data management
- Advanced search/filter module, pagination, CSV/PDF export interface, interactive charts, recent activity widgets, improved validation, and responsive optimizations.

### Week 6 — Testing and optimization
- UI/responsiveness fixes, CSS/JS optimization, improved validation, accessibility improvements, browser testing notes, bug-fix report, and screenshots.

### Week 7 — Complete integration
- Connected major pages, integrated dashboard modules, verified Login → Dashboard → Reports → Profile flow, added final demo page, and prepared project demonstration guide.

### Week 8 — Final project completion
- Reviewed pages from Weeks 1–7, checked links/forms/tables/charts/cards, polished UI consistency, organized project files, updated README, captured screenshots, and prepared the final demonstration package.

## Major Pages to Screenshot for Submission

- `index.html` — Home page
- `login.html` — Login page
- `register.html` — Registration page
- `dashboard.html` — Main dashboard
- `admin-dashboard.html` — Administrator dashboard
- `teacher-dashboard.html` — Teacher dashboard
- `student-dashboard.html` — Student dashboard
- `reports.html` — Reports and analytics
- `account-profile.html` — Profile management
- `final-demo.html` — Final project demonstration

## Final Demonstration Flow

1. Start from `index.html` and introduce the project.
2. Open `login.html` and log in with one of the demo accounts.
3. Show role-based routing to Administrator, Teacher, or Student dashboard.
4. Open `dashboard.html` and demonstrate cards, table, search, filters, pagination, charts, and export UI.
5. Open `reports.html` and show analytics/report views.
6. Open `account-profile.html` and show profile management.
7. Open `final-demo.html` and explain the complete integrated user flow.

## Submission Notes

For final submission, include the complete source-code folder, updated GitHub repository, README documentation, screenshots of completed pages, and a 3–5 minute demo video explaining the project.
