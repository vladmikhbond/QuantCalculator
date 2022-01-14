function makeLearningButtons() {
    for (let partIdx = 0; partIdx < DATA.length; partIdx++) {
        let btn = document.createElement("button");
        btn.id="card" + partIdx;
        btn.type = "button";
        btn.className = "btn btn-secondary autogen"; 
        btn.innerHTML = DATA[partIdx].h;
        
        btn.onclick = () => switchTo(partIdx);
        document.getElementById("buttonsDiv").appendChild(btn);
    }
}

function switchTo(partIdx) 
{
    cardTitle.innerHTML = DATA[partIdx].h;
    let dataT = DATA[partIdx].t.replace( /<<(.):(.*)>>/g,
        '<span class="nav-link" onclick="switchToPartSection('+ partIdx +',\'$1\')">$2</span>');
    cardText.innerHTML = dataT;
    createDivsFromData(DATA[partIdx].a);
    LEARNING_STATE = partIdx-1;
    refresh();
}

function switchToPartSection(partIdx, letter) {
    createDivsFromData(DATA[partIdx][letter]);
    refresh();
}