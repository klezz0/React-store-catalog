import { useState, useRef, useMemo } from 'react';
import type { Product } from '../../../types/product.ts';
import { SubmitButton } from './submit-button.tsx';
import './form.css';

interface ProductFormProps {
    editingProduct: Product | null;
    onSubmit: (formData: FormData) => Promise<void>;
    onCancelEdit: () => void;
    isLoading: boolean;
    disabled?: boolean;
    submitError: string | null;
}

interface FormErrors {
    title: string;
    price: string;
    description: string;
    image: string;
}

const EMPTY_ERRORS: FormErrors = { title: '', price: '', description: '', image: '' };

// иконка прикрепления файла для инпута фото
function AttachIcon() {
    return (
        <svg
            className="product-form__file-icon"
            viewBox="0 0 13.6646 15.5089"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.805 8.75583H4.97167C5.96994 8.73816 6.79461 9.53097 6.81625 10.5292V13.6958C6.81191 14.6953 6.00278 15.5044 5.00333 15.5088H1.83667C0.83843 15.522 0.0173503 14.7257 0 13.7275V10.5608C0 9.56396 0.808126 8.75583 1.805 8.75583ZM4.97167 14.3213C5.31707 14.3213 5.59708 14.0412 5.59708 13.6958V10.5292C5.5971 10.364 5.53095 10.2057 5.41343 10.0897C5.29591 9.97367 5.13681 9.90955 4.97167 9.91167H1.805C1.64123 9.91167 1.48417 9.97672 1.36836 10.0925C1.25256 10.2083 1.1875 10.3654 1.1875 10.5292V13.6958C1.18747 14.0382 1.46269 14.3169 1.805 14.3213H4.97167Z"
                fill="#888"
            />
            <path
                d="M3.99792 11.5346V11.0833C3.99792 10.7554 3.73209 10.4896 3.40417 10.4896C3.07625 10.4896 2.81042 10.7554 2.81042 11.0833V11.5346H2.36708C2.03916 11.5346 1.77333 11.8004 1.77333 12.1283C1.77333 12.4563 2.03916 12.7221 2.36708 12.7221H2.81833V13.1813C2.81833 13.5092 3.08416 13.775 3.41208 13.775C3.74 13.775 4.00583 13.5092 4.00583 13.1813V12.7221H4.465C4.79292 12.7221 5.05875 12.4563 5.05875 12.1283C5.05875 11.8004 4.79292 11.5346 4.465 11.5346H3.99792Z"
                fill="#888"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.94833 0.174167L13.49 5.71583C13.6078 5.83579 13.6708 5.99908 13.6642 6.16708V11.7088C13.6642 13.7856 11.9806 15.4692 9.90375 15.4692H7.63167C7.30375 15.4692 7.03792 15.2033 7.03792 14.8754C7.03792 14.5475 7.30375 14.2817 7.63167 14.2817H9.90375C11.3247 14.2817 12.4767 13.1297 12.4767 11.7088V6.76083H9.11208C7.90971 6.76083 6.935 5.78612 6.935 4.58375V1.21125H5.15375C3.73149 1.21561 2.58083 2.36981 2.58083 3.79208V7.75042C2.58083 8.07834 2.315 8.34417 1.98708 8.34417C1.65916 8.34417 1.39333 8.07834 1.39333 7.75042V3.79208C1.38489 2.78928 1.77734 1.82465 2.48347 1.11257C3.18961 0.400494 4.15091 -3.55559e-05 5.15375 2.36739e-09H7.52875C7.68617 0.000138585 7.83709 0.0627851 7.94833 0.174167ZM8.1225 2.02667V4.58375C8.12685 5.12719 8.56863 5.56543 9.11208 5.56542H11.6612L8.1225 2.02667Z"
                fill="#888"
            />
        </svg>
    );
}

