// API ключ от CryptoPanic (зарегистрируйтесь на https://cryptopanic.com/developers/api/)
const API_KEY = '0339ef3be09edd5536d8f46d84104224d1b01ea0'; // Замените на ваш ключ

// Функция для загрузки новостей
async function loadNews() {
    const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${API_KEY}&public=true`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayNews(data.results);
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        document.getElementById('newsContainer').innerHTML = '<p>Не удалось загрузить новости. Попробуйте позже.</p>';
    }
}

// Функция для отображения новостей
function displayNews(news) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = ''; // Очищаем контейнер

    news.forEach((item) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        const title = document.createElement('h3');
        title.textContent = item.title;
        newsItem.appendChild(title);

        const description = document.createElement('p');
        description.textContent = item.description || 'Нет описания';
        newsItem.appendChild(description);

        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = 'Читать далее';
        link.target = '_blank'; // Открывать в новой вкладке
        newsItem.appendChild(link);

        newsContainer.appendChild(newsItem);
    });
}

// Загружаем новости при загрузке страницы
document.addEventListener('DOMContentLoaded', loadNews);