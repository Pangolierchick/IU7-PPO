# Название проекта

Спальник & завтрак

# Краткое описание идеи проекта

Идея проекта заключается в предоставлении пользователям выкладывать предложения по аренде жилья. Установление связи между хозяином жилья и клиентом, желающим арендовать помещение.

# Краткое описание предметной области

Предметной областью является аренда жилья.

Гость (неавторизованный пользователь) сможет искать и просматривать объявления.

Авторизованный пользователь сможет как искать, смотреть объявления, арендовать жилье, выставление оценок, так и выкладывать собственные предложения/объявления.

Администратор может удалять объявления (если они нарушают правила площадки).

# Аналогичные решения

Сравним существующие решения по следующим критериям:

1. Возможность оплаты в Российской федерации.
2. Объявления представлены во всем мире.
3. Возможность выкладывать объявления обычным пользователям.
4. Ориентированность на частные объявления.

| Критерии | airbnb | avito | Островок | Booking |
|:--------:|:------:|:-----:|:--------:|:-------:|
|     1    |    -   |   +   |     +    |    -    |
|     2    |    +   |   -   |     -    |    +    |
|     3    |    +   |   +   |     -    |    -    |
|     4    |    +   |   +   |     -    |    -    |

# Краткое обоснование целесообразности и актуальности проекта

По данным Google trends за последний год Россияне стали чаще искать жилье за рубежом, а также в следствие блокировки SWIFT в РФ пропала возможность пользоваться многими зарубежными аналогами.

Учитывая выше сказанное, можно сделать вывод о том, что потребность в сервисе по аренде жилья сейчас как никогда высока.

# Use-case диаграмма
![Use-case диаграмма](/doc/img/use-case.png)
# ER-диаграмма сущностей
![ER-диаграмма](/doc/img/ER.png)
# Пользовательские сценарии
1. Пользователь арендует жилье.
    + Пользователь заходит на сайт и выбирает раздел "Бронирование жилья".
    + Он указывает даты планируемого отпуска, количество человек и желаемый регион или город пребывания.
    + Сайт выводит список доступных вариантов жилья, соответствующих запросу пользователя.
    + Пользователь просматривает фото и описание каждого варианта, выбирает наиболее подходящий и бронирует его.
2. Пользователь размещает объявление.
    + Пользователь заходит на сайт и выбирает раздел "Рамещение объявлений".
    + Он заполняет поля: название объявления, описание, цену, добавляет фотографии.
    + Сайт проверяет валидность объявления и выводит сообщение об успехе или неудаче.

# Формализация бизнес правил
![BPMN-диаграмма](/doc/img/bpmn.png)

# Описание типа приложения и выбранного технологического стека

Тип приложения WEB MPA.
## Технологический стек

1. Backend - typescript Node.js.x
2. Frontend - hmtl, css, js.
3. БД - PostgreSQL.

# Верхнеуровневое разбиение на компоненты

![Верхнеуровневые компоненты](/doc/img/components.svg)

# UML диаграмма

![Сущности доступа к данным](/doc/img/uml.png)

# Диаграмма сущностей базы данных

![Сущности базы данных](/doc/img/db_erd.png)
