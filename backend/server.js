const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

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
    { id: nanoid(6), name: 'Январь', category: 'Месяца', description: 'Неприятный, мерзлый(но у меня др)', price: 100, stock: 1 },
    { id: nanoid(6), name: 'Февраль', category: 'Месяца', description: 'Вроде конец зимы, а все равно неприятно', price: 150, stock: 1 },
    { id: nanoid(6), name: 'Март', category: 'Месяца', description: 'Небольшое тепло, оттепель, крутой', price: 300, stock: 1 },
    { id: nanoid(6), name: 'Апрель', category: 'Месяца', description: 'Тепло, сухо, приятно жить', price: 500, stock: 1 },
    { id: nanoid(6), name: 'Май', category: 'Месяца', description: 'Уже становится жарко, но пока терпимо', price: 600, stock: 1 },
    { id: nanoid(6), name: 'Июнь', category: 'Месяца', description: 'Жарень почти в пике, фу', price: 500, stock: 1 },
    { id: nanoid(6), name: 'Июль"', category: 'Месяца', description: 'ЖАРАААААА', price: 600, stock: 1 },
    { id: nanoid(6), name: 'Август"', category: 'Месяца', description: 'Приятное тепло, дожди, но последний месяц лета', price: 700, stock: 1 },
    { id: nanoid(6), name: 'Сентябрь', category: 'Месяца', description: 'Начинается учеба, кринж', price: 450, stock: 1 },
    { id: nanoid(6), name: 'Октябрь', category: 'Месяца', description: 'К учебе уже привыкаешь, и погодка норм', price: 420, stock: 1 },
    { id: nanoid(6), name: 'Ноябрь', category: 'Месяца', description: 'Погода уже хуже, но все равно приятная', price: 400, stock: 1 },
    { id: nanoid(6), name: 'Декабрь', category: 'Месяца', description: 'Пока не холодно, новый год и вообще крутотень', price: 401, stock: 1 }
];

function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: 'Товар не найден' });
        return null;
    }
    return product;
}

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    res.json(product);
});

app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock } = req.body;
    
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
        stock: Number(stock) || 0
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    
    const { name, category, description, price, stock } = req.body;
    
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    
    res.json(product);
});

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