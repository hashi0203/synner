var data_number;
var data_idx;
var json;

function toCountDict(array){
  let dict = {};
  for(let key of array){
      dict[key] = array.filter(function(x){return x==key}).length;
  }
  var keys = Object.keys(dict);
  var values = [];
  for (var i = 0; i < keys.length; i++) {
    values.push(dict[keys[i]]*100/data_number);
  }
  return [keys,values];
};

function draw_chart(canvas,data, i) {
  //「月別データ」
  data = toCountDict(data);
  var mydata = {
    labels: data[0],
    datasets: [
      {
        label: 'Number(%)',
        data: data[1],
        // hoverBackgroundColor: "rgba(255,99,132,0.3)",
        hoverBackgroundColor: "rgba(36,22,236,0.3)",
        backgroundColor: "rgba(36,22,236,1)"
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
         },
        gridLines: {
          display: false // グリッドラインを表示しない
        },
        scaleLabel: {
          display: false // 軸名を表示しない
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true, // 0から始める
          callback: function(value, index, values){ return  '' }
        },
        scaleLabel: {
          display: false // 軸名を表示しない
        }
      }]
     },
    responsive: true,
    maintainAspectRatio: false
  };

  json[i]['chart'] = new Chart(canvas, {

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
  if (cs.length < 2) {
    console.log("you need list longer than 2");
  }
  for(var i = 0; i < cs.length - 1; i++) {
    cs[i+1].appendChild(cs[i]);
  }
};

function fill_titles() {
  for (var i = 0; i < json.length; i++) {
    var th = new_elem('th');
    var input = new_elem('input');
    add_atts(input,[['type','text'],['id','title'+i],['class','size_fix'],['value',json[i]["name"]]]);
    app_child([input,th,document.getElementById("titles")]);
  }
};

function fill_canvases() {
  for (var i = 0; i < json.length; i++) {
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
  for (var i = 0; i < json.length; i++) {
    var td = new_elem('td');
    add_atts(td,[['id','dependency_content'+i],['width',"200"]]);
    var span = new_elem('span');
    add_atts(span,[['style','font-size: 15px;']])
    span.textContent = 'Depends on: ';
    app_child([span,td]);
    for (var j = 0; j < json[i]["dependency"].length; j++) {
      var div = new_elem('div');
      add_atts(div,[['class','del_button']]);
      var span = new_elem('span');
      var id = json[i]["dependency"][j];
      var dep = json.filter(function(json){
        if (json.id == id) return true;
      });
      span.textContent = dep[0]["name"];
      add_atts(span,[['style','font-size: 12px; padding-right: 5px']])
      app_child([span,div]);
      var a = new_elem('a');
      add_atts(a,[['class','batsu'],['id','d'+i+'_'+j],['onclick','delete_dependency(this.id);']]);
      a.textContent = '✕';
      app_child([a,div,td]);
    }
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
  for (var i = 0; i < json.length; i++) {
    var td = new_elem('td');
    add_atts(td,[['width',"200"]]);
    var div = new_elem('div');
    add_atts(div,[['class','data_scroll']]);
    for (var j = 0; j < data_number; j++) {
      var input = new_elem('input');
      add_atts(input,[['type','text'],['class','size_fix'], ['id','data'+i+'_'+j],['value',json[i]["data"][j]],['onchange','update_data(this.id);']]);
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
  add_atts(table,[['border','1']]);
  var tr = new_elem('tr');
  var th = new_elem('th');
  th.textContent = 'Default Case';
  add_atts(th,[['colspan','2']]);
  app_child([th,tr,table]);
  var tr = new_elem('tr');
  var td = new_elem('td');
  var div = new_elem('div');
  div.textContent = 'Describe by:';
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
    add_atts(input,[['type','radio'],['name','describe-by'],['value',str]]);
    if (i == 0) {
      input.checked = true;
    }
    input.required = true;
    app_child([input,label]);
    var span = new_elem('span');
    span.textContent = items[i];
    app_child([span,label,div]);
  }
  app_child([div,td])
  var td = new_elem('td');
  app_child([td,tr,table,document.getElementById('data_detail_content')]);
  
};

function delete_dependency(obj) {
  var idx = obj.replace('d','').split('_');
  json[idx[0]]['dependency'] = json[idx[0]]['dependency'].splice(idx[1],idx[1]);
	document.getElementById('dependency_content'+idx[0]).removeChild(document.getElementById(obj).parentNode);
};

function update_data(obj) {
  var idx = obj.replace('data','').split('_');
  json[idx[0]]['data'][idx[1]] = document.getElementById(obj).value;
  var canvas = document.getElementById('canvas'+idx[0]);
  json[idx[0]]['chart'].destroy();
  draw_chart(canvas, json[idx[0]]["data"],idx[0]);
};

function init() {
  data_number = 1000;
  
  var name = [];
  for (var i = 0; i < data_number; i++) {  
    name.push(Math.random().toString(32).substring(2));
  }
  var surname = [];
  for (var i = 0; i < data_number; i++) {  
    surname.push(Math.random().toString(32).substring(2));
  }
  var sex = [];
  for (var i = 0; i < data_number; i++) {
    if (Math.random() < 0.5) {
      sex.push('M');
    } else {
      sex.push('F');
    }
  }
  var age = [];
  for (var i = 0; i < data_number; i++) {
    age.push(Math.floor(Math.random()*100));
  }
  
  json = [
    { "id": 0,
      "name": "Name",
      "dependency": [2],
      "data": name
    },
    { "id": 1,
      "name": "Surname",
      "dependency": [],
      "data": surname
    },
    { "id": 2,
      "name": "Sex",
      "dependency": [],
      "data": sex
    },
    { "id": 3,
      "name": "Age",
      "dependency": [],
      "data": age
    },
  ];
  console.log(json);
  
  fill_titles();
  fill_canvases();
  fill_dependencies();
  fill_datas();
  
  var canvases = document.getElementsByTagName('canvas');
  for (var i = 0; i < canvases.length; i++) {
    draw_chart(canvases[i], json[i]["data"],i);
  }
  
  fill_data_detail_title(0);
  fill_data_detail_content();
};