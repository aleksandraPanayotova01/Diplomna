document.addEventListener('DOMContentLoaded', () => {
    fetch('/lecturer/get/subjects')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched Subjects Data:', data);

            if (checkForAddGradesButton(data)) {
                console.log('Adding the button');
                displayAddGradesButton();
            } else {
                console.log('No subject with period_type_id_fk = 1 found');
            }
        })
        .catch(error => console.error('Error fetching lecturer subjects:', error));
});

function checkForAddGradesButton(subjects) {
    subjects.forEach(subject => console.log('Subject:', subject));

    return subjects.some(subject => subject.period_type_id_fk === 1);
}

function displayAddGradesButton() {
    const addGradesButton = document.createElement('div');
    addGradesButton.innerHTML = `
    <div>
        <a href="/lecturer/add/marks">
            <button>Добавяне на оценки</button>
        </a>
    </div>
`;

    const container = document.getElementById('addGradesContainer');
    container.appendChild(addGradesButton);
}