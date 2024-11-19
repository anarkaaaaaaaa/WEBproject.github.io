// Ваш API ключ
const API_KEY = 'AIzaSyC7FzaCkwTtfqowkPDbAQUMXjHGnMbaDa8';
const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';

// Элементы DOM
const form = document.getElementById('book-search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('search-results');
const loader = document.createElement('div'); // Элемент для индикатора загрузки
loader.classList.add('loader');

// Обработка формы
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
        resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    // Отображение индикатора загрузки
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(loader);

    try {
        // Запрос к Google Books API
        const response = await fetch(`${API_URL}${query}&key=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data from the API');
        }

        const data = await response.json();
        // Отображение результатов
        displayResults(data.items || []);
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    } finally {
        loader.remove(); // Удаляем индикатор загрузки после выполнения запроса
    }
});

function displayResults(books) {
    resultsContainer.innerHTML = ''; // Очистка предыдущих результатов

    if (books.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    books.forEach((book) => {
        const { volumeInfo } = book;

        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        // Создание HTML содержимого книги
        bookCard.innerHTML = `
            <h3>${volumeInfo.title || 'No title available'}</h3>
            <p><strong>Author:</strong> ${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown'}</p>
            <p><strong>Description:</strong> ${truncateText(volumeInfo.description, 150)}</p>
            <img src="${volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${volumeInfo.title}">
        `;

        resultsContainer.appendChild(bookCard);
    });
}

// Вспомогательная функция для обрезки текста
function truncateText(text, maxLength) {
    if (!text) return 'No description available.';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

