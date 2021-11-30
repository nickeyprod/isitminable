
const changeVisibility = async (p_id, val, e) => {
    const changedData = {_id: p_id, hidden:  val == "0" ? true : false, action: "vis"}
    const resp = await fetchDataFrom("/panel/rm-hide-project", "POST", changedData);

    if (resp.result == "ERROR") {
        window.alert("Сервер вернул ошибку: " + resp.message);
        e.value = val == "0" ? "1" : "0";
        return;
    } else if (resp.result == "OK") {
        window.alert("Видимость проекта успешно изменена!");
        e.value = val == "0" ? "0" : "1";
        return;
    } else {
        window.alert("Неправильный ответ от сервера!");
        e.value = val == "0" ? "1" : "0";
        return;
    }
};

const removeProject = async (p_id, e, p_name) => {
    const rmData = {_id: p_id, action: "rm" };

    if (!confirm("Вы действительно хотите удалить проект " + p_name + "?")) {
        return;
    }

    const resp = await fetchDataFrom("/panel/rm-hide-project", "POST", rmData);

    if (resp.result == "ERROR") {
        window.alert("Сервер вернул ошибку: " + resp.message);
        return;
    } else if (resp.result == "OK") {
        window.alert("Проект успешно удалён!");
        e.remove();
        return;
    } else {
        window.alert("Неправильный ответ от сервера!");
        return;
    }
};
