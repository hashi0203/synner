var data_number;
var data_idx;
var json;
var max_id;

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

function add_title(i) {
  var th = new_elem('th');
  var input = new_elem('input');
  add_atts(input,[['type','text'],['id','title'+i],['value',json[i]["name"]]]);
  app_child([input,th]);

  var icon = new_elem('i');
  add_atts(icon,[['class','far fa-edit fa-fw point'],['onclick','fill_data_detail_title('+i+'); fill_data_detail_content('+i+');']]);
  app_child([icon,th]);

  var icon = new_elem('i');
  add_atts(icon,[['class','far fa-trash-alt fa-fw point']]);

  app_child([icon,th,document.getElementById("titles")]);
};

function add_canvas(i) {
  var td = new_elem('td');
  add_atts(td,[['width',"200"]]);
  var div = new_elem('div');
  add_atts(div,[['class','chart_container']]);
  var canvas = new_elem('canvas');
  add_atts(canvas,[['id','canvas'+i]]);
  app_child([canvas,div,td,document.getElementById("canvases")]);
};

function add_dependencies(i) {
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
    add_atts(a,[['class','batsu'],['id','d'+i+'_'+j],['onclick','delete_dependency('+i+','+j+');']]);
    a.textContent = '✕';
    app_child([a,div,td]);
  }
  app_child([td,document.getElementById("dependencies")]);
};

function add_data(i) {
  var td = new_elem('td');
  add_atts(td,[['width',"200"]]);
  var div = new_elem('div');
  add_atts(div,[['class','data_scroll']]);
  for (var j = 0; j < data_number; j++) {
    var input = new_elem('input');
    add_atts(input,[['type','text'],['class','size_fix'], ['id','data'+i+'_'+j],['value',json[i]["data"][j]],['onchange','update_data('+i+','+j+');']]);
    app_child([input,div]);
  }
  app_child([div,td,document.getElementById("datas")]);
}

function fill_titles() {
  for (var i = 0; i < json.length; i++) {
    
  }  
};

function fill_canvases() {
  for (var i = 0; i < json.length; i++) {
    
  }
};

function fill_dependencies() {
  for (var i = 0; i < json.length; i++) {
    
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
    
  }
};

function fill_data_detail_title(idx) {
  data_idx = idx;
  document.getElementById('data_detail_title').textContent = document.getElementById('title'+data_idx).value;
};

function make_data_detail_content() {
  var table = new_elem('table');
  add_atts(table,[['border','1']]);
  var tr = new_elem('tr');
  var th = new_elem('th');
  th.textContent = 'Default Case';
  add_atts(th,[['colspan','2']]);
  app_child([th,tr,table]);
  var tr = new_elem('tr');
  var td = new_elem('td');
  add_atts(td,[['id','description']]);
  var div = new_elem('div');
  div.textContent = 'Describe by:';
  app_child([div,td]);
  var div = new_elem('div');
  add_atts(div,[['class','btn-group-vertical btn-group-toggle'],['data-toggle','buttons']]);
  var items = ['Distribution','Enumeration','Expression','Visual Relationship','Sequence'];
  for (var i=0; i<items.length; i++) {
    var label = new_elem('label');
    add_atts(label,[['id','description'+i],['class','center btn btn-outline-primary descriptions']]);
    var input = new_elem('input');
    add_atts(input,[['type','radio'],['name','describe-by'],['value',i]]);
    if (i == 0) {
      input.checked = true;
    }
    input.required = true;
    app_child([input,label]);
    var span = new_elem('span');
    span.textContent = items[i];
    app_child([span,label,div]);
  }
  app_child([div,td,tr]);
  
  var td = new_elem('td');
  add_atts(td,[['id','described0'],['class','describeds']]);
  var div = new_elem('div');
  div.textContent = 'Domain:';
  app_child([div,td]);
  var div = new_elem('div');
  add_atts(div,[['class','btn-group-vertical btn-group-toggle'],['data-toggle','buttons']]);
  var items = ['Uniform','Gaussian','Gamma','Exponential','Custom'];
  for (var i=0; i<items.length; i++) {
    var label = new_elem('label');
    add_atts(label,[['id','domain'+i],['class','center btn btn-outline-primary domains']]);
    var input = new_elem('input');
    add_atts(input,[['type','radio'],['name','domain'],['value',i]]);
    input.required = true;
    app_child([input,label]);
    var span = new_elem('span');
    span.textContent = items[i];
    app_child([span,label,div]);
  }
  app_child([div,td]);
  var div = new_elem('div');
  add_atts(div,[['class','dist_chart']]);
  var canvas = new_elem('canvas');
  add_atts(canvas,[['id','dist_chart'+data_idx]]);
  app_child([canvas,div,td,tr]);
  
  var td = new_elem('td');
  add_atts(td,[['id','described1'],['class','describeds']]);
  var table1 = new_elem('table');
  var tr1 = new_elem('tr');
  var th = new_elem('th');
  th.textContent = 'Value';
  app_child([th,tr1]);
  var th = new_elem('th');
  th.textContent = 'Distribution';
  app_child([th,tr1,table1,td]);
  var div = new_elem('div');
  add_atts(div,[['id','val_dist']]);
  app_child([div,td]);
  
  app_child([td,tr,table,document.getElementById('data_detail_content')]);
};

