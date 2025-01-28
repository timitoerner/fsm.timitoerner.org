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


function replaceText() {
  let replacements = {
    "Beginn in Jahrgangsklasse": "ab Jg.",
    "Beginn in Jahrgangsstufe": "ab Jg.",
    "Naturwissenschaften": "NW",
    "Mathematik": "Mathe",
    "Individuelle Lernzeit": "ILZ",
    "Religionslehre": "Religion",
    "Sozialwissenschaften": "SOWI",
    "Arbeitsgemeinschaft": "AG",
    "Angleichstunde": "Angleichst.",
    "bungsstunde": "bungsst.",
    "Stunde": "St.",
    "Art": "Info",
    "Vertreter": "Ersatz",
    "eigenverantwortliches": "selber",
    "Deutsch als Fremdsprache": "Deutsch Fremd.",
    "([0-9]) - ([0-9])": "$1-$2",
  };
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(key, 'gi');
    document.body.innerHTML = document.body.innerHTML.replace(regex, value);
  }
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

function listSpecifiedClasses() {
  // if none specified -> return
  if (window.location.search == "") return;

  const urlParams = new URLSearchParams(window.location.search);

  const rows = document.querySelectorAll('.mon_list tr.list');

  // go throught all rows and all specified classes and remove the not specified classes 
  rows.forEach(row => {
    // uses variable because removes after ALL keys are checked an NONE match
    let shouldKeep = false;

    for (const key of urlParams.keys()) {
      // checks if specified class (key) is present in row
      if (row.firstElementChild.innerHTML.includes(key) ||
        // exclude table haeders
        row.firstElementChild.nodeName == "TH" ||
        // exclude 'Deutsch als Fremdsprache'
        row.firstElementChild.innerHTML == "DAZ") {
        shouldKeep = true;
      }
    }
    if (!shouldKeep) {
      row.remove();
    }
  });
}


function classButtons() {
  // classes that will be displayed
  let displayClasses = ["5", "6", "7", "8", "9", "10", "EF", "Q1", "Q2"];
  // the url param filters for the specific class
  let filterClasses = ["5/&5.&", "/6&6.&", "7.&", "8.&", "9.&", "10.&", "EF&11.&", "Q1&", "Q2&"];

  document.body.insertAdjacentHTML("afterbegin", "<div class='classes'></div>")
  document.body.insertAdjacentHTML("afterbegin", "<h3 style='text-align: center'>Die spezifische Stufenauswahl ist noch nicht stark gestestet und kann Fehler enthalten!!!<h3>")
  for (let i = 0; i < displayClasses.length; i++) {
    let disClas = displayClasses[i];
    let filClas = filterClasses[i];

    document.getElementsByClassName("classes").item(0).insertAdjacentHTML("beforeend", "<div>" + disClas + "</div>");

    document.getElementsByClassName("classes").item(0).lastChild.addEventListener("click", () => {
      if (location.search.includes(filClas)) {
        location.search = location.search.replace(filClas, "");
      }
      else {
        location.search += filClas;
      }
    }
    )

    
    if (location.search.includes(filClas)) {
      document.getElementsByClassName("classes").item(0).lastChild.style.backgroundColor = "var(--color-surface-a20)";
    }
    else {
      document.getElementsByClassName("classes").item(0).lastChild.style.backgroundColor = "var(--color-surface-a10)";
    }

  }
}

window.onload = function() {
  moveTextToInfoColumn();
  listSpecifiedClasses();
  replaceText();
  sumClassesUp();
  classButtons();
};

