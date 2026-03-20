import { Loader } from '../../loader/loader.tsx';
import './submit-button.css';

interface SubmitButtonProps {
    label: string;
    isLoading: boolean;
    isActive: boolean;
    onClick: () => void;
}

export function SubmitButton({ label, isLoading, isActive, onClick }: SubmitButtonProps) {
    const className = [
        'submit-button',
        isActive && !isLoading ? 'submit-button--active' : '',
        isLoading ? 'submit-button--loading' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={className} type="button" onClick={onClick} disabled={isLoading}>
            {isLoading ? <Loader variant="inline" /> : label}
        </button>
    );
}
