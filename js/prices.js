// Список криптовалют, которые мы хотим отобразить (только 10)
const cryptocurrencies = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', icon: 'fab fa-bitcoin' },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', icon: 'fab fa-ethereum' },
    { id: 'binancecoin', symbol: 'bnb', name: 'Binance Coin', icon: 'fab fa-btc' },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', icon: 'fab fa-cc-visa' },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', icon: 'fab fa-dogecoin' },
    { id: 'tether', symbol: 'usdt', name: 'Tether', icon: 'fas fa-coins' },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', icon: 'fab fa-cc-ripple' },
    { id: 'solana', symbol: 'sol', name: 'Solana', icon: 'fas fa-sun' },
    { id: 'polkadot', symbol: 'dot', name: 'Polkadot', icon: 'fas fa-circle' },
    { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', icon: 'fab fa-ltc' },
];

// Функция для загрузки данных о ценах
async function loadPrices() {
    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptocurrencies.map(c => c.id).join(',')}&order=market_cap_desc&sparkline=false`;

    try {
        // Добавляем задержку в 1 секунду перед запросом
        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await fetch(apiUrl);
        const data = await response.json();
        displayPrices(data);
        console.log("data", data);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('cryptoTableBody').innerHTML = '<tr><td colspan="4">Не удалось загрузить данные. Пожалуйста обновите страницу.</td></tr>';
    }
}

// Функция для отображения данных в таблице
function displayPrices(data) {
    const tableBody = document.getElementById('cryptoTableBody');
    tableBody.innerHTML = ''; // Очищаем таблицу

    data.forEach((crypto, index) => {
        const row = document.createElement('tr');

        // Номер
        const numberCell = document.createElement('td');
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        // Название и иконка
        const nameCell = document.createElement('td');
        const cryptoInfo = cryptocurrencies.find(c => c.id === crypto.id);
        nameCell.innerHTML = `<i class="${cryptoInfo.icon}"></i> ${cryptoInfo.name} (${cryptoInfo.symbol.toUpperCase()})`;
        row.appendChild(nameCell);

        // Цена
        const priceCell = document.createElement('td');
        priceCell.textContent = `$${crypto.current_price.toLocaleString()}`;
        row.appendChild(priceCell);

        // Изменение за 24 часа
        const changeCell = document.createElement('td');
        const change = crypto.price_change_percentage_24h;
        changeCell.textContent = `${change.toFixed(2)}%`;
        changeCell.className = change >= 0 ? 'positive' : 'negative';
        row.appendChild(changeCell);

        tableBody.appendChild(row);
    });
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', loadPrices);