function fill_data_detail_content() {
  var did = json[data_idx]['description'];
  var descriptions = document.getElementsByClassName('descriptions');
  for (var i = 0; i < descriptions.length; i++) {
    if (i == did) {
      add_atts(document.getElementById('description'+i),[['class','center btn btn-outline-primary active']]);
    } else {
      add_atts(document.getElementById('description'+i),[['class','center btn btn-outline-primary']]);
    }
  }
  if (did == 0) {
    var domid = json[data_idx]['domain'];
    var domains = document.getElementsByClassName('domains');
    for (var i = 0; i < domains.length; i++) {
      if (i == domid) {
        add_atts(document.getElementById('domain'+i),[['class','center btn btn-outline-primary active']]);
      } else {
        add_atts(document.getElementById('domain'+i),[['class','center btn btn-outline-primary']]);
      }
    }
    draw_chart(document.getElementById('dist_chart'+data_idx), json[data_idx]["data"],data_idx);
  } else if (did == 1) {
    var table_wrapper = document.getElementById('val_dist');
    var rmv_obj = document.getElementById('val_dist_table');
    if (rmv_obj != null) {
      table_wrapper.removeChild(rmv_obj);
    }
    var data = toCountDict(json[data_idx]['data']);
    var table = new_elem('table');
    add_atts(table,[['id','val_dist_table']]);
    for (var i = 0; i < data[0].length; i++) {
      var tr1 = new_elem('tr');
      var td1 = new_elem('td');
      var input = new_elem('input');
      add_atts(input,[['type','text'],['class','size_fix'], ['id','value'+i],['value',data[0][i]]]);
      app_child([input,td1,tr1]);
      var td1 = new_elem('td');
      var input = new_elem('input');
      add_atts(input,[['type','text'],['class','size_fix'], ['id','dist'+i],['value',data[1][i]*100/data_number]]);
      app_child([input,td1,tr1,table,table_wrapper]);
    }
  }
  var describeds = document.getElementsByClassName('describeds');
  for (var i = 0; i < describeds.length; i++) {
    if (i == did) {
      document.getElementById('described'+i).style.display = 'table-cell';
    } else {
      document.getElementById('described'+i).style.display = 'none';
    }
  }
};

function add_field() {
  max_id++;
  json.push({"id": max_id, "Name": 'Column'+max_id, 'dependency': [], 'data': [], 'description': 0, 'domain': 0});
  
  var th = new_elem('th');
  var input = new_elem('input');
  add_atts(input,[['type','text'],['id','title'+max_id],['value',json[max_id]["name"]]]);
  app_child([input,th]);

  var icon = new_elem('i');
  add_atts(icon,[['class','far fa-edit fa-fw point'],['onclick','fill_data_detail_title('+max_id+'); fill_data_detail_content('+max_id+');']]);
  app_child([icon,th]);

  var icon = new_elem('i');
  add_atts(icon,[['class','far fa-trash-alt fa-fw point']]);

  app_child([icon,th,document.getElementById("titles")]);
  
};

function delete_dependency(i,j) {
  json[i]['dependency'] = json[i]['dependency'].splice(j,j);
	document.getElementById('dependency_content'+i).removeChild(document.getElementById('d'+i+'_'+j).parentNode);
};

function update_data(i,j) {
  json[i]['data'][j] = document.getElementById('data'+i+'_'+j).value;
  var canvas = document.getElementById('canvas'+i);
  json[i]['chart'].destroy();
  draw_chart(canvas, json[i]["data"],i);
  if (i = data_idx) {
    fill_data_detail_content();
  }
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
      "data": name,
      "description": 0,
      "domain" : 2
    },
    { "id": 1,
      "name": "Surname",
      "dependency": [],
      "data": surname,
      "description": 2,
      "expressions": "uniform(0,1)"
    },
    { "id": 2,
      "name": "Sex",
      "dependency": [],
      "data": sex,
      "description": 1,
      "enumeration": [1,2]
    },
    { "id": 3,
      "name": "Age",
      "dependency": [],
      "data": age,
      "description": 3,
      "visual-relationship": []
    },
  ];
  console.log(json);
  
  max_id = 3;
  
  fill_titles();
  fill_canvases();
  fill_dependencies();
  fill_datas();
  
  var canvases = document.getElementsByTagName('canvas');
  for (var i = 0; i < canvases.length; i++) {
    draw_chart(canvases[i], json[i]["data"],i);
  }
  
  fill_data_detail_title(0);
  make_data_detail_content();
  fill_data_detail_content();
};