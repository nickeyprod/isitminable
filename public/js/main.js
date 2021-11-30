window.onload = () => {
    const searchInpt = document.getElementById("search-inpt");
    const searchResults = document.getElementById("s-rs");
    const preloader = document.getElementById("preloader"); 

    searchInpt.oninput = async () => {
        showPreloader();
        searchResults.innerHTML = "";

        const nameOrTicker = searchInpt.value;

        const resp = await fetchDataFrom("/", "POST", { nameOrTicker });

        if (resp.result == "ERROR") {
            hidePreloader();
            console.log("Server responded with an error: " + resp.message);
            return;
        } else if (resp.message == "OK") {
            fillResults(resp.result);
            hidePreloader();
            return;
        } else {
            hidePreloader();
            console.log("Server responded with an error")
            return;
        }
    };

    const showPreloader = () => {
        preloader.style.display = "block";
    };
    
    const hidePreloader = () => {
        preloader.style.display = "none";
    };

    const fillResults = (results) => {
        let minableProjDiv, pName, pTicker, pDesc, img, a;
        for (let i = 0; i < results.length; i++) {
            minableProjDiv = document.createElement("div");
            pName = document.createElement("div");
            pTicker = document.createElement("div");
            pDesc = document.createElement("div");
            img = document.createElement("img");
            a = document.createElement("a");

            minableProjDiv.className = "minable-project";
            pName.className = "p-name";
            pTicker.className = "p-ticker";
            pDesc.className = "p-desc";

            img.className = "project-logo";
            img.src = "/imgs/" + results[i].name + "_" + results[i].ticker + ".png"

            a.href = `/how-to-mine?coin=${results[i].name}`;
            a.title = `Узнать как майнить ${results[i].name}`;
            a.textContent = results[i].name;

            pName.appendChild(img);
            pName.appendChild(a);

            a.textContent = results[i].name;
            pTicker.textContent = results[i].ticker;
            pDesc.textContent = results[i].description;

            minableProjDiv.appendChild(pName);
            minableProjDiv.appendChild(pTicker);
            minableProjDiv.appendChild(pDesc);
            searchResults.appendChild(minableProjDiv);
        }
    };
}