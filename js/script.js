document.addEventListener('DOMContentLoaded', function() {
    let container = document.querySelector('.inner-container');
    let sections = document.querySelectorAll('.section');
    let scrollPosition = 0;
    let targetPosition = 0;
    let isAnimating = false;
    let sectionSize = window.innerHeight / 4;
    const touchpadScrollSpeed = 0.2; // 터치패드 스크롤 속도 조절

    function isMobileOrTablet() {
        return /Mobi|Android|Tablet|iPad/i.test(navigator.userAgent);
    }

    function setContainerSize() {
        sectionSize = isMobileOrTablet() ? window.innerHeight / 2 : window.innerWidth / 2;
        if (isMobileOrTablet()) {
            container.style.width = '100%';
            container.style.height = 'auto';
            container.style.overflowX = 'hidden';
            container.style.flexDirection = 'column';
        } else {
            container.style.width = 'auto';
            container.style.height = '100%';
            container.style.flexDirection = 'row';
        }
    }

    function animateScroll() {
        if (!isAnimating) return;
        scrollPosition += (targetPosition - scrollPosition) * 0.05;
        if (isMobileOrTablet()) {
            container.style.transform = `translateY(-${scrollPosition}px)`;
        } else {
            container.style.transform = `translateX(-${scrollPosition}px)`;
        }
        if (Math.abs(targetPosition - scrollPosition) < 1) {
            scrollPosition = targetPosition;
            isAnimating = false;
        } else {
            requestAnimationFrame(animateScroll);
        }
    }

    function handleScroll(deltaY) {
        if (isMobileOrTablet()) {
            targetPosition += deltaY > 0 ? sectionSize : -sectionSize;
            targetPosition = Math.max(0, Math.min(targetPosition, container.scrollHeight - window.innerHeight));
        } else {
            let previousTargetPosition = targetPosition;
            targetPosition += deltaY > 0 ? sectionSize : -sectionSize;

            // Check if scrolling back to intro section
            if (targetPosition < previousTargetPosition && targetPosition <= sectionSize) {
                targetPosition = 0;
            } else {
                if (targetPosition >= container.scrollWidth - window.innerWidth + sectionSize) {
                    targetPosition = 0;
                } else {
                    targetPosition = Math.max(0, Math.min(targetPosition, container.scrollWidth - window.innerWidth));
                }
            }
        }

        if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(animateScroll);
        }
    }

    window.addEventListener('wheel', (e) => {
        // 터치패드 스크롤 시 천천히 스크롤되도록 조정
        const delta = e.deltaMode === 0 ? e.deltaY * touchpadScrollSpeed : e.deltaY;
        handleScroll(delta);
    });

    window.addEventListener('keydown', (e) => {
        if (!isMobileOrTablet()) {
            if (e.key === 'ArrowRight') {
                targetPosition += sectionSize;
                if (targetPosition >= container.scrollWidth - window.innerWidth + sectionSize) {
                    targetPosition = 0;
                } else {
                    targetPosition = Math.max(0, Math.min(targetPosition, container.scrollWidth - window.innerWidth));
                }
            } else if (e.key === 'ArrowLeft') {
                targetPosition -= sectionSize;
                if (targetPosition < 0) {
                    targetPosition = 0;
                }
            }

            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(animateScroll);
            }
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });


    

    window.addEventListener('resize', () => {
        scrollPosition = 0;
        targetPosition = 0;
        container.style.transform = isMobileOrTablet() ? 'translateY(0)' : 'translateX(0)';
        setContainerSize();
    });

    window.addEventListener('load', () => {
        setContainerSize();
    });

    function addMenuClickEventListeners() {
        document.querySelectorAll('.manifesto-link').forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                let targetSectionId = item.getAttribute('href').substring(1);

                if (targetSectionId === 'intro') {
                    scrollToSection('intro');
                } else if (targetSectionId === 'about') {
                    scrollToSection('about');
                } else if (targetSectionId === 'publishing') {
                    scrollToSection('publishing');
                } else if (targetSectionId === 'design') {
                    scrollToSection('design');
                } else if (targetSectionId === 'mobileapp') {
                    scrollToSection('mobileapp');
                } else if (targetSectionId === 'projects2') {
                    scrollToSection('projects2');
                } else if (targetSectionId === 'skill') {
                    scrollToSection('skill');
                } else {
                    window.location.href = item.getAttribute('href');
                }
            });
        });
    }

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            window.scrollTo({ top: sectionTop, behavior: 'smooth' });
        }
    }

    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.trim();
            document.body.insertBefore(tempDiv.firstChild, document.body.firstChild);
            addMenuClickEventListeners();
        })
        .catch(error => console.error('Error loading header:', error));
});

function addMenuToggleEvent() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    menuToggle.addEventListener('click', function() {
        menu.classList.toggle('open');
    });

    // Close menu when a menu item is clicked
    menu.querySelectorAll('.menuitem').forEach(item => {
        item.addEventListener('click', function() {
            menu.classList.remove('open');
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.trim();
            document.body.insertBefore(tempDiv.firstChild, document.body.firstChild);
            addMenuToggleEvent(); // 메뉴 토글 이벤트 추가
            addMenuClickEventListeners(); // 메뉴 클릭 이벤트 추가
        })
        .catch(error => console.error('Error loading header:', error));
});
