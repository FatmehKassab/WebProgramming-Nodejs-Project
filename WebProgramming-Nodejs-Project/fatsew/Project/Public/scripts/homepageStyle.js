const welcomeHeader = document.getElementById("welcome-header");

        const welcomeText = {
            header: "Welcome",
        };

        function typeText(element, text) {
            let index = 0;
            const intervalId = setInterval(() => {
                element.textContent = text.slice(0, index);
                index++;

                if (index > text.length) {
                    clearInterval(intervalId);
                }
            }, 100); // Adjust the interval duration (milliseconds) for the typing speed
        }

        // Start the typing animation for the header
        typeText(welcomeHeader, welcomeText.header);

        
        function applySlideAnimation() {
            const welcomeParagraph = document.getElementById("welcome-paragraph");

            // Set a timeout to delay the animation onload
            setTimeout(() => {
                welcomeParagraph.style.opacity = "1";
                welcomeParagraph.style.transform = "translateY(0)";
            }, 500); // Adjust the delay as needed
        }

        // Call the function when the window is loaded
        window.onload = applySlideAnimation;

        document.addEventListener("DOMContentLoaded", function () {
            var navbar = document.querySelector('.navbar');
        
            window.addEventListener('scroll', function () {
                if (window.scrollY > 0) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
            });
        });

        

        window.addEventListener('load', function () {
            var img = document.getElementById('right-con-img');
            img.onload = function () {
                img.classList.add('pixelate');
            };
        });
        