const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API интернет-магазина',
            version: '1.0.0',
            description: 'Полное CRUD API для управления товарами',
        },
        servers: [
            {
                url: `http://localhost:3000`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

let products = [
    { id: nanoid(6), name: 'Январь', category: 'Месяца', description: 'Неприятный, мерзлый(но у меня др)', price: 100, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2318035625/display_1500/stock-photo-frosty-snowy-trees-on-snowy-meadows-in-a-park-early-cold-morning-in-january-in-an-urban-area-2318035625.jpg'},
    { id: nanoid(6), name: 'Февраль', category: 'Месяца', description: 'Вроде конец зимы, а все равно неприятно', price: 150, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2722452063/display_1500/stock-photo-a-calendar-for-february-with-the-date-february-th-marked-with-a-red-heart-symbol-2722452063.jpg'},
    { id: nanoid(6), name: 'Март', category: 'Месяца', description: 'Небольшое тепло, оттепель, крутой', price: 300, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2564030329/display_1500/stock-photo--march-year-calendar-day-illustration-2564030329.jpg'},
    { id: nanoid(6), name: 'Апрель', category: 'Месяца', description: 'Тепло, сухо, приятно жить', price: 500, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2414809297/display_1500/stock-vector-hello-april-welcome-april-hello-spring-april-vector-illustration-2414809297.jpg'},
    { id: nanoid(6), name: 'Май', category: 'Месяца', description: 'Уже становится жарко, но пока терпимо', price: 600, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2607951387/display_1500/stock-photo-may-small-spiral-desktop-calendar-time-and-business-concept-2607951387.jpg'},
    { id: nanoid(6), name: 'Июнь', category: 'Месяца', description: 'Жарень почти в пике, фу', price: 500, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2583850537/display_1500/stock-photo-desk-calendar-for-june-calendar-for-planning-and-managing-every-day-2583850537.jpg'},
    { id: nanoid(6), name: 'Июль"', category: 'Месяца', description: 'ЖАРАААААА', price: 600, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2326005523/display_1500/stock-vector-hello-july-welcome-july-vector-illustrations-for-greetings-card-2326005523.jpg'},
    { id: nanoid(6), name: 'Август"', category: 'Месяца', description: 'Приятное тепло, дожди, но последний месяц лета', price: 700, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2152098053/display_1500/stock-photo-august-handwritten-on-the-soft-beach-sand-with-a-soft-lapping-wave-2152098053.jpg'},
    { id: nanoid(6), name: 'Сентябрь', category: 'Месяца', description: 'Начинается учеба, кринж', price: 450, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2613802633/display_1500/stock-photo-september-small-spiral-desktop-calendar-time-and-business-concept-2613802633.jpg'},
    { id: nanoid(6), name: 'Октябрь', category: 'Месяца', description: 'К учебе уже привыкаешь, и погодка норм', price: 420, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/708413443/display_1500/stock-vector-hello-october-card-708413443.jpg'},
    { id: nanoid(6), name: 'Ноябрь', category: 'Месяца', description: 'Погода уже хуже, но все равно приятная', price: 400, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/1943714341/display_1500/stock-photo-november-month-on-calendar-page-with-pencil-business-planning-appointment-meeting-concept-1943714341.jpg'},
    { id: nanoid(6), name: 'Декабрь', category: 'Месяца', description: 'Пока не холодно, новый год и вообще крутотень', price: 401, stock: 1, imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2593106497/display_1500/stock-photo-december-resolution-strategy-solution-goal-business-and-holidays-date-month-december-2593106497.jpg'}
];

function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: 'Товар не найден' });
        return null;
    }
    return product;
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

app.get('/api/products', (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */

app.get('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 */

app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock, imageUrl } = req.body;
    
    // Проверка обязательных полей
    if (!name || !category || !price) {
        return res.status(400).json({ error: 'Название, категория и цена обязательны' });
    }
    
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description?.trim() || '',
        price: Number(price),
        stock: Number(stock) || 0,
        imageUrl: imageUrl?.trim() || ''
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет существующий товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Товар не найден
 */

app.patch('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    
    const { name, category, description, price, stock, imageUrl } = req.body;
    
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (imageUrl !== undefined) product.imageUrl = imageUrl.trim();
    
    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
 */

app.delete('/api/products/:id', (req, res) => {
    const exists = products.some(p => p.id === req.params.id);
    if (!exists) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send(); // No content
});

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
    console.log(`📦 Товаров в базе: ${products.length}`);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID товара
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена товара
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *         imageUrl:
 *           type: string
 *           description: Ссылка на изображение
 *       example:
 *         id: "abc123"
 *         name: "Игровой ноутбук"
 *         category: "Ноутбуки"
 *         description: "Мощный ноутбук для игр"
 *         price: 75000
 *         stock: 5
 *         imageUrl: "https://example.com/image.jpg"
 */