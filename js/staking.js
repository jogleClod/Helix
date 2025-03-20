// Пути к изображениям QR-кодов
const qrImages = {
    TRC20: 'assets/trc20.jpeg', // Путь к QR-коду для TRC20
    ERC20: 'assets/erc20.jpeg', // Путь к QR-коду для ERC20
};

// Адреса кошельков для TRC20 и ERC20
const walletAddresses = {
    TRC20: 'TDiWeynXhV7tUGuHzR2mG8oxhXAZWrYsgx', // Пример адреса TRC20
    ERC20: '0x57d537Dd7d32afeebFc9f1627A6f9494e3F651C6', // Пример адреса ERC20
};

// Функция для копирования текста в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('Адрес скопирован в буфер обмена!');
        })
        .catch((error) => {
            console.error('Ошибка при копировании:', error);
            alert('Не удалось скопировать адрес.');
        });
}

// Функция для показа модального окна с QR-кодом
function showQrDialog(network) {
    const qrDialog = document.getElementById('qrDialog');
    const qrDialogTitle = document.getElementById('qrDialogTitle');
    const walletAddress = document.getElementById('address');
    const qrCodeContainer = document.getElementById('qrCode');

    // Устанавливаем заголовок и адрес кошелька
    qrDialogTitle.textContent = `Оплата через ${network}`;
    walletAddress.textContent = walletAddresses[network];

    // Очищаем контейнер для QR-кода
    qrCodeContainer.innerHTML = '';

    // Создаем элемент изображения QR-кода
    const qrImage = document.createElement('img');
    qrImage.src = qrImages[network]; // Устанавливаем путь к изображению
    qrImage.alt = `QR-код для ${network}`;
    qrImage.style.width = '200px'; // Размер QR-кода
    qrImage.style.height = '200px';

    // Добавляем изображение в контейнер
    qrCodeContainer.appendChild(qrImage);

    // Добавляем обработчик для копирования адреса
    walletAddress.onclick = () => {
        copyToClipboard(walletAddresses[network]);
    };

    // Показываем модальное окно
    qrDialog.style.display = 'flex';
}

// Функция для закрытия модального окна с QR-кодом
function closeQrDialog() {
    const qrDialog = document.getElementById('qrDialog');
    qrDialog.style.display = 'none'; // Скрываем модальное окно
}

// Функция для открытия модального окна выбора сети
function openPaymentDialog() {
    const dialog = document.getElementById('paymentDialog');
    dialog.style.display = 'flex'; // Показываем модальное окно
}

// Функция для закрытия модального окна выбора сети
function closePaymentDialog() {
    const dialog = document.getElementById('paymentDialog');
    dialog.style.display = 'none'; // Скрываем модальное окно
}

// Функция для выбора сети и показа QR-кода
function selectPayment(network) {
    closePaymentDialog(); // Закрываем окно выбора сети
    showQrDialog(network); // Показываем окно с QR-кодом
}

// Назначаем обработчики событий после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    // Обработчик для кнопки "Добавить стейкинг"
    const addStakingButton = document.getElementById('addStakingButton');
    if (addStakingButton) {
        addStakingButton.addEventListener('click', openPaymentDialog);
    }

    // Обработчики для кнопок выбора сети
    const trc20Button = document.getElementById('trc20Button');
    const erc20Button = document.getElementById('erc20Button');
    if (trc20Button) {
        trc20Button.addEventListener('click', () => selectPayment('TRC20'));
    }
    if (erc20Button) {
        erc20Button.addEventListener('click', () => selectPayment('ERC20'));
    }

    // Обработчики для закрытия модальных окон
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closePaymentDialog();
            closeQrDialog();
        });
    });
});