document.addEventListener("DOMContentLoaded", function () {
    // Загружаем данные о криптовалютах
    loadCryptoData();

    // Загружаем графики, если они есть на странице
    if (document.getElementById("btcChart")) {
        loadCryptoChart("bitcoin", "btcChart", "#f7931a"); // Bitcoin
    }
    if (document.getElementById("ethChart")) {
        loadCryptoChart("ethereum", "ethChart", "#627eea"); // Ethereum
    }
    if (document.getElementById("bnbChart")) {
        loadCryptoChart("binancecoin", "bnbChart", "#f3ba2f"); // Binance Coin
    }
    if (document.getElementById("adaChart")) {
        loadCryptoChart("cardano", "adaChart", "#0d1e30"); // Cardano
    }
    // Проверяем, авторизован ли пользователь (только на странице home.html)
    if (window.location.pathname.endsWith("home.html")) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            window.location.href = "index.html"; // Перенаправляем на страницу входа
        }
    }

    // Подключаем обработчики для форм
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            registerUser();
        });
    }

    // Обработчик для кнопки профиля
    const profileButton = document.getElementById("profileButton");
    if (profileButton) {
        profileButton.addEventListener("click", function () {
            // Проверяем, авторизован ли пользователь
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                window.location.href = "profile.html"; // Перенаправляем на страницу профиля
            } else {
                showToast("Сначала войдите в систему!");
                window.location.href = "index.html"; // Перенаправляем на страницу входа
            }
        });
    }

    // Загружаем данные профиля, если находимся на странице профиля
    if (window.location.pathname.endsWith("profile.html")) {
        loadProfile();
    }
});

