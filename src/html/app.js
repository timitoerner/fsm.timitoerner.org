// Function to move content from "Text" column to "Art" column
function moveTextToArtColumn() {
  // Get all rows in the table (excluding the header row)
  const rows = document.querySelectorAll('.mon_list tr.list');

  rows.forEach(row => {
    // Get all cells (td) in the current row
    const cells = row.querySelectorAll('td');

    // Skip rows that don't have the expected number of columns (in case of missing data)
    if (cells.length < 7) return;

    // Move the content from the "Text" column (last cell) to the "Art" column (second-to-last cell)
    const textContent = cells[cells.length - 1].innerHTML;
    cells[cells.length - 2].innerHTML += "; " + textContent;

    // Optionally, clear the content in the "Text" column
    cells[cells.length - 1].remove(); //style = "display: none;";
  });
}

function listTeacher() {
  let allTables = document.getElementsByClassName("mon_list");

  for (let i = 0; i < allTables.length; i++) {
    let teacherParagraph = document.createElement("p");

    let cells = document.querySelectorAll(".mon_list tr td");

    for (let j = 0; j < cells.length; j++) {
      if (j > allTables.item(i).firstElementChild.childElementCount * 6) break;
      if (!(j % 6)) {
        let cell = cells.item(j + 2);

        if (teacherParagraph.innerHTML.slice(-cell.innerHTML.length - 2, teacherParagraph.innerHTML.length) == cell.innerHTML + ", ") continue;

        teacherParagraph.innerHTML += cell.innerHTML + ", ";
      }
    }

    allTables.item(i).before(teacherParagraph);

  }
}

function listSpecifiedClasses() {
  if (window.location.search == "") return;

  const urlParams = new URLSearchParams(window.location.search);

  const rows = document.querySelectorAll('.mon_list tr.list');

  rows.forEach(row => {
    if (urlParams.has(row.firstElementChild.innerHTML) || row.firstElementChild.nodeName == "TH") return;
    row.remove();
  });
}

function replaceText() {
  document.body.innerHTML = document.body.innerHTML.replace(/Beginn in Jahrgangsklasse/gi, "ab Jg.");
  document.body.innerHTML = document.body.innerHTML.replace(/Beginn in Jahrgangsstufe/gi, "ab Jg.");
  document.body.innerHTML = document.body.innerHTML.replace(/Naturwissenschaften/gi, "NW");
  document.body.innerHTML = document.body.innerHTML.replace(/Sozialwissenschaften/gi, "SOWI");
  document.body.innerHTML = document.body.innerHTML.replace(/Arbeitsgemeinschaft/gi, "AG");
  document.body.innerHTML = document.body.innerHTML.replace(/(\d) - (\d)/gi, "$1-$2");
}

window.onload = function() {
  moveTextToArtColumn();
  listSpecifiedClasses();
  replaceText();
  //listTeacher();
};
