// Utility functions

// --------------------------------------------------------------------------------
// Sorting a table - https://www.w3schools.com/howto/howto_js_sort_table.asp
// --------------------------------------------------------------------------------
function sortTable(n) {
    var table, rows, headers, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("fundlist");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc"; 
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.getElementsByTagName("TR");
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++; 
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    } // While switching

    // Indicate which column that is sorted
    var glyph = 'fas'; //'glyphicon';
    var asc = 'fa-sort-amount-down'; //'glyphicon-sort-by-attributes-alt';
    var desc = 'fa-sort-amount-up'; //'glyphicon-sort-by-attributes';
    headers = table.getElementsByTagName("TH");
    for (i = 0; i < headers.length; i++) {
        var icon = headers[i].getElementsByTagName('I'); 
        icon[0].classList.remove(glyph);
        icon[0].classList.remove(asc);
        icon[0].classList.remove(desc);
    }
    var icon = headers[n].getElementsByTagName('I'); 
    icon[0].classList.add(glyph);
    icon[0].classList.add((dir == 'asc' ? asc : desc));

  }