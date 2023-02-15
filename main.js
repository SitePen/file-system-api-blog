import "./style.css";

const list = document.getElementById("list");
const btn = document.getElementById("bntAdd");
const btnLoad = document.getElementById("bntLoad");
const btnSave = document.getElementById("bntSave");
const input = document.getElementById("inputDetails");

const options = {
    types: [
        {
            description: "Notes File",
            accept: {
                "application/json": [".json"],
            },
        },
    ]
};

btnLoad.addEventListener("click", () => {
    loadNotes();
});

btnSave.addEventListener("click", () => {
    saveNotes();
});

btn.addEventListener("click", () => {
    if (input.value?.length < 2) return;
    const note = createNote({ name: input.value, content: "" });
    note && list.appendChild(note);
    input.value = "";
});

let fileHandle;

async function loadNotes() {
    [fileHandle] = await showOpenFilePicker(options);
    if (fileHandle.kind === "file") {
        const file = await fileHandle.getFile();
        const text = await file.text();
        const data = JSON.parse(text);
        const { notes } = data;
        for (let note of notes) {
            const elem = createNote(note);
            elem && list.appendChild(elem);
        }
    }
}

async function saveNotes() {
    const elements = [...document.querySelectorAll("details")];
    const notes = [];
    for (let elem of elements) {
        const summElem = elem.querySelector("summary");
        const contentElem = elem.querySelector("textarea");
        let note = {
            name: summElem.innerText,
            content: contentElem.value
        };
        notes.push(note);
    }
    const writable = await fileHandle.createWritable();
    const values = JSON.stringify({ notes: notes });
    await writable.write(values);
    await writable.close();
}

function createNote(note) {
    if (isDuplicate(note.name)) return;
    const detailsElement = document.createElement("details");
    const summary = document.createElement("summary");
    const content = document.createElement("textarea");
    content.classList.add("notes-value");
    summary.innerText = note.name;
    content.innerText = note.content;
    detailsElement.appendChild(summary);
    detailsElement.appendChild(content);
    detailsElement.setAttribute("data-content", note.name);

    return detailsElement;
}

function isDuplicate(content) {
    const count = [...document.querySelectorAll("summary")].filter((element) => {
        return element.innerText === content;
    }).length;

    return count > 0;
}

