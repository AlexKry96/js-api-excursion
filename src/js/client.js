import '../css/tailwind.css';
import './../css/client.css';
import 'whatwg-fetch';
import ExcursionsAPI from './ExcursionsAPI';


document.addEventListener('DOMContentLoaded', () => {
    renderExcursions();
    setupOrderForm();
});

/*Render wycieczek*/
async function renderExcursions() {
    const excursionsList = document.querySelector('.excursions');
    const prototype = document.querySelector('.excursions__item--prototype');

    if (!excursionsList || !prototype) {
        console.error('Brak listy wycieczek lub prototypu');
        return;
    }

    excursionsList.querySelectorAll('.excursions__item:not(.excursions__item--prototype)').forEach(el => el.remove());

    try {
        const excursions = await ExcursionsAPI.getExcursions();

        excursions.forEach(exc => {
            const item = prototype.cloneNode(true);
            item.classList.remove('excursions__item--prototype');

            const adultPrice = Number(exc.adultPrice) || 0;
            const childPrice = Number(exc.childPrice) || 0;

            const titleEl = item.querySelector('.excursions__title');
            const descEl = item.querySelector('.excursions__description');
            if (titleEl) titleEl.textContent = exc.title || 'Brak tytułu';
            if (descEl) descEl.textContent = exc.description || '';

            const labels = item.querySelectorAll('.excursions__field-name');
            if (labels && labels.length >= 2) {
                labels[0].childNodes[0].textContent = `Dorosły: ${adultPrice}PLN x `;
                labels[1].childNodes[0].textContent = `Dziecko: ${childPrice}PLN x `;
            }

            const form = item.querySelector('.excursions__form');
            const adultsInput = form.querySelector('input[name="adults"]');
            const childrenInput = form.querySelector('input[name="children"]');

            if (adultsInput) adultsInput.value = '';
            if (childrenInput) childrenInput.value = '';

            form.addEventListener('submit', e => {
                e.preventDefault();

                const adults = parseInt(adultsInput.value, 10) || 0;
                const children = parseInt(childrenInput.value, 10) || 0;

                if (adults < 0 || children < 0) {
                    alert('Liczba biletów nie może być ujemna.');
                    return;
                }
                if (adults === 0 && children === 0) {
                    alert('Wybierz przynajmniej 1 bilet.');
                    return;
                }

                addToCart({
                    id: exc.id,
                    title: exc.title,
                    adultPrice,
                    childPrice,
                    adults,
                    children,
                });

                form.reset();
            });

            excursionsList.appendChild(item);
        });
    } catch (err) {
        console.error('Błąd pobierania wycieczek:', err);
        const msg = document.createElement('p');
        msg.textContent = 'Nie udało się załadować wycieczek. Sprawdź połączenie z API.';
        msg.style.color = 'red';
        excursionsList.appendChild(msg);
    }
}

/*KOszyk */
const cart = [];

function addToCart(item) {
    const existing = cart.find(el => el.id === item.id);
    if (existing) {
        existing.adults += item.adults;
        existing.children += item.children;
    } else {
        cart.push(Object.assign({}, item));
    }
    renderCart();
}

function removeFromCart(id) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx !== -1) cart.splice(idx, 1);
    renderCart();
}

function clearCart() {
    cart.length = 0;
    renderCart();
}

function renderCart() {
    const summaryList = document.querySelector('.summary');
    const prototype = document.querySelector('.summary__item--prototype');
    const totalPriceElem = document.querySelector('.order__total-price-value');

    if (!summaryList || !prototype || !totalPriceElem) {
        console.warn('Nie znaleziono elementów podsumowania.');
        return;
    }

    summaryList.querySelectorAll('.summary__item:not(.summary__item--prototype)').forEach(el => el.remove());

    let total = 0;

    cart.forEach(item => {
        const li = prototype.cloneNode(true);
        li.classList.remove('summary__item--prototype');
        li.classList.add('summary__item--generated');

        const totalItem = item.adults * item.adultPrice + item.children * item.childPrice;
        total += totalItem;

        const nameEl = li.querySelector('.summary__name');
        const priceEl = li.querySelector('.summary__total-price');
        const pricesEl = li.querySelector('.summary__prices');
        if (nameEl) nameEl.textContent = item.title;
        if (priceEl) priceEl.textContent = `${totalItem} PLN`;
        if (pricesEl) pricesEl.textContent = `dorośli: ${item.adults} x ${item.adultPrice} PLN, dzieci: ${item.children} x ${item.childPrice} PLN`;

        const removeBtn = li.querySelector('.summary__btn-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', ev => {
                ev.preventDefault();
                removeFromCart(item.id);
            });
        }

        summaryList.appendChild(li);
    });

    totalPriceElem.textContent = `${total} PLN`;
}

/* Formularz zamówienia */
function setupOrderForm() {
    const form = document.querySelector('.panel__order');

    if (!form) {
        console.warn('Nie znaleziono formularza zamówienia (.panel__order).');
        return;
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Koszyk jest pusty.');
            return;
        }

        const name = (form.elements.name && form.elements.name.value || '').trim();
        const email = (form.elements.email && form.elements.email.value || '').trim();

        if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Podaj poprawne dane: imię i poprawny email.');
            return;
        }

        const totalNumber = cart.reduce((sum, i) => sum + i.adults * i.adultPrice + i.children * i.childPrice, 0);

        const order = {
            name,
            email,
            items: cart.map(i => ({
                id: i.id,
                title: i.title,
                adults: i.adults,
                children: i.children,
                adultPrice: i.adultPrice,
                childPrice: i.childPrice
            })),
            total: totalNumber,
            date: new Date().toISOString()
        };

        try {
            await ExcursionsAPI.addOrder(order);
            alert('Zamówienie wysłane pomyślnie!');
            clearCart();
            form.reset();
        } catch (err) {
            console.error('Błąd wysyłki zamówienia:', err);
            alert('Nie udało się wysłać zamówienia. Spróbuj ponownie później.');
        }
    });
}