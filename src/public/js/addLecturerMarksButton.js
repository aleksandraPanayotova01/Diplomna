document.addEventListener('DOMContentLoaded', () => {
    fetch('/lecturer/get/subjects')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched Subjects Data:', data);  // Log the data for debugging

            // Check for any subject with period_type_id_fk == 1 and show the button
            if (checkForAddGradesButton(data)) {
                console.log('Adding the button');  // Debugging log to check if the button should be added
                displayAddGradesButton();
            } else {
                console.log('No subject with period_type_id_fk = 1 found');
            }
        })
        .catch(error => console.error('Error fetching lecturer subjects:', error));
});

function checkForAddGradesButton(subjects) {
    // Log each subject to check if the period_type_id_fk exists
    subjects.forEach(subject => console.log('Subject:', subject));

    // Check if any subject has period_type_id_fk equal to 1
    return subjects.some(subject => subject.period_type_id_fk === 1);
}

function displayAddGradesButton() {
    // Create the button element
    const addGradesButton = document.createElement('div');
    addGradesButton.innerHTML = `
    <div>
        <a href="/lecturer/add/marks">
            <button>Добавяне на оценки</button>
        </a>
    </div>
`;

    // Append it to the container with id `addGradesContainer`
    const container = document.getElementById('addGradesContainer');
    container.appendChild(addGradesButton);
}