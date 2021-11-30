window.onload = () => {
    const saveProjBtn = document.getElementById("save-proj-btn");
    const projectName = document.getElementById("proj-name-inpt");
    const projectTicker = document.getElementById("proj-ticker-inpt");
    const projectLink = document.getElementById("proj-link-inpt");
    const projectId = document.getElementById("proj-id-inpt");


    saveProjBtn.onclick = async () => {
        saveProjBtn.setAttribute("disabled", "true");

        if (!projectId.value || projectId.value == "" ) {
            addProjBtn.removeAttribute("disabled");
            window.alert("Отсутствует ID проекта!");
            return;
        } else if (!projectName.value || projectName.value == "") {
            addProjBtn.removeAttribute("disabled");
            window.alert("Поле 'Название' не может быть пустым");
            return;
        } else if (!projectTicker.value || projectTicker.value == "") {
            addProjBtn.removeAttribute("disabled");
            window.alert("Поле 'Тикер' не может быть пустым");
            return;
        }

        const newProjectData = {
            _id: projectId.value,
            name: projectName.value,
            ticker: projectTicker.value,
            link: projectLink.value
        };

        const resp = await fetchDataFrom("/panel/edit-project", "POST", newProjectData);

        if (resp.result == "ERROR") {
            window.alert("Сервер вернул ошибку: " + resp.message);
            saveProjBtn.removeAttribute("disabled");
            return;
        } else if (resp.result == "OK") {
            window.alert("Проект был успешно обновлен и сохранён!");
            saveProjBtn.removeAttribute("disabled");
            return;
        } else {
            window.alert("Неправильный ответ от сервера!");
            saveProjBtn.removeAttribute("disabled");
            return;
        }
    };
}