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
    "Erziehungswissenschaft": "P&#228;dagogik",
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


function sumColumnUp(index, maxWidth) {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(`.mon_list>tbody>tr>td:nth-child(${index + 1}):hover { cursor: pointer; }`));
  style.appendChild(document.createTextNode(`.mon_list>tbody>tr>td:nth-child(${index + 1}) { max-width: ${maxWidth}rem }`));
  document.head.appendChild(style);



  // get all table rows
  let trs = document.getElementsByTagName("tr");

  // loop through every row 
  for (let tr of trs) {
    // keep track of cell at place {index}
    let indexCell = tr.cells[index];
    
    // continue if cell does not exist
    if (!indexCell) continue;

    indexCell.addEventListener("click", () => {
      // return if it is the table header
      if (indexCell.tagName == "TH" ||
          !indexCell.parentElement.parentElement.parentElement.classList.contains("mon_list")) return;

      // if width is not set, set it
      // and also change the color
      if (indexCell.style.maxWidth == "none") {
        indexCell.style.maxWidth = maxWidth.toString() + "rem";
        indexCell.style.backgroundColor = "var(--color-surface-a20)";
        indexCell.style.color = "var(--color-primary-a50)";
      }
      // and if it is than set it to none
      else {
        indexCell.style.maxWidth = "none";
        indexCell.style.backgroundColor = "var(--color-primary-a50)";
        indexCell.style.color = "var(--color-surface-a20)";
      }
    });
  }
}

function listSpecifiedClasses() {
  // if none specified -> return
  if (window.location.search == "") return;

  const urlParams = new URLSearchParams(window.location.search);

  const rows = document.querySelectorAll('.mon_list tr.list');

  // go through all rows and all specified classes and remove the not specified classes 
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
  // grades that will be displayed
  let displayClasses = ["5", "6", "7", "8", "9", "10", "EF", "Q1", "Q2"];
  // the url param filters for the specific grade
  let filterClasses = ["5/&5.&", "/6&6.&", "7/&7.&", "/8&8.&", "9.&", "10.&", "EF&11.&", "Q1&", "Q2&"];

  // the parent div for the clickable filters
  document.body.insertAdjacentHTML("afterbegin", "<div class='classes'></div>")
  // disclaimer
  //document.body.insertAdjacentHTML("afterbegin", "<h3 style='text-align: center'>Die spezifische Stufenauswahl ist noch nicht stark gestestet und kann Fehler enthalten!!!<h3>")
  // go through all grades with an index
  for (let i = 0; i < displayClasses.length; i++) {
    // keep track of current grade
    let disClas = displayClasses[i];
    let filClas = filterClasses[i];

    //make new div with grade inside
    document.getElementsByClassName("classes").item(0).insertAdjacentHTML("beforeend", "<div>" + disClas + "</div>");

    // make the grades clickable by adding the filter grade to the url params or removing it
    document.getElementsByClassName("classes").item(0).lastChild.addEventListener("click", () => {
      if (location.search.includes(filClas)) {
        // remove filter grade
        location.search = location.search.replace(filClas, "");
      }
      else {
        // add filter grade
        location.search += filClas;
      }
    }
    )

    
    // make the specified grades pop out by switching colors
    if (location.search.includes(filClas)) {
      document.getElementsByClassName("classes").item(0).lastChild.style.backgroundColor = "var(--color-primary-a50)";
      document.getElementsByClassName("classes").item(0).lastChild.style.color = "var(--color-surface-a10)";
    }
    else {
      document.getElementsByClassName("classes").item(0).lastChild.style.backgroundColor = "var(--color-surface-a10)";
      document.getElementsByClassName("classes").item(0).lastChild.style.color = "var(--color-primary-a50)";
    }

  }
}

function addSupportButtons() {
  document.getElementsByClassName("support-text").item(0).style.display = "none";
  document.getElementsByClassName("support").item(0).addEventListener("click", () => {
    if (document.getElementsByClassName("support-text").item(0).style.display == "none") {
      document.getElementsByClassName("support-text").item(0).style.display = "flex";
      document.getElementsByClassName("support").item(0).lastChild.style.backgroundColor = "var(--color-primary-a50)";
      document.getElementsByClassName("support").item(0).lastChild.style.color = "var(--color-surface-a10)";
    } 
    else {
      document.getElementsByClassName("support-text").item(0).style.display = "none";
      document.getElementsByClassName("support").item(0).lastChild.style.backgroundColor = "var(--color-surface-a10)";
      document.getElementsByClassName("support").item(0).lastChild.style.color = "var(--color-primary-a50)";
    }
  });
}

window.onload = function() {
  moveTextToInfoColumn();
  listSpecifiedClasses();
  replaceText();
  sumColumnUp(0, 5);
  sumColumnUp(3, 10);
  sumColumnUp(5, 10);
  classButtons();
  addSupportButtons();
};

