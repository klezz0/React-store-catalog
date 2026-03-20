import { useState, useCallback } from 'react';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from './store/productSlice';
import type { Product } from './types/product';
import { Form } from './components/product/form/form.tsx';
import { List } from './components/product/list/list.tsx';
import { EmptyState } from './components/EmptyState/EmptyState';
import { Loader } from './components/loader/loader.tsx';
import './App.css';

export default function App() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: items = { products: [] }, isLoading, error, refetch } = useGetProductsQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const isMutating = isCreating || isUpdating || isDeleting;

  const handleSubmit = useCallback(
      async (formData: FormData) => {
        setSubmitError(null);
        try {
          if (editingProduct) {
            await updateProduct(formData).unwrap();
            setEditingProduct(null);
          } else {
            await createProduct(formData).unwrap();
          }
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Не удалось сохранить. Проверьте подключение к серверу.';
          setSubmitError(message);
          throw e;
        }
      },
      [editingProduct, updateProduct, createProduct]
  );

  const handleDelete = useCallback(
      async (id: number) => {
        if (editingProduct?.id === id) {
          setEditingProduct(null);
        }
        try {
          await deleteProduct(id).unwrap();
        } catch (e) {
          console.error('Ошибка при удалении:', e);
        }
      },
      [editingProduct, deleteProduct]
  );

  const handleEdit = useCallback((product: Product) => setEditingProduct(product), []);
  const handleCancelEdit = useCallback(() => setEditingProduct(null), []);

  return (
      <div className="app">
        <Form
            key={editingProduct?.id ?? 'new'}
            editingProduct={editingProduct}
            onSubmit={handleSubmit}
            onCancelEdit={handleCancelEdit}
            isLoading={isMutating}
            disabled={isMutating}
            submitError={submitError}
        />

        <main className="app__content" style={{ marginLeft: 480 }}>
          {isLoading && <Loader />}

          {error && (
              <div className="app__error">
                <p className="app__error-text">Произошла ошибка</p>
                <button className="app__error-retry" onClick={() => refetch()}>
                  Повторить
                </button>
              </div>
          )}

          {!isLoading && !error && items.products.length === 0 ? (
              <EmptyState />
          ) : (
              !error && (
                  <List
                      products={items.products}
                      editingProductId={editingProduct?.id ?? null}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                  />
              )
          )}
        </main>
      </div>
  );
}