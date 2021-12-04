window.onload = () => {
    const searchInpt = document.getElementById("search-inpt");
    const searchResults = document.getElementById("s-rs");
    const preloader = document.getElementById("preloader"); 

    const trnsl = { "vcard": "Video Card", "cpu": "CPU", "ssd": "SSD" };

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
        let minableProjDiv, pName, pTicker, a, pLinkA;
        for (let i = 0; i < results.length; i++) {
            minableProjDiv = document.createElement("div");
            pName = document.createElement("div");
            pTicker = document.createElement("div");
            pType = document.createElement("div");
            pLink = document.createElement("div");
            pLogo = document.createElement("img");
            a = document.createElement("a");

            minableProjDiv.className = "minable-project";
            pName.className = "p-name";
            pTicker.className = "p-ticker";
            pType.className = "p-mtype";
            pLink.className = "p-link";

            pLogo.className = "project-logo";
            pLogo.src = "/imgs/" + results[i].name + "_" + results[i].ticker + ".png"

            a.href = `/how-to-mine?coin=${results[i].name}`;
            a.title = `Узнать как майнить ${results[i].name}`;
            a.textContent = results[i].name;
            
            if (results[i].link && results[i].link != "") {
                pLinkA = document.createElement("a");
                pLinkA.href = results[i].link;
                pLinkA.target = "_blank";
                pLinkA.textContent = results[i].link;
            } else {
                pLinkA = document.createElement("span");
                pLinkA.textContent = "-";
            }

            pName.appendChild(pLogo);
            pName.appendChild(a);
            pLink.appendChild(pLinkA);

            let img_mType;
            for (let a = 0; a < results[i].minable_via.length; a++) {
                img_mType = document.createElement("img");
                img_mType.src = `/imgs/mining_types/${results[i].minable_via[a]}.png`;
                img_mType.alt = `${trnsl[results[i].minable_via[a]]} icon`;
                img_mType.title = `${trnsl[results[i].minable_via[a]]} Mining`;
                pType.appendChild(img_mType);
            }

            if (results[i].minable_via.length == 0) {
                const sp = document.createElement("span");
                sp.textContent = "??";
                sp.title = "Тип майнинга неизвестен";
                pType.appendChild(sp);
            }

            a.textContent = results[i].name;
            pTicker.textContent = results[i].ticker;

            minableProjDiv.appendChild(pName);
            minableProjDiv.appendChild(pTicker);
            minableProjDiv.appendChild(pType);
            minableProjDiv.appendChild(pLink);
            searchResults.appendChild(minableProjDiv);
        }
    };
}