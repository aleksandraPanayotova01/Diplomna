document.addEventListener("DOMContentLoaded", async function () {
    const specialtyDropdown = document.getElementById("specialtyDropdown");
    const courseSelect = document.querySelector("#selectCourse");

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

    async function fetchAndCreateSubjectSelect(groupHalfId) {
        try {
            const response = await fetch(`/admin/get/subjectsHalf`, {
                method: "POST",
                body: JSON.stringify({ groupHalfId }),
                headers: { 'Content-Type': 'application/json' }
            });

            const subjectsHalf = await response.json();
            createSubjectSelect(subjectsHalf);
            console.log(subjectsHalf);

        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }
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

    function createSubjectSelect(subjectsHalf) {
        const form = document.querySelector("#deleteSubjectForm");

        const existingSubjectDiv = form.querySelector('.formInput.subject');
        if (existingSubjectDiv) existingSubjectDiv.remove();

        const subjectDiv = document.createElement("div");
        subjectDiv.classList.add("formInput", "subject");

        const labelSubjectSelect = document.createElement('label');
        labelSubjectSelect.textContent = "Предмет";
        subjectDiv.appendChild(labelSubjectSelect);

        const subjectSelect = document.createElement('select');
        subjectSelect.name = "selectSubject";
        subjectSelect.id = "selectSubject";
        subjectSelect.classList.add("selectSubject");
        subjectDiv.appendChild(subjectSelect);

        const defaultSubjectOption = document.createElement('option');
        defaultSubjectOption.textContent = "Изберете предмет";
        defaultSubjectOption.value = "";
        defaultSubjectOption.disabled = true;
        defaultSubjectOption.selected = true;
        subjectSelect.appendChild(defaultSubjectOption);

        for (const subjectHalf of subjectsHalf) {
            const subjectOption = document.createElement('option');
            subjectOption.textContent = subjectHalf.subject_name;
            subjectSelect.id = "selectSubject";
            subjectOption.value = subjectHalf.subject_id;
            subjectSelect.appendChild(subjectOption);
        }

        form.appendChild(subjectDiv);
        subjectSelect.addEventListener('change', (event) => {
            handleSubjectChange(event, subjectsHalf);
        });
        // subjectSelect.addEventListener('change', (event) => handleSubjectChange(event, subjectsHalf));

    }


    // Listen for specialty dropdown changes
    specialtyDropdown.addEventListener("change", function () {
        const selectedSpecialtyId = specialtyDropdown.value;
        const selectedSpecialtyOption = specialtyDropdown.options[specialtyDropdown.selectedIndex];

        if (selectedSpecialtyId) {

            const specialtySemesters = selectedSpecialtyOption.getAttribute('data-semesters');

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
            courseSelect.innerHTML = '<option value="">-- Изберете семестър --</option>';
            courseSelect.disabled = true;  // Disable the course select dropdown if no specialty is selected
        }

        courseSelect.addEventListener("change", async function () {
            const selectedSpecialtyId = specialtyDropdown.value; // Вземете избраната специалност
            const selectedCourse = courseSelect.value; // Вземете избрания курс/семестър
            const groupHalfs = await getGroupHalfs(specialtyDropdown.value, courseSelect.value);

            createGroupHalfInputs(groupHalfs);
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

    });

    // Handling the course selection

    // Creating group half input fields
    function createGroupHalfInputs(groupHalfs) {
        const form = document.querySelector("#deleteSubjectForm");

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

            await fetchAndCreateSubjectSelect(selectedGroupHalfId);
            // await fetchAndCreateLecturerSelect(selectedGroupHalfId);
        });
    }



    // Fetching and creating the lecturer select input
    async function fetchAndCreateLecturerSelect(lecturerId) {
        const lecturers = await getLecturers();
        const form = document.querySelector("#deleteSubjectForm");

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
            if (lecturerId == lecturer.lecturer_id) {
                lecturerOption.selected = true;
            }
            lecturerSelect.appendChild(lecturerOption);
        }

        form.appendChild(lecturersDiv);

        const submitDiv = document.createElement("div");
        submitDiv.classList.add("formInput");

        let submitButton = form.querySelector('button');
        if (!submitButton) {
            submitButton = document.createElement('button');
            submitButton.classList.add('submit');
            submitButton.textContent = "Изтриване";
            // submitButton.disabled = true; // Start with the button disabled
            submitDiv.appendChild(submitButton);
            form.appendChild(submitDiv);
        }

        // const periodTypeSelect = form.querySelector('.selectPeriodType');

        // check if the selection changed and enable/disable the submit button
        // const checkIfSelectionChanged = () => {
        //     // const selectedPeriodType = periodTypeSelect ? periodTypeSelect.value : null;
        //     submitButton.disabled = false;

        // };

        // Add event listener for lecturer select
        // lecturerSelect.addEventListener('change', checkIfSelectionChanged);

        // Add event listener for period type select if it exists
        // if (periodTypeSelect) {
        //     periodTypeSelect.addEventListener('change', checkIfSelectionChanged);
        // }
    }
    // function checkIfSelectionChanged(lecturerSelect, submitButton) {
    //     const selectedLecturer = lecturerSelect.value;
    //     // const selectedPeriodType = periodTypeSelect.value;

    //     // Активирай бутона, ако някой от изборите е променен
    //     if (selectedLecturer) {
    //         submitButton.disabled = false;
    //     } else {
    //         submitButton.disabled = true;
    //     }
    // }
    function handlePeriodTypeChange(event, lecturers, lecturerParagraph) {
        const selectedPeriodTypeId = event.target.value;

        if (selectedPeriodTypeId) {
            // Find the lecturer associated with the new period type
            const associatedLecturer = lecturers.find(lecturer =>
                lecturer.period_type_id === parseInt(selectedPeriodTypeId)
            );

            if (associatedLecturer) {
                lecturerParagraph.textContent = `${associatedLecturer.title_name} ${associatedLecturer.name} ${associatedLecturer.surname}`;
            } else {
                lecturerParagraph.textContent = "Няма свързан преподавател за избрания вид предмет.";
            }
        } else {
            lecturerParagraph.textContent = "Изберете преподавател";
        }
    }


    // Fetching and creating the period type select input
    async function fetchAndCreatePeriodTypeSelect(periodTypeId) {
        const periodTypes = await getPeriodTypes();
        const form = document.querySelector("#deleteSubjectForm");
        const lecturers = await getLecturers();
        const lecturerParagraph = await fetchAndCreateLecturerSelect();

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
            if (periodTypeId == periodType.period_type_id) {
                periodTypeOption.selected = true;
            }
            periodTypeSelect.appendChild(periodTypeOption);
        }
        periodTypeSelect.addEventListener('change', (event) => {
            handlePeriodTypeChange(event, lecturers, lecturerParagraph);
        });
        form.appendChild(periodTypeDiv);
    }
    async function handleSubjectChange(event, subjectsHalf) {
        const selectedSubjectId = event.target.value;

        if (selectedSubjectId) {
            // Намерете избрания предмет от масива subjectsHalf
            const subjectHalf = subjectsHalf.find(subject => subject.subject_id == selectedSubjectId);

            if (subjectHalf) {
                // Извиквайте fetchAndCreatePeriodTypeSelect за да добавите вид предмет
                await fetchAndCreatePeriodTypeSelect(subjectHalf.period_type_id_fk);

                // Добавете заглавие "Редактиране"
                // const form = document.querySelector("#deleteSubjectForm");
                // let existingEditHeader = form.querySelector('.editHeader');
                // if (!existingEditHeader) {
                //     const editHeader = document.createElement('h2');
                //     editHeader.textContent = "Редактиране";
                //     editHeader.classList.add("editHeader");
                //     form.appendChild(editHeader);
                // }

                // Извикайте fetchAndCreateLecturerSelect с ID на преподавателя
                await fetchAndCreateLecturerSelect(subjectHalf.lecturer_id_fk);
            } else {
                console.warn("Не е намерен избраният предмет.");
            }
        } else {
            // Премахнете всички полета, ако предметът не е избран
            const existingPeriodDiv = document.querySelector('.formInput.period');
            if (existingPeriodDiv) existingPeriodDiv.remove();

            const existingLecturerDiv = document.querySelector('.formInput.lecturers');
            if (existingLecturerDiv) existingLecturerDiv.remove();

            const existingEditHeader = document.querySelector('.editHeader');
            if (existingEditHeader) existingEditHeader.remove();

            // Деактивирайте бутона за промяна
            const submitButton = document.querySelector(".submit");
            if (submitButton) {
                submitButton.disabled = true;
            }
        }
    }


    async function fetchAndCreateLecturerSelect(lecturerId) {
        const lecturers = await getLecturers();
        const form = document.querySelector("#deleteSubjectForm");

        const existingLecturerDiv = form.querySelector('.formInput.lecturers');
        if (existingLecturerDiv) existingLecturerDiv.remove();

        const lecturersDiv = document.createElement("div");
        lecturersDiv.classList.add("formInput", "lecturers");

        const labelLecturerParagraph = document.createElement('label');
        labelLecturerParagraph.textContent = "Преподавател";
        lecturersDiv.appendChild(labelLecturerParagraph);
        const lecturerParagraph = document.createElement('p');
        lecturerParagraph.name = "selectLecturer";
        lecturerParagraph.classList.add("selectLecturer");
        lecturersDiv.appendChild(lecturerParagraph);

        // const defaultOption = document.createElement('option');
        // defaultOption.textContent = "Изберете преподавател";
        // defaultOption.value = "";
        // defaultOption.disabled = true;
        // defaultOption.selected = true;
        // lecturerSelect.appendChild(defaultOption);

        for (const lecturer of lecturers) {
            // const lecturerOption = document.createElement('option');

            if (lecturerId == lecturer.lecturer_id) {
                lecturerParagraph.textContent = `${lecturer.title_name} ${lecturer.name} ${lecturer.surname}`;
                lecturerParagraph.value = lecturer.lecturer_id;
                break;
            }
        }

        form.appendChild(lecturersDiv);

        const submitDiv = document.createElement("div");
        submitDiv.classList.add("formInput");

        let submitButton = form.querySelector('button');
        if (!submitButton) {
            submitButton = document.createElement('button');
            submitButton.classList.add('submit');
            submitButton.textContent = "Изтриване";
            // submitButton.disabled = true;
            submitDiv.appendChild(submitButton);
            form.appendChild(submitDiv);
        }

        const periodTypeSelect = form.querySelector('.selectPeriodType');
        console.log('PeriodTypeSelect exists:', !!periodTypeSelect);

        // lecturerSelect.addEventListener('change', () => {
        //     if (periodTypeSelect) {
        //         submitButton.disabled = !lecturerParagraph.value;
        //     }
        // });


    }

    // Populate specialties on page load
    await populateSpecialtiesDropdown();
});
