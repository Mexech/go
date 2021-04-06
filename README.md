# go

## Описание структуры репозитория
Фронтенд клиента реализован при помощи vuejs3, поэтому все используемые компоненты лежать в ./src/components. Сервер, написанный на NodeJS находится в ./server.js

### Описание взаимодействия с API
Прежде всего мы создаем собственный сервер на localhost:3000, чтобы не было неполадок с CORS. 
Сервер принимает 3 типа запроса GET. 
1.  **/leaderboard** по его вызову сервер делает запрос на  ресурс *https://www.gokgs.com/top100.jsp*, после чего отбирает из полученного ответа имена ТОП-100 игроков.  А также создается рабочая сессию с KGS API.
2. **/archive/:username** после данного запроса отправляется запрос на подключение к архивам выбранного игрока и для фронтенда выставляется первичная информация о играх.
3. **/moves/:username/:number** данный запрос получает информацию о последней или предпоследней игре и выставляет для отображения в фронтенде массив ходов в данной партии.

### Описание реализованного функционала
В данный момент реализован сам лидерборд, состоящий из строчек с именами игроков. По клику на каждую из строчек появляется выпадающее меню, в котором показываются две секции с последними двумя играми. В каждой из них небольшая информация о партии, кто и за какой цвет играл, кто выиграл и каким образом, а также справа-снизу секции находится дата проведения матча. По клику открывается модальное окно, в котором отображается сама доска. Снизу данной доски находятся две кнопки, левая уводит игру на шаг назад, а правая на шаг вперед. Каждый шаг вперед просчитывается согласно правилам игры, а каждый шаг назад убирает поставленный камень и возвращает забранные в прошлом ходу камни противника, если такие были.

### Описание стека технологий
1. Vuejs 3
2. Axios
3. Express
4. SCSS
5. NodeJS
6. JSDOM

### Видео работы проекта

https://photos.google.com/share/AF1QipMROuEcq0HSpjV0TD9GcGPlvqGPb1jE91PvnTXaso0QIKpdMLguJ5bxRpZpCu4BcQ/photo/AF1QipNlO1vsKoouqUk2xwr4zIstgnnre_BEEyxv_FEs?key=QzJBMW9qRDU3OTJUOUtsSHZ2N0NxMlBZeklocFhR