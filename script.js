const STORAGE_KEY = 'lb18_todos';

const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

const defaultTodos = [
  { id: '1', text: 'Вивчити HTML', completed: true },
  { id: '2', text: 'Вивчити CSS', completed: true },
  { id: '3', text: 'Вивчити JavaScript', completed: false },
];

let todos = loadTodos();

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return [...defaultTodos];
  } catch (err) {
    console.error('Помилка зчитування Local Storage:', err);
    return [...defaultTodos];
  }
}

// Створення нової справи
function newTodo() {
  const input = prompt('Введіть нову справу:');
  if (input === null) return;

  const text = input.trim();
  if (!text) return;

  const todo = {
    id: String(Date.now()),
    text,
    completed: false,
  };

  todos.push(todo);
  console.log('Нова справа:', todo);
  console.log('Актуальний масив todos:', todos);

  saveTodos();
  render();
  updateCounter();
}

// Створення DOM-елемента для однієї справи
function renderTodo(todo) {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'form-check-input me-2';
  checkbox.id = 'todo-' + todo.id;
  checkbox.checked = Boolean(todo.completed);

  const label = document.createElement('label');
  label.htmlFor = 'todo-' + todo.id;

  const span = document.createElement('span');
  if (todo.completed) {
    span.className = 'text-success text-decoration-line-through';
  }
  span.textContent = todo.text;

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'btn btn-danger btn-sm float-end';
  delBtn.textContent = 'delete';

  label.appendChild(span);
  li.append(checkbox, label, delBtn);
  return li;
}

function render() {
  list.replaceChildren(...todos.map(renderTodo));
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  const uncheckedCount = todos.filter((todo) => !todo.completed).length;
  uncheckedCountSpan.textContent = uncheckedCount;
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== String(id));
  saveTodos();
  render();
  updateCounter();
}

function checkTodo(id) {
  todos = todos.map((todo) =>
    todo.id === String(id) ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  render();
  updateCounter();
}

list.addEventListener('change', (event) => {
  if (event.target.matches('input[type="checkbox"]')) {
    const li = event.target.closest('li.list-group-item');
    if (li) {
      checkTodo(li.dataset.id);
    }
  }
});

list.addEventListener('click', (event) => {
  if (event.target.matches('button.btn-danger')) {
    const li = event.target.closest('li.list-group-item');
    if (li) {
      deleteTodo(li.dataset.id);
    }
  }
});

render();
updateCounter();