// Функция для загрузки графиков
function loadCryptoChart(coinId, chartId, borderColor) {
    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`)
        .then((response) => response.json())
        .then((data) => {
            const ctx = document.getElementById(chartId).getContext("2d");
            const prices = data.prices.map((item) => item[1]);
            const dates = data.prices.map((item) => new Date(item[0]).toLocaleDateString());

            // Создаем график
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: `Цена ${coinId.toUpperCase()} (USD)`,
                            data: prices,
                            borderColor: borderColor,
                            borderWidth: 2,
                            fill: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            suggestedMin: Math.min(...prices) * 0.9, // Минимальная граница
                            suggestedMax: Math.max(...prices) * 1.1, // Максимальная граница
                            grid: {
                                color: "#4c566a", // Цвет сетки
                            },
                            ticks: {
                                color: "#d8dee9", // Цвет текста
                            },
                        },
                        x: {
                            grid: {
                                color: "#4c566a", // Цвет сетки
                            },
                            ticks: {
                                color: "#d8dee9", // Цвет текста
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: "#d8dee9", // Цвет текста легенды
                            },
                        },
                    },
                },
            });
        })
        .catch((error) => {
            console.error("Ошибка загрузки данных:", error);
            showToast("Не удалось загрузить данные о криптовалютах.");
        });
}

// Функция для проверки пароля
function validatePassword(password) {
    const minLength = 5;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (password.length < minLength) {
        return "Пароль должен содержать минимум 5 символов.";
    }
    if (!hasUpperCase) {
        return "Пароль должен содержать хотя бы одну заглавную букву.";
    }
    if (!hasNumber) {
        return "Пароль должен содержать хотя бы одну цифру.";
    }
    if (!hasSpecialChar) {
        return "Пароль должен содержать хотя бы один специальный символ (!@#$%^&*).";
    }
    return null; // Пароль валиден
}

// Функция для регистрации
function registerUser() {
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!username || !email || !password) {
        showToast("Заполните все поля!");
        return;
    }

    // Проверяем пароль
    const passwordError = validatePassword(password);
    if (passwordError) {
        showToast(passwordError);
        return;
    }

    // Проверяем, существует ли пользователь
    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (existingUser && existingUser.username === username) {
        showToast("Пользователь с таким логином уже существует!");
        return;
    }

    // Сохраняем пользователя в localStorage
    const user = { username, email, password };
    localStorage.setItem("user", JSON.stringify(user));
    showToast("Регистрация прошла успешно!");
    window.location.href = "home.html"; // Перенаправляем на страницу входа
}

// Функция для входа
function loginUser() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
        showToast("Заполните все поля!");
        return;
    }

    // Проверяем данные пользователя
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username === username && user.password === password) {
        showToast(`Добро пожаловать, ${username}!`);
        window.location.href = "home.html"; // Перенаправляем на главную страницу
    } else {
        showToast("Неверный логин или пароль!");
    }
}

// Функция для загрузки данных профиля
function loadProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const profileInfo = document.getElementById("profileInfo");

    if (user && profileInfo) {
        profileInfo.innerHTML = `
            <p><strong>Имя:</strong> ${user.username}</p>
            <p><strong>Почта:</strong> ${user.email}</p>
        `;
    } else {
        showToast("Пользователь не авторизован!");
        window.location.href = "index.html"; // Перенаправляем на страницу входа
    }
}

// Функция для выхода
function logout() {
    localStorage.removeItem("user");
    showToast("Вы успешно вышли из системы.");
    window.location.href = "index.html"; // Перенаправляем на страницу входа
}

// Функция для загрузки данных о криптовалютах
function loadCryptoData() {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,cardano";

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Обновляем карточки с данными
            updateCard("btcCard", data.find((coin) => coin.id === "bitcoin"));
            updateCard("ethCard", data.find((coin) => coin.id === "ethereum"));
            updateCard("bnbCard", data.find((coin) => coin.id === "binancecoin"));
            updateCard("adaCard", data.find((coin) => coin.id === "cardano"));
        })
        .catch((error) => {
            console.error("Ошибка загрузки данных:", error);
            showToast("Не удалось загрузить данные о криптовалютах.");
        });
}

// Функция для обновления карточки
function updateCard(cardId, coinData) {
    const card = document.getElementById(cardId);
    if (!card || !coinData) return;

    const priceElement = card.querySelector(".price");
    const changeElement = card.querySelector(".change");

    if (priceElement) {
        priceElement.textContent = `$${coinData.current_price.toFixed(2)}`;
    }

    if (changeElement) {
        const change = coinData.price_change_percentage_24h;
        changeElement.textContent = `${change.toFixed(2)}% за 24ч`;
        changeElement.classList.toggle("positive", change >= 0);
        changeElement.classList.toggle("negative", change < 0);
    }
}

// Функция для загрузки новостей (пример)
function loadNews() {
    const newsCard = document.getElementById("newsCard");
    if (!newsCard) return;

    const newsElement = newsCard.querySelector(".news");
    if (newsElement) {
        newsElement.textContent = "Криптовалютный рынок продолжает расти.";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    // Открытие модального окна для входа
    const showLoginForm = document.getElementById("showLoginForm");
    const loginModal = document.getElementById("loginModal");
    const closeButton = document.querySelector(".close-button");

    if (showLoginForm && loginModal) {
        showLoginForm.addEventListener("click", function (e) {
            e.preventDefault(); // Отменяем переход по ссылке
            loginModal.classList.add("show"); // Показываем модальное окно
        });
    }

    // Закрытие модального окна
    if (closeButton && loginModal) {
        closeButton.addEventListener("click", function () {
            loginModal.classList.remove("show"); // Скрываем модальное окно
        });
    }

    // Закрытие модального окна при клике вне его
    window.addEventListener("click", function (e) {
        if (e.target === loginModal) {
            loginModal.classList.remove("show");
        }
    });

    // Обработка входа
    const loginForm = document.querySelector("#loginModal .form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            loginUser();
        });
    }
});

// Функция для входа
function loginUser() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
        showToast("Заполните все поля!");
        return;
    }

    // Проверяем данные пользователя
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username === username && user.password === password) {
        showToast(`Добро пожаловать, ${username}!`);
        setTimeout(() => {
            window.location.href = "home.html"; // Перенаправляем на главную страницу
        }, 2000);
    } else {
        showToast("Неверный логин или пароль!");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    // Открытие модального окна для входа
    const showLoginForm = document.getElementById("showLoginForm");
    const loginModal = document.getElementById("loginModal");
    const closeButton = document.querySelector(".close-button");

    if (showLoginForm && loginModal) {
        showLoginForm.addEventListener("click", function (e) {
            e.preventDefault(); // Отменяем переход по ссылке
            loginModal.classList.add("show"); // Показываем модальное окно
        });
    }

    // Закрытие модального окна
    if (closeButton && loginModal) {
        closeButton.addEventListener("click", function () {
            loginModal.classList.remove("show"); // Скрываем модальное окно
        });
    }

    // Закрытие модального окна при клике вне его
    window.addEventListener("click", function (e) {
        if (e.target === loginModal) {
            loginModal.classList.remove("show");
        }
    });

    // Обработка регистрации
    const registerForm = document.querySelector("#registerForm .form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            registerUser();
        });
    }

    // Обработка входа
    const loginForm = document.querySelector("#loginModal .form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            loginUser();
        });
    }
});

// Функция для регистрации
function registerUser() {
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const errorElement = document.getElementById("registerError");

    // Очищаем предыдущие ошибки
    errorElement.textContent = "";

    if (!username || !email || !password) {
        errorElement.textContent = "Заполните все поля!";
        return;
    }

    // Проверка email
    if (!email.includes("@")) {
        errorElement.textContent = "Пожалуйста, введите корректный email.";
        return;
    }

    // Проверяем пароль
    const passwordError = validatePassword(password);
    if (passwordError) {
        errorElement.textContent = passwordError;
        return;
    }

    // Проверяем, существует ли пользователь
    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (existingUser && existingUser.username === username) {
        errorElement.textContent = "Пользователь с таким логином уже существует!";
        return;
    }

    // Сохраняем пользователя в localStorage
    const user = { username, email, password };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "home.html"; // Перенаправляем на главную страницу
}

// Функция для входа
function loginUser() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const errorElement = document.getElementById("loginError");

    // Очищаем предыдущие ошибки
    errorElement.textContent = "";

    if (!username || !password) {
        errorElement.textContent = "Заполните все поля!";
        return;
    }

    // Проверяем данные пользователя
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username === username && user.password === password) {
        window.location.href = "home.html"; // Перенаправляем на главную страницу
    } else {
        errorElement.textContent = "Неверный логин или пароль!";
    }
}

// Функция для проверки пароля
function validatePassword(password) {
    const minLength = 5;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (password.length < minLength) {
        return "Пароль должен содержать минимум 5 символов.";
    }
    if (!hasUpperCase) {
        return "Пароль должен содержать хотя бы одну заглавную букву.";
    }
    if (!hasNumber) {
        return "Пароль должен содержать хотя бы одну цифру.";
    }
    if (!hasSpecialChar) {
        return "Пароль должен содержать хотя бы один специальный символ (!@#$%^&*).";
    }
    return null; // Пароль валиден
}
