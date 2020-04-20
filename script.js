function draw_graph(canvas) {
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
     }
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
  table.setAttribute("width",100);
  
  var tr = document.createElement('tr');
  var th = document.createElement('th');
  var input = document.createElement('input');
  input.setAttribute("type","text");
  input.setAttribute("id", "title"+i);
  th.appendChild(input);
  tr.appendChild(th);
  table.appendChild(tr);
  
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  var canvas = document.createElement('canvas');
  canvas.setAttribute("id","canvas"+i);
  td.appendChild(canvas);
  tr.appendChild(td);  
  table.appendChild(tr);
  
  td_top.append(table);
  document.getElementById('data-tables').appendChild(td_top); 
  draw_graph(canvas);
}

