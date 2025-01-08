document.addEventListener("DOMContentLoaded", async function () {
    async function createWeekdaySelect(parentDiv) {
        console.log("INSIDE WEEKDAY SELECT");
        try {
            const response = await fetch(`/admin/get/weekdays`);
            const weekdays = await response.json();
            console.log(weekdays);
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
  
    window.onload = function () {
        createWeekdaySelect(document.getElementById('weekdayContainer'));
        createRoomSelect(document.getElementById('roomContainer'));
    }
});