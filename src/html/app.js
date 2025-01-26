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
  document.body.innerHTML = document.body.innerHTML.replace(/Stunde/g, "St.");
  document.body.innerHTML = document.body.innerHTML.replace(/Art/g, "Info");
  document.body.innerHTML = document.body.innerHTML.replace(/Vertreter/g, "Ersatz");
  document.body.innerHTML = document.body.innerHTML.replace(/eigenverantwortliches/g, "selber");
  document.body.innerHTML = document.body.innerHTML.replace(/Klasse\(n\)/g, "Klasse");
  document.body.innerHTML = document.body.innerHTML.replace(/Deutsch als Fremdsprache/gi, "Deutsch Fremd.");
  document.body.innerHTML = document.body.innerHTML.replace(/(\d) - (\d)/gi, "$1-$2");
}

function _isTableOverflow() {
  return document.querySelector('.mon_list').clientWidth > window.innerWidth;
}

function sumClassesUp() {
  let trs = document.getElementsByTagName("tr");
  for (let tr of trs) {
    let firstCell = tr.cells[0];
    firstCell.addEventListener("click", () => {
      if (!_isTableOverflow() || trs.item(0) == tr) {
        return;
      }
      if (firstCell.style.maxWidth == "none") {
        firstCell.style.maxWidth = "4rem";
        firstCell.style.backgroundColor = "var(--color-surface-a20)";
      }
      else {
        firstCell.style.maxWidth = "none";
        firstCell.style.backgroundColor = "var(--color-surface-a40)";
      }
    });
  }
}

function checkTableOverflow() {
  const table = document.querySelector('.mon_list');

  if (_isTableOverflow()) {
    table.classList.add('overflow');
  } else {
    table.classList.remove('overflow');
  }
}


window.onload = function() {
  moveTextToArtColumn();
  listSpecifiedClasses();
  replaceText();
  sumClassesUp();
  checkTableOverflow();
  //listTeacher();
};

window.addEventListener('resize', checkTableOverflow);
