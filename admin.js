const loginForm = document.getElementById('login-form');
const adminPanel = document.getElementById('admin-panel');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');

const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');
const createPostBtn = document.getElementById('create-post-btn');
const postList = document.getElementById('post-list');

const categoryNameInput = document.getElementById('category-name');
const createCategoryBtn = document.getElementById('create-category-btn');
const categoryList = document.getElementById('category-list');

const siteTitleInput = document.getElementById('site-title');
const createTitlesBtn = document.getElementById('create-titles-btn');

const userList = document.getElementById('user-list');

let posts = [];
let categories = [];
let users = [];

loginBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === 'admin' && password === 'admin') {
        loginForm.style.display = 'none';
        adminPanel.style.display = 'block';
        loadPosts();
        loadCategories();
        loadUsers();
    } else {
        alert('Credenciais inválidas.');
    }
});

createPostBtn.addEventListener('click', () => {
    const title = postTitleInput.value;
    const content = postContentInput.value;
    if (title && content) {
        posts.push({ title, content });
        displayPosts();
        postTitleInput.value = '';
        postContentInput.value = '';
    }
});

createCategoryBtn.addEventListener('click', () => {
    const name = categoryNameInput.value;
    if (name) {
        categories.push(name);
        displayCategories();
        categoryNameInput.value = '';
    }
});

createTitlesBtn.addEventListener('click', ()=>{
    const title = siteTitleInput.value;
    if (title) {
        document.title = title;
        siteTitleInput.value = '';
    }
});

function displayPosts() {
    postList.innerHTML = '';
    posts.forEach((post, index) => {
        const li = document.createElement('li');
        li.textContent = `${post.title} - ${post.content}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.addEventListener('click', () => {
            posts.splice(index, 1);
            displayPosts();
        });
        li.appendChild(deleteBtn);
        postList.appendChild(li);
    });
}

function displayCategories() {
    categoryList.innerHTML = '';
    categories.forEach((category, index) => {
        const li = document.createElement('li');
        li.textContent = category;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.addEventListener('click', () => {
            categories.splice(index, 1);
            displayCategories();
        });
        li.appendChild(deleteBtn);
        categoryList.appendChild(li);
    });
}

function loadUsers() {
    users = [{username: "user1", email: "user1@example.com"}, {username: "user2", email: "user2@example.com"}];
    displayUsers();
}

function displayUsers() {
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = `${user.username} - ${user.email}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.addEventListener('click', () => {
            users.splice(index, 1);
            displayUsers();
        });
        li.appendChild(deleteBtn);
        userList.appendChild(li);
    });
}

function loadPosts() {
    posts = [{title: "Post 1", content: "Conteudo 1"},{title:"Post 2", content: "Conteudo 2"}];
    displayPosts();
}

function loadCategories() {
    categories = ["Categoria 1", "Categoria 2"];
    displayCategories();
}