(function () {
    const STORAGE_KEY = 'djama_tasks_v1';
    const MAX_VISIBLE_TASKS = 4;

    function getTasks() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveTasks(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function addTask(task) {
        const tasks = getTasks();
        const updatedTasks = [task, ...tasks].slice(0, MAX_VISIBLE_TASKS);
        saveTasks(updatedTasks);
    }

    // Called from Nuevas_Tareas.html
    function initForm() {
        const form = document.getElementById('taskForm');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const title = document.getElementById('title').value.trim();
            if (!title) return alert('El nombre de la tarea es obligatorio');
            const date = document.getElementById('date').value || null;
            const time = document.getElementById('time').value || null;
            const priority = document.getElementById('priority').value || 'media';
            const notes = document.getElementById('notes').value || '';

            const task = {
                id: Date.now(),
                title,
                date,
                time,
                priority,
                notes,
                createdAt: new Date().toISOString(),
            };

            addTask(task);

            const msg = document.getElementById('saveMessage');
            if (msg) {
                msg.style.display = 'block';
            }

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 700);
        });
    }

    function initHelpForm() {
        const form = document.getElementById('helpForm');
        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            try {
                await fetch('https://danielec2009.app.n8n.cloud/webhook/1dfef588-3f90-4780-a97f-c8aff618be0a', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const msg = document.getElementById('helpMessage');
                if (msg) msg.style.display = 'block';

                form.reset();
            } catch (err) {
                alert('Error al enviar. Intenta de nuevo.');
            }
        });
    }

    function renderTasks() {
        const list = document.getElementById('taskList');
        if (!list) return;
        const tasks = getTasks().slice(0, MAX_VISIBLE_TASKS);
        if (tasks.length === 0) {
            list.innerHTML = '<li class="" style="color:var(--muted);">No hay tareas guardadas. Crea una nueva tarea.</li>';
            return;
        }
        list.innerHTML = '';
        tasks.forEach(t => {
            const li = document.createElement('li');
            li.className = '';
            li.innerHTML = `
                <span class="task-icon">📅</span>
                <span class="task-name">${escapeHtml(t.title)}</span>
                <span class="task-time">${t.time || ''}</span>
            `;
            list.appendChild(li);
        });
    }

    function escapeHtml(s) {
        return (s + '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    window.DJAMA = window.DJAMA || {};
    window.DJAMA.initForm = initForm;
    window.DJAMA.renderTasks = renderTasks;

    document.addEventListener('DOMContentLoaded', function () {
        initForm();
        initHelpForm();
        renderTasks();
    });

})();