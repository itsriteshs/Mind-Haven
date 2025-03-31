document.addEventListener('DOMContentLoaded', () => {
    const eyesWrapper = document.getElementById('eyesWrapper');
    const pupils = document.querySelectorAll('.pupil');
    const eyeOvals = document.querySelectorAll('.eye-oval');
    const appIcons = document.querySelectorAll('.app-icon');
    const phaseMoonElement = document.querySelector('.phase-moon');
    const moonBlockerRect = document.getElementById('moonBlocker');

    const pupilTransforms = new Map();
    pupils.forEach(p => pupilTransforms.set(p, { x: 0, y: 0 }));

    function movePupil(eyeOval, pupil, event) {
        if (!pupil || !eyeOval) return;

        const eyeRect = eyeOval.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const deltaX = mouseX - eyeCenterX;
        const deltaY = mouseY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);

        const maxDistanceX = eyeRect.width / 3.5;
        const maxDistanceY = eyeRect.height / 3.5;

        let moveX = Math.cos(angle) * maxDistanceX;
        let moveY = Math.sin(angle) * maxDistanceY;

        const distanceToMouse = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxHypot = Math.sqrt(maxDistanceX * maxDistanceX + maxDistanceY * maxDistanceY);

        if (distanceToMouse <= maxHypot) {
            const scaleFactor = distanceToMouse / maxHypot;
            moveX = deltaX * scaleFactor * 0.8;
            moveY = deltaY * scaleFactor * 0.8;
        }

        pupilTransforms.set(pupil, { x: moveX, y: moveY });
        applyCombinedTransform(pupil);
    }

    function applyCombinedTransform(pupil) {
        const translation = pupilTransforms.get(pupil);
        const scale = pupil.classList.contains('dilate') ? 1.3 : 1;
        pupil.style.transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`;
    }

    window.addEventListener('mousemove', (event) => {
        eyeOvals.forEach((oval, index) => {
            if (pupils[index]) {
                movePupil(oval, pupils[index], event);
            }
        });
    });

    function randomBlink() {
        if (!eyeOvals.length) return;

        eyeOvals.forEach(eyeOval => {
            eyeOval.classList.add('blink');
            setTimeout(() => {
                eyeOval.classList.remove('blink');
            }, 250);
        });
    }

    function scheduleRandomBlink() {
        const randomInterval = Math.random() * 5000 + 3000;
        setTimeout(() => {
            if (eyesWrapper && eyesWrapper.getBoundingClientRect().top < window.innerHeight * 1.1) {
                randomBlink();
            }
            scheduleRandomBlink();
        }, randomInterval);
    }

    if (eyesWrapper) {
        scheduleRandomBlink();
    }

    appIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            pupils.forEach(pupil => {
                pupil.classList.add('dilate');
                applyCombinedTransform(pupil);
            });
        });

        icon.addEventListener('mouseleave', () => {
            pupils.forEach(pupil => {
                pupil.classList.remove('dilate');
                applyCombinedTransform(pupil);
            });
        });
    });

    if (phaseMoonElement && moonBlockerRect) {
        let currentPhase = 0;
        const totalPhases = 8;
        const moonDiameter = 30;
        const moonRadius = moonDiameter / 2;

        phaseMoonElement.addEventListener('animationiteration', () => {
            currentPhase = (currentPhase + 1) % totalPhases;

            let blockerX = 0;
            let blockerWidth = 0;

            if (currentPhase === 0) {
                blockerX = -moonRadius;
                blockerWidth = 0;
            } else if (currentPhase < totalPhases / 2) {
                blockerWidth = (currentPhase / (totalPhases / 2)) * moonDiameter;
                blockerX = moonDiameter - blockerWidth;
            } else if (currentPhase === totalPhases / 2) {
                blockerX = -moonRadius;
                blockerWidth = moonDiameter;
            } else {
                blockerWidth = ((totalPhases - currentPhase) / (totalPhases / 2)) * moonDiameter;
                blockerX = -moonRadius;
            }

            moonBlockerRect.setAttribute('x', blockerX - moonRadius);
            moonBlockerRect.setAttribute('width', blockerWidth);
        });
    }
});