export function Form({ editingProduct, onSubmit, onCancelEdit, isLoading, disabled = false, submitError }: ProductFormProps) {
    // начальные значения берутся из editingProduct (если есть)
    // при смене editingProduct компонент пересоздаётся через key в App.tsx
    const [title, setTitle] = useState(editingProduct?.title ?? '');
    const [price, setPrice] = useState(editingProduct ? String(editingProduct.price) : '');
    const [description, setDescription] = useState(editingProduct?.description ?? '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageName, setImageName] = useState(editingProduct?.image ? 'Изменить фотографию' : '');
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditing = editingProduct !== null;

    // ошибки как derived state — пересчитываются при каждом изменении полей
    const errors = useMemo((): FormErrors => {
        if (!submitted) return EMPTY_ERRORS;

        const newErrors: FormErrors = { ...EMPTY_ERRORS };

        if (!title.trim()) {
            newErrors.title = 'Обязательное поле для заполнения';
        }
        if (!price.trim()) {
            newErrors.price = 'Обязательное поле для заполнения';
        } else if (isNaN(Number(price)) || Number(price) <= 0) {
            newErrors.price = 'Введите положительное число';
        }
        if (!description.trim()) {
            newErrors.description = 'Обязательное поле для заполнения';
        }
        if (!isEditing && !imageFile) {
            newErrors.image = 'Обязательное поле для заполнения';
        }

        return newErrors;
    }, [submitted, title, price, description, imageFile, isEditing]);

    function resetForm() {
        setTitle('');
        setPrice('');
        setDescription('');
        setImageFile(null);
        setImageName('');
        setSubmitted(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    async function handleSubmit() {
        if (disabled) return;

        setSubmitted(true);

        // проверяем валидацию напрямую (errors пересчитается на следующем рендере)
        const hasTitle = title.trim() !== '';
        const hasPrice = price.trim() !== '' && !isNaN(Number(price)) && Number(price) > 0;
        const hasDescription = description.trim() !== '';
        const hasImage = isEditing || imageFile !== null;

        if (!hasTitle || !hasPrice || !hasDescription || !hasImage) return;

        const formData = new FormData();
        if (isEditing && editingProduct) {
            formData.append('id', String(editingProduct.id));
        }
        formData.append('title', title.trim());
        formData.append('price', price.trim());
        formData.append('description', description.trim());
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await onSubmit(formData);
            resetForm();
        } catch {
            // ошибка отображается через submitError проп
        }
    }

    function handleCancel() {
        resetForm();
        onCancelEdit();
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
        setImageName(file ? file.name : '');
    }

    // кнопка активна только когда хоть что-то заполнено
    const isFormFilled =
        title.trim() !== '' || price.trim() !== '' || description.trim() !== '' || imageFile !== null;

    return (
        <aside className="product-form">
            <h2 className="product-form__title">
                {isEditing ? 'Редактирование товара' : 'Добавление товара'}
            </h2>
            <p className="product-form__subtitle">Заполните все обязательные поля с *</p>

            {/* Название */}
            <div className="product-form__field">
                <span className={`product-form__label${title ? ' product-form__label--visible' : ''}`}>
                    Название*
                </span>
                <input
                    className={`product-form__input${submitted && errors.title ? ' product-form__input--error' : ''}`}
                    type="text"
                    placeholder="Название*"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <span className="product-form__error">
                    {submitted && errors.title ? errors.title : ''}
                </span>
            </div>

            {/* Цена */}
            <div className="product-form__field">
                <span className={`product-form__label${price ? ' product-form__label--visible' : ''}`}>
                    Цена*
                </span>
                <input
                    className={`product-form__input${submitted && errors.price ? ' product-form__input--error' : ''}`}
                    type="text"
                    placeholder="Цена*"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <span className="product-form__error">
                    {submitted && errors.price ? errors.price : ''}
                </span>
            </div>

            {/* Фото */}
            <div className="product-form__field">
                <span className={`product-form__label${imageName ? ' product-form__label--visible' : ''}`}>
                    Фото
                </span>
                <div className="product-form__file-wrapper">
                    <input
                        ref={fileInputRef}
                        className="product-form__file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="product-image"
                    />
                    <label
                        htmlFor="product-image"
                        className={`product-form__file-label${!imageName ? ' product-form__file-label--empty' : ''}`}
                    >
                        <span>{imageName || 'Фото'}</span>
                        <AttachIcon />
                    </label>
                </div>
                <span className="product-form__error">
                    {submitted && errors.image ? errors.image : ''}
                </span>
            </div>

            {/* Описание */}
            <div className="product-form__field">
                <span
                    className={`product-form__label${description ? ' product-form__label--visible' : ''}`}
                >
                    Описание товара
                </span>
                <textarea
                    className={`product-form__textarea${submitted && errors.description ? ' product-form__textarea--error' : ''}`}
                    placeholder="Описание товара"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <span className="product-form__error">
                    {submitted && errors.description ? errors.description : ''}
                </span>
            </div>

            {/* Сообщение об ошибке при отправке */}
            {submitError && (
                <p className="product-form__submit-error">{submitError}</p>
            )}

            {/* Кнопка отправки */}
            <SubmitButton
                label={isEditing ? 'Редактировать товар' : 'Добавить товар'}
                isLoading={isLoading}
                isActive={isFormFilled && !disabled}
                onClick={handleSubmit}
            />

            {/* Кнопка отмены (только в режиме редактирования) */}
            {isEditing && (
                <button
                    className="product-form__button product-form__button--cancel"
                    type="button"
                    onClick={handleCancel}
                >
                    Отменить редактирование
                </button>
            )}
        </aside>
    );
}
