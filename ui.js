function switchTab(element) {
    let tab = element.id.replace("Button", "")
    let tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.add("closed")
    };

    document.getElementById(tab + "Tab").classList.remove("closed")
    document.getElementById("tabTitle").innerText = capitalize(tab);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}