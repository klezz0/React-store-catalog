import { useState } from 'react';
import { Loader } from '../../loader/loader.tsx';

function NoPhotoPlaceholder() {
    return (
        <svg
            className="product-card__placeholder-icon"
            viewBox="0 0 120 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="35" y="2" width="72" height="55" rx="4"
                stroke="#A0A0A0" strokeWidth="2.5" fill="#E0E0E0"
                transform="rotate(8 71 29)"
            />
            <rect
                x="12" y="18" width="72" height="55" rx="4"
                stroke="#A0A0A0" strokeWidth="2.5" fill="white"
            />
            <path
                d="M12,65 L30,42 L42,52 L58,33 L84,65 Z"
                fill="#C8C8C8"
            />
            <path
                d="M12,65 L45,45 L60,55 L84,65 Z"
                fill="#D8D8D8"
            />
            <circle cx="68" cy="32" r="7" fill="#C8C8C8" />
        </svg>
    );
}

function ProductImage({ src, alt }: { src: string | null; alt: string }) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (!src || hasError) {
        return (
            <div className="product-card__placeholder">
                <NoPhotoPlaceholder />
                <span className="product-card__placeholder-text">Фото отсутствует</span>
            </div>
        );
    }

    return (
        <>
            {isLoading && (
                <div className="product-card__image-loader">
                    <Loader variant="inline" />
                </div>
            )}
            <img
                className="product-card__image"
                src={src}
                alt={alt}
                onLoad={() => setIsLoading(false)}
                onError={() => { setIsLoading(false); setHasError(true); }}
                style={isLoading ? { display: 'none' } : undefined}
            />
        </>
    );
}

export default ProductImage;
