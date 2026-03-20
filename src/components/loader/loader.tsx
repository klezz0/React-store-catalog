import './loader.css';

interface LoaderProps {
    /** 'fullscreen' — overlay на весь экран, 'inline' — маленький спиннер (для кнопок, карточек) */
    variant?: 'fullscreen' | 'inline';
}

export function Loader({ variant = 'fullscreen' }: LoaderProps) {
    if (variant === 'inline') {
        return <span className="loader-inline"><span className="loader-inline__spinner" /></span>;
    }

    return (
        <div className="loader">
            <div className="loader__spinner" />
        </div>
    );
}
