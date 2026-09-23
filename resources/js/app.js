import '../sass/style.scss'

const navbarAnchor = document.querySelectorAll('.navbar__nav a');
const burgerMenu = document.getElementById('burger-btn');
const menuContainer = document.getElementById('navbar__wrap');

navbarAnchor?.forEach(item => {
    item.addEventListener('click', function(){
        burgerMenu.classList.remove('active');
        menuContainer.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
})

burgerMenu?.addEventListener('click', function(_event){
    this.classList.toggle('active');
    menuContainer.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});
