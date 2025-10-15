console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Step 2 code 
// let navLinks = $$("nav a");
// let currentLink = navLinks.find((a) => a.host === location.host && a.pathname === location.pathname);
// currentLink?.classList.add('current');

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'cv/', title: 'CV' },
    { url: 'https://github.com/boson25', title: 'GitHub' }
];


const BASE_PATH = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? '/'  
    : '/portfolio/';  


let nav = document.createElement('nav');
document.body.prepend(nav);


for (let p of pages) {
    let url = p.url;
    let title = p.title;
    
    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    }
    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    
    if (a.host !== location.host) {
        a.target = "_blank";
    }
}  

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
    `
);

let select = document.querySelector('.color-scheme select');

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    select.value = colorScheme;
}

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    
    setColorScheme(event.target.value);
    
    localStorage.colorScheme = event.target.value;
});

if ('colorScheme' in localStorage) {
    setColorScheme(localStorage.colorScheme);
}

let form = document.querySelector('form');

form?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let data = new FormData(form);
    
    let url = form.action + '?';
    
    for (let [name, value] of data) {
        url += name + '=' + encodeURIComponent(value) + '&';
    }
    url = url.slice(0, -1);
    location.href = url;
});