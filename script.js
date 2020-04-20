for (var i = 0; i < 2; i++) {
  var td_top = document.createElement('td');
  var table = document.createElement('table');
  var tr = document.createElement('tr');
  var th = document.createElement('th');
  var input = document.createElement('input');
  input.setAttribute("type","text");
  input.setAttribute("id", "title"+i);
  th.appendChild(input);
  tr.appendChild(th);
  table.appendChild(tr);
  td_top.append(table);
  document.getElementById('data-tables').appendChild(td_top);
}

