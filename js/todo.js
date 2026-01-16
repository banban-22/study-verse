// Todo List functionality with local storage
class TodoList {
    constructor() {
        this.todos = this.loadTodos();
        
        // DOM elements
        this.todoInput = document.getElementById('todoInput');
        this.addTodoBtn = document.getElementById('addTodoBtn');
        this.todoList = document.getElementById('todoList');
        this.todoCount = document.getElementById('todoCount');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        
        // Event listeners
        this.addTodoBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        
        // Initialize
        this.render();
    }
    
    loadTodos() {
        const saved = localStorage.getItem('studyTodos');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveTodos() {
        localStorage.setItem('studyTodos', JSON.stringify(this.todos));
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.unshift(todo);
        this.todoInput.value = '';
        this.saveTodos();
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }
    
    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            alert('No completed tasks to clear.');
            return;
        }
        
        if (confirm(`Clear ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodos();
            this.render();
        }
    }
    
    render() {
        // Clear list
        this.todoList.innerHTML = '';
        
        // Render todos
        if (this.todos.length === 0) {
            this.todoList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-clipboard-list" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>No study tasks yet. Add one to get started!</p>
                </div>
            `;
        } else {
            this.todos.forEach(todo => {
                const todoElement = this.createTodoElement(todo);
                this.todoList.appendChild(todoElement);
            });
        }
        
        // Update count
        const activeCount = this.todos.filter(t => !t.completed).length;
        this.todoCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''}`;
    }
    
    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = 'todo-item' + (todo.completed ? ' completed' : '');
        
        div.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <button class="todo-delete">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Add event listeners
        const checkbox = div.querySelector('.todo-checkbox');
        const deleteBtn = div.querySelector('.todo-delete');
        
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
        
        return div;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize todo list when page loads
let todoList;
document.addEventListener('DOMContentLoaded', () => {
    todoList = new TodoList();
});
