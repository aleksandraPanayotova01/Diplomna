document.addEventListener("DOMContentLoaded", async function () {
    async function createWeekdaySelect(parentDiv) {
        try {
            const response = await fetch(`/admin/get/weekdays`);
            const weekdays = await response.json();

            const weekdayDiv = document.createElement("div");
            weekdayDiv.classList.add("formInput");

            const labelWeekdaySelect = document.createElement('label');
            labelWeekdaySelect.textContent = "Ден от седмицата";
            labelWeekdaySelect.setAttribute('for', 'weekday');
            weekdayDiv.appendChild(labelWeekdaySelect);

            const weekdaySelect = document.createElement('select');
            weekdaySelect.name = "weekday";
            weekdaySelect.id = "weekday";
            weekdaySelect.classList.add("selectWeekday");
            weekdaySelect.required = true;
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
            roomDiv.classList.add("formInput")

            const labelRoomSelect = document.createElement('label');
            labelRoomSelect.textContent = "Стая";
            roomDiv.appendChild(labelRoomSelect);

            const roomSelect = document.createElement('select');
            roomSelect.name = "room";
            roomSelect.classList.add("selectRoom");
            roomSelect.required = true;
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
    // async function createLecturerSubjectsSelect(parentDiv) {
    //     try {
    //         const response = await fetch(`/lecturer/get/subjects`);
    //         const subjects = await response.json();

    //         const subjectsDiv = document.createElement("div");
    //         subjectsDiv.classList.add("formInput")

    //         const labelSubjectsSelect = document.createElement('label');
    //         labelSubjectsSelect.textContent = "Предмет";
    //         subjectsDiv.appendChild(labelSubjectsSelect);

    //         const subjectsSelect = document.createElement('select');
    //         subjectsSelect.name = "subject";
    //         subjectsSelect.classList.add("selectSubject");
    //         subjectsSelect.required = true;
    //         subjectsDiv.appendChild(subjectsSelect);

    //         const defaultOption = document.createElement('option');
    //         defaultOption.textContent = "Изберете предмет";
    //         defaultOption.value = "";
    //         defaultOption.disabled = true;
    //         defaultOption.selected = true;
    //         subjectsSelect.appendChild(defaultOption);

    //         subjects.forEach(subject => {
    //             const option = document.createElement('option');
    //             option.textContent = subject.subject_name;
    //             option.value = subject.subject_abbreviation;
    //             subjectsSelect.appendChild(option);
    //         });

    //         parentDiv.appendChild(subjectsDiv);
    //     } catch (error) {
    //         console.error('Error fetching subjects:', error);
    //     }
    // }
    window.onload = function () {
        createWeekdaySelect(document.getElementById('weekdayContainer'));
        createRoomSelect(document.getElementById('roomContainer'));
        // createLecturerSubjectsSelect(document.getElementById('subjectsContainer'));
    }
});