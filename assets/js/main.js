var typed = new Typed(".home__profession",{
    strings: ["Data Scientist", "Machine Learning Engineer"],
    startDelay:0.001,
    typeSpeed:100,
    backSpeed:50,
    // backDelay:1000,
    loop:true,
    showCursor: false,
    
});




// ---Show Menu---
//When Nav Toggle Button is clicked the Menu is displayed
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId), 
    nav = document.getElementById(navId);

    if(toggle && nav){
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show-menu');
        });
    }
}

showMenu('nav-toggle', 'nav-menu');


// ---Remove Menu Mobile---
//When a Menu Item is clicked the Menu then gets hidden
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}

navLink.forEach(i => i.addEventListener('click', linkAction));


// ---Scroll Section Active Link---
//As the WebPage is navigated the active section is higlighed in the Nav Menu too
const sections = document.querySelectorAll('section[id]'); 
for(sec of sections){
    console.log(sec);
}

function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id');

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
        }
        else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}

window.addEventListener('scroll', scrollActive);





// ---Show Scroll Top---
//A Scroll Top button appears at the bottom right when the WebPage is navigated
function scrollTop() {
    const scrollTop = document.getElementById('scroll-top');
    if(this.scrollY >= 560)
        scrollTop.classList.add('show-scroll');
    else
        scrollTop.classList.remove('show-scroll');
}

window.addEventListener('scroll', scrollTop);


// ---MixItUp Filter Portfolio---
//MixItUp JS is used for Portfolio Projects
var mixer = mixitup('.portfolio__container', {
    selectors: {
        target: '.portfolio__content'
    },
    animation: {
        duration: 400
    }
});


// ---Link Active Portfolio---
//The Portfolio Projects Nav Menu Item is highlighted according to the selection made by the user
const linkPortfolio = document.querySelectorAll('.portfolio__item');

function activePortfolio() {
    if(linkPortfolio){
        linkPortfolio.forEach(i => i.classList.remove('active-portfolio'));
        this.classList.add('active-portfolio');
        
        const element = document.querySelectorAll('.portfolio__content');
        element.forEach(i => i.classList.remove('non-rec-project'));
    }
}

linkPortfolio.forEach(i => i.addEventListener('click', activePortfolio));



// --- GSAP ---
//GSAP Animations is used to animate the Home Page on startup
gsap.from('.home__img', {opacity: 0, duration: 2, delay: .5, x: 60});
gsap.from('.home__data', {opacity: 0, duration: 2, delay: .8, y: 25});
gsap.from('.home__greeting, .home__name, .home__profession, .home__button', {opacity: 0, duration: 2, delay: 1, y: 25, ease:'expo.out', stagger: .2});

gsap.from('.nav__logo .nav__toggle', {opacity: 0, duration: 2, delay: 1.5, y: 25, ease:'expo.out', stagger: .2});
gsap.from('.nav__item', {opacity: 0, duration: 2, delay: 1.8, y: 25, ease:'expo.out', stagger: .2});
gsap.from('.home__social-icon', {opacity: 0, duration: 2, delay: 2.2, y: 25, ease:'expo.out', stagger: .2});