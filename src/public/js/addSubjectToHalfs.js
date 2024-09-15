document.addEventListener("DOMContentLoaded", async function () {
    const getGroupHalfs = async (specialty, course) => {
        try {
            const response = await fetch(`/admin/get/groupHalfs`, {
                method: "POST",
                body: JSON.stringify({ specialty, course }),
                headers: { 'Content-Type': 'application/json' }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching group halves:', error);
        }
    };

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

    const specialtySelect = document.querySelector("#selectSpecialty");
    const courseSelect = document.querySelector("#selectCourse");
    let specialty;

    specialtySelect.addEventListener("change", function () {
        specialty = specialtySelect.value;
    });

    courseSelect.addEventListener("change", async function () {
        const groupHalfs = await getGroupHalfs(specialty, courseSelect.value);
        createGroupHalfInputs(groupHalfs);
        const subjectSelect = document.querySelector(".subject");
        const groupHalfDiv = document.querySelector(".groupHalf");

        if (subjectSelect != null) {
            subjectSelect.remove();
        }

        if (groupHalfDiv != null) {
            groupHalfDiv.remove();
        }

        console.log(groupHalfs);
    });

    function createGroupHalfInputs(groupHalfs) {
        const form = document.querySelector("#addSubjectForm");

        // Remove existing elements if they exist
        const existingGroupHalfsDiv = form.querySelector('.formInput.groupHalfs');
        if (existingGroupHalfsDiv) existingGroupHalfsDiv.remove();

        // Create a new div for group halves
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

        // Create and append options like "1 a", "1 b", etc.
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

        // Remove existing lecturer select if it exists
        const existingLecturerDiv = form.querySelector('.formInput.lecturers');
        if (existingLecturerDiv) existingLecturerDiv.remove();

        // Create a new div for lecturers
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

        // Populate the lecturer select options
        for (const lecturer of lecturers) {
            const lecturerOption = document.createElement('option');
            lecturerOption.textContent = `${lecturer.title_name} ${lecturer.name} ${lecturer.surname}`;
            lecturerOption.value = lecturer.lecturer_id;
            lecturerSelect.appendChild(lecturerOption);
        }

        form.appendChild(lecturersDiv);

        await fetchAndCreatePeriodTypeSelect(); // Fetch and create the period type select
        const submitDiv = document.createElement("div");
        submitDiv.classList.add("formInput");
        // Add the submit button if it doesn't exist

        let submitButton = form.querySelector('button');
        if (!submitButton) {
            submitButton = document.createElement('button');
            // submitButton.classList.add('submit');

            submitButton.classList.add('submit');
            submitButton.textContent = "Добавяне";
            submitDiv.appendChild(submitButton);
            form.appendChild(submitDiv);
        }
    }

    async function fetchAndCreatePeriodTypeSelect() {
        const periodTypes = await getPeriodTypes();
        const form = document.querySelector("#addSubjectForm");

        // Remove existing period type select if it exists
        const existingPeriodTypeDiv = form.querySelector('.formInput.periodType');
        if (existingPeriodTypeDiv) existingPeriodTypeDiv.remove();

        // Create a new div for period types
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

        // Populate the period type select options
        for (const periodType of periodTypes) {
            const periodTypeOption = document.createElement('option');
            periodTypeOption.textContent = periodType.period_type_name;
            periodTypeOption.value = periodType.period_type_id;
            periodTypeSelect.appendChild(periodTypeOption);
        }

        form.appendChild(periodTypeDiv);
    }
});
