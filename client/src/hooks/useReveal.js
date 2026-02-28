import { useEffect } from 'react';

export const useReveal = () => {
    useEffect(() => {
        const revealElements = document.querySelectorAll('.reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters the viewport
        });

        revealElements.forEach(el => observer.observe(el));

        return () => {
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, []);
};
