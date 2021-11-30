window.onload = () => {
    const addProjBtn = document.getElementById("add-proj-btn");
    const projectName = document.getElementById("proj-name-inpt");
    const projectTicker = document.getElementById("proj-ticker-inpt");
    const projectLink = document.getElementById("proj-link-inpt");

    addProjBtn.onclick = async () => {
        addProjBtn.setAttribute("disabled", "true");

        if (!projectName.value || projectName.value == "") {
            addProjBtn.removeAttribute("disabled");
            window.alert("Поле 'Название' не может быть пустым");
            return;
        } else if (!projectTicker.value || projectTicker.value == "") {
            addProjBtn.removeAttribute("disabled");
            window.alert("Поле 'Тикер' не может быть пустым");
            return;
        }

        const newProjectData = {
            name: projectName.value,
            ticker: projectTicker.value,
            link: projectLink.value
        };

        const resp = await fetchDataFrom("/panel/add-project", "POST", newProjectData);

        if (resp.result == "ERROR") {
            window.alert("Сервер вернул ошибку: " + resp.message);
            addProjBtn.removeAttribute("disabled");
            return;
        } else if (resp.result == "OK") {
            window.alert("Проект был успешно добавлен!");
            addProjBtn.removeAttribute("disabled");
            clearFields();
            return;
        } else {
            window.alert("Неправильный ответ от сервера!");
            addProjBtn.removeAttribute("disabled");
            return;
        }
    };

    const clearFields = () => {
        projectName.value = "";
        projectTicker.value = "";
        projectLink.value = "";
    };
}