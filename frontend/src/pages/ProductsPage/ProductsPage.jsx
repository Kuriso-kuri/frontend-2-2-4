import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import './ProductsPage.scss';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Не удалось загрузить товары');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить товар?')) return;
        
        try {
            await api.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Не удалось удалить товар');
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="container">
                    <h1>🛍️ Интернет-магазин</h1>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    {loading ? (
                        <div className="loading">Загрузка...</div>
                    ) : (
                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <h3>{product.name}</h3>
                                    <p className="category">{product.category}</p>
                                    <p className="description">{product.description}</p>
                                    <p className="price">{product.price} ₽</p>
                                    <p className="stock">В наличии: {product.stock} шт.</p>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProductsPage;