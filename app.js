(() => {
  "use strict";

  const STORAGE_KEYS = {
    users: "edutrackUsers",
    currentUser: "edutrackCurrentUser",
    resetEmail: "edutrackResetEmail",
    students: "edutrackStudents",
    theme: "edutrackTheme",
    notifications: "edutrackNotifications",
    activity: "edutrackRecentActivity"
  };

  const DEFAULT_USERS = [
    { name: "Dua Fatima", email: "student@edutrack.com", password: "Student123", role: "student" },
    { name: "Ms. Rabia ", email: "teacher@edutrack.com", password: "Teacher123", role: "teacher" },
    { name: "Portal Administrator", email: "admin@edutrack.com", password: "Admin123", role: "administrator" }
  ];

  const DEFAULT_STUDENTS = [
    { id: "ST-1001", name: "Dua Fatima", attendance: 94, overall: 91, grade: "A+", assignment: 93, quiz: 90, mid: 88, final: 94 },
    { id: "ST-1002", name: "Hamza Ali", attendance: 88, overall: 84, grade: "B+", assignment: 82, quiz: 86, mid: 79, final: 87 },
    { id: "ST-1003", name: "Sara Ahmed", attendance: 92, overall: 87, grade: "A", assignment: 89, quiz: 84, mid: 86, final: 90 },
    { id: "ST-1004", name: "Bilal Raza", attendance: 79, overall: 73, grade: "C+", assignment: 71, quiz: 74, mid: 69, final: 78 },
    { id: "ST-1005", name: "Mahnoor Fatima", attendance: 96, overall: 89, grade: "A", assignment: 91, quiz: 87, mid: 85, final: 92 },
    { id: "ST-1006", name: "Usman Tariq", attendance: 86, overall: 78, grade: "B", assignment: 78, quiz: 76, mid: 74, final: 83 },
    { id: "ST-1007", name: "Zainab Iqbal", attendance: 90, overall: 82, grade: "B+", assignment: 84, quiz: 81, mid: 80, final: 83 },
    { id: "ST-1008", name: "Danish Malik", attendance: 74, overall: 68, grade: "C", assignment: 69, quiz: 66, mid: 64, final: 72 },
    { id: "ST-1009", name: "Hira Noor", attendance: 97, overall: 95, grade: "A+", assignment: 96, quiz: 94, mid: 92, final: 97 },
    { id: "ST-1010", name: "Ali Raza", attendance: 83, overall: 76, grade: "B", assignment: 74, quiz: 79, mid: 72, final: 78 },
    { id: "ST-1011", name: "Fatima Shah", attendance: 91, overall: 86, grade: "A", assignment: 87, quiz: 85, mid: 84, final: 88 },
    { id: "ST-1012", name: "Ahmed Saeed", attendance: 69, overall: 58, grade: "D", assignment: 60, quiz: 55, mid: 54, final: 62 },
    { id: "ST-1013", name: "Noor Ul Ain", attendance: 87, overall: 80, grade: "B", assignment: 82, quiz: 77, mid: 79, final: 81 },
    { id: "ST-1014", name: "Rehan Ahmed", attendance: 63, overall: 49, grade: "F", assignment: 52, quiz: 45, mid: 47, final: 51 }
  ];

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function removeStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Local storage is a simulation. The UI remains usable if storage is unavailable.
    }
  }

  function normalizeRole(role) {
    return ["administrator", "teacher", "student"].includes(role) ? role : "student";
  }

  function ensureInitialData() {
    const storedUsers = readStorage(STORAGE_KEYS.users, []);
    const users = Array.isArray(storedUsers) ? storedUsers.map((user) => ({ ...user, role: normalizeRole(user.role) })) : [];

    DEFAULT_USERS.forEach((demoUser) => {
      if (!users.some((user) => String(user.email).toLowerCase() === demoUser.email.toLowerCase())) {
        users.push({ ...demoUser });
      }
    });
    writeStorage(STORAGE_KEYS.users, users);

    const students = readStorage(STORAGE_KEYS.students, null);
    if (!Array.isArray(students) || students.length === 0) {
      writeStorage(STORAGE_KEYS.students, DEFAULT_STUDENTS);
    }

    const notifications = readStorage(STORAGE_KEYS.notifications, null);
    if (!Array.isArray(notifications)) {
      writeStorage(STORAGE_KEYS.notifications, [
        { id: 1, title: "Performance reports updated", message: "Latest student performance records are ready to review.", read: false },
        { id: 2, title: "Attendance reminder", message: "Please verify this week's attendance entries.", read: false },
        { id: 3, title: "Portal notice", message: "Your dashboard interface now supports role-based navigation.", read: false }
      ]);
    }

    const activity = readStorage(STORAGE_KEYS.activity, null);
    if (!Array.isArray(activity)) {
      writeStorage(STORAGE_KEYS.activity, [
        { id: 1, title: "Dashboard opened", message: "Week 5 advanced dashboard module is ready.", date: "16 July 2026" },
        { id: 2, title: "Charts prepared", message: "Student grade and performance chart widgets were added.", date: "16 July 2026" },
        { id: 3, title: "Export UI added", message: "CSV and PDF export controls are available from dashboard and reports.", date: "16 July 2026" }
      ]);
    }
  }

  ensureInitialData();

  function getCurrentUser() {
    const user = readStorage(STORAGE_KEYS.currentUser, null);
    return user && typeof user === "object" ? { ...user, role: normalizeRole(user.role) } : null;
  }

  function roleDashboardPath(role) {
    const paths = {
      administrator: "admin-dashboard.html",
      teacher: "teacher-dashboard.html",
      student: "student-dashboard.html"
    };
    return paths[normalizeRole(role)];
  }

  function debounce(callback, delay = 180) {
    let timeoutId;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => callback(...args), delay);
    };
  }

  function applyTheme(theme) {
    const selectedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = selectedTheme;
    const button = document.querySelector(".theme-toggle");
    if (button) {
      button.setAttribute("aria-pressed", String(selectedTheme === "dark"));
      button.textContent = selectedTheme === "dark" ? "☀ Light" : "◐ Dark";
      button.setAttribute("aria-label", selectedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  applyTheme(readStorage(STORAGE_KEYS.theme, "light"));

  const navbar = document.querySelector(".navbar");
  if (navbar && !navbar.querySelector(".theme-toggle")) {
    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle";
    const menuToggle = navbar.querySelector(".menu-toggle");
    navbar.insertBefore(themeButton, menuToggle || navbar.querySelector(".nav-links"));
    applyTheme(readStorage(STORAGE_KEYS.theme, "light"));
    themeButton.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      writeStorage(STORAGE_KEYS.theme, nextTheme);
      applyTheme(nextTheme);
    });
  }

  const currentUser = getCurrentUser();
  if (currentUser) {
    document.querySelectorAll('a[href="dashboard.html"]').forEach((link) => {
      link.href = roleDashboardPath(currentUser.role);
    });
    document.querySelectorAll('a[href="login.html"]').forEach((link) => {
      if (!link.closest(".auth-links") && !link.closest(".auth-prompt")) {
        link.href = "account-profile.html";
        link.textContent = "Profile";
      }
    });
  }

  const requiredRole = document.body.dataset.requiredRole;
  if (requiredRole) {
    if (!currentUser) {
      window.location.replace("login.html");
    } else if (normalizeRole(currentUser.role) !== requiredRole) {
      window.location.replace(roleDashboardPath(currentUser.role));
    }
  }

  if (document.body.dataset.roleRouter === "true" && currentUser) {
    window.location.replace(roleDashboardPath(currentUser.role));
  }

  document.querySelectorAll("[data-current-user-name]").forEach((element) => {
    element.textContent = currentUser ? currentUser.name : "Guest";
  });
  document.querySelectorAll("[data-current-user-role]").forEach((element) => {
    element.textContent = currentUser ? normalizeRole(currentUser.role) : "guest";
  });

  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.contains(event.target) && !menuButton.contains(event.target)) {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setMessage(element, text, type = "") {
    if (!element) return;
    element.textContent = text;
    element.classList.remove("success", "error");
    if (type) element.classList.add(type);
  }

  function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function gradeClass(grade) {
    if (String(grade).startsWith("A")) return "grade-a";
    if (String(grade).startsWith("B")) return "grade-b";
    return "grade-c";
  }

  function getStudents() {
    const students = readStorage(STORAGE_KEYS.students, DEFAULT_STUDENTS);
    return Array.isArray(students) ? students : DEFAULT_STUDENTS;
  }

  function saveStudents(students) {
    writeStorage(STORAGE_KEYS.students, students);
  }

  function getUsers() {
    const users = readStorage(STORAGE_KEYS.users, DEFAULT_USERS);
    return Array.isArray(users) ? users : DEFAULT_USERS;
  }

  // Week 5: dashboard data management, advanced filters, pagination, export UI and activity widgets.
  function getActivities() {
    const activities = readStorage(STORAGE_KEYS.activity, []);
    return Array.isArray(activities) ? activities : [];
  }

  function addActivity(title, message) {
    const activity = {
      id: Date.now(),
      title,
      message,
      date: new Date().toLocaleString()
    };
    writeStorage(STORAGE_KEYS.activity, [activity, ...getActivities()].slice(0, 8));
    renderActivityWidgets();
  }

  function renderActivityWidgets() {
    document.querySelectorAll("[data-activity-list]").forEach((list) => {
      const activities = getActivities();
      const fragment = document.createDocumentFragment();
      activities.slice(0, 5).forEach((activity) => {
        const item = document.createElement("li");
        item.className = "activity-item";
        const title = document.createElement("strong");
        title.textContent = activity.title;
        const message = document.createElement("span");
        message.textContent = activity.message;
        const date = document.createElement("small");
        date.textContent = activity.date;
        item.append(title, message, date);
        fragment.appendChild(item);
      });
      if (!activities.length) {
        const item = document.createElement("li");
        item.className = "activity-item";
        item.textContent = "No recent activity yet.";
        fragment.appendChild(item);
      }
      list.replaceChildren(fragment);
    });
  }

  function clearFieldErrors(form) {
    if (!form) return;
    form.querySelectorAll(".field-error").forEach((error) => error.remove());
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
      field.removeAttribute("aria-invalid");
      const describedBy = (field.getAttribute("aria-describedby") || "")
        .split(/\s+/)
        .filter((id) => id && !id.endsWith("-error"))
        .join(" ");
      if (describedBy) field.setAttribute("aria-describedby", describedBy);
      else field.removeAttribute("aria-describedby");
    });
  }

  function setFieldError(input, message) {
    if (!input) return;
    const safeId = input.id || input.name || `field-${Math.random().toString(36).slice(2)}`;
    if (!input.id) input.id = safeId;
    const errorId = `${safeId}-error`;
    input.setAttribute("aria-invalid", "true");
    const currentDescriptions = new Set((input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    currentDescriptions.add(errorId);
    input.setAttribute("aria-describedby", Array.from(currentDescriptions).join(" "));
    const existing = document.getElementById(errorId);
    if (existing) {
      existing.textContent = message;
      return;
    }
    const error = document.createElement("span");
    error.className = "field-error";
    error.id = errorId;
    error.textContent = message;
    input.insertAdjacentElement("afterend", error);
  }

  function clearSingleFieldError(field) {
    if (!field) return;
    field.removeAttribute("aria-invalid");
    const errorId = field.id ? `${field.id}-error` : "";
    if (errorId) {
      const error = document.getElementById(errorId);
      if (error) error.remove();
    }
    const describedBy = (field.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter((id) => id && id !== errorId)
      .join(" ");
    if (describedBy) field.setAttribute("aria-describedby", describedBy);
    else field.removeAttribute("aria-describedby");
  }

  function validateNativeRequiredFields(form) {
    if (!form) return true;
    let isValid = true;
    Array.from(form.elements).forEach((field) => {
      if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
      if (field.disabled || field.type === "hidden") return;
      if (!field.checkValidity()) {
        setFieldError(field, field.validationMessage || "Please enter a valid value.");
        isValid = false;
      }
    });
    return isValid;
  }

  function studentCsv(students) {
    const headers = ["Student ID", "Name", "Attendance", "Assignment", "Quiz", "Mid", "Final", "Overall", "Grade"];
    const rows = students.map((student) => [
      student.id,
      student.name,
      student.attendance,
      student.assignment,
      student.quiz,
      student.mid,
      student.final,
      student.overall,
      student.grade
    ]);
    return [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
  }

  function downloadCsv(filename, students) {
    const blob = new Blob([studentCsv(students)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const studentTable = document.getElementById("student-table");
  const studentSearch = document.getElementById("student-search");
  const studentSearchField = document.getElementById("student-search-field");
  const studentGradeFilter = document.getElementById("student-grade-filter");
  const studentMinScore = document.getElementById("student-min-score");
  const studentMaxScore = document.getElementById("student-max-score");
  const studentMinAttendance = document.getElementById("student-min-attendance");
  const studentSort = document.getElementById("student-sort");
  const studentPageSize = document.getElementById("student-page-size");
  const studentPrevPage = document.getElementById("student-prev-page");
  const studentNextPage = document.getElementById("student-next-page");
  const studentPageInfo = document.getElementById("student-page-info");
  const studentResultCount = document.getElementById("student-result-count");
  const studentExportCsv = document.getElementById("student-export-csv");
  const studentExportPdf = document.getElementById("student-export-pdf");
  const studentExportStatus = document.getElementById("student-export-status");
  const studentEmpty = document.getElementById("student-empty");
  const studentCount = document.getElementById("student-count");
  const averageScore = document.getElementById("average-score");
  const topGrade = document.getElementById("top-grade");
  const averageAttendance = document.getElementById("average-attendance");
  let currentStudentPage = 1;
  let currentFilteredStudents = [];

  function updateDashboardCards(students) {
    if (!studentCount && !averageScore && !topGrade && !averageAttendance) return;

    if (!students.length) {
      if (studentCount) studentCount.textContent = "0";
      if (averageScore) averageScore.textContent = "0%";
      if (topGrade) topGrade.textContent = "—";
      if (averageAttendance) averageAttendance.textContent = "0%";
      return;
    }

    const scoreAverage = students.reduce((sum, student) => sum + Number(student.overall || 0), 0) / students.length;
    const attendanceAverageValue = students.reduce((sum, student) => sum + Number(student.attendance || 0), 0) / students.length;
    const gradeOrder = ["A+", "A", "B+", "B", "C+", "C", "D", "F"];
    const bestGrade = gradeOrder.find((grade) => students.some((student) => student.grade === grade)) || "—";

    if (studentCount) studentCount.textContent = String(students.length);
    if (averageScore) averageScore.textContent = `${scoreAverage.toFixed(1)}%`;
    if (topGrade) topGrade.textContent = bestGrade;
    if (averageAttendance) averageAttendance.textContent = `${attendanceAverageValue.toFixed(1)}%`;
  }

  function getFilteredSortedStudents() {
    let students = [...getStudents()];
    const query = studentSearch ? studentSearch.value.trim().toLowerCase() : "";
    const field = studentSearchField ? studentSearchField.value : "all";
    const grade = studentGradeFilter ? studentGradeFilter.value : "all";
    const minScoreValue = studentMinScore ? studentMinScore.value.trim() : "";
    const maxScoreValue = studentMaxScore ? studentMaxScore.value.trim() : "";
    const minAttendanceValue = studentMinAttendance ? studentMinAttendance.value.trim() : "";
    const minScore = minScoreValue === "" ? null : Number(minScoreValue);
    const maxScore = maxScoreValue === "" ? null : Number(maxScoreValue);
    const minAttendance = minAttendanceValue === "" ? null : Number(minAttendanceValue);

    if (query) {
      students = students.filter((student) => {
        const values = {
          id: String(student.id).toLowerCase(),
          name: String(student.name).toLowerCase(),
          grade: String(student.grade).toLowerCase(),
          attendance: String(student.attendance).toLowerCase(),
          overall: String(student.overall).toLowerCase()
        };
        if (field === "all") return Object.values(values).some((value) => value.includes(query));
        return values[field] ? values[field].includes(query) : false;
      });
    }

    if (grade !== "all") students = students.filter((student) => student.grade === grade);
    if (minScore !== null && Number.isFinite(minScore)) students = students.filter((student) => Number(student.overall) >= minScore);
    if (maxScore !== null && Number.isFinite(maxScore)) students = students.filter((student) => Number(student.overall) <= maxScore);
    if (minAttendance !== null && Number.isFinite(minAttendance)) students = students.filter((student) => Number(student.attendance) >= minAttendance);

    const sortValue = studentSort ? studentSort.value : "id-asc";
    const sorters = {
      "id-asc": (a, b) => a.id.localeCompare(b.id),
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "name-desc": (a, b) => b.name.localeCompare(a.name),
      "score-desc": (a, b) => Number(b.overall) - Number(a.overall),
      "score-asc": (a, b) => Number(a.overall) - Number(b.overall),
      "attendance-desc": (a, b) => Number(b.attendance) - Number(a.attendance),
      "attendance-asc": (a, b) => Number(a.attendance) - Number(b.attendance),
      "grade-asc": (a, b) => String(a.grade).localeCompare(String(b.grade))
    };
    students.sort(sorters[sortValue] || sorters["id-asc"]);
    return students;
  }

  function renderStudentTable(students) {
    if (!studentTable || !studentTable.tBodies.length) return;
    currentFilteredStudents = students;
    const tbody = studentTable.tBodies[0];
    const pageSize = studentPageSize ? Number(studentPageSize.value) : 5;
    const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
    currentStudentPage = Math.min(Math.max(1, currentStudentPage), totalPages);
    const start = (currentStudentPage - 1) * pageSize;
    const visibleStudents = students.slice(start, start + pageSize);
    const fragment = document.createDocumentFragment();

    visibleStudents.forEach((student) => {
      const row = document.createElement("tr");
      row.dataset.grade = student.grade;
      const values = [student.id, student.name, `${student.attendance}%`, `${student.overall}%`];
      values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      const gradeCell = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = `grade ${gradeClass(student.grade)}`;
      badge.textContent = student.grade;
      gradeCell.appendChild(badge);
      row.appendChild(gradeCell);

      const actionCell = document.createElement("td");
      const link = document.createElement("a");
      link.className = "table-link";
      link.href = `profile.html?id=${encodeURIComponent(student.id)}`;
      link.textContent = "View Profile";
      actionCell.appendChild(link);
      row.appendChild(actionCell);
      fragment.appendChild(row);
    });

    tbody.replaceChildren(fragment);
    if (studentEmpty) studentEmpty.hidden = students.length !== 0;
    if (studentResultCount) studentResultCount.textContent = `${students.length} record${students.length === 1 ? "" : "s"} found`;
    if (studentPageInfo) studentPageInfo.textContent = `Page ${currentStudentPage} of ${totalPages}`;
    if (studentPrevPage) studentPrevPage.disabled = currentStudentPage <= 1;
    if (studentNextPage) studentNextPage.disabled = currentStudentPage >= totalPages;
  }

  function updateStudentDashboard(resetPage = false) {
    if (resetPage) currentStudentPage = 1;
    const students = getFilteredSortedStudents();
    updateDashboardCards(getStudents());
    renderStudentTable(students);
  }

  const debouncedStudentFilter = debounce(() => updateStudentDashboard(true), 160);
  [studentSearch, studentMinScore, studentMaxScore, studentMinAttendance].forEach((control) => {
    if (control) control.addEventListener("input", debouncedStudentFilter);
  });
  [studentSearchField, studentGradeFilter, studentSort, studentPageSize].forEach((control) => {
    if (control) control.addEventListener("change", () => updateStudentDashboard(true));
  });
  if (studentPrevPage) studentPrevPage.addEventListener("click", () => { currentStudentPage -= 1; updateStudentDashboard(); });
  if (studentNextPage) studentNextPage.addEventListener("click", () => { currentStudentPage += 1; updateStudentDashboard(); });
  if (studentExportCsv) {
    studentExportCsv.addEventListener("click", () => {
      downloadCsv("student-records.csv", currentFilteredStudents.length ? currentFilteredStudents : getFilteredSortedStudents());
      setMessage(studentExportStatus, "CSV export prepared for the current filtered records.", "success");
      addActivity("CSV export", "Student records were exported as CSV.");
    });
  }
  if (studentExportPdf) {
    studentExportPdf.addEventListener("click", () => {
      setMessage(studentExportStatus, "Use the browser print dialog to save this dashboard as PDF.", "success");
      addActivity("PDF export", "Dashboard PDF export dialog was opened.");
      window.setTimeout(() => window.print(), 120);
    });
  }

  if (studentTable) updateStudentDashboard(true);
  else updateDashboardCards(getStudents());
  renderActivityWidgets();

  const studentForm = document.getElementById("student-form");
  const studentMessage = document.getElementById("student-form-message");

  if (studentForm) {
    studentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFieldErrors(studentForm);

      const idInput = document.getElementById("student-id");
      const nameInput = document.getElementById("student-name");
      const attendanceInput = document.getElementById("student-attendance");
      const overallInput = document.getElementById("student-overall");
      const gradeInput = document.getElementById("student-grade");
      const id = idInput.value.trim().toUpperCase();
      const name = nameInput.value.trim();
      const attendance = Number(attendanceInput.value);
      const overall = Number(overallInput.value);
      const grade = gradeInput.value;
      let hasError = false;

      if (!/^ST-\d{4}$/.test(id)) { setFieldError(idInput, "Use this format: ST-1007."); hasError = true; }
      if (name.length < 2) { setFieldError(nameInput, "Enter at least 2 characters."); hasError = true; }
      if (!Number.isFinite(attendance) || attendance < 0 || attendance > 100) { setFieldError(attendanceInput, "Attendance must be from 0 to 100."); hasError = true; }
      if (!Number.isFinite(overall) || overall < 0 || overall > 100) { setFieldError(overallInput, "Overall percentage must be from 0 to 100."); hasError = true; }
      if (!grade) { setFieldError(gradeInput, "Select a grade."); hasError = true; }

      const students = getStudents();
      if (students.some((student) => student.id.toLowerCase() === id.toLowerCase())) {
        setFieldError(idInput, "This Student ID already exists.");
        hasError = true;
      }

      if (hasError) {
        setMessage(studentMessage, "Please fix the highlighted fields and try again.", "error");
        const firstInvalid = studentForm.querySelector("[aria-invalid='true']");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      students.push({ id, name, attendance, overall, grade, assignment: overall, quiz: overall, mid: overall, final: overall });
      saveStudents(students);
      studentForm.reset();
      setMessage(studentMessage, "Student record added successfully.", "success");
      addActivity("Student added", `${name} (${id}) was added to the record table.`);
      updateStudentDashboard(true);
      renderReportData();
    });
  }

  // Week 5: report filters, export controls and Chart.js visualizations.
  const gradeFilter = document.getElementById("grade-filter");
  const reportTable = document.getElementById("report-table");
  const reportSearch = document.getElementById("report-search");
  const reportSort = document.getElementById("report-sort");
  const reportEmpty = document.getElementById("report-empty");
  const reportResultCount = document.getElementById("report-result-count");
  const reportExportCsv = document.getElementById("report-export-csv");
  const reportExportPdf = document.getElementById("report-export-pdf");
  const reportStatus = document.getElementById("report-status");
  let currentReportStudents = [];
  const reportCharts = [];

  function filteredReportStudents() {
    let students = [...getStudents()];
    const grade = gradeFilter ? gradeFilter.value : "all";
    const query = reportSearch ? reportSearch.value.trim().toLowerCase() : "";
    if (grade !== "all") students = students.filter((student) => student.grade === grade);
    if (query) {
      students = students.filter((student) => [student.id, student.name, student.grade, student.overall, student.attendance]
        .some((value) => String(value).toLowerCase().includes(query)));
    }
    const sort = reportSort ? reportSort.value : "overall-desc";
    const sorters = {
      "overall-desc": (a, b) => Number(b.overall) - Number(a.overall),
      "overall-asc": (a, b) => Number(a.overall) - Number(b.overall),
      "attendance-desc": (a, b) => Number(b.attendance) - Number(a.attendance),
      "name-asc": (a, b) => a.name.localeCompare(b.name)
    };
    students.sort(sorters[sort] || sorters["overall-desc"]);
    return students;
  }

  function renderReportTable(students) {
    if (!reportTable || !reportTable.tBodies.length) return;
    const tbody = reportTable.tBodies[0];
    const fragment = document.createDocumentFragment();
    students.forEach((student) => {
      const row = document.createElement("tr");
      row.dataset.grade = student.grade;
      [student.id, student.name, `${student.attendance}%`, student.assignment, student.quiz, student.mid, student.final, `${student.overall}%`].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });
      const gradeCell = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = `grade ${gradeClass(student.grade)}`;
      badge.textContent = student.grade;
      gradeCell.appendChild(badge);
      row.appendChild(gradeCell);
      fragment.appendChild(row);
    });
    tbody.replaceChildren(fragment);
    if (reportEmpty) reportEmpty.hidden = students.length !== 0;
    if (reportResultCount) reportResultCount.textContent = `${students.length} report record${students.length === 1 ? "" : "s"} visible`;
  }

  function chartDefaults(canvasId, type, labels, data, label) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;
    const chart = new window.Chart(canvas, {
      type,
      data: {
        labels,
        datasets: [{ label, data }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: type === "doughnut" } },
        scales: type === "doughnut" ? {} : { y: { beginAtZero: true, suggestedMax: 100 } }
      }
    });
    reportCharts.push(chart);
  }

  function renderReportCharts(students) {
    while (reportCharts.length) {
      const chart = reportCharts.pop();
      if (chart && typeof chart.destroy === "function") chart.destroy();
    }
    if (!students.length) return;
    const gradeOrder = ["A+", "A", "B+", "B", "C+", "C", "D", "F"];
    const gradeCounts = gradeOrder.map((grade) => students.filter((student) => student.grade === grade).length);
    chartDefaults("grade-distribution-chart", "doughnut", gradeOrder, gradeCounts, "Grade Distribution");
    chartDefaults("overall-score-chart", "bar", students.map((student) => student.id), students.map((student) => student.overall), "Overall Percentage");
    chartDefaults("attendance-score-chart", "line", students.map((student) => student.id), students.map((student) => student.attendance), "Attendance Rate");
  }

  function renderReportData() {
    if (!reportTable && !document.getElementById("grade-distribution-chart") && !document.getElementById("overall-score-chart") && !document.getElementById("attendance-score-chart")) return;
    currentReportStudents = filteredReportStudents();
    renderReportTable(currentReportStudents);
    renderReportCharts(currentReportStudents);
  }

  [gradeFilter, reportSort].forEach((control) => {
    if (control) control.addEventListener("change", renderReportData);
  });
  if (reportSearch) reportSearch.addEventListener("input", debounce(renderReportData, 160));
  if (reportExportCsv) {
    reportExportCsv.addEventListener("click", () => {
      downloadCsv("student-performance-report.csv", currentReportStudents.length ? currentReportStudents : filteredReportStudents());
      setMessage(reportStatus, "CSV report prepared for visible records.", "success");
      addActivity("Report CSV export", "Performance report records were exported as CSV.");
    });
  }
  if (reportExportPdf) {
    reportExportPdf.addEventListener("click", () => {
      setMessage(reportStatus, "Use the browser print dialog to save the report as PDF.", "success");
      addActivity("Report PDF export", "Performance report PDF export dialog was opened.");
      window.setTimeout(() => window.print(), 120);
    });
  }
  renderReportData();

  // Registration with Local Storage simulation.
  const registerForm = document.getElementById("register-form");
  const registerMessage = document.getElementById("register-message");

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFieldErrors(registerForm);
      const nameInput = document.getElementById("register-name");
      const emailInput = document.getElementById("register-email");
      const roleInput = document.getElementById("register-role");
      const passwordInput = document.getElementById("register-password");
      const confirmInput = document.getElementById("register-confirm-password");

      const name = nameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const role = normalizeRole(roleInput ? roleInput.value : "student");
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;

      if (name.length < 2) {
        setFieldError(nameInput, "Enter at least 2 characters.");
        setMessage(registerMessage, "Please fix the highlighted fields and try again.", "error");
        nameInput.focus();
        return;
      }
      if (!isValidEmail(email)) {
        setFieldError(emailInput, "Enter a valid email address.");
        setMessage(registerMessage, "Please fix the highlighted fields and try again.", "error");
        emailInput.focus();
        return;
      }
      if (password.length < 8) {
        setFieldError(passwordInput, "Password must contain at least 8 characters.");
        setMessage(registerMessage, "Please fix the highlighted fields and try again.", "error");
        passwordInput.focus();
        return;
      }
      if (password !== confirmPassword) {
        setFieldError(confirmInput, "Passwords do not match.");
        setMessage(registerMessage, "Please fix the highlighted fields and try again.", "error");
        confirmInput.focus();
        return;
      }

      const users = getUsers();
      if (users.some((user) => user.email.toLowerCase() === email)) {
        setFieldError(emailInput, "An account with this email already exists.");
        setMessage(registerMessage, "Please use another email address.", "error");
        emailInput.focus();
        return;
      }

      users.push({ name, email, password, role });
      if (!writeStorage(STORAGE_KEYS.users, users)) {
        setMessage(registerMessage, "Local Storage is unavailable in this browser.", "error");
        return;
      }

      setMessage(registerMessage, "Registration successful. Opening login...", "success");
      registerForm.reset();
      window.setTimeout(() => {
        window.location.href = "login.html";
      }, 450);
    });
  }

  // Login supports registered Local Storage users and the seeded demo user.
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-message");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFieldErrors(loginForm);
      const emailInput = document.getElementById("login-email");
      const passwordInput = document.getElementById("login-password");
      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;

      if (!isValidEmail(email)) {
        setFieldError(emailInput, "Enter a valid email address.");
        setMessage(loginMessage, "Please fix the highlighted fields and try again.", "error");
        emailInput.focus();
        return;
      }
      if (password.length < 8) {
        setFieldError(passwordInput, "Password must contain at least 8 characters.");
        setMessage(loginMessage, "Please fix the highlighted fields and try again.", "error");
        passwordInput.focus();
        return;
      }

      const user = getUsers().find((item) => item.email.toLowerCase() === email && item.password === password);
      if (!user) {
        setFieldError(emailInput, "Check the email address.");
        setFieldError(passwordInput, "Check the password.");
        setMessage(loginMessage, "Incorrect email or password.", "error");
        return;
      }

      const signedInUser = { name: user.name, email: user.email, role: normalizeRole(user.role) };
      writeStorage(STORAGE_KEYS.currentUser, signedInUser);
      setMessage(loginMessage, `Login successful. Opening ${signedInUser.role} dashboard...`, "success");
      window.setTimeout(() => {
        window.location.href = roleDashboardPath(signedInUser.role);
      }, 350);
    });
  }

  // Forgot password and reset password UI simulation.
  const forgotForm = document.getElementById("forgot-password-form");
  const forgotMessage = document.getElementById("forgot-password-message");

  if (forgotForm) {
    forgotForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFieldErrors(forgotForm);
      const emailInput = document.getElementById("forgot-email");
      const email = emailInput.value.trim().toLowerCase();

      if (!isValidEmail(email)) {
        setFieldError(emailInput, "Enter a valid email address.");
        setMessage(forgotMessage, "Please fix the highlighted field and try again.", "error");
        emailInput.focus();
        return;
      }
      if (!getUsers().some((user) => user.email.toLowerCase() === email)) {
        setFieldError(emailInput, "No simulated account was found for this email.");
        setMessage(forgotMessage, "No simulated account was found for this email.", "error");
        return;
      }

      writeStorage(STORAGE_KEYS.resetEmail, email);
      setMessage(forgotMessage, "Account verified. Opening reset password...", "success");
      window.setTimeout(() => {
        window.location.href = "reset-password.html";
      }, 400);
    });
  }

  const resetForm = document.getElementById("reset-password-form");
  const resetMessage = document.getElementById("reset-password-message");
  const resetAccount = document.getElementById("reset-account");

  if (resetForm) {
    const resetEmail = readStorage(STORAGE_KEYS.resetEmail, "");
    if (resetAccount) {
      resetAccount.textContent = resetEmail || "No account selected";
    }

    resetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFieldErrors(resetForm);
      const passwordInput = document.getElementById("reset-password");
      const confirmInput = document.getElementById("reset-confirm-password");
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;
      const email = readStorage(STORAGE_KEYS.resetEmail, "");

      if (!email) {
        setMessage(resetMessage, "Start from the Forgot Password page first.", "error");
        return;
      }
      if (password.length < 8) {
        setFieldError(passwordInput, "Password must contain at least 8 characters.");
        setMessage(resetMessage, "Please fix the highlighted fields and try again.", "error");
        passwordInput.focus();
        return;
      }
      if (password !== confirmPassword) {
        setFieldError(confirmInput, "Passwords do not match.");
        setMessage(resetMessage, "Please fix the highlighted fields and try again.", "error");
        confirmInput.focus();
        return;
      }

      const users = getUsers();
      const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        setMessage(resetMessage, "The selected account no longer exists.", "error");
        return;
      }

      user.password = password;
      writeStorage(STORAGE_KEYS.users, users);
      removeStorage(STORAGE_KEYS.resetEmail);
      setMessage(resetMessage, "Password reset successful. Opening login...", "success");
      resetForm.reset();
      window.setTimeout(() => {
        window.location.href = "login.html";
      }, 450);
    });
  }

  // Dynamic student profile page and JavaScript performance cards.
  const profileRoot = document.getElementById("student-profile-root");
  if (profileRoot) {
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get("id");
    const student = getStudents().find((item) => item.id === requestedId);
    const profileName = document.getElementById("profile-name");
    const profileId = document.getElementById("profile-id");
    const profileGrade = document.getElementById("profile-grade");
    const performanceCards = document.getElementById("performance-cards");
    const profileDetails = document.getElementById("profile-details");
    const profileMissing = document.getElementById("profile-missing");

    if (!student) {
      profileRoot.hidden = true;
      if (profileMissing) profileMissing.hidden = false;
    } else {
      if (profileName) profileName.textContent = student.name;
      if (profileId) profileId.textContent = student.id;
      if (profileGrade) {
        profileGrade.textContent = student.grade;
        profileGrade.className = `grade ${gradeClass(student.grade)}`;
      }

      const cards = [
        ["Overall Score", `${student.overall}%`, "Current performance"],
        ["Attendance", `${student.attendance}%`, "Attendance rate"],
        ["Final Exam", `${student.final}%`, "Final assessment"],
        ["Grade", student.grade, "Current grade"]
      ];

      if (performanceCards) {
        performanceCards.textContent = "";
        cards.forEach(([label, value, note]) => {
          const card = document.createElement("article");
          card.className = "stat-card performance-card reveal";
          const labelElement = document.createElement("span");
          labelElement.className = "stat-label";
          labelElement.textContent = label;
          const valueElement = document.createElement("strong");
          valueElement.textContent = value;
          const noteElement = document.createElement("small");
          noteElement.textContent = note;
          card.append(labelElement, valueElement, noteElement);
          performanceCards.appendChild(card);
        });
      }

      if (profileDetails) {
        const detailItems = [
          ["Assignment Score", student.assignment],
          ["Quiz Score", student.quiz],
          ["Mid Exam Score", student.mid],
          ["Final Exam Score", student.final]
        ];
        profileDetails.textContent = "";
        detailItems.forEach(([label, value]) => {
          const item = document.createElement("div");
          item.className = "profile-detail";
          const labelElement = document.createElement("span");
          labelElement.textContent = label;
          const valueElement = document.createElement("strong");
          valueElement.textContent = `${value}%`;
          item.append(labelElement, valueElement);
          profileDetails.appendChild(item);
        });
      }
    }
  }

  // Contact form validation.
  const contactForm = document.getElementById("contact-form");
  const contactMessage = document.getElementById("contact-form-message");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFieldErrors(contactForm);
      const nameInput = document.getElementById("contact-name");
      const emailInput = document.getElementById("contact-email");
      const subjectInput = document.getElementById("contact-subject");
      const messageInput = document.getElementById("contact-message");
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      let contactHasError = false;
      if (name.length < 2) { setFieldError(nameInput, "Enter at least 2 characters."); contactHasError = true; }
      if (!isValidEmail(email)) { setFieldError(emailInput, "Enter a valid email address."); contactHasError = true; }
      if (subject.length < 3) { setFieldError(subjectInput, "Enter at least 3 characters."); contactHasError = true; }
      if (message.length < 10) { setFieldError(messageInput, "Enter at least 10 characters."); contactHasError = true; }
      if (contactHasError) {
        setMessage(contactMessage, "Please complete the highlighted fields with valid information.", "error");
        const firstInvalid = contactForm.querySelector("[aria-invalid='true']");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      setMessage(contactMessage, "Message submitted successfully.", "success");
      contactForm.reset();
    });
  }

  // Week 4: role dashboards, notifications, profile management and accessibility controls.
  const notificationToggle = document.getElementById("notification-toggle");
  const notificationPanel = document.getElementById("notification-panel");
  const notificationClose = document.getElementById("notification-close");
  const notificationList = document.getElementById("notification-list");
  const notificationBadge = document.getElementById("notification-badge");
  const markNotificationsRead = document.getElementById("mark-notifications-read");

  function getNotifications() {
    const notifications = readStorage(STORAGE_KEYS.notifications, []);
    return Array.isArray(notifications) ? notifications : [];
  }

  function renderNotifications() {
    const notifications = getNotifications();
    const unreadCount = notifications.filter((item) => !item.read).length;
    if (notificationBadge) {
      notificationBadge.textContent = String(unreadCount);
      notificationBadge.hidden = unreadCount === 0;
    }
    if (!notificationList) return;

    const fragment = document.createDocumentFragment();
    notifications.forEach((notification) => {
      const item = document.createElement("li");
      item.className = `notification-item${notification.read ? "" : " unread"}`;
      const title = document.createElement("strong");
      title.textContent = notification.title;
      const message = document.createElement("span");
      message.textContent = notification.message;
      item.append(title, message);
      fragment.appendChild(item);
    });
    notificationList.replaceChildren(fragment);
  }

  function setNotificationPanel(open) {
    if (!notificationPanel || !notificationToggle) return;
    notificationPanel.hidden = !open;
    notificationToggle.setAttribute("aria-expanded", String(open));
    if (open && notificationClose) notificationClose.focus();
  }

  if (notificationToggle && notificationPanel) {
    renderNotifications();
    notificationToggle.addEventListener("click", () => {
      setNotificationPanel(notificationPanel.hidden);
    });
    if (notificationClose) notificationClose.addEventListener("click", () => setNotificationPanel(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !notificationPanel.hidden) {
        setNotificationPanel(false);
        notificationToggle.focus();
      }
    });
  }

  if (markNotificationsRead) {
    markNotificationsRead.addEventListener("click", () => {
      const notifications = getNotifications().map((item) => ({ ...item, read: true }));
      writeStorage(STORAGE_KEYS.notifications, notifications);
      renderNotifications();
    });
  }

  const logoutButtons = document.querySelectorAll("[data-logout]");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      removeStorage(STORAGE_KEYS.currentUser);
      window.location.href = "login.html";
    });
  });

  const accountProfileForm = document.getElementById("account-profile-form");
  const accountProfileMessage = document.getElementById("account-profile-message");
  if (accountProfileForm) {
    const nameInput = document.getElementById("account-name");
    const emailInput = document.getElementById("account-email");
    const roleInput = document.getElementById("account-role");

    if (!currentUser) {
      setMessage(accountProfileMessage, "Please log in to manage your profile.", "error");
      Array.from(accountProfileForm.elements).forEach((element) => { element.disabled = true; });
    } else {
      nameInput.value = currentUser.name || "";
      emailInput.value = currentUser.email || "";
      roleInput.value = normalizeRole(currentUser.role);

      accountProfileForm.addEventListener("submit", (event) => {
        event.preventDefault();
        clearFieldErrors(accountProfileForm);
        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        if (name.length < 2) {
          setFieldError(nameInput, "Enter at least 2 characters.");
          setMessage(accountProfileMessage, "Please fix the highlighted fields and try again.", "error");
          nameInput.focus();
          return;
        }
        if (!isValidEmail(email)) {
          setFieldError(emailInput, "Enter a valid email address.");
          setMessage(accountProfileMessage, "Please fix the highlighted fields and try again.", "error");
          emailInput.focus();
          return;
        }

        const users = getUsers();
        const duplicate = users.some((user) => user.email.toLowerCase() === email && user.email.toLowerCase() !== currentUser.email.toLowerCase());
        if (duplicate) {
          setFieldError(emailInput, "Another account already uses this email.");
          setMessage(accountProfileMessage, "Another account already uses this email.", "error");
          return;
        }

        const user = users.find((item) => item.email.toLowerCase() === currentUser.email.toLowerCase());
        if (user) {
          user.name = name;
          user.email = email;
          user.role = normalizeRole(user.role);
          writeStorage(STORAGE_KEYS.users, users);
        }
        writeStorage(STORAGE_KEYS.currentUser, { name, email, role: normalizeRole(currentUser.role) });
        setMessage(accountProfileMessage, "Profile updated successfully.", "success");
      });
    }
  }

  const studentRoleCards = document.getElementById("student-role-cards");
  if (studentRoleCards) {
    const students = getStudents();
    const matchedStudent = currentUser
      ? students.find((student) => student.name.toLowerCase() === String(currentUser.name).toLowerCase())
      : null;
    const student = matchedStudent || students[0];

    if (student) {
      const nameElement = document.getElementById("student-role-name");
      const idElement = document.getElementById("student-role-id");
      const gradeElement = document.getElementById("student-role-grade");
      const detailsElement = document.getElementById("student-role-details");
      if (nameElement) nameElement.textContent = student.name;
      if (idElement) idElement.textContent = student.id;
      if (gradeElement) {
        gradeElement.textContent = student.grade;
        gradeElement.className = `grade ${gradeClass(student.grade)}`;
      }

      const metrics = [
        ["Overall Score", `${student.overall}%`, "Current performance"],
        ["Attendance", `${student.attendance}%`, "Attendance rate"],
        ["Assignment", `${student.assignment}%`, "Assignment score"],
        ["Final Exam", `${student.final}%`, "Final assessment"]
      ];
      const fragment = document.createDocumentFragment();
      metrics.forEach(([label, value, note]) => {
        const card = document.createElement("article");
        card.className = "stat-card";
        const labelElement = document.createElement("span");
        labelElement.className = "stat-label";
        labelElement.textContent = label;
        const valueElement = document.createElement("strong");
        valueElement.textContent = value;
        const noteElement = document.createElement("small");
        noteElement.textContent = note;
        card.append(labelElement, valueElement, noteElement);
        fragment.appendChild(card);
      });
      studentRoleCards.replaceChildren(fragment);

      if (detailsElement) {
        const detailFragment = document.createDocumentFragment();
        [["Quiz", student.quiz], ["Mid Exam", student.mid], ["Final Exam", student.final], ["Grade", student.grade]].forEach(([label, value]) => {
          const item = document.createElement("div");
          item.className = "profile-detail";
          const labelElement = document.createElement("span");
          labelElement.textContent = label;
          const valueElement = document.createElement("strong");
          valueElement.textContent = typeof value === "number" ? `${value}%` : value;
          item.append(labelElement, valueElement);
          detailFragment.appendChild(item);
        });
        detailsElement.replaceChildren(detailFragment);
      }
    }
  }



  // Week 7/8: final integrated user flow, module readiness and demo state interfaces.
  function readablePageName(pathname) {
    const file = pathname.split("/").pop() || "index.html";
    const names = {
      "login.html": "Login",
      "dashboard.html": "Dashboard",
      "admin-dashboard.html": "Administrator Dashboard",
      "teacher-dashboard.html": "Teacher Dashboard",
      "student-dashboard.html": "Student Dashboard",
      "reports.html": "Reports",
      "profile.html": "Student Profile",
      "account-profile.html": "Profile",
      "final-demo.html": "Final Project Demo"
    };
    return names[file] || "Home";
  }

  function markIntegratedState(target, label) {
    const states = document.querySelectorAll(`[data-loading-state="${target}"]`);
    states.forEach((state) => {
      window.setTimeout(() => {
        state.classList.remove("loading");
        state.classList.add("ready");
        const strong = state.querySelector("strong");
        const text = state.querySelector("p");
        if (strong) strong.textContent = `${label} ready`;
        if (text) text.textContent = "Integrated navigation, dashboard components, tables, filters, charts and UI state handling are active.";
      }, 220);
    });
  }

  function highlightFinalFlow() {
    const page = readablePageName(window.location.pathname).toLowerCase();
    document.querySelectorAll("[data-flow-step]").forEach((step) => {
      const stepName = String(step.dataset.flowStep || "").toLowerCase();
      const isCurrent = page.includes(stepName) || ((page.includes("administrator") || page.includes("teacher") || page.includes("student dashboard")) && stepName === "dashboard");
      step.classList.toggle("current", isCurrent);
      if (isCurrent) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
  }

  markIntegratedState("dashboard", "Dashboard modules");
  markIntegratedState("reports", "Reports module");
  highlightFinalFlow();

  // Week 6: clear inline validation messages as users correct form fields.
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("input", (event) => {
      if (event.target instanceof HTMLElement) clearSingleFieldError(event.target);
    });
    form.addEventListener("change", (event) => {
      if (event.target instanceof HTMLElement) clearSingleFieldError(event.target);
    });
  });

  // Lightweight reveal animations for improved user experience.
  const revealItems = document.querySelectorAll(".stat-card, .feature-card, .panel, .info-panel, .login-card");
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 270)}ms`);
  });
})();
