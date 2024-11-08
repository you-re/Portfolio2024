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

    // Function to fetch and check links in an external HTML file
    async function checkLinksInExternalFile(url) {
        try {
            // Fetch the external HTML file
            const response = await fetch(url);

            // Check if the fetch was successful
            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
            }

            // Get the HTML content as text
            const htmlText = await response.text();

            // Parse the HTML text into a document
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // Select all grid-item elements and collect <a> links from them
            const gridItems = doc.querySelectorAll('.grid-item'); // Adjust selector as needed
            let links = [];

            // Collect all <a> tags from each grid-item
            gridItems.forEach(gridItem => {
                gridItem.querySelectorAll('a').forEach(link => links.push(link));
            });

            // Get the last part of the current page path
            const currentPagePath = window.location.pathname.split('/')[1];

            // Initialize variables to hold the index and adjacent links
            let targetIndex = -1;
            let linkBefore = null;
            let linkAfter = null;

            // Iterate over the links to check if any match the current page's relative path
            links.forEach((link, index) => {
                const linkPath = link.pathname.split('/')[2]; // Get the last segment of the link's path

                if (linkPath === currentPagePath) {
                    // console.log(`Found link to this page: ${link.href}`);
                    targetIndex = index;
                }
            });

            // Set adjacent links if the target link was found
            if (targetIndex !== -1) {
                indexBefore = ((targetIndex - 2) < 0) ? links.length - 1 : targetIndex - 2;
                indexAfter = ((targetIndex + 1) === links.length) ? 0 : targetIndex + 1;
                
                linkBefore = "../" + links[indexBefore].pathname.split('/')[2] + "/";
                linkAfter = "../" + links[indexAfter].pathname.split('/')[2] + "/";
                // console.log(`Link before: ${linkBefore}`);
                // console.log(`Link after: ${linkAfter}`);
            } else {
                // console.log("No link to this page found in the external file.");
            }

            // Update the header links dynamically
            updateHeaderLinks(linkBefore, linkAfter);

        } catch (error) {
            console.error("Error checking links:", error);
        }
    }
    
    checkLinksInExternalFile("..")

    // Function to update the left and right arrow links in the header
    function updateHeaderLinks(linkBefore, linkAfter) {
        const leftArrowLink = document.querySelector('.header-content a:nth-child(1)');
        const rightArrowLink = document.querySelector('.header-content a:nth-child(3)');

        // Update the href attributes of the left and right arrow links
        if (linkBefore) {
            leftArrowLink.href = linkBefore;
        }

        if (linkAfter) {
            rightArrowLink.href = linkAfter;
        }
    }

    // Select all videos and images
    const mediaElements = document.querySelectorAll('.gallery-vid, .gallery-img'); 
    
    // Loaders for all media
    mediaElements.forEach(media => {
        // Create a loader for each media item
        const loader = document.createElement('div');
        loader.classList.add('loader');
        
        // Insert the loader right after the media element
        media.parentNode.insertBefore(loader, media.nextSibling);
        
        if (media.tagName === 'VIDEO') {
            // Event listener for videos
            media.addEventListener('canplaythrough', function() {
                loader.style.display = 'none'; // Hide loader when video is ready
                media.classList.add('loaded'); // Optional: Add loaded class to video
            });

            // Optional: Timeout in case canplaythrough doesn't trigger
            setTimeout(() => {
                if (loader.style.display !== 'none') {
                    loader.style.display = 'none'; // Hide loader after a timeout
                    media.classList.add('loaded'); // Optional: Add loaded class
                }
            }, 3000); // Timeout after 3 seconds (adjust as needed)
        } else if (media.tagName === 'IMG') {
            // Event listener for images
            media.addEventListener('load', function() {
                loader.style.display = 'none'; // Hide loader when image is loaded
            });

            // Optional: Timeout for images
            setTimeout(() => {
                if (loader.style.display !== 'none') {
                    loader.style.display = 'none'; // Hide loader after a timeout
                }
            }, 3000); // Timeout after 3 seconds (adjust as needed)
        }
    });
});
