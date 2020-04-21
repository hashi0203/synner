function draw_chart(canvas) {
  //「月別データ」
  var mydata = {
    labels: ["１月", "２月", "３月", "４月", "５月", "６月", "７月"],
    datasets: [
      {
        label: '数量',
        hoverBackgroundColor: "rgba(255,99,132,0.3)",
        data: [65, 59, 80, 81, 56, 55, 48],
      }
    ]
  };

  //「オプション設定」
  var options = {
    legend: {
        display: false
     },
    scales: {
      xAxes: [{
       ticks: {
        callback: function(value, index, values){ return  '' }
       }
      }],
      yAxes: [{
       ticks: {
        callback: function(value, index, values){ return  '' }
       }
      }]
     },
    responsive: true,
    maintainAspectRatio: false
  };

  var chart = new Chart(canvas, {

    type: 'bar',  //グラフの種類
    data: mydata,  //表示するデータ
    options: options  //オプション設定

  });
};


for (var i = 0; i < 2; i++) {
  var td_top = document.createElement('td');
  var table = document.createElement('table');
  var thead = document.createElement('thead');
  
  var tr = document.createElement('tr');
  var th = document.createElement('th');
  var input = document.createElement('input');
  input.setAttribute("type","text");
  input.setAttribute("id", "title"+i);
  th.appendChild(input);
  tr.appendChild(th);
  thead.appendChild(tr);
  
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  var div = document.createElement('div');
  div.setAttribute("class","chart-container");
  var canvas = document.createElement('canvas');
  canvas.setAttribute("id","canvas"+i);
  div.appendChild(canvas);
  td.appendChild(div);
  tr.appendChild(td);  
  thead.appendChild(tr);
  
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.textContent = "Depends on";
  tr.appendChild(td);  
  thead.appendChild(tr);
  
  table.appendChild(thead);
  
  var tbody = document.createElement('tbody');
  tbody.setAttribute("height",100);
  var div = document.createElement('div');
  div.setAttribute("class","data-scroll");
  for (var j = 0; j < 10; j++) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.textContent = j;
    tr.appendChild(td);  
    div.appendChild(tr);
  }
  tbody.appendChild(div);
  table.appendChild(tbody);
  
  td_top.append(table);
  document.getElementById('data-tables').appendChild(td_top); 
  draw_chart(canvas);
}

data_idx = 0;
var th = document.createElement('th');
th.textContent = document.getElementById('title'+data_idx).value;
document.getElementById('data-detail-title').appendChild(th);

var table = document.createElement('table');
var tr = document.createElement('tr');
var th = document.createElement('th');
th.textContent = 'Default Case';
tr.appendChild(th);
table.appendChild(tr);
var tr = document.createElement('tr');
var td = document.createElement('td');
td.textContent = 'Describe by:';
var div = document.createElement('div');

for (var str in ['Distribution','Enumeration','Expression','Visual Relationship','Sequence']) {
  var button = document.createElement('button');
  button.setAttribute("type","button");
  button.setAttribute("id",str.replace(' ','-',).toLowerCase());
  button.setAttribute("class","btn btn-primary");
  // button.textContent(str);
  div.appendChild(button);
}
td.appendChild(div);

tr.appendChild(td);
table.appendChild(tr);
document.getElementById('data-detail-content').appendChild(table);

