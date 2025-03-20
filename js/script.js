document.addEventListener("DOMContentLoaded", function () {
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

    // Подключаем обработчик для формы регистрации
    const form = document.querySelector(".form");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Остановить стандартную отправку формы
            registerUser();
        });
    }
});

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
        .catch((error) => console.error("Ошибка загрузки данных:", error));
}

// Функция регистрации
function registerUser() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Заполните все поля!");
        return;
    }

    // Имитация успешной регистрации (можно добавить отправку данных на сервер)
    alert("Вы успешно зарегистрированы!");

    // Перенаправление на страницу входа
    window.location.href = "home.html";
}
