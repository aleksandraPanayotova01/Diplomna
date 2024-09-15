document.addEventListener("DOMContentLoaded", function () {
    const dropdownIcon = document.querySelector('#menu');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Toggle the visibility of the dropdown content
    dropdownIcon.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevents the click event from propagating to the document
        if (dropdownContent.style.display === 'none' || dropdownContent.style.display === '') {
            dropdownContent.style.display = 'block';
        } else {
            dropdownContent.style.display = 'none';
        }
    });

    // Click outside to close the dropdown
    document.addEventListener('click', function (event) {
        if (!dropdownIcon.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    });
});
