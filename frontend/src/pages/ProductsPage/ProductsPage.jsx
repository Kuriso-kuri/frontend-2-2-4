import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import ProductModal from '../../components/ProductModal';
import './ProductsPage.scss';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Состояния для модального окна
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' или 'edit'
    const [editingProduct, setEditingProduct] = useState(null);

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

    const handleEdit = (product) => {
        setModalMode('edit');
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setModalMode('create');
        setEditingProduct(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmitModal = async (productData) => {
        try {
            if (modalMode === 'create') {
                const newProduct = await api.createProduct(productData);
                setProducts([...products, newProduct]);
            } else {
                const updatedProduct = await api.updateProduct(productData.id, productData);
                setProducts(products.map(p => 
                    p.id === productData.id ? updatedProduct : p
                ));
            }
            handleCloseModal();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Не удалось сохранить товар');
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <h1>Интернет-магазин</h1>
                        <button className="btn-create" onClick={handleCreate}>
                            Добавить товар
                        </button>
                    </div>
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
                                    {product.imageUrl && (
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.name}
                                            className="product-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <h3>{product.name}</h3>
                                    <p className="category">{product.category}</p>
                                    <p className="description">{product.description}</p>
                                    <p className="price">{product.price} ₽</p>
                                    <p className="stock">В наличии: {product.stock} шт.</p>
                                    
                                    <div className="card-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Редактировать
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <ProductModal
                open={modalOpen}
                mode={modalMode}
                initialProduct={editingProduct}
                onClose={handleCloseModal}
                onSubmit={handleSubmitModal}
            />
        </div>
    );
};

export default ProductsPage;