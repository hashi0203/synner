var dim;
var data_number;
var data_idx;

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


function new_elem(e) {
  return document.createElement(e);
};

function add_atts(e,atts){
  for(var i = 0; i < atts.length; i++) {
    e.setAttribute(atts[i][0],atts[i][1]);
  }
};

function app_child(cs){
  for(var i = 0; i < cs.length - 1; i++) {
    cs[i+1].appendChild(cs[i]);
  }
};

function fill_titles() {
  for (var i = 0; i < dim; i++) {
    var th = new_elem('th');
    var input = new_elem('input');
    add_atts(input,[['type','text'],['id','title'+i],['class','size_fix'],['value','Column'+i]]);
    app_child([input,th,document.getElementById("titles")]);
  }
};

function fill_canvases() {
  for (var i = 0; i < dim; i++) {
    var td = new_elem('td');
    add_atts(td,[['width',"200"]]);
    var div = new_elem('div');
    add_atts(div,[['class','chart_container']]);
    var canvas = new_elem('canvas');
    add_atts(canvas,[['id','canvas'+i]]);
    app_child([canvas,div,td,document.getElementById("canvases")]);
  }
};

function fill_dependencies() {
  for (var i = 0; i < dim; i++) {
    var td = new_elem('td');
    add_atts(td,[['width',"200"]]);
    td.textContent = 'Depends on: ';
    app_child([td,document.getElementById("dependencies")]);
  }
};

function fill_datas() {
  data_number = Number(document.getElementById("data_number").value);
  if (data_number < 1) {
    data_number = 1;
    document.getElementById("data_number").value = 1;
  } else {
    data_number = Math.round(data_number);
    document.getElementById("data_number").value = data_number;
  }
  for (var i = 0; i < dim; i++) {
    var td = new_elem('td');
    add_atts(td,[['width',"200"]]);
    var div = new_elem('div');
    add_atts(div,[['class','data_scroll']]);
    for (var j = 0; j < data_number; j++) {
      var input = new_elem('input');
      add_atts(input,[['type','text'],['class','size_fix data'+i],['value',j]]);
      app_child([input,div]);
    }
    app_child([div,td,document.getElementById("datas")]);
  }
};

function fill_data_detail_title(idx) {
  data_idx = idx;
  document.getElementById('data_detail_title').textContent = document.getElementById('title'+data_idx).value;
};

function fill_data_detail_content() {
  var table = new_elem('table');
  var tr = new_elem('tr');
  var th = new_elem('th');
  th.textContent = 'Default Case';
  app_child([th,tr,table]);
  var tr = new_elem('tr');
  var td = new_elem('td');
  var div = new_elem('div');
  div.textConten = 'Describe by:';
  app_child([div,td]);
  var div = new_elem('div');
  add_atts(div,[['class','btn-group-vertical btn-group-toggle'],['data-toggle','buttons']]);
  var items = ['Distribution','Enumeration','Expression','Visual Relationship','Sequence'];
  for (var i=0; i<items.length; i++) {
    var str = items[i].replace(' ','_').toLowerCase();
    var label = new_elem('label');
    if (i == 0) {
      add_atts(label,[['id',str],['class','center btn btn-outline-primary active']]);
    } else {
      add_atts(label,[['id',str],['class','center btn btn-outline-primary']]);
    }
    var input = new_elem('input');
    add_atts(input,[['type','radio'],['name'
    input.setAttribute("type","radio");
    input.setAttribute("name","describe-by");
    input.setAttribute("value",str);
    if (i == 0) {
      input.checked = true;
    }
    input.required = true;
    label.appendChild(input);
    var span = document.createElement('span');
    span.textContent = items[i];
    label.appendChild(span);
    div.appendChild(label);
  }

  td.appendChild(div);

  tr.appendChild(td);
  table.appendChild(tr);
  document.getElementById('data_detail_content').appendChild(table);
  
};

var table = document.createElement('table');
var tr = document.createElement('tr');
var th = document.createElement('th');
th.textContent = 'Default Case';
tr.appendChild(th);
table.appendChild(tr);
var tr = document.createElement('tr');
var td = document.createElement('td');
var div = document.createElement('div');
div.textContent = 'Describe by:';
td.appendChild(div);
var div = document.createElement('div');
div.setAttribute("class","btn-group-vertical btn-group-toggle");
div.setAttribute("data-toggle","buttons");
var items = ['Distribution','Enumeration','Expression','Visual Relationship','Sequence'];
for (var i=0; i<items.length; i++) {
  var str = items[i].replace(' ','-').toLowerCase();
  var label = document.createElement('label');
  label.setAttribute("id",str);
  if (i == 0) {
    label.setAttribute("class","center btn btn-outline-primary active");
  } else {
    label.setAttribute("class","center btn btn-outline-primary");
  }
  var input = document.createElement('input');
  input.setAttribute("type","radio");
  input.setAttribute("name","describe-by");
  input.setAttribute("value",str);
  if (i == 0) {
    input.checked = true;
  }
  input.required = true;
  label.appendChild(input);
  var span = document.createElement('span');
  span.textContent = items[i];
  label.appendChild(span);
  div.appendChild(label);
}

td.appendChild(div);

tr.appendChild(td);
table.appendChild(tr);
document.getElementById('data_detail_content').appendChild(table);


function init() {
  dim = 3;
  
  fill_titles();
  fill_canvases();
  fill_dependencies();
  fill_datas();
  
  var canvases = document.getElementsByTagName('canvas');
  for (var i = 0; i < canvases.length; i++) {
    draw_chart(canvases[i]);
  }
  
  fill_data_detail_title(0);
}