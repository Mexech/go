# go

### [Видео работы клиента](https://photos.google.com/share/AF1QipMROuEcq0HSpjV0TD9GcGPlvqGPb1jE91PvnTXaso0QIKpdMLguJ5bxRpZpCu4BcQ/photo/AF1QipNlO1vsKoouqUk2xwr4zIstgnnre_BEEyxv_FEs?key=QzJBMW9qRDU3OTJUOUtsSHZ2N0NxMlBZeklocFhR "Видео работы клиента")

### Описание структуры репозитория
Фронтенд клиента реализован при помощи vuejs3, поэтому все используемые компоненты лежат в ./src/components. Сервер, написанный на NodeJS находится в ./server/server.js

### Описание взаимодействия с API
Прежде всего мы создаем собственный сервер на localhost:3000, чтобы не было неполадок с CORS. 
Сервер принимает 3 типа запроса GET. 
1.  **/leaderboard** по его вызову сервер делает запрос на ресурс *https://www.gokgs.com/top100.jsp*, после чего отбирает из полученного ответа имена ТОП-100 игроков, а потом выставляет их, как массив для отображения в фронтенде. После этого создается рабочая сессия с KGS API.
2. **/archive/:username** здесь отправляется запрос на подключение к архивам выбранного игрока и из полученного ответа для фронтенда выставляется первичная информация о играх.
3. **/moves/:username/:number** данный запрос получает информацию о последней или предпоследней игре и выставляет для отображения в фронтенде массив ходов данной партии.

### Описание реализованного функционала
В данный момент реализован сам лидерборд, состоящий из строчек с именами игроков. По клику на любую из строчек появляется выпадающее меню, в котором показываются две секции с последними двумя играми. В каждой из них находится немного информации о партии, кто и за какой цвет играл, кто выиграл и каким образом, а также справа-снизу секции находится дата проведения матча. По клику на секцию открывается модальное окно, в котором отображается сама доска. Снизу данной доски находятся две кнопки: левая уводит игру на шаг назад, а правая на шаг вперед. Каждый шаг вперед просчитывается согласно правилам игры, а каждый шаг назад убирает поставленный камень и возвращает забранные в прошлом ходу камни противника, если такие были.

### Описание стека технологий
1. Vuejs 3
2. Axios
3. Express
4. SCSS
5. NodeJS
6. JSDOM

### Над проектом работали
- Попов Максим
- Артём Степанов
- Никита Смирнов
- Даниил Шпагин
- Владислав Черняков