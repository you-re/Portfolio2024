// Wait for the DOM to load before running JavaScript
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("modal-img");
    const captionText = document.getElementById("caption");
    const closeModal = document.querySelector(".close");

    let originalRect; // To store the original position of the image

    // Function to set modal image width based on container width
    function setModalImageWidth() {
        const containerWidth = document.querySelector('.container').offsetWidth;
        modalImg.style.width = `${containerWidth}px`;
    }

    // Add click event to each gallery image to open modal
    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "flex"; // Show modal
            modalImg.src = this.src; // Set image source
            captionText.innerHTML = this.alt; // Set caption text
            setModalImageWidth(); // Match modal image width with container
            
            // Store the original dimensions of the image
            originalRect = modalImg.getBoundingClientRect();

            // Add mouse movement effect to modal image
            modalImg.addEventListener('mousemove', parallaxEffect);
            modalImg.addEventListener('mouseleave', resetImagePosition);
        });
    });

    // Parallax effect function for modal image using mouse position
    function parallaxEffect(e) {
        const x = e.clientX - originalRect.left; // Mouse X within the original bounds of the modal image
        const y = e.clientY - originalRect.top;  // Mouse Y within the original bounds of the modal image

        // Scale factor for the image
        const scaleFactor = 2;

        // Calculate movement based on mouse position relative to the center
        const moveX = -((x / originalRect.width) - 0.5) * (originalRect.width * (scaleFactor - 1));
        const moveY = -((y / originalRect.height) - 0.5) * (originalRect.height * (scaleFactor - 1));

        // Apply translation to create parallax effect
        modalImg.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleFactor})`;
    }

    // Reset the image position when the mouse leaves the modal image
    function resetImagePosition() {
        modalImg.style.transform = 'translate(0, 0) scale(1)'; // Reset to initial position
    }

    // Close modal and remove parallax effect on modal close
    function closeModalAndReset() {
        modal.style.display = "none";
        resetImagePosition(); // Reset position
        modalImg.removeEventListener('mousemove', parallaxEffect); // Remove parallax listener
        modalImg.removeEventListener('mouseleave', resetImagePosition); // Remove reset listener
    }

    // Close modal when clicking the 'close' button
    closeModal.onclick = closeModalAndReset;

    // Close modal when clicking outside the image
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModalAndReset();
        }
    }

    // Update modal image width on window resize
    window.addEventListener('resize', setModalImageWidth);
});
