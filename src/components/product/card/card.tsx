import type { Product } from '../../../types/product.ts';
import './card.css';
import ProductImage from "./image.tsx";

interface ProductCardProps {
    product: Product;
    isEditing: boolean;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

// форматируем цену с пробелами (6000 -> 6 000 ₽)
function formatPrice(price: string | number): string {
    const num = typeof price === 'number' ? price : Number(price);
    if (isNaN(num)) return String(price);
    return num.toLocaleString('ru-RU') + ' ₽';
}

// иконка редактирования
function EditIcon() {
    return (
        <svg
            className="product-card__action-icon"
            viewBox="0 0 18.5008 19.4058"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.7283 0.7975C17.2139 0.287227 16.5188 0.000629487 15.7942 0C15.1665 0.00204109 14.5583 0.218763 14.0708 0.614167L5.48167 7.59917L5.34417 7.73667C4.14703 8.92355 3.88146 10.7601 4.69333 12.2375C4.36025 12.1359 4.01482 12.0804 3.66667 12.0725C1.64162 12.0725 0 13.7141 0 15.7392V18.0308C0 18.7902 0.615608 19.4058 1.375 19.4058H3.66667C4.93956 19.3989 6.11775 18.7322 6.77924 17.6447C7.44073 16.5571 7.49086 15.2043 6.91167 14.0708C7.27803 14.1945 7.66166 14.2595 8.04833 14.2633C9.06359 14.2701 10.0386 13.8669 10.7525 13.145L10.8442 13.0442L17.875 4.455C18.7625 3.37564 18.6994 1.80234 17.7283 0.7975ZM3.70333 18.0308H1.41167V15.7392C1.41167 14.4735 2.43768 13.4475 3.70333 13.4475C4.96899 13.4475 5.995 14.4735 5.995 15.7392C5.995 17.0048 4.96899 18.0308 3.70333 18.0308ZM9.8175 12.1825L16.8483 3.58417C17.2793 3.04433 17.2359 2.26687 16.7474 1.77843C16.259 1.28998 15.4815 1.24653 14.9417 1.6775L6.3525 8.70833C5.39314 9.66517 5.39108 11.2186 6.34792 12.1779C7.30475 13.1373 8.85814 13.1393 9.8175 12.1825Z"
                fill="var(--fill-0, black)"
            />
            <path
                d="M10.1108 7.44333L7.36083 10.1933C7.09275 10.4617 7.09275 10.8966 7.36083 11.165C7.62925 11.4331 8.06408 11.4331 8.3325 11.165L11.0825 8.415C11.2664 8.24361 11.3421 7.98549 11.2799 7.7419C11.2177 7.49831 11.0275 7.30811 10.7839 7.2459C10.5403 7.18369 10.2822 7.2594 10.1108 7.44333Z"
                fill="var(--fill-0, black)"
            />
        </svg>
    );
}

// иконка удаления
function DeleteIcon() {
    return (
        <svg
            className="product-card__action-icon"
            viewBox="0 0 15.5833 19.25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.5 0H10.0833C13.1209 0 15.5833 2.46243 15.5833 5.5V13.75C15.5833 16.7876 13.1209 19.25 10.0833 19.25H5.5C2.46243 19.25 0 16.7876 0 13.75V5.5C0 2.46243 2.46243 0 5.5 0ZM10.0833 17.5633C12.1894 17.5633 13.8967 15.856 13.8967 13.75V5.5C13.8967 3.39395 12.1894 1.68667 10.0833 1.68667H5.5C3.39395 1.68667 1.68667 3.39395 1.68667 5.5V13.75C1.68667 15.856 3.39395 17.5633 5.5 17.5633H10.0833Z"
                fill="var(--fill-0, black)"
            />
            <path
                d="M10.6608 3.96C9.08722 5.00933 7.03694 5.00933 5.46333 3.96C5.2411 3.78885 4.94206 3.75568 4.68772 3.87396C4.43338 3.99225 4.26607 4.24231 4.25375 4.52253C4.24144 4.80276 4.38618 5.06653 4.62917 5.20667C5.64287 5.8876 6.83632 6.25138 8.0575 6.25167C9.26905 6.24432 10.4517 5.88092 11.4583 5.20667C11.7013 5.06653 11.8461 4.80276 11.8337 4.52253C11.8214 4.24231 11.6541 3.99225 11.3998 3.87396C11.1454 3.75568 10.8464 3.78885 10.6242 3.96H10.6608Z"
                fill="var(--fill-0, black)"
            />
        </svg>
    );
}

export function ProductCard({ product, isEditing, onEdit, onDelete }: ProductCardProps) {
    const imageUrl = product.image ? new URL(`images/${product.image}`, import.meta.env.VITE_API_URL).href : null;

    const cardClass = ['product-card', isEditing ? 'product-card--editing' : '']
        .filter(Boolean)
        .join(' ');

    // в режиме редактирования кнопка всегда подсвечена
    const editBtnClass = [
        'product-card__action-btn',
        isEditing ? 'product-card__action-btn--editing-active' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cardClass}>

            <div className="product-card__image-wrapper">
                <ProductImage src={imageUrl} alt={product.title} />
            </div>


            <div className="product-card__info">
                <h3 className="product-card__title">{product.title}</h3>
                <p className="product-card__description">
                    <span className="product-card__description-label">Описание: </span>
                    <span className="product-card__description-text">{product.description}</span>
                </p>
                <p className="product-card__price">{formatPrice(product.price)}</p>
            </div>


            <div className="product-card__actions">
                <button
                    className={editBtnClass}
                    type="button"
                    onClick={() => onEdit(product)}
                    title="Редактировать"
                >
                    <EditIcon />
                </button>
                <button
                    className="product-card__action-btn"
                    type="button"
                    onClick={() => onDelete(product.id)}
                    title="Удалить"
                >
                    <DeleteIcon />
                </button>
            </div>
        </div>
    );
}
