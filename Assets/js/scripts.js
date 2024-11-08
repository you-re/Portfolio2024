// Wait for the DOM to load before running JavaScript
document.addEventListener("DOMContentLoaded", function() {
    const imgModal = document.getElementById("imgModal");
    const vidModal = document.getElementById("vidModal");
    const modalImg = document.getElementById("modal-img");
    const modalVid = document.getElementById("modal-vid");
    const captionImg = document.getElementById("captionImg");
    const captionVid = document.getElementById("captionVid");
    const closeModal = document.querySelector(".close");

    let originalRect; // To store the original position of the image

    // Function to set modal image width based on container width
    function setModalWidth() {
        const containerWidth = document.querySelector('.container').offsetWidth;
        modalImg.style.width = `${containerWidth}px`;
        modalVid.style.width = `${containerWidth}px`;
    }

    // Add click event to each gallery image to open modal
    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', function() {
            imgModal.style.display = "flex"; // Show modal
            modalImg.src = this.src; // Set image source
            captionImg.innerHTML = this.alt; // Set caption text

            const itemType = this.tagName.toLowerCase(); // Check if it's an image or video

            setModalWidth(itemType); // Match modal image width with container
            
            // Store the original dimensions of the image
            originalRect = modalImg.getBoundingClientRect();

            modalImg.addEventListener('mousemove', parallaxEffect);
            modalImg.addEventListener('mouseleave', resetImagePosition);
        });
    });

    // Add click event to each gallery image to open modal
    document.querySelectorAll('.gallery-vid').forEach(vid => {
        vid.addEventListener('click', function() {
            vidModal.style.display = "flex"; // Show modal
            modalVid.src = this.src; // Set image source
            captionVid.innerHTML = this.title; // Set caption text
            
            const itemType = this.tagName.toLowerCase(); // Check if it's an image or video

            setModalWidth(itemType); // Match modal image width with container
            
            // Store the original dimensions of the image
            originalRect = modalVid.getBoundingClientRect();
            
            // Add mouse movement effect to modal image
            modalVid.addEventListener('mousemove', parallaxEffect);
            modalVid.addEventListener('mouseleave', resetImagePosition);
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
        // Apply translation to create parallax effect
        modalVid.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleFactor})`;
    }

    // Reset the image position when the mouse leaves the modal image
    function resetImagePosition() {
        modalImg.style.transform = 'translate(0, 0) scale(1)'; // Reset to initial position
        modalVid.style.transform = 'translate(0, 0) scale(1)'; // Reset to initial position
    }

    // Close modal and remove parallax effect on modal close
    function closeModalAndReset() {
        imgModal.style.display = "none";
        vidModal.style.display = "none";
        resetImagePosition(); // Reset position
        modalImg.removeEventListener('mousemove', parallaxEffect); // Remove parallax listener
        modalImg.removeEventListener('mouseleave', resetImagePosition); // Remove reset listener
        modalVid.removeEventListener('mousemove', parallaxEffect); // Remove parallax listener
        modalVid.removeEventListener('mouseleave', resetImagePosition); // Remove reset listener
    }

    // Close modal when clicking the 'close' button
    closeModal.onclick = closeModalAndReset;

    // Close modal when clicking outside the image
    imgModal.onclick = function(event) {
        if (event.target === imgModal) {
            closeModalAndReset();
        }
    }

    // Close modal when clicking outside the image
    vidModal.onclick = function(event) {
        if (event.target === vidModal) {
            closeModalAndReset();
        }
    }

    // Update modal image width on window resize
    window.addEventListener('resize', setModalWidth);
});
