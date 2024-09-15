document.addEventListener("DOMContentLoaded", async function () {
    const addLecturerButton = document.querySelector("#addLecturerButton");
    const addLecturerDiv = document.querySelector(".addLecturer");
    const lecturersDiv = document.querySelector(".lecturers");
    let titleChosenSelects = document.querySelectorAll('.selectTitle');

    const getTitles = async () => {
        try {
            const titles = await fetch("/admin/get/titles", {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            return await titles.json();
        } catch (error) {
            console.error('Error fetching titles:', error);
        }
    };

    const getLecturers = async () => {
        try {
            const response = await fetch("/admin/get/lecturers", {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            return await response.json();
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };

    const lecturers = await getLecturers();

    // Function to set up event listeners for title selects
    function setupTitleSelects() {
        titleChosenSelects = document.querySelectorAll('.selectTitle');

        for (const titleChosen of titleChosenSelects) {
            titleChosen.addEventListener("change", function () {
                const parentDiv = titleChosen.closest('div');
                const lecturersWithTitle = parentDiv.querySelector('.selectLecturer');

                createLecturerOptions(titleChosen.value, lecturersWithTitle);
            });

            // Initialize lecturer options based on the first title option
            const titleFirstOption = titleChosen.options[0];
            const parentDiv = titleChosen.closest('div');
            const lecturersWithTitle = parentDiv.querySelector('.selectLecturer');
            createLecturerOptions(titleFirstOption.value, lecturersWithTitle);
        }
    }

    // Initial setup of event listeners
    setupTitleSelects();

    addLecturerButton.addEventListener("click", async function () {
        const lecturerDiv = document.createElement("div");
        lecturerDiv.classList.add("formInput", "lecturer");

        const titles = await getTitles();

        const br0 = document.createElement("br");
        lecturerDiv.appendChild(br0);

        const labelSelectTitle = document.createElement("label");
        const labelSelectText = document.createTextNode("Титла на преподавател");
        labelSelectTitle.appendChild(labelSelectText);
        lecturerDiv.appendChild(labelSelectTitle);

        const selectTitle = document.createElement("select");
        selectTitle.classList.add('selectTitle');
        selectTitle.name = "title";

        for (const title of titles) {
            const selectTitleOption = document.createElement("option");
            selectTitleOption.value = title.title_name;
            selectTitleOption.textContent = title.title_name;
            selectTitle.appendChild(selectTitleOption);
        }

        lecturerDiv.appendChild(labelSelectTitle);
        lecturerDiv.appendChild(selectTitle);
        const br = document.createElement("br");
        lecturerDiv.appendChild(br);

        const labelSelectLecturer = document.createElement("label");
        const labelSelectLecturerText = document.createTextNode("Имена на преподавател");
        labelSelectLecturer.appendChild(labelSelectLecturerText);
        lecturerDiv.appendChild(labelSelectLecturer);

        const selectLecturerName = document.createElement("select");
        selectLecturerName.name = "selectLecturer";
        selectLecturerName.classList.add("selectLecturer");

        lecturerDiv.appendChild(selectLecturerName);

        const br3 = document.createElement("br");
        lecturerDiv.appendChild(br3);

        const removeLecturer = document.createElement("button");
        removeLecturer.classList.add("remove");
        removeLecturer.type = "button";
        const removeLecturerButtonText = document.createTextNode("Премахване");
        removeLecturer.appendChild(removeLecturerButtonText);
        lecturerDiv.appendChild(removeLecturer);

        lecturersDiv.insertBefore(lecturerDiv, addLecturerDiv);

        removeLecturer.addEventListener("click", function () {
            lecturerDiv.remove();////////////////////////////
            setupTitleSelects(); // Re-setup event listeners after removal
        });

        setupTitleSelects(); // Re-setup event listeners for the newly added select
    });

    function createLecturerOptions(title, lecturersWithTitle) {
        lecturersWithTitle.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = 'none';
        defaultOption.selected = true;
        defaultOption.hidden = true;
        defaultOption.disabled = true;
        defaultOption.textContent = 'Изберете преподавател';
        lecturersWithTitle.appendChild(defaultOption);

        for (const lecturer of lecturers) {
            if (lecturer.title_name === title) {
                const lecturerOption = document.createElement('option');
                lecturerOption.textContent = `${lecturer.name} ${lecturer.fathers_name} ${lecturer.surname}`;
                lecturerOption.value = lecturer.lecturer_id;
                lecturersWithTitle.appendChild(lecturerOption);
            }
        }
    }
});