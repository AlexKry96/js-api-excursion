import './../css/admin.css';
import ExcursionsAPI from './ExcursionsAPI';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM wczytany, uruchamiam admina');
    renderExcursions();
    setupAddForm();
});

async function renderExcursions() {
    const list = document.querySelector('.panel__excursions');
    const prototype = document.querySelector('.excursions__item--prototype');

    if (!list || !prototype) return console.error('Brak listy lub prototypu');

    list.querySelectorAll('.excursions__item:not(.excursions__item--prototype)').forEach(el => el.remove());

    try {
        const excursions = await ExcursionsAPI.getExcursions();

        excursions.forEach(exc => {
            const item = prototype.cloneNode(true);
            item.classList.remove('excursions__item--prototype');
            item.dataset.id = exc.id;

            const titleEl = item.querySelector('.excursions__title');
            const descEl = item.querySelector('.excursions__description');
            if (titleEl) titleEl.textContent = exc.title;
            if (descEl) descEl.textContent = exc.description;

            const fields = item.querySelectorAll('.excursions__field-name strong');
            if (fields.length >= 2) {
                fields[0].textContent = exc.adultPrice;
                fields[1].textContent = exc.childPrice;
            }

            const btnEdit = item.querySelector('.excursions__field-input--update');
            const btnRemove = item.querySelector('.excursions__field-input--remove');

            if (btnEdit) {
                btnEdit.type = 'button';
                btnEdit.addEventListener('click', () => {
                    fillEditForm(exc);
                });
            }

            if (btnRemove) {
                btnRemove.type = 'button';
                btnRemove.addEventListener('click', async () => {
                    if (confirm(`Usunąć wycieczkę "${exc.title}"?`)) {
                        try {
                            await ExcursionsAPI.deleteExcursion(exc.id);
                            renderExcursions();
                        } catch (err) {
                            console.error('Błąd usuwania wycieczki:', err);
                        }
                    }
                });
            }

            list.appendChild(item);
        });
    } catch (err) {
        console.error('Błąd pobierania wycieczek:', err);
    }
}

function setupAddForm() {
    const form = document.querySelector('.form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const title = form.elements.title?.value.trim();
        const description = form.elements.description?.value.trim();
        const adultPrice = parseFloat(form.elements.adultPrice?.value) || 0;
        const childPrice = parseFloat(form.elements.childPrice?.value) || 0;

        if (!title) return alert('Podaj nazwę wycieczki');
        if (adultPrice < 0 || childPrice < 0) return alert('Cena nie może być ujemna');

        const id = form.dataset.editId;

        const data = { title, description, adultPrice, childPrice };

        try {
            if (id) {
                await ExcursionsAPI.updateExcursion(id, data);
                delete form.dataset.editId;
            } else {
                await ExcursionsAPI.addExcursion(data);
            }

            form.reset();
            renderExcursions();
        } catch (err) {
            console.error('Błąd zapisu wycieczki:', err);
            alert('Nie udało się zapisać wycieczki');
        }
    });
}

function fillEditForm(exc) {
    const form = document.querySelector('.form');
    if (!form) return;

    form.dataset.editId = exc.id;
    form.elements.title.value = exc.title;
    form.elements.description.value = exc.description;
    form.elements.adultPrice.value = exc.adultPrice;
    form.elements.childPrice.value = exc.childPrice;
} 