document.addEventListener("DOMContentLoaded", function () {
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

    // async function fetchAndCreateMarksSelect() {
    //     try {
    //         const response = await fetch(`/admin/get/marks`);
    //         const marks = await response.json();
    //         createMarksSelect(marks);
    //     } catch (error) {
    //         console.error('Error fetching marks:', error);
    //     }
    // };
    async function fetchMarksAndCreateSelect() {
        try {
            const response = await fetch(`/admin/get/marks`);
            const marks = await response.json();
            await createMarksSelect(marks);
        } catch (error) {
            console.error('Error fetching marks:', error);
        }
    }

    async function fetchAndCreateSubjectSelect(groupHalfId) {
        try {
            const response = await fetch(`/admin/get/subjectsHalf`, {
                method: "POST",
                body: JSON.stringify({ groupHalfId }),
                headers: { 'Content-Type': 'application/json' }
            });

            const subjectsHalf = await response.json();
            createSubjectSelect(subjectsHalf);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }

    async function fetchAndCreateFacNums(groupHalfId) {
        try {
            const response = await fetch(`/admin/get/facultyNumbers`, {
                method: "POST",
                body: JSON.stringify({ groupHalfId }),
                headers: { 'Content-Type': 'application/json' }
            });

            const facultyNumbers = await response.json();
            createFacNumsSelect(facultyNumbers);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }

    const specialtySelect = document.querySelector("#selectSpecialty");
    const courseSelect = document.querySelector("#selectCourse");
    let specialty;

    specialtySelect.addEventListener("change", async function () {
        specialty = specialtySelect.value;
    });

    courseSelect.addEventListener("change", async function () {
        const groupHalfs = await getGroupHalfs(specialty, courseSelect.value);
        await createGroupHalfInputs(groupHalfs);

        const subjectSelect = document.querySelector(".subject");
        const periodDiv = document.querySelector(".period");

        if (subjectSelect != null) {
            subjectSelect.remove();
        }

        if (periodDiv != null) {
            periodDiv.remove();
        }

        console.log(groupHalfs);
    });

    async function createGroupHalfInputs(groupHalfs) {
        const form = document.querySelector("#addMarkForm");

        // Remove existing elements
        const existingGroupNumberDiv = form.querySelector('.formInput.groupNumber');
        if (existingGroupNumberDiv) existingGroupNumberDiv.remove();

        const existingGroupHalfDiv = form.querySelector('.formInput.groupHalf');
        if (existingGroupHalfDiv) existingGroupHalfDiv.remove();

        // Create and append the group number select
        const groupNumberDiv = document.createElement("div");
        groupNumberDiv.classList.add("formInput", "groupNumber");

        const labelGroupNumberSelect = document.createElement('label');
        labelGroupNumberSelect.textContent = "Група";
        groupNumberDiv.appendChild(labelGroupNumberSelect);

        const groupNumberSelect = document.createElement('select');
        groupNumberSelect.name = "selectGroup";
        groupNumberSelect.classList.add("selectGroup");
        groupNumberDiv.appendChild(groupNumberSelect);

        const defaultOption = document.createElement('option');
        defaultOption.textContent = "Изберете група";
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        groupNumberSelect.appendChild(defaultOption);

        const uniqueGroupNumbers = [...new Set(groupHalfs.map(gh => gh.group_number))];
        for (const groupNumber of uniqueGroupNumbers) {
            const groupNumberOption = document.createElement('option');
            groupNumberOption.textContent = groupNumber;
            groupNumberOption.value = groupNumber;
            groupNumberSelect.appendChild(groupNumberOption);
        }

        form.appendChild(groupNumberDiv);

        groupNumberSelect.addEventListener("change", async function () {
            const selectedGroupNumber = groupNumberSelect.value;
            await createGroupHalfInput(groupHalfs, selectedGroupNumber);
        });
    }

    async function createGroupHalfInput(groupHalfs, selectedGroupNumber) {
        const form = document.querySelector("#addMarkForm");

        const existingGroupHalfDiv = form.querySelector('.formInput.groupHalf');
        if (existingGroupHalfDiv) existingGroupHalfDiv.remove();

        const filteredGroupHalfs = groupHalfs.filter(gh => gh.group_number === Number(selectedGroupNumber));

        if (filteredGroupHalfs.length > 0) {
            const groupHalfDiv = document.createElement("div");
            groupHalfDiv.classList.add("formInput", "groupHalf");

            const labelGroupHalfSelect = document.createElement('label');
            labelGroupHalfSelect.textContent = "Половинка";
            groupHalfDiv.appendChild(labelGroupHalfSelect);

            const groupHalfSelect = document.createElement('select');
            groupHalfSelect.name = "selectGroupHalf";
            groupHalfSelect.classList.add("selectGroupHalf");
            groupHalfDiv.appendChild(groupHalfSelect);

            const defaultOption = document.createElement('option');
            defaultOption.textContent = "Изберете половинка";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            groupHalfSelect.appendChild(defaultOption);

            for (const groupHalf of filteredGroupHalfs) {
                const groupHalfOption = document.createElement('option');
                groupHalfOption.textContent = groupHalf.group_half_letter;
                groupHalfOption.value = groupHalf.group_half_id;
                groupHalfSelect.appendChild(groupHalfOption);
            }

            form.appendChild(groupHalfDiv);

            groupHalfSelect.addEventListener("change", async function () {
                const selectedGroupHalfId = groupHalfSelect.value;
                await fetchAndCreateSubjectSelect(selectedGroupHalfId);
                await fetchAndCreateFacNums(selectedGroupHalfId);
            });
        }
    }

    function createSubjectSelect(subjectsHalf) {
        const form = document.querySelector("#addMarkForm");

        const existingSubjectDiv = form.querySelector('.formInput.subject');
        if (existingSubjectDiv) existingSubjectDiv.remove();

        const subjectDiv = document.createElement("div");
        subjectDiv.classList.add("formInput", "subject");

        const labelSubjectSelect = document.createElement('label');
        labelSubjectSelect.textContent = "Предмет";
        subjectDiv.appendChild(labelSubjectSelect);

        const subjectSelect = document.createElement('select');
        subjectSelect.name = "selectSubject";
        subjectSelect.id = "selectSubject"; // Ensure unique IDs
        subjectSelect.classList.add("selectSubject");
        subjectDiv.appendChild(subjectSelect);

        const defaultSubjectOption = document.createElement('option');
        defaultSubjectOption.textContent = "Изберете предмет";
        defaultSubjectOption.value = "";
        defaultSubjectOption.disabled = true;
        defaultSubjectOption.selected = true;
        subjectSelect.appendChild(defaultSubjectOption);

        subjectsHalf.forEach(subjectHalf => {
            const subjectOption = document.createElement('option');
            subjectOption.textContent = subjectHalf.subject_name;
            subjectOption.value = subjectHalf.subject_id;
            subjectSelect.appendChild(subjectOption);
        });

        form.appendChild(subjectDiv);
        subjectSelect.addEventListener('change', handleSubjectChange);
    }

    async function handleSubjectChange(event) {
        const selectedSubjectId = event.target.value;
        if (selectedSubjectId) {
            // await createPeriodTypeSelect();
        } else {
            // Remove existing period inputs if subject is deselected
            const existingPeriodDiv = document.querySelector('.formInput.period');
            if (existingPeriodDiv) existingPeriodDiv.remove();
        }
    }

    async function createFacNumsSelect(facultyNumbers) {
        const form = document.querySelector("#addMarkForm");
        const existingFacultyNumbersDiv = form.querySelector('.formInput.faculty_numbers');
        if (existingFacultyNumbersDiv) existingFacultyNumbersDiv.remove();

        const facultyNumbersDiv = document.createElement("div");
        facultyNumbersDiv.classList.add("formInput", "faculty_numbers");

        const labelFacultyNumbersSelect = document.createElement('label');
        labelFacultyNumbersSelect.textContent = "Факултетни номера";
        facultyNumbersDiv.appendChild(labelFacultyNumbersSelect);

        const facultyNumbersSelect = document.createElement('select');
        facultyNumbersSelect.name = "facultyNumbersSelect";
        facultyNumbersSelect.id = "facultyNumbersSelect";
        facultyNumbersSelect.classList.add("facultyNumbersSelect");
        facultyNumbersDiv.appendChild(facultyNumbersSelect);

        const defaultFacultyNumbersOption = document.createElement('option');
        defaultFacultyNumbersOption.textContent = "Изберете факултетен номер";
        defaultFacultyNumbersOption.value = "";
        defaultFacultyNumbersOption.disabled = true;
        defaultFacultyNumbersOption.selected = true;
        facultyNumbersSelect.appendChild(defaultFacultyNumbersOption);

        facultyNumbers.forEach(facultyNumber => {
            const facultyNumberOption = document.createElement('option');
            facultyNumberOption.textContent = facultyNumber.student_fac_num;
            facultyNumberOption.value = facultyNumber.student_fac_num;
            facultyNumbersSelect.appendChild(facultyNumberOption);
        });
        form.appendChild(facultyNumbersDiv);
        await fetchMarksAndCreateSelect();

    }

    async function createMarksSelect(marks) {
        try {
            const form = document.querySelector("#addMarkForm");

            // Create the marks select div
            const marksDiv = document.createElement("div");
            marksDiv.classList.add("formInput", "marks");
            // const facultyNumbersDiv = document.createElement("div");
            // facultyNumbersDiv.classList.add("formInput", "faculty_numbers");

            const labelMarksSelect = document.createElement('label');
            labelMarksSelect.textContent = "Оценка";
            marksDiv.appendChild(labelMarksSelect);

            const marksSelect = document.createElement('select');
            marksSelect.name = "selectMarks";
            marksSelect.classList.add("selectMarks");
            marksDiv.appendChild(marksSelect);

            const defaultOption = document.createElement('option');
            defaultOption.textContent = "Изберете оценка";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            marksSelect.appendChild(defaultOption);

            // Append each mark to the select element
            marks.forEach(mark => {
                const option = document.createElement('option');
                option.textContent = mark.mark_value;
                option.value = mark.mark_id;
                marksSelect.appendChild(option);
            });

            // Append the marksDiv to the form
            form.appendChild(marksDiv);
            marksDiv.appendChild(document.createElement("br"));

            // Create and append the submit button to the marksDiv
            createSubmitButton(marksDiv);

        } catch (error) {
            console.error('Error creating marks select:', error);
        }
    }

    function createSubmitButton(parentDiv) {
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Добавяне на оценка';
        submitButton.classList.add('submit');
        parentDiv.appendChild(submitButton);

        return submitButton;
    }
});