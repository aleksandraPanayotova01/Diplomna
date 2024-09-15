document.addEventListener("DOMContentLoaded", async function () {
    const getGroupHalfs = async (specialty, course) => {
        console.log(course)
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

        console.log(groupHalfs);
    });

    function createGroupHalfInputs(groupHalfs) {
        const form = document.querySelector("#addPeriodScheduleForm");

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

        groupNumberSelect.addEventListener("change", function () {
            const selectedGroupNumber = groupNumberSelect.value;
            createGroupHalfInput(groupHalfs, selectedGroupNumber);
        });
    }

    function createGroupHalfInput(groupHalfs, selectedGroupNumber) {
        const form = document.querySelector("#addPeriodScheduleForm");

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

            groupHalfSelect.addEventListener("change", function () {
                const selectedGroupHalfId = groupHalfSelect.value;
                fetchAndCreateSubjectSelect(selectedGroupHalfId);
            });
        }
    }

    function createSubjectSelect(subjectsHalf) {
        const form = document.querySelector("#addPeriodScheduleForm");

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
        subjectSelect.addEventListener('change', handleSubjectChange);

    }

    async function createPeriodInput(subjectId) {
        const form = document.querySelector("#addPeriodScheduleForm");

        // Remove existing period input if it exists
        const existingPeriodDiv = form.querySelector('.formInput.period');
        if (existingPeriodDiv) existingPeriodDiv.remove();

        // Create and append the period input fields
        const periodDiv = document.createElement("div");
        periodDiv.classList.add("formInput", "period");
        //Create start period and end period inputs
        createTimeInputs(periodDiv);
        // Create weekday select
        await createWeekdaySelect(periodDiv);

        // Create room select
        await createRoomSelect(periodDiv);

        // Create lecturer select
        await createLecturerSelect(periodDiv);

        // Create period type select
        await createPeriodTypeSelect(periodDiv);

        createSubmitButton(periodDiv);


        form.appendChild(periodDiv);

    }

    async function createWeekdaySelect(parentDiv) {
        try {
            const response = await fetch(`/admin/get/weekdays`);
            const weekdays = await response.json();

            const weekdayDiv = document.createElement("div");
            weekdayDiv.classList.add("formField");

            const labelWeekdaySelect = document.createElement('label');
            labelWeekdaySelect.textContent = "Ден от седмицата";
            weekdayDiv.appendChild(labelWeekdaySelect);

            const weekdaySelect = document.createElement('select');
            weekdaySelect.name = "weekday";
            weekdaySelect.classList.add("selectWeekday");
            weekdayDiv.appendChild(weekdaySelect);

            const defaultOption = document.createElement('option');
            defaultOption.textContent = "Изберете ден";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            weekdaySelect.appendChild(defaultOption);

            weekdays.forEach(weekday => {
                const option = document.createElement('option');
                option.textContent = weekday.weekday_name;
                option.value = weekday.weekday_id;
                weekdaySelect.appendChild(option);
            });

            parentDiv.appendChild(weekdayDiv);
        } catch (error) {
            console.error('Error fetching weekdays:', error);
        }
    }

    async function createRoomSelect(parentDiv) {
        try {
            const response = await fetch(`/admin/get/rooms`);
            const rooms = await response.json();

            const roomDiv = document.createElement("div");
            roomDiv.classList.add("formField");

            const labelRoomSelect = document.createElement('label');
            labelRoomSelect.textContent = "Стая";
            roomDiv.appendChild(labelRoomSelect);

            const roomSelect = document.createElement('select');
            roomSelect.name = "room";
            roomSelect.classList.add("selectRoom");
            roomDiv.appendChild(roomSelect);

            const defaultOption = document.createElement('option');
            defaultOption.textContent = "Изберете стая";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            roomSelect.appendChild(defaultOption);

            rooms.forEach(room => {
                const option = document.createElement('option');
                option.textContent = `${room.room_number} ${room.building_abbreviation}`;
                option.value = room.room_id;
                roomSelect.appendChild(option);
            });

            parentDiv.appendChild(roomDiv);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    }

    async function createLecturerSelect(parentDiv) {
        try {
            const response = await fetch(`/admin/get/lecturers`);
            const lecturers = await response.json();

            const lecturerDiv = document.createElement("div");
            lecturerDiv.classList.add("formField");

            const labelLecturerSelect = document.createElement('label');
            labelLecturerSelect.textContent = "Преподавател";
            lecturerDiv.appendChild(labelLecturerSelect);

            const lecturerSelect = document.createElement('select');
            lecturerSelect.name = "lecturer";
            lecturerSelect.classList.add("selectLecturer");
            lecturerDiv.appendChild(lecturerSelect);

            const defaultOption = document.createElement('option');
            defaultOption.textContent = "Изберете преподавател";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            lecturerSelect.appendChild(defaultOption);

            lecturers.forEach(lecturer => {
                const option = document.createElement('option');
                option.textContent = `${lecturer.title_name} ${lecturer.name} ${lecturer.surname}`;
                option.value = lecturer.lecturer_id;
                lecturerSelect.appendChild(option);
            });

            parentDiv.appendChild(lecturerDiv);
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    }

    async function createPeriodTypeSelect(parentDiv) {
        try {
            const response = await fetch(`/admin/get/periodTypes`);
            const periodTypes = await response.json();

            const periodTypeDiv = document.createElement("div");
            periodTypeDiv.classList.add("formField");

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

            parentDiv.appendChild(periodTypeDiv);
        } catch (error) {
            console.error('Error fetching period types:', error);
        }
    }
    const createTimeInputs = (parentDiv) => {
        // Create period start time input
        const startTimeDiv = document.createElement('div');
        startTimeDiv.classList.add('timeInput');
        const labelStartTime = document.createElement('label');
        labelStartTime.textContent = 'Начален час';
        const inputStartTime = document.createElement('input');
        inputStartTime.type = 'time';
        inputStartTime.name = 'period_start_time';
        inputStartTime.required = true;
        startTimeDiv.appendChild(labelStartTime);
        startTimeDiv.appendChild(inputStartTime);
        parentDiv.appendChild(startTimeDiv);

        // Create period end time input
        const endTimeDiv = document.createElement('div');
        endTimeDiv.classList.add('timeInput');
        const labelEndTime = document.createElement('label');
        labelEndTime.textContent = 'Краен час';
        const inputEndTime = document.createElement('input');
        inputEndTime.type = 'time';
        inputEndTime.name = 'period_end_time';
        endTimeDiv.appendChild(labelEndTime);
        endTimeDiv.appendChild(inputEndTime);
        parentDiv.appendChild(endTimeDiv);
    }
    function createSubmitButton(parentDiv) {
        const submitButton = document.createElement('button');
        console.log('Creating submit button:', submitButton);
        submitButton.textContent = 'Добавяне на часа';
        submitButton.classList.add('submit');
        // submitButton.style.display = 'none'; // Initially hidden
        // submitButton.addEventListener('click', handleSubmit);
        parentDiv.appendChild(submitButton);

        // Return the submitButton element so it can be used elsewhere
        return submitButton;
    }

    function handleSubjectChange(event) {
        const selectedSubjectId = event.target.value;
        if (selectedSubjectId) {
            createPeriodInput(selectedSubjectId);
        } else {
            // Remove existing period inputs if subject is deselected
            const existingPeriodDiv = document.querySelector('.formInput.period');
            if (existingPeriodDiv) existingPeriodDiv.remove();
        }
    }



});
