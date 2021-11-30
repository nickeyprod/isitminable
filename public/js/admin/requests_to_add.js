
const removeRequest = async (id, e, name) => {

    if (!id || id == "") {
        window.alert("Ошибка, отсутствует ID элемента");
        return;
    } else if (!e) {
        window.alert("Ошибка, отсутсвует элемент");
        return;
    }
    if (!confirm(`Вы действительно хотите удалить данный запрос: ${name}`)) {
        return;
    }
    const resp = await fetchDataFrom("/panel/requests", "POST", {_id: id});

    if (resp.result == "ERROR") {
        window.alert("Сервер вернул ошибку: " + resp.message);
        return;
    } else if (resp.result == "OK") {
        window.alert("Запрос был успешно удалён!");
        e.remove();
        return;
    } else {
        window.alert("Неправильный ответ от сервера!");
        return;
    }
};