import { atom } from 'nanostores';

export const isMobileMenuOpen = atom(false);

export function toggleMobileMenu() {
    setMobileMenuOpen(!isMobileMenuOpen.get());
}

export function setMobileMenuOpen(isOpen) {
    isMobileMenuOpen.set(isOpen);
    hideOverflowContentWhenDisplayMobileMenu();
}

function hideOverflowContentWhenDisplayMobileMenu() {
    const root = document.documentElement;
    if(isMobileMenuOpen.get()){
        root.style.setProperty('--overflow-property', 'hidden');
    } else {
        root.style.setProperty('--overflow-property', 'revert');
    }
}