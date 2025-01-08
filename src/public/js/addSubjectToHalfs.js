document.addEventListener("DOMContentLoaded", async function () {
    const specialtyDropdown = document.getElementById("specialtyDropdown");
    const subjectsDropdown = document.getElementById("subjectsDropdown");
    const subjectNameInput = document.getElementById("subjectName");
    const subjectAbbreviationInput = document.getElementById("subjectAbbreviation");
    const courseSelect = document.querySelector("#selectCourse");

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


    const getLecturers = async () => {
        try {
            const response = await fetch(`/admin/get/lecturers`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };

    const getPeriodTypes = async () => {
        try {
            const response = await fetch(`/admin/get/periodTypes`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching period types:', error);
        }
    };

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
            defaultOption.value = "";
            defaultOption.textContent = "-- Изберете предмет --";
            subjectsDropdown.appendChild(defaultOption);

            if (data.subjects && data.subjects.length > 0) {
                data.subjects.forEach(subject => {
                    const option = document.createElement("option");
                    option.value = subject.subject_id;
                    option.textContent = subject.subject_name;
                    option.setAttribute('data-abbreviation', subject.subject_abbreviation);
                    option.setAttribute('data-name', subject.subject_name);
                    subjectsDropdown.appendChild(option);
                });
                subjectsDropdown.disabled = false;
            } else {
                subjectsDropdown.innerHTML = `<option value="">-- Няма налични предмети --</option>`;
                subjectsDropdown.disabled = true;
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
            alert("Грешка при зареждане на предмети.");
        }
    };


    subjectsDropdown.addEventListener('change', function () {
        const selectedOption = subjectsDropdown.options[subjectsDropdown.selectedIndex];
        if (selectedOption && selectedOption.value) {
            subjectNameInput.value = selectedOption.getAttribute('data-name');
            subjectAbbreviationInput.value = selectedOption.getAttribute('data-abbreviation');
        } else {
            subjectNameInput.value = "";
            subjectAbbreviationInput.value = "";
        }
    });

    specialtyDropdown.addEventListener("change", function () {
        const selectedSpecialtyId = specialtyDropdown.value;
        const selectedSpecialtyOption = specialtyDropdown.options[specialtyDropdown.selectedIndex];

        if (selectedSpecialtyId) {
            loadSubjectsBySpecialty(selectedSpecialtyId);
            const specialtySemesters = selectedSpecialtyOption.getAttribute('data-semesters');
            courseSelect.innerHTML = '';
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "-- Изберете семестър --";
            courseSelect.appendChild(defaultOption);
            for (let i = 1; i <= specialtySemesters; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = `${i}`;
                courseSelect.appendChild(option);
            }

            courseSelect.disabled = false;
        } else {
            courseSelect.innerHTML = '<option value="">-- Изберете курс --</option>';
            courseSelect.disabled = true;
        }
    });

    courseSelect.addEventListener("change", async function () {
        const selectedSpecialtyId = specialtyDropdown.value;
        const selectedCourse = courseSelect.value;

        if (selectedSpecialtyId && selectedCourse) {
            const groupHalfs = await getGroupHalfs(selectedSpecialtyId, selectedCourse);

            if (groupHalfs && groupHalfs.length > 0) {
                createGroupHalfInputs(groupHalfs);
            } else {
                console.warn("Няма намерени половинки за тази специалност и курс.");
                alert("Няма налични половинки за тази специалност и курс.");
            }
        }
    });

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

        for (const groupHalf of groupHalfs) {
            const groupHalfOption = document.createElement('option');
            groupHalfOption.textContent = `${groupHalf.group_number} ${groupHalf.group_half_letter}`;
            groupHalfOption.value = groupHalf.group_half_id;
            groupHalfSelect.appendChild(groupHalfOption);
        }

        form.appendChild(groupHalfsDiv);

        groupHalfSelect.addEventListener("change", async function () {
            const selectedGroupHalfId = groupHalfSelect.value;
            await fetchAndCreateLecturerSelect(selectedGroupHalfId);
        });
    }

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

        for (const periodType of periodTypes) {
            const periodTypeOption = document.createElement('option');
            periodTypeOption.textContent = periodType.period_type_name;
            periodTypeOption.value = periodType.period_type_id;
            periodTypeSelect.appendChild(periodTypeOption);
        }

        form.appendChild(periodTypeDiv);
    }

    await populateSpecialtiesDropdown();
});
