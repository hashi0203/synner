var data_number;
var data_idx = 0;
var json;
var max_id;
var items = ['titles','canvases','dependencies','datas'];
var dist_chart;

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

function draw_chart(i) {
  if (json[i]['chart']) {
    json[i]['chart'].destroy();
  }
  
  var canvas = document.getElementById('canvas'+i);
  var data = toCountDict(json[i]['data']);
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

function draw_dist_chart(i) {
  if (dist_chart) {
    dist_chart.destroy();
  }
  
  var canvas = document.getElementById('dist_chart');
  var data = toCountDict(json[i]['data']);
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

  dist_chart = new Chart(canvas, {

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

function add_title_col(i) {
  var th = new_elem('th');
  var input = new_elem('input');
  add_atts(input,[['type','text'],['id','title'+i],['value',json[i]["name"]],['onchange','update_title('+i+')']]);
  app_child([input,th]);

  var icon = new_elem('i');
  add_atts(icon,[['class','far fa-edit fa-fw point'],['onclick','change_selected_field('+i+');']]);
  app_child([icon,th]);

  var icon = new_elem('i');
  add_atts(icon,[['class','far fa-trash-alt fa-fw point'],['onclick','delete_field('+i+');']]);

  app_child([icon,th,document.getElementById("titles")]);
};

function add_canvas_col(i) {
  var td = new_elem('td');
  add_atts(td,[['width',"200"]]);
  var div = new_elem('div');
  add_atts(div,[['class','chart_container']]);
  var canvas = new_elem('canvas');
  add_atts(canvas,[['id','canvas'+i]]);
  app_child([canvas,div,td,document.getElementById("canvases")]);
};

function add_dependency_col(i) {
  var td = new_elem('td');
  add_atts(td,[['id','dependency_content'+i],['width',"200"]]);
  var div = new_elem('div');
  add_atts(div,[['style','font-size: 15px;']])
  div.textContent = 'Depends on: ';
  app_child([div,td]);
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
  var avail_dep = [];
  for (var j = 0; j < json.length; j++) {
    if (i == j) { // 自分自身には依存できない
      continue;
    }
    var jid = json[j]['id'];
    if (json[i]['dependency'].some( function(value) { return value == jid; })) { // すでに依存関係として定義されている
      continue;
    }
    var iid = json[i]['id'];
    if (json[j]['dependency'].some( function(value) { return value == iid; })) { // 相手に依存されている
      continue;
    }
    avail_dep.push(j);
  }
  
  if (avail_dep.length >= 1) {
    var div = new_elem('div');
    add_atts(div,[['class','dropdown']]);
    var icon = new_elem('i');
    add_atts(icon,[['class','fas fa-plus fa-fw dropdown-toggle point'],['data-toggle','dropdown'],['aria-haspopup','true'],['aria-expanded','false']]);
    app_child([icon,div]);
    var div2 = new_elem('div');
    add_atts(div2,[['class','dropdown-menu'],['aria-labelledby','dropdown1']]);
    for (var j = 0; j < avail_dep.length; j++) {
      var a = new_elem('a');
      add_atts(a,[['class','dropdown-item point'],['onclick','add_dependency('+i+','+avail_dep[j]+');']]);
      a.textContent = json[avail_dep[j]]['name'];
      app_child([a,div2]);
    }
    app_child([div2,div, td,document.getElementById("dependencies")]);
  } else {
    app_child([td,document.getElementById("dependencies")]);
  }
};

function add_data_col(i) {
  var td = new_elem('td');
  add_atts(td,[['width',"200"]]);
  var div = new_elem('div');
  add_atts(div,[['class','data_scroll']]);
  for (var j = 0; j < data_number; j++) {
    var input = new_elem('input');
    if (json[i]["data"][j]) {
      add_atts(input,[['type','text'],['class','size_fix'], ['id','data'+i+'_'+j],['value',json[i]["data"][j]],['onchange','update_data('+i+','+j+');']]);
    } else {
      add_atts(input,[['type','text'],['class','size_fix'], ['id','data'+i+'_'+j],['onchange','update_data('+i+','+j+');']]);
    }
    app_child([input,div]);
  }
  app_child([div,td,document.getElementById("datas")]);
};

function fill_items(item) {
  if (item == 'titles') {
    for (var i = 0; i < json.length; i++) {
      add_title_col(i);
    }
  } else if (item == 'canvases') {
    for (var i = 0; i < json.length; i++) {
      add_canvas_col(i);
    }
  } else if (item == 'dependencies') {
    for (var i = 0; i < json.length; i++) {
      add_dependency_col(i);
    }
  } else if (item == 'datas') {
    for (var i = 0; i < json.length; i++) {
      add_data_col(i);
    }
  } else if (item == 'charts') {
    for (var i = 0; i < json.length; i++) {
      draw_chart(i);
    }
  }
};

function fill_data_detail_title() {
  document.getElementById('data_detail_title').textContent = json[data_idx]['name'];
};

function make_sug_table(item) {
  var title;
  var content;
  var onclick;
  if (item == 'custom') {
    title = 'Custom';
    content = 'Design your own custom type';
    onclick = "make_new_data('age');";
  } else if (item == 'random') {
    title = 'Random';
    content = 'Make random dataset';
    onclick = "";
  }
  
  var table = new_elem('table');
  add_atts(table,[['border','1'], ['width', '160'],['style','text-align: center; margin-left: 20px;']]);
  var tr = new_elem('tr');
  var th = new_elem('th');
  th.textContent = title;
  add_atts(th,[['class','bg-gray']]);
  app_child([th,tr,table]);
  var tr = new_elem('tr');
  add_atts(tr,[['height','150']]);
  var td = new_elem('td');
  td.textContent = content;
  app_child([td,tr,table]);
  var tr = new_elem('tr');
  var td = new_elem('td');
  add_atts(td,[['class','bg-gray']]);
  var button = new_elem('button');
  add_atts(button, [['type', 'button'],['class','btn btn-primary'],['onclick',onclick]]);
  button.textContent = 'Use';
  app_child([button,td,tr,table]);
  return table;
};

function make_data_detail_content() {
  var table = new_elem('table');
  add_atts(table,[['border','1'],['width','98%']]);
  table.style.margin = 'auto';
  var tr = new_elem('tr');
  var th = new_elem('th');
  th.textContent = 'Default Case';
  add_atts(th,[['colspan','2'],['class','bg-gray']]);
  app_child([th,tr,table]);
  
  var tr = new_elem('tr');
  var td = new_elem('td');
  add_atts(td,[['id','sug_custom']]);
  var table1 = make_sug_table('custom');
  app_child([table1,td,tr]);
  
  var td = new_elem('td');
  add_atts(td,[['id','sugs']]);
  var table1 = make_sug_table('random');
  app_child([table1,td,tr]);
  
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
  add_atts(div,[['class','dist_chart_container']]);
  var canvas = new_elem('canvas');
  add_atts(canvas,[['id','dist_chart']]);
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
  if (json[data_idx]['data'].length >= 1) {
    document.getElementById('description').style.display = 'table-cell';
    document.getElementById('sug_custom').style.display = 'none';
    document.getElementById('sugs').style.display = 'none';
    var did = json[data_idx]['description'];
    var descriptions = document.getElementsByClassName('descriptions');
    for (var i = 0; i < descriptions.length; i++) {
      if (i == did) {
        document.getElementById('description'+i).classList.add('active');
      } else {
        document.getElementById('description'+i).classList.remove('active');
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
    if (did == 0) {
      var domid = json[data_idx]['domain'];
      var domains = document.getElementsByClassName('domains');
      for (var i = 0; i < domains.length; i++) {
        if (i == domid) {
          document.getElementById('domain'+i).classList.add('active');
        } else {
          document.getElementById('domain'+i).classList.remove('active');
        }
      }
      draw_dist_chart(data_idx);
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
  } else {
    document.getElementById('description').style.display = 'none';
    document.getElementById('sug_custom').style.display = 'table-cell';
    document.getElementById('sugs').style.display = 'table-cell';
    var describeds = document.getElementsByClassName('describeds');
    for (var i = 0; i < describeds.length; i++) {
      document.getElementById('described'+i).style.display = 'none';
    }
  }
  
};

function add_field() {
  max_id++;
  json.push({"id": max_id, "name": 'column'+max_id, 'dependency': [], 'data': [], 'description': 0, 'domain': 0});
  
  data_idx = json.length-1;
  add_title_col(data_idx);
  add_canvas_col(data_idx);
  add_dependency_col(data_idx);
  add_data_col(data_idx);
  edit_selected();
  draw_chart(data_idx);
  fill_data_detail_title();
  fill_data_detail_content();
};

function replace_all_children(item) {
  var elem = document.getElementById(item);
  var clone = elem.cloneNode(false);
  elem.parentNode.replaceChild(clone,elem);
  fill_items(item);
};

function delete_field(i) {
  var iid = json[i]['id'];
  json.splice(i,1);
  for (var j = 0; j < json.length; j++) {
    json[j]['dependency'] = json[j]['dependency'].filter(function(value) { return value != iid; });
  }
  if (i == data_idx) {
    data_idx = 0;
    fill_data_detail_title();
    fill_data_detail_content();
  } else if (i < data_idx) {
    data_idx--;
  }
  for (var i = 0; i < items.length; i++) {
    replace_all_children(items[i]);
  }
  fill_items('charts');
};

function update_title(i) {
  json[i]['name'] = document.getElementById('title'+i).value;
  if (i == data_idx) {
    fill_data_detail_title();
  }
};

function add_dependency(i,j) {
  json[i]['dependency'].push(json[j]['id']);
  replace_all_children('dependencies');
}

function delete_dependency(i,j) {
  json[i]['dependency'].splice(j,1);
  replace_all_children('dependencies');
};

function update_data(i,j) {
  json[i]['data'][j] = document.getElementById('data'+i+'_'+j).value;
  draw_chart(i);
  if (i = data_idx) {
    fill_data_detail_content();
  }
};

function edit_selected() {
  for (var i = 0; i < items.length; i++) {
    var tds = document.getElementById(items[i]).children;
    for (var j = 0; j < tds.length; j++) {
      if (j == data_idx) {
        tds[j].classList.add("bg-gray");
      } else {
        tds[j].classList.remove("bg-gray");
      }
    }
  }
  for (var i = 0; i < json.length; i++) {
    if (i == data_idx) {
      document.getElementById('title'+i).classList.add("bg-gray");
    } else {
      document.getElementById('title'+i).classList.remove("bg-gray");
    }
  }
  for (var i = 0; i < json.length; i++) {
    if (i == data_idx) {
      for (var j = 0; j < data_number; j++) {
        document.getElementById('data'+i+'_'+j).classList.add("bg-gray");
      }
    } else {
      for (var j = 0; j < json[i]['data'].length; j++) {
        document.getElementById('data'+i+'_'+j).classList.remove("bg-gray");
      }
    }
  }
};

function change_selected_field(i) {
  data_idx = i;
  fill_data_detail_title();
  edit_selected();
  fill_data_detail_content();
}

function change_data_size() {
  data_number = Number(document.getElementById("data_number").value);
  if (data_number < 1) {
    data_number = 1;
    document.getElementById("data_number").value = 1;
  } else {
    data_number = Math.round(data_number);
    document.getElementById("data_number").value = data_number;
  }
  for (var i = 0; i < json.length; i++) {
    json[i]['data'] = data_generator(json[i]['generator']);
  }
  replace_all_children('datas');
  fill_items('charts');
};

function make_new_data(item) {
  json[data_idx]['generator'] = item;
  json[data_idx]['data'] = data_generator(item);
  for (var i = 0; i < data_number; i++) {
    document.getElementById('data'+data_idx+'_'+i).value = json[data_idx]['data'][i];
  }
  draw_chart(data_idx);
  fill_data_detail_content();
}

function data_generator(item) {
  var data = [];
  if (item == 'name') {
    for (var i = 0; i < data_number; i++) {  
      data.push(Math.random().toString(32).substring(2));
    }
  } else if (item == 'sex') {
    for (var i = 0; i < data_number; i++) {
      if (Math.random() < 0.5) {
        data.push('M');
      } else {
        data.push('F');
      }
    }
  } else if (item == 'age') {
    for (var i = 0; i < data_number; i++) {
      data.push(Math.floor(Math.random()*100));
    }
  }
  return data;  
};

function init() {
  data_number = Number(document.getElementById("data_number").value);
  if (data_number < 1) {
    data_number = 1;
    document.getElementById("data_number").value = 1;
  } else {
    data_number = Math.round(data_number);
    document.getElementById("data_number").value = data_number;
  }
  
  var name = data_generator('name');
  var surname = data_generator('name');
  var sex = data_generator('sex');
  var age = data_generator('age');
  
  json = [
    { "id": 0,
      "name": "Name",
      "dependency": [2],
      "generator": 'name',
      "data": name,
      "description": 0,
      "domain" : 2
    },
    { "id": 1,
      "name": "Surname",
      "dependency": [],
      "generator": 'name',
      "data": surname,
      "description": 2,
      "expressions": "uniform(0,1)"
    },
    { "id": 2,
      "name": "Sex",
      "dependency": [],
      "generator": 'sex',
      "data": sex,
      "description": 1,
      "enumeration": [1,2]
    },
    { "id": 3,
      "name": "Age",
      "dependency": [],
      "generator": 'age',
      "data": age,
      "description": 3,
      "visual-relationship": []
    },
  ];
  
  max_id = json.length;
  
  for (var i = 0; i < items.length; i++) {
    fill_items(items[i]);
  }
  edit_selected();
  
  fill_items('charts');
  
  fill_data_detail_title();
  make_data_detail_content();
  fill_data_detail_content();
};