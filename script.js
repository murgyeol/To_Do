document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const currentDateEl = document.getElementById('current-date');
    const addBtn = document.getElementById('add-btn');
    const modal = document.getElementById('todo-modal');
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const todoForm = document.getElementById('todo-form');

    const todaySection = document.getElementById('today-section');
    const otherSection = document.getElementById('other-section');
    const todayList = document.getElementById('today-list');
    const otherList = document.getElementById('other-list');
    const todayCount = document.getElementById('today-count');
    const otherCount = document.getElementById('other-count');
    const emptyState = document.getElementById('empty-state');

    const dateInput = document.getElementById('todo-date');
    const toast = document.getElementById('toast');
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = document.getElementById('submit-btn');
    const toggleCompleteBtn = document.getElementById('toggle-complete-btn');

    // Filter Elements
    const filterAllBtn = document.getElementById('filter-all');
    const filterCompletedBtn = document.getElementById('filter-completed');
    const filterIncompleteBtn = document.getElementById('filter-incomplete');

    // View Toggle Elements
    const viewListBtn = document.getElementById('view-list-btn');
    const viewCalendarBtn = document.getElementById('view-calendar-btn');
    const listViewContainer = document.getElementById('list-view-container');
    const calendarViewContainer = document.getElementById('calendar-view-container');

    // Calendar Elements
    const calendarMonthTitle = document.getElementById('calendar-month-title');
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');

    // Day Detail Modal Elements
    const dayDetailModal = document.getElementById('day-detail-modal');
    const dayDetailTitle = document.getElementById('day-detail-title');
    const dayDetailList = document.getElementById('day-detail-list');
    const dayDetailEmpty = document.getElementById('day-detail-empty');
    const dayDetailAddBtn = document.getElementById('day-detail-add-btn');
    const closeDayDetailBtn = document.getElementById('close-day-detail');

    // State
    // Format of todo: { id, title, date, desc, completed, createdAt }
    const firebaseConfig = {
        apiKey: 'AIzaSyA3wZQzIcEsunLrPWbOFLNpZYoeiG6By8I',
        authDomain: 'todo-4d0d7.firebaseapp.com',
        databaseURL: 'https://todo-4d0d7-default-rtdb.firebaseio.com',
        projectId: 'todo-4d0d7',
        storageBucket: 'todo-4d0d7.firebasestorage.app',
        messagingSenderId: '886996608861',
        appId: '1:886996608861:web:73bae81f44befdd9eb2ab4',
        measurementId: 'G-D9EWD6C41D'
    };
    // Firebase Realtime Database endpoint (todos collection)
    const FIREBASE_DB_URL = `${firebaseConfig.databaseURL}/todos`;
    let todos = [];
    let currentView = 'calendar'; // 'list' or 'calendar'
    let currentFilter = 'all'; // 'all', 'completed', 'incomplete'
    let currentCalendarDate = new Date(); // Tracks the month currently shown in calendar
    let currentEditingId = null;
    let currentDayDetailDate = null; // Tracks which date the day detail modal is showing

    // Initialize
    async function init() {
        setTodayDate();
        setupViewToggles();
        setupFilterToggles();
        setupCalendarNavigation();
        setupDayDetailModal();
        await fetchTodos();
        renderActiveView();
    }

    // Fetch from Firebase Realtime Database
    async function fetchTodos() {
        try {
            const res = await fetch(`${FIREBASE_DB_URL}.json`);
            if (!res.ok) throw new Error('Failed to fetch todos');

            const data = await res.json();
            if (!data) {
                todos = [];
                return;
            }

            todos = Object.entries(data).map(([id, value]) => ({
                id,
                title: value.title,
                date: value.date,
                desc: value.desc || '',
                completed: Boolean(value.completed),
                createdAt: value.createdAt || value.date
            })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (e) {
            console.error('Error fetching todos:', e);
        }
    }

    // Set today's date in header
    function setTodayDate() {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const today = new Date();
        currentDateEl.textContent = today.toLocaleDateString('ko-KR', options);

        // Also set default date in modal date picker (local timezone)
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
        dateInput.value = localISOTime;
    }

    // Get today's date string in YYYY-MM-DD format for comparison
    function getTodayString() {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        return (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];
    }

    // View Toggle Logic
    function setupViewToggles() {
        viewListBtn.addEventListener('click', () => {
            currentView = 'list';
            viewListBtn.classList.add('active');
            viewCalendarBtn.classList.remove('active');
            listViewContainer.style.display = 'flex';
            calendarViewContainer.style.display = 'none';
            renderActiveView();
        });

        viewCalendarBtn.addEventListener('click', () => {
            currentView = 'calendar';
            viewCalendarBtn.classList.add('active');
            viewListBtn.classList.remove('active');
            calendarViewContainer.style.display = 'flex';
            listViewContainer.style.display = 'none';
            renderActiveView();
        });
    }

    // Filter Toggle Logic
    function setupFilterToggles() {
        const updateFilterUI = () => {
            filterAllBtn.classList.toggle('active', currentFilter === 'all');
            filterCompletedBtn.classList.toggle('active', currentFilter === 'completed');
            filterIncompleteBtn.classList.toggle('active', currentFilter === 'incomplete');
        };

        filterAllBtn.addEventListener('click', () => {
            currentFilter = 'all';
            updateFilterUI();
            renderTodos();
        });

        filterCompletedBtn.addEventListener('click', () => {
            currentFilter = 'completed';
            updateFilterUI();
            renderTodos();
        });

        filterIncompleteBtn.addEventListener('click', () => {
            currentFilter = 'incomplete';
            updateFilterUI();
            renderTodos();
        });
    }

    function renderActiveView() {
        renderTodos();
        if (currentView === 'list') {
            // Empty state handled in renderTodos
        } else {
            renderCalendar();
        }
    }

    // Calendar Navigation Logic
    function setupCalendarNavigation() {
        prevMonthBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar();
        });
    }

    // Event Listeners for Modal
    addBtn.addEventListener('click', () => openModal(false));
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    toggleCompleteBtn.addEventListener('click', async () => {
        if (currentEditingId) {
            await toggleComplete(currentEditingId);
            closeModal();
            showToast('할 일 상태가 변경되었습니다.');
        }
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function openModal(isEdit = false, todo = null) {
        modal.classList.add('active');
        document.getElementById('todo-title').focus();

        if (isEdit && todo) {
            modalTitle.textContent = '할 일 상세 정보';
            submitBtn.textContent = '수정하기';
            document.getElementById('todo-title').value = todo.title;
            document.getElementById('todo-date').value = todo.date;
            document.getElementById('todo-desc').value = todo.desc;
            currentEditingId = todo.id;

            toggleCompleteBtn.style.display = 'block';
            toggleCompleteBtn.textContent = todo.completed ? '미완료로 변경' : '완료하기';
        } else {
            modalTitle.textContent = '새로운 할 일';
            submitBtn.textContent = '저장하기';
            todoForm.reset();
            setTodayDate();
            currentEditingId = null;
            toggleCompleteBtn.style.display = 'none';
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        todoForm.reset();
        setTodayDate(); // reset date to today
        currentEditingId = null;
    }

    // Show Toast
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Handle Form Submit
    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('todo-title').value.trim();
        const date = document.getElementById('todo-date').value;
        const desc = document.getElementById('todo-desc').value.trim();

        if (!title || !date) return;

        if (currentEditingId) {
            // Edit mode
            const todo = todos.find(t => t.id === currentEditingId);
            if (todo) {
                todo.title = title;
                todo.date = date;
                todo.desc = desc;

                try {
                    await fetch(`${FIREBASE_DB_URL}/${todo.id}.json`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, date, desc })
                    });
                    showToast('할 일이 수정되었습니다! ✨');
                } catch (e) {
                    console.error('Failed to update todo', e);
                    showToast('수정에 실패했습니다.');
                }
            }
        } else {
            // Add mode
            const newTodo = {
                title,
                date,
                desc,
                completed: false,
                createdAt: new Date().toISOString()
            };

            try {
                const res = await fetch(`${FIREBASE_DB_URL}.json`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTodo)
                });

                if (res.ok) {
                    const saved = await res.json(); // { name: "<firebase-id>" }
                    const savedTodo = { ...newTodo, id: saved.name };
                    todos.unshift(savedTodo);
                    showToast('할 일이 성공적으로 추가되었습니다! 🎉');
                } else {
                    console.error('Server returned error on POST');
                    showToast('저장에 실패했습니다.');
                }
            } catch (e) {
                console.error('Failed to post new todo', e);
                showToast('저장에 실패했습니다.');
            }
        }

        await fetchTodos();
        renderActiveView();
        closeModal();
    });

    // Create Todo HTML Element
    function createTodoElement(todo, isToday) {
        const li = document.createElement('li');
        li.className = `todo-item ${isToday ? 'today' : ''} ${todo.completed ? 'completed' : ''}`;
        li.style.cursor = 'pointer'; // indicate it's clickable
        li.dataset.id = todo.id;

        const titleStyle = todo.completed ? 'text-decoration: line-through; color: var(--text-muted);' : '';
        const checkIcon = todo.completed ? 'ph-check-circle' : 'ph-circle';
        const isTodayDate = todo.date === getTodayString();
        const dateLabel = isTodayDate ? '오늘' : formatDateShort(todo.date);

        li.innerHTML = `
            <div class="todo-header">
                <div class="todo-title-row">
                    <div class="todo-title" style="${titleStyle}">${escapeHTML(todo.title)}</div>
                    <span class="todo-date-inline ${isTodayDate ? 'today' : ''}">${dateLabel}</span>
                </div>
                <div class="todo-actions">
                    <button class="icon-btn check" data-id="${todo.id}" title="${todo.completed ? '미완료로 변경' : '완료'}">
                        <i class="ph ${checkIcon}"></i>
                    </button>
                    <button class="icon-btn delete" data-id="${todo.id}" title="삭제">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </div>
        `;
        return li;
    }

    // Render Todos
    function renderTodos() {
        todayList.innerHTML = '';
        otherList.innerHTML = '';

        const todayStr = getTodayString();

        const todayTodos = todos.filter(t => t.date === todayStr);
        let otherTodos = todos.filter(t => t.date !== todayStr);

        // Render Today's
        if (todayTodos.length > 0) {
            document.getElementById('today-empty-state').style.display = 'none';
            todayList.style.display = 'flex';
            todayCount.textContent = todayTodos.length;
            todayTodos.forEach(todo => {
                todayList.appendChild(createTodoElement(todo, true));
            });
        } else {
            document.getElementById('today-empty-state').style.display = 'flex';
            todayList.style.display = 'none';
            todayCount.textContent = '0';
        }

        if (currentFilter === 'completed') {
            otherTodos = otherTodos.filter(t => t.completed);
        } else if (currentFilter === 'incomplete') {
            otherTodos = otherTodos.filter(t => !t.completed);
        }

        // Sort remaining by date ascending
        otherTodos.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Render Others
        if (otherTodos.length > 0) {
            emptyState.classList.remove('active');
            otherSection.style.display = 'block';
            otherCount.textContent = otherTodos.length;
            otherTodos.forEach(todo => {
                otherList.appendChild(createTodoElement(todo, false));
            });
        } else {
            emptyState.classList.add('active');
            otherSection.style.display = 'none';
        }

        // Attach Event Listeners
        document.querySelectorAll('.todo-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Ignore clicks on action buttons
                if (e.target.closest('.todo-actions')) return;

                const id = e.currentTarget.dataset.id;
                const todo = todos.find(t => t.id === id);
                if (todo) openModal(true, todo);
            });
        });

        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteTodo(id);
            });
        });

        document.querySelectorAll('.check').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                toggleComplete(id);
            });
        });
    }

    // Render Calendar View
    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();

        // Update Title
        calendarMonthTitle.textContent = `${year}년 ${month + 1}월`;

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const todayStr = getTodayString();

        // Previous month padding
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');

            // Format YYYY-MM-DD for matching
            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateString = `${year}-${monthStr}-${dayStr}`;

            dayCell.className = `calendar-day${dateString === todayStr ? ' today' : ''}`;

            // Make Sundays red if needed (optional styling)
            const isSunday = new Date(year, month, day).getDay() === 0;
            if (isSunday) dayCell.classList.add('holiday');

            // Day Number
            const dayNum = document.createElement('div');
            dayNum.className = 'day-num';
            dayNum.textContent = day;
            dayCell.appendChild(dayNum);

            // Find todos for this date
            const dayTodos = todos.filter(t => t.date === dateString);

            dayTodos.forEach(todo => {
                const todoIndicator = document.createElement('div');
                todoIndicator.className = `calendar-todo-item${todo.completed ? ' completed' : ''}`;
                todoIndicator.textContent = todo.title;
                todoIndicator.title = todo.desc ? `${todo.title}\n${todo.desc}` : todo.title;

                // Click on custom indicator to open modal
                todoIndicator.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openModal(true, todo);
                });

                dayCell.appendChild(todoIndicator);
            });

            // Click empty space to add new todo on that date
            dayCell.addEventListener('click', () => {
                openDayDetailModal(dateString);
            });

            calendarDays.appendChild(dayCell);
        }
    }

    // Day Detail Modal Logic
    function setupDayDetailModal() {
        closeDayDetailBtn.addEventListener('click', closeDayDetailModal);
        dayDetailModal.addEventListener('click', (e) => {
            if (e.target === dayDetailModal) closeDayDetailModal();
        });
        dayDetailAddBtn.addEventListener('click', () => {
            const selectedDate = currentDayDetailDate;
            closeDayDetailModal();
            openModal(false);
            document.getElementById('todo-date').value = selectedDate;
        });
    }

    function openDayDetailModal(dateString) {
        currentDayDetailDate = dateString;
        const date = new Date(dateString + 'T00:00:00');
        const options = { month: 'long', day: 'numeric', weekday: 'short' };
        dayDetailTitle.textContent = `${date.toLocaleDateString('ko-KR', options)}의 할 일`;

        renderDayDetailList(dateString);
        dayDetailModal.classList.add('active');
    }

    function closeDayDetailModal() {
        dayDetailModal.classList.remove('active');
        currentDayDetailDate = null;
    }

    function renderDayDetailList(dateString) {
        dayDetailList.innerHTML = '';
        const dayTodos = todos.filter(t => t.date === dateString);

        if (dayTodos.length === 0) {
            dayDetailEmpty.style.display = 'flex';
        } else {
            dayDetailEmpty.style.display = 'none';
            dayTodos.forEach(todo => {
                const item = document.createElement('div');
                item.className = `day-detail-item${todo.completed ? ' completed' : ''}`;

                const checkIcon = todo.completed ? 'ph-check-circle' : 'ph-circle';

                item.innerHTML = `
                    <i class="ph ${checkIcon} check-circle" data-id="${todo.id}"></i>
                    <div class="day-detail-item-info">
                        <div class="day-detail-item-title">${escapeHTML(todo.title)}</div>
                        ${todo.desc ? `<div class="day-detail-item-desc">${escapeHTML(todo.desc)}</div>` : ''}
                    </div>
                    <button class="delete-btn" data-id="${todo.id}" title="삭제"><i class="ph ph-trash"></i></button>
                `;

                // Click check icon to toggle complete
                item.querySelector('.check-circle').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await toggleComplete(todo.id);
                    renderDayDetailList(dateString);
                });

                // Click delete button
                item.querySelector('.delete-btn').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await deleteTodo(todo.id);
                    renderDayDetailList(dateString);
                });

                // Click item to open edit modal
                item.addEventListener('click', () => {
                    closeDayDetailModal();
                    openModal(true, todo);
                });

                dayDetailList.appendChild(item);
            });
        }
    }

    // Toggle Complete
    async function toggleComplete(id) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            try {
                await fetch(`${FIREBASE_DB_URL}/${todo.id}.json`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: todo.completed })
                });
                await fetchTodos();
                renderActiveView();
            } catch (e) {
                console.error('Failed to toggle completion', e);
                // Revert local state if failed
                todo.completed = !todo.completed;
                showToast('상태 변경에 실패했습니다.');
            }
        }
    }

    // Delete Todo
    async function deleteTodo(id) {
        try {
            await fetch(`${FIREBASE_DB_URL}/${id}.json`, { method: 'DELETE' });
            await fetchTodos();
            renderActiveView();
            showToast('할 일이 삭제되었습니다.');
        } catch (e) {
            console.error('Failed to delete todo', e);
            showToast('삭제에 실패했습니다.');
        }
    }

    // Utility: Format Date
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
    }

    // Utility: Short Date for inline labels
    function formatDateShort(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }

    // Utility: Escape HTML to prevent XSS
    function escapeHTML(str) {
        let div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    init();
});
