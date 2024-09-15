document.addEventListener('DOMContentLoaded', async () => {
    async function fetchSubjects() {
        try {
            const response = await fetch(`/lecturer/get/subjects`);
            const subjects = await response.json();
            populateSubjectSelect('selectSubject', subjects);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }
    await fetchSubjects()

    async function fetchGroups(subject_id) {
        try {
            const response = await fetch(`/lecturer/get/groups/${subject_id}`);
            const groups = await response.json();
            console.log("Groups:", groups);
            populateGroupSelect('selectGroup', groups);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    }



    async function fetchFacultyNumbers(groupHalf) {
        // const subjectId = document.getElementById('selectSubject').value;
        // if (!subjectId) return;

        try {
            const response = await fetch(`/lecturer/get/groupfacNums/${groupHalf}`);
            const facultyNumbers = await response.json();
            populateFacultyNumsSelect('selectFacultyNumber', facultyNumbers);
        } catch (error) {
            console.error('Error fetching faculty numbers:', error);
        }
    }

    function populateFacultyNumsSelect(selectId, items) {
        const select = document.getElementById(selectId);
        console.log(select);
        select.innerHTML = '<option value="">Изберете ФН</option>';

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.student_fac_num; // Adjust according to your data structure
            option.textContent = item.student_fac_num; // Adjust according to your data structure
            select.appendChild(option);
        });

    }
    function populateGroupSelect(selectId, items) {
        const select = document.getElementById(selectId);
        console.log(select);
        select.innerHTML = '<option value="">Изберете група</option>';

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.group_half_id; // Adjust according to your data structure
            option.textContent = item.group_number + item.group_half_letter; // Adjust according to your data structure
            select.appendChild(option);
        });
        select.addEventListener("change", async function () {
            // console.log(select.value);
            await fetchFacultyNumbers(select.value);

        })
    }
    async function populateSubjectSelect(selectId, items) {
        const select = document.getElementById(selectId);
        console.log(select);
        select.innerHTML = '<option value="">Изберете предмет</option>';

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.subject_id; // Adjust according to your data structure
            option.textContent = item.subject_name; // Adjust according to your data structure
            select.appendChild(option);
        });
        select.addEventListener("change", async function () {
            // console.log(select.value);
            await fetchGroups(select.value);

        })
    }

})