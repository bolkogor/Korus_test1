function statement(invoice) { //Возможно полностью убрать plays, т.к. invoice.performance уже содержит type и name(playId)
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Счет для ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("ru-RU",
        {
            style: "currency", currency: "RUB",
            minimumFractionDigits: 2
        }).format;
    for (let perf of invoice.performance) {
        let thisAmount = 0;
        switch (perf.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                thisAmount += 300 * perf.audience;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                    // Дополнительный бонус за каждые 10 комедий
                    volumeCredits += Math.floor(perf.audience / 5); //Нужно ли переделать расчеты на 10 комедий?
                }
                break;
            default:
                throw new Error('неизвестный тип: ${play.type}');
        }
        // Добавление бонусов
        volumeCredits += Math.max(perf.audience - 30, 0);
        result += ` ${perf.playId}: ${format(thisAmount / 100)}`;
        result += ` ${perf.audience} мест\n`;
        totalAmount += thisAmount;
    }
    result += `Итого с вас ${format(totalAmount/100)}\n`;       //Деление на 100? неочевидно
    result += `Вы заработали ${volumeCredits} бонусов\n`;
    //Вывод счета
    return result;
}

// Проверка функции на имеющихся данных

const inv = {
    "customer": "MDT",
    "performance": [ {
        "playId": "Гамлет", "audience": 55,
        "type": "tragedy" },
        {
            "playId": "Ромео и Джульетта",
            "audience": 35,
            "type": "tragedy" },
        {
            "playId": "Отелло", "audience": 40, "type": "comedy"
        } ]
}

statement(inv)

//OUTPUT
// "Счет для MDT
// Гамлет: 650,00 ₽ 55 мест
// Ромео и Джульетта: 450,00 ₽ 35 мест
// Отелло: 620,00 ₽ 40 мест
// Итого с вас 1 720,00 ₽
// Вы заработали 48 бонусов
// "