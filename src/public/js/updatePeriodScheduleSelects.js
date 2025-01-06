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
        const form = document.querySelector("#updatePeriodScheduleForm");
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

            const form = document.querySelector("#updatePeriodScheduleForm");

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
        // Add period type select after subject select
    }

    async function createPeriodTypeSelect(subjectDiv) {
        try {
            const response = await fetch(`/admin/get/periodTypes`);
            if (!response.ok) {
                throw new Error("Failed to fetch period types");
            }

            const periodTypes = await response.json();
            console.log("Fetched period types:", periodTypes); // Debugging log

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

            // Insert the period type select right after the subject div
            subjectDiv.insertAdjacentElement('afterend', periodTypeDiv);
            periodTypeSelect.addEventListener("change", handlePeriodTypeChange);
        } catch (error) {
            console.error("Error fetching or creating period types:", error);
        }
    }




    async function createPeriodInput() {
        const form = document.querySelector("#updatePeriodScheduleForm");
        const existingPeriodDiv = form.querySelector('.formInput.period');

        if (existingPeriodDiv) existingPeriodDiv.remove();

        const selectPeriodType = document.querySelector(".selectPeriodType").value;
        console.log("Period type: ", selectPeriodType);
        const selectSubject = document.querySelector("#selectSubject").value;
        console.log("Group half subject id: ", selectSubject);

        try {
            const response = await fetch(`/admin/get/period`, {
                method: "POST",
                body: JSON.stringify({ groupHalfSubjectId: selectSubject, periodType: selectPeriodType }),
                headers: { 'Content-Type': 'application/json' }
            });

            const period = await response.json();
            fetchAndCreateSubjectSelect(subjectsHalf);
            console.log(period);
            const periodDiv = document.createElement("div");
            periodDiv.classList.add("formInput", "period");

            createTimeInputs(periodDiv, period);
            await createWeekdaySelect(periodDiv, period);
            await createRoomSelect(periodDiv, period);
            await createLecturerSelect(periodDiv, period);
            createSubmitButton(periodDiv);

            form.appendChild(periodDiv);
        } catch (error) {
            console.error('Error fetching period:', error);
        }
    }

    async function createWeekdaySelect(parentDiv, period) {
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
                console.log("period.weekday_id_fk:", period.weekday_id_fk);
                if (period.weekday_id_fk == weekday.weekday_id) {
                    option.selected = true;
                }
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
    // async function createRoomSelect(parentDiv) { /* Implementation here */ }
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
        submitButton.textContent = 'Промяна на часа';
        submitButton.classList.add('submit');
        // submitButton.style.display = 'none'; // Initially hidden
        // submitButton.addEventListener('click', handleSubmit);
        parentDiv.appendChild(submitButton);

        // Return the submitButton element so it can be used elsewhere
        return submitButton;
    }

    function handlePeriodTypeChange(event) {
        const selectedSubjectId = event.target.value;
        if (selectedSubjectId) {
            createPeriodInput(selectedSubjectId);
        } else {
            const existingPeriodDiv = document.querySelector('.formInput.period');
            if (existingPeriodDiv) existingPeriodDiv.remove();
        }
    }
});
