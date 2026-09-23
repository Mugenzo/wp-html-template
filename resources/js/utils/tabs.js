const assortment_tab = document.querySelector(".pricing__tab");
const tab_item = assortment_tab?.querySelectorAll(".pricing__item");
const assortment_subtab = document.querySelectorAll(".pricing__subtab");

tab_item?.forEach(item => {
    item.addEventListener('click', () => {
        tab_item.forEach(item => {
            item.classList.remove("active");
        })

        item.classList.add("active");

        const k = item.dataset.id;
        let counter = 0;

        assortment_subtab.forEach(item => {
            if (k === counter) {
                item.classList.add("active");
                // swiper_container[counter].slideTo(0, false, false);
            } else {
                closeAccordionItems()
                item.classList.remove("active");
            }

            counter++;
        })
    });
})
document.querySelector('.pricing__item')?.click();

const accordionItems = document.querySelectorAll(".accordion-item");
function closeAccordionItems() {
    accordionItems?.forEach(item => {
        item.querySelector(".accordion-content").style.height = '0px';
        item.querySelector(".accordion-title").classList.remove('active');
    })
}