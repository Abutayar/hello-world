const fs = require("fs");
const ignore_files_folder = [
    ".github",
    ".editorconfig",
    "CONTRIBUTING.md",
    ".gitignore",
    "README.md",
    "update_list.py",
    "list_language.js",
    "LICENSE",
];

let count = 0;
let tableContent = "";

const list_dir = fs
    .readdirSync(__dirname)
    .filter((each) => !ignore_files_folder.includes(each));

for (let i = 0; i < list_dir.length; i++) {
    const dir = list_dir[i];
    const filelist = fs.readdirSync(__dirname + "/" + dir);
    for (let j = 0; j < filelist.length; j++) {
        const filename = filelist[j];
        const filepath = `${__dirname}/${dir}/${filename}`;
        try {
            count++;
            const fileSize = fs.statSync(filepath).size + " bytes";
            const language = filename.split(".")[0];
            const ext = filename.split(".")[1];
            const r_path = `${encodeURIComponent(dir)}/${filename}`;
            tableContent +=
                tableRow(count, filename, r_path, language, ext, fileSize);
        } catch (e) {
            console.log("Exception");
        }
    }
}

const readmePath = __dirname + "\\README.md";
const readmeContent = fs.readFileSync(readmePath).toString("utf8");
const start_replace = "^<!--- Table List start-->.*";
const end_replace = "<!--- Table List end-->$";
const regex = new RegExp(start_replace + end_replace, "ms");

fs.writeFileSync(
    readmePath,
    readmeContent.replace(regex, template(tableContent))
);

function tableRow(no, name, dir, language, extension = "NA", size = "NA") {
    return `|${no}|[${name}](${dir})|${language}|${extension}|${size}|\n`;
}

function template(content) {
return `<!--- Table List start-->

|No.|Filename|Language|Extension|Size|
|---|--------|--------|---------|----|
${content}

<!--- Table List end-->`;
}
