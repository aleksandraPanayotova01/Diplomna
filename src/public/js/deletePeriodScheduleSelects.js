document.addEventListener("DOMContentLoaded", async function () {
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
            console.error("Error fetching group halves:", error);
            return [];
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
        createGroupHalfInputs(groupHalfs);

        const subjectSelect = document.querySelector(".subject");
        const periodDiv = document.querySelector(".period");

        if (subjectSelect != null) {
            subjectSelect.remove();
        }

        if (periodDiv != null) {
            periodDiv.remove();
        }
    });

    function createGroupHalfInputs(groupHalfs) {
        const form = document.querySelector("#deletePeriodScheduleForm");
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
            console.log("selectedGroupHalfId", selectedGroupHalfId);
            fetchAndCreateSubjectSelect(selectedGroupHalfId);
        });
    }

    async function fetchAndCreateSubjectSelect(selectedGroupHalfId) {
        try {
            const response = await fetch(`/admin/get/subjectsHalf`, {
                method: "POST",
                body: JSON.stringify({ groupHalfId: selectedGroupHalfId }),
                headers: { 'Content-Type': 'application/json' }
            });

            const subjectsHalf = await response.json();
            console.log(subjectsHalf);

            const form = document.querySelector("#deletePeriodScheduleForm");

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
                subjectOption.value = subjectHalf.group_half_subject_id;
                subjectSelect.appendChild(subjectOption);
            }

            form.appendChild(subjectDiv);


            subjectSelect.addEventListener('change', createPeriodTypeSelect(subjectDiv));

        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }

    async function createPeriodTypeSelect(subjectDiv) {
        try {
            const response = await fetch(`/admin/get/periodTypes`);
            if (!response.ok) {
                throw new Error("Failed to fetch period types");
            }

            const periodTypes = await response.json();
            console.log("Fetched period types:", periodTypes);

            if (!Array.isArray(periodTypes) || periodTypes.length === 0) {
                console.warn("No period types available.");
                return;
            }

            const periodTypeDiv = document.createElement("div");
            periodTypeDiv.classList.add("formInput", "periodType");

            const labelPeriodTypeSelect = document.createElement('label');
            labelPeriodTypeSelect.textContent = "Вид занятие";
            periodTypeDiv.appendChild(labelPeriodTypeSelect);

            const periodTypeSelect = document.createElement('select');
            periodTypeSelect.name = "period_type";
            periodTypeSelect.classList.add("selectPeriodType");
            periodTypeDiv.appendChild(periodTypeSelect);

            const defaultOption = document.createElement('option');
            defaultOption.textContent = "Изберете вид занятие";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            periodTypeSelect.appendChild(defaultOption);

            periodTypes.forEach(periodType => {
                const option = document.createElement('option');
                option.textContent = periodType.period_type_name;
                option.value = periodType.period_type_id;
                periodTypeSelect.appendChild(option);
            });

            subjectDiv.insertAdjacentElement('afterend', periodTypeDiv);
            periodTypeSelect.addEventListener("change", handlePeriodTypeChange(periodTypeDiv));
        } catch (error) {
            console.error("Error fetching or creating period types:", error);
        }
    }



    function createSubmitButton(parentDiv) {
        const submitButton = document.createElement('button');
        console.log('Creating submit button:', submitButton);
        submitButton.textContent = 'Изтриване';
        submitButton.classList.add('submit');
        parentDiv.appendChild(submitButton);

        return submitButton;
    }

    function handlePeriodTypeChange(periodTypeDiv) {
        createSubmitButton(periodTypeDiv);

    }
});
