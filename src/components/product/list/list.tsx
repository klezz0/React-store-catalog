import type { Product } from '../../../types/product.ts';
import { ProductCard } from '../card/card.tsx';
import './list.css';

interface ProductListProps {
    products: Product[];
    editingProductId: number | null;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

export function List({ products, editingProductId, onEdit, onDelete }: ProductListProps) {
    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isEditing={product.id === editingProductId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}