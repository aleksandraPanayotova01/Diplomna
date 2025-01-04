document.addEventListener("DOMContentLoaded", async function () {
    // const subjects = JSON.parse(document.currentScript.getAttribute("subjects"));
    const specialtyDropdown = document.getElementById("specialtyDropdown");
    const subjectsDropdown = document.getElementById("subjectsDropdown");
    const subjectNameInput = document.getElementById("subjectName");
    const subjectAbbreviationInput = document.getElementById("subjectAbbreviation");
    // const specialtySelect = document.querySelector("#selectSpecialty");
    const courseSelect = document.querySelector("#selectCourse");
    // let specialty;

    // Fetch specialties from the server
    const getSpecialties = async () => {
        try {
            const response = await fetch(`/admin/get/specialties`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                console.error("Failed to fetch specialties. Status:", response.status);
                alert("Неуспешно зареждане на специалности. Моля, опитайте по-късно.");
                return [];
            }

            const specialties = await response.json();
            if (!Array.isArray(specialties)) {
                console.error("Unexpected response format:", specialties);
                alert("Неочакван отговор от сървъра.");
                return [];
            }

            return specialties;
        } catch (error) {
            console.error('Error fetching specialties:', error);
            alert("Грешка при зареждане на специалности.");
            return [];
        }
    };
    // Fetch function to get group halfs
    async function getGroupHalfs(specialtyId, courseNumber) {
        try {
            const response = await fetch('/admin/get/groupHalfs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ specialty: specialtyId, course: courseNumber })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch group halves");
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    //Fetch group halfs based on the chosen specialty and semester

    // Fetch function to get lecturers
    const getLecturers = async () => {
        try {
            const response = await fetch(`/admin/get/lecturers`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };

    // Fetch function to get period types
    const getPeriodTypes = async () => {
        try {
            const response = await fetch(`/admin/get/periodTypes`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching period types:', error);
        }
    };

    // Populate specialties dropdown
    const populateSpecialtiesDropdown = async () => {
        const specialties = await getSpecialties();

        if (specialties.length === 0) {
            console.warn("No specialties found.");
            specialtyDropdown.innerHTML = `<option value="">-- Няма налични специалности --</option>`;
            return;
        }

        specialties.forEach(specialty => {
            const option = document.createElement("option");
            option.value = specialty.specialty_id;
            option.textContent = specialty.specialty_name;
            option.setAttribute('data-semesters', specialty.specialty_semesters);// Save semesters count in data attribute   
            specialtyDropdown.appendChild(option);
        });
    };
    // Populate subjects dropdown
    const loadSubjectsBySpecialty = async (specialtyId) => {
        try {
            const response = await fetch(`/admin/search/subjectsSpecialty`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subjectSearch: specialtyId })
            });

            const data = await response.json();
            subjectsDropdown.innerHTML = ""; // Clear old options
            const defaultOption = document.createElement("option");
            //default option
            defaultOption.value = "";
            defaultOption.textContent = "-- Изберете предмет --";
            subjectsDropdown.appendChild(defaultOption);

            if (data.subjects && data.subjects.length > 0) {
                data.subjects.forEach(subject => {
                    const option = document.createElement("option");
                    option.value = subject.subject_id; // Store the subject_id
                    option.textContent = subject.subject_name; // Display subject name
                    option.setAttribute('data-abbreviation', subject.subject_abbreviation); // Store abbreviation in data attribute
                    option.setAttribute('data-name', subject.subject_name); // Store name in data attribute
                    subjectsDropdown.appendChild(option);
                });
                subjectsDropdown.disabled = false; // Enable dropdown
            } else {
                subjectsDropdown.innerHTML = `<option value="">-- Няма налични предмети --</option>`;
                subjectsDropdown.disabled = true; // Disable dropdown
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
            alert("Грешка при зареждане на предмети.");
        }
    };


    // // Handling the specialty selection
    // const specialtySelect = document.querySelector("#selectSpecialty");
    // const courseSelect = document.querySelector("#selectCourse");
    // let specialty;

    // specialtySelect.addEventListener("change", function () {
    //     specialty = specialtySelect.value;
    //     const subjectSelect = document.querySelector("#selectSubject");
    //     subjectSelect.innerHTML = '<option value="none" selected disabled hidden>Изберете предмет</option>';

    //     // Filter and populate the subjects based on selected specialty
    //     for (const subject of subjects) {
    //         if (subject.specialty_id_fk === specialty) {
    //             const subjectOption = document.createElement('option');
    //             subjectOption.textContent = `${subject.subject_name} - ${subject.subject_abbreviation}`;
    //             subjectOption.value = subject.subject_id;
    //             subjectSelect.appendChild(subjectOption);
    //         }
    //     }
    // });
    subjectsDropdown.addEventListener('change', function () {
        const selectedOption = subjectsDropdown.options[subjectsDropdown.selectedIndex];
        if (selectedOption && selectedOption.value) {
            // Set hidden fields for name and abbreviation

            subjectNameInput.value = selectedOption.getAttribute('data-name');
            subjectAbbreviationInput.value = selectedOption.getAttribute('data-abbreviation');
            // submitButton.disabled = false; // Enable the submit button
        } else {
            subjectNameInput.value = "";
            subjectAbbreviationInput.value = "";
            // submitButton.disabled = true; // Disable the submit button if no subject is selected
        }
    });

    // Listen for specialty dropdown changes
    specialtyDropdown.addEventListener("change", function () {
        const selectedSpecialtyId = specialtyDropdown.value;
        const selectedSpecialtyOption = specialtyDropdown.options[specialtyDropdown.selectedIndex];

        if (selectedSpecialtyId) {
            loadSubjectsBySpecialty(selectedSpecialtyId);
            const specialtySemesters = selectedSpecialtyOption.getAttribute('data-semesters');
            // //  Filter and populate the subjects based on selected specialty
            // for (const subject of subjects) {
            //     if (subject.specialty_id_fk === specialty) {
            //         const subjectOption = document.createElement('option');
            //         subjectOption.textContent = `${subject.subject_name} - ${subject.subject_abbreviation}`;
            //         subjectOption.value = subject.subject_id;
            //         subjectSelect.appendChild(subjectOption);
            //     }
            // }
            // Clear and populate the courses dropdown based on the specialty
            courseSelect.innerHTML = '';
            const defaultOption = document.createElement("option");
            //default option
            defaultOption.value = "";
            defaultOption.textContent = "-- Изберете семестър --";
            courseSelect.appendChild(defaultOption);
            for (let i = 1; i <= specialtySemesters; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = `${i}`;
                courseSelect.appendChild(option);
            }

            courseSelect.disabled = false;  // Enable the course select dropdown
        } else {
            courseSelect.innerHTML = '<option value="">-- Изберете курс --</option>';
            courseSelect.disabled = true;  // Disable the course select dropdown if no specialty is selected
        }
    });

    // Handling the course selection
    courseSelect.addEventListener("change", async function () {
        const selectedSpecialtyId = specialtyDropdown.value; // Вземете избраната специалност
        const selectedCourse = courseSelect.value; // Вземете избрания курс/семестър

        if (selectedSpecialtyId && selectedCourse) {
            // Извличане на половинките на групи за избраната специалност и курс
            const groupHalfs = await getGroupHalfs(selectedSpecialtyId, selectedCourse);

            if (groupHalfs && groupHalfs.length > 0) {
                // Създаване на полета за половинки
                createGroupHalfInputs(groupHalfs);
            } else {
                console.warn("Няма намерени половинки за тази специалност и курс.");
                alert("Няма налични половинки за тази специалност и курс.");
            }
        }
        // const groupHalfs = await getGroupHalfs(specialtySelect.value, courseSelect.value);
        // createGroupHalfInputs(groupHalfs);
    });

    // Creating group half input fields
    function createGroupHalfInputs(groupHalfs) {
        const form = document.querySelector("#addSubjectForm");

        const existingGroupHalfsDiv = form.querySelector('.formInput.groupHalfs');
        if (existingGroupHalfsDiv) existingGroupHalfsDiv.remove();

        const groupHalfsDiv = document.createElement("div");
        groupHalfsDiv.classList.add("formInput", "groupHalfs");

        const labelGroupHalfSelect = document.createElement('label');
        labelGroupHalfSelect.textContent = "За половинки";
        groupHalfsDiv.appendChild(labelGroupHalfSelect);

        const groupHalfSelect = document.createElement('select');
        groupHalfSelect.name = "selectGroupHalf";
        groupHalfSelect.classList.add("selectGroupHalf");
        groupHalfsDiv.appendChild(groupHalfSelect);

        const defaultOption = document.createElement('option');
        defaultOption.textContent = "Изберете половинка";
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        groupHalfSelect.appendChild(defaultOption);

        // Populating the group halves options
        for (const groupHalf of groupHalfs) {
            const groupHalfOption = document.createElement('option');
            groupHalfOption.textContent = `${groupHalf.group_number} ${groupHalf.group_half_letter}`;
            groupHalfOption.value = groupHalf.group_half_id;
            groupHalfSelect.appendChild(groupHalfOption);
        }

        form.appendChild(groupHalfsDiv);

        // Adding event listener for group half change
        groupHalfSelect.addEventListener("change", async function () {
            const selectedGroupHalfId = groupHalfSelect.value;
            await fetchAndCreateLecturerSelect(selectedGroupHalfId);
        });
    }

    // Fetching and creating the lecturer select input
    async function fetchAndCreateLecturerSelect(groupHalfId) {
        const lecturers = await getLecturers();
        const form = document.querySelector("#addSubjectForm");

        const existingLecturerDiv = form.querySelector('.formInput.lecturers');
        if (existingLecturerDiv) existingLecturerDiv.remove();

        const lecturersDiv = document.createElement("div");
        lecturersDiv.classList.add("formInput", "lecturers");

        const labelLecturerSelect = document.createElement('label');
        labelLecturerSelect.textContent = "Преподавател";
        lecturersDiv.appendChild(labelLecturerSelect);

        const lecturerSelect = document.createElement('select');
        lecturerSelect.name = "selectLecturer";
        lecturerSelect.classList.add("selectLecturer");
        lecturersDiv.appendChild(lecturerSelect);

        const defaultOption = document.createElement('option');
        defaultOption.textContent = "Изберете преподавател";
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        lecturerSelect.appendChild(defaultOption);

        // Populating the lecturer options
        for (const lecturer of lecturers) {
            const lecturerOption = document.createElement('option');
            lecturerOption.textContent = `${lecturer.title_name} ${lecturer.name} ${lecturer.surname}`;
            lecturerOption.value = lecturer.lecturer_id;
            lecturerSelect.appendChild(lecturerOption);
        }

        form.appendChild(lecturersDiv);

        await fetchAndCreatePeriodTypeSelect();
        const submitDiv = document.createElement("div");
        submitDiv.classList.add("formInput");

        let submitButton = form.querySelector('button');
        if (!submitButton) {
            submitButton = document.createElement('button');
            submitButton.classList.add('submit');
            submitButton.textContent = "Добавяне";
            submitDiv.appendChild(submitButton);
            form.appendChild(submitDiv);
        }
    }

    // Fetching and creating the period type select input
    async function fetchAndCreatePeriodTypeSelect() {
        const periodTypes = await getPeriodTypes();
        const form = document.querySelector("#addSubjectForm");

        const existingPeriodTypeDiv = form.querySelector('.formInput.periodType');
        if (existingPeriodTypeDiv) existingPeriodTypeDiv.remove();

        const periodTypeDiv = document.createElement("div");
        periodTypeDiv.classList.add("formInput", "periodType");

        const labelPeriodTypeSelect = document.createElement('label');
        labelPeriodTypeSelect.textContent = "Вид предмет";
        periodTypeDiv.appendChild(labelPeriodTypeSelect);

        const periodTypeSelect = document.createElement('select');
        periodTypeSelect.name = "selectPeriodType";
        periodTypeSelect.classList.add("selectPeriodType");
        periodTypeDiv.appendChild(periodTypeSelect);

        const defaultOption = document.createElement('option');
        defaultOption.textContent = "Изберете вид предмет";
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        periodTypeSelect.appendChild(defaultOption);

        // Populating the period type options
        for (const periodType of periodTypes) {
            const periodTypeOption = document.createElement('option');
            periodTypeOption.textContent = periodType.period_type_name;
            periodTypeOption.value = periodType.period_type_id;
            periodTypeSelect.appendChild(periodTypeOption);
        }

        form.appendChild(periodTypeDiv);
    }

    // Populate specialties on page load
    await populateSpecialtiesDropdown();
});
