// components/ui/drag-enhancer.tsx
'use client';

import { useEffect, useRef } from 'react';

export function DragEnhancer() {
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);
    const dragThreshold = useRef(5); // Small threshold to differentiate clicks from drags
    const moveDistance = useRef(0);
    const activeIndex = useRef(0);

    useEffect(() => {
        const container = document.getElementById('carousel-container');
        if (!container) return;

        const itemCount = parseInt(container.getAttribute('data-items-count') || '0', 10);

        // Initial position (if we're using the infinite loop approach)
        setTimeout(() => {
            if (container) {
                container.scrollLeft = container.clientWidth;
                activeIndex.current = 0;
            }
        }, 0);

        const handleScroll = () => {
            if (!container) return;

            // Calculate which slide is in view
            const slideWidth = container.clientWidth;
            const scrollPosition = container.scrollLeft;
            const currentIndex = Math.round(scrollPosition / slideWidth);

            // Handle infinite loop
            if (currentIndex === 0) {
                // If at clone of last slide, jump to the real last slide
                setTimeout(() => {
                    container.scrollTo({
                        left: slideWidth * itemCount,
                        behavior: 'auto'
                    });
                }, 200);
                activeIndex.current = itemCount - 1;
            } else if (currentIndex === itemCount + 1) {
                // If at clone of first slide, jump to the real first slide
                setTimeout(() => {
                    container.scrollTo({
                        left: slideWidth,
                        behavior: 'auto'
                    });
                }, 200);
                activeIndex.current = 0;
            } else {
                activeIndex.current = currentIndex - 1;
            }

            // Update indicators
            updateIndicators();
        };

        const updateIndicators = () => {
            const indicators = document.querySelectorAll('.bottom-0.left-1\\/2 div[aria-label^="Slide"]');
            indicators.forEach((dot, i) => {
                if (i === activeIndex.current) {
                    dot.classList.add("bg-primary");
                    dot.classList.remove("bg-primary/40");
                } else {
                    dot.classList.remove("bg-primary");
                    dot.classList.add("bg-primary/40");
                }
            });
        };

        // Mouse Events
        const handleMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            startX.current = e.pageX;
            startScrollLeft.current = container.scrollLeft;
            moveDistance.current = 0;
            container.style.cursor = 'grabbing';
            container.style.userSelect = 'none';
            e.preventDefault(); // Important to prevent default behaviors
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;

            const x = e.pageX;
            const dx = x - startX.current;
            moveDistance.current = Math.abs(dx);

            // Apply scroll if we've moved past the threshold
            if (moveDistance.current > dragThreshold.current) {
                container.scrollLeft = startScrollLeft.current - dx;
            }

            e.preventDefault(); // Prevent text selection and other default behaviors
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (isDragging.current) {
                // Only prevent default if we've actually been dragging
                if (moveDistance.current > dragThreshold.current) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }

            isDragging.current = false;
            container.style.cursor = 'grab';
            container.style.userSelect = '';
        };

        // Touch Events
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                isDragging.current = true;
                startX.current = e.touches[0].pageX;
                startScrollLeft.current = container.scrollLeft;
                moveDistance.current = 0;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging.current || e.touches.length !== 1) return;

            const x = e.touches[0].pageX;
            const dx = x - startX.current;
            moveDistance.current = Math.abs(dx);

            if (moveDistance.current > dragThreshold.current) {
                container.scrollLeft = startScrollLeft.current - dx;
                e.preventDefault(); // Prevent page scrolling when dragging carousel
            }
        };

        const handleTouchEnd = () => {
            isDragging.current = false;
        };

        // Add event listeners
        container.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        container.addEventListener('scroll', handleScroll);

        // Set initial style
        container.style.cursor = 'grab';

        // Cleanup event listeners on unmount
        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return null;
}