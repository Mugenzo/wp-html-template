const modal = document.querySelectorAll(".modal");
const modalClose = document.querySelectorAll(".modal-close");

const scrollbarWidth = window.innerWidth - document.body.offsetWidth

//modal vacancies order
const modalContacts = document.querySelector(".modal-contacts");
const modalContactsOpen = document.querySelectorAll(".modal-contacts-open");

modalContactsOpen.forEach(item => {
	item.addEventListener('click', (_e) => {
		modalContacts.classList.add('show')
		modalContacts.style.paddingRight = scrollbarWidth + 'px';
		document.body.classList.add('no-scroll')
		document.body.style.paddingRight = scrollbarWidth + 'px';
	})
})

//modal close button and background
modalClose.forEach(item => {
	item.addEventListener('click', () => {

		const modalClosest = item.closest('.modal');

		modalsCloseControl(modalClosest);
	})
})

modal.forEach(el => {
	el.addEventListener("click", (event) => {
		const isClickInside = el.querySelector(".modal-container").contains(event.target);

		if (!isClickInside) {
			modalsCloseControl(el);
		}
	});
})

function modalsCloseControl (modal) {
	modal.classList.remove('show')
	modal.style.paddingRight = '0px';

	const modalActiveCount = document.querySelectorAll('.modal.show').length;

	if (modalActiveCount === 0) {
		document.body.classList.remove('no-scroll')
		document.body.style.paddingRight = '0px';
	}
}