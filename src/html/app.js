function moveTextToInfoColumn() {
  // Get all rows in the table (excluding the header row)
  const rows = document.querySelectorAll('.mon_list tr.list');

  rows.forEach(row => {
    // Get all cells (td) in the current row
    const cells = row.querySelectorAll('td');

    // Skip rows that don't have the expected number of columns (in case of missing data)
    if (cells.length < 7) return;

    // Move the content from the "Text" column (last cell) to the "Info" column (second-to-last cell)
    const textContent = cells[cells.length - 1].innerHTML;
    cells[cells.length - 2].innerHTML += "; " + textContent;

    // Optionally, clear the content in the "Text" column
    cells[cells.length - 1].remove(); //style = "display: none;";
  });
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


function sumClassesUp() {
  let trs = document.getElementsByTagName("tr");
  for (let tr of trs) {
    let firstCell = tr.cells[0];
    firstCell.addEventListener("click", () => {
      
      if (trs.item(0) == tr) return;

      if (firstCell.style.maxWidth == "none") {
        firstCell.style.maxWidth = "5rem";
        firstCell.style.backgroundColor = "var(--color-surface-a20)";
      }
      else {
        firstCell.style.maxWidth = "none";
        firstCell.style.backgroundColor = "var(--color-surface-a40)";
      }
    });
  }
}


window.onload = function() {
  moveTextToInfoColumn();
  listSpecifiedClasses();
  replaceText();
  sumClassesUp();
};

