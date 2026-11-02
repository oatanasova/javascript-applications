const url = 'http://localhost:3030/jsonstore/collections/students';
const output = document.querySelector('#results tbody');

document.getElementById('form').addEventListener('submit', onSubmit);

async function onLoad() {
    output.replaceChildren();
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Something went wrong');
        }
        const data = await response.json();

        Object.values(data).forEach(student => {
            const tr = document.createElement('tr');
            const firstName = document.createElement('td');
            firstName.textContent = student.firstName;

            const lastName = document.createElement('td');
            lastName.textContent = student.lastName;

            const facultyNumber = document.createElement('td');
            facultyNumber.textContent = student.facultyNumber;

            const grade = document.createElement('td');
            grade.textContent = student.grade;

            tr.append(firstName, lastName, facultyNumber, grade);
            output.appendChild(tr);
        });
    } catch (error) {
        console.error(error.message);
    }
}

async function onSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const formData = new FormData(form);

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const facultyNumber = formData.get('facultyNumber');
    const grade = formData.get('grade');


    if (!firstName || !lastName || !facultyNumber || !grade) {
        return;
    }

    const item = { firstName, lastName, facultyNumber, grade };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        if (!response.ok) {
            throw new Error("Could not send");
        }

    } catch (error) {
        console.error(error.message)
    }
    await onLoad();
    form.reset();
}

onLoad();