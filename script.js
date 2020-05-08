var data_number;
var data_idx = 0;
var json;
var max_id;
var items = ['titles','canvases','dependencies','datas'];
var dist_chart;
var new_data_args = {'custom': [[],[]],'uniform': [[],[]],'gaussian': [[],[]]};

function get_min(array,type) {
  if (type == 'int' || type == 'float') {
    return array.reduce((a,b)=>Math.min(a,b));
  } else {
    return array.reduce((a,b)=>a < b ? a : b);
  }
};

function get_max(array,type) {
  if (type == 'int' || type == 'float') {
    return array.reduce((a,b)=>Math.max(a,b));
  } else {
    return array.reduce((a,b)=>a > b ? a : b);
  }
};

function assoc_sort(dict,type) {
  if (type == 'int' || type == 'float') {
    // const compare = (x, y) => x - y;
    // return Object.keys(dict).sort(compare);
    var keys = Object.keys(dict);
    var min = get_min(keys, type);
    var max = get_max(keys, type);
    var ret = [];
    for (var i = min; i <= max; i++) {
      ret.push(i);
    }
    return ret;
  } else {
    return Object.keys(dict).sort(function(a,b){
            if( a < b ) return -1;
            if( a > b ) return 1;
            return 0;
          });
  }
};

function toCountDict(array,type){
  if (array.length != 0) {
    let dict = {};
    if (type == 'float' || type == 'int') {
      for(let key of array){
        if (key != undefined) {
          dict[Math.round(key)] = array.filter(function(x){return Math.round(x)==Math.round(key);}).length;
        }
      }
    } else if (type == 'date') {
      var min = get_min(array,type).split('-');
      var max = get_max(array,type).split('-');
      if (Number(max[0]) - Number(min[0]) >= 10) {
        for (let key of array) {
          if (key != undefined) {
            var y = key.split('-')[0];
            dict[y] = array.filter(function(x){return x.split('-')[0]==y;}).length; 
          }
        }
      } else if (Number(min[0]) == Number(max[0]) || (Number(min[0])+1 == Number(max[0]) && Number(max[1]) < Number(min[1]))) {
        for (let key of array) {
          if (key != undefined) {
            var ymd = key.split('-');
            dict[ymd[0]+'/'+ymd[1]+'/'+ymd[2]] = array.filter(function(x){return (x.split('-')[1]==ymd[1] && x.split('-')[2]==ymd[2]);}).length;            
          }
        }
      } else {
        for (let key of array) {
          if (key != undefined) {
            var ymd = key.split('-');
            dict[ymd[0]+'/'+ymd[1]] = array.filter(function(x){return (x.split('-')[0]==ymd[0] && x.split('-')[1]==ymd[1]);}).length;            
          }
        }
      }
    } else {
      for(let key of array){
        if (key != undefined) {
          dict[key] = array.filter(function(x){return x==key}).length;          
        }
      }
    }
    var keys = assoc_sort(dict,type);

    var values = [];
    for (var i = 0; i < keys.length; i++) {
      if (dict[keys[i]] == undefined) {
        values.push(0);
      } else {
        values.push(Math.round(dict[keys[i]]*10000/data_number)/100); 
      }
    }
    return [keys,values];
  } else {
    return [[],[]];
  }
};

function draw_chart(i) {
  if (json[i]['chart']) {
    json[i]['chart'].destroy();
  }
  
  var canvas = document.getElementById('canvas'+i);
  var data = toCountDict(json[i]['data'],json[i]['data_type']);
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
    tooltips: {
      intersect: false
    },
    scales: {
      xAxes: [{
        ticks: {
          // callback: function(value, index, values){ return  '' }
          display: false
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
          // callback: function(value, index, values){ return  '' }
          display: false
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

function norm_func (x, m, s) {
  return 100/(Math.sqrt(2*Math.PI*(s**2))) * Math.exp(-((x-m)**2)/(2*(s**2)));
};

function exact_model(keys, type, info) {
  var data = [];
  var v = 100/keys.length;
  if (type == 'int' || type == 'float') {
    if (info['distribution'] == 0) {
      keys.forEach(function(k){
        data.push(v);
      });
    } else if (info['distribution'] == 1) {
      keys.forEach(function(k){
        data.push(norm_func(k,info['mean'],info['sd']));
      });
    }
  } else if (type == 'date') {
    if (info['distribution'] == 0) {
      keys.forEach(function(k){
        data.push(v);
      });
    } else if (info['distribution'] == 1) {
      // Todo: 一様関数のまま
      keys.forEach(function(k){
        data.push(v);
      });
    }
  } else {
    keys.forEach(function(k){
      data.push(v);
    });
  }
  return data;  
};


function draw_dist_chart(i) {
  if (dist_chart) {
    dist_chart.destroy();
  }
  
  var canvas = document.getElementById('dist_chart');
  var data = toCountDict(json[i]['data'],json[i]['data_type']);
  var exact_data = exact_model(data[0],json[i]['data_type'], json[i]['generator']);
  var mydata = {
    labels: data[0],
    datasets: [
      {
        type: 'line',
        label: 'Number(%)',
        data: exact_data,
        borderColor: "rgba(200,202,36,1)",
        fill: false,
        radius: 2,
        borderWidth: 1
      },
      {
        type: 'line',
        label: 'Number(%)',
        data: data[1],
        borderColor: "rgba(200,22,236,1)",
        fill: false,
        radius: 2,
        borderWidth: 1
      },
      {
        type: 'bar',
        label: 'Number(%)',
        data: data[1],
        hoverBackgroundColor: "rgba(36,22,236,0.3)",
        backgroundColor: "rgba(36,22,236,0)"
      }
    ]
  };

  //「オプション設定」
  var options = {
    legend: {
        display: false
     },
    tooltips: {
        mode: 'nearest',
        intersect: false,
    },
    scales: {
      xAxes: [{
        ticks: {
          display: false
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
          display:false
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

function onlayers() {
  dist_chart.data.datasets[2].backgroundColor = "rgba(36,22,236,0.8)";
  dist_chart.update();
};

function outlayers() {
  dist_chart.data.datasets[2].backgroundColor = "rgba(36,22,236,0)";
  dist_chart.update();
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
  add_atts(input,[['type','text'],['id','title'+i],['class','title_input'],['value',json[i]["name"]],['onchange','update_title('+i+')']]);
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
  };
  
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
    add_atts(input,[['class','size_fix'], ['id','data'+i+'_'+j],['onchange','update_data('+i+','+j+');']]);
    if (json[i]['data_type'] == 'int') {
      add_atts(input,[['type','number'],['step','1']]);
    } else if (json[i]['data_type'] == 'float') {
      add_atts(input,[['type','number'],['step','0.1']]);
    } else {
      add_atts(input,[['type',json[i]['data_type']]]);
    }
    if (json[i]["data"][j] != undefined) {
      add_atts(input,[['value',json[i]["data"][j]]]);
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

function sug_dependency(item) {
  item = item.toLowerCase();
  var deps = [['name','sex'], ['age','height', 'birthday']];
  deps = deps.map(d => d.map(i => new RegExp(i)));
  var idx = -1;
  var dep = deps.filter(d => {
    var tmp = (d.findIndex(i => {
      return i.test(item);
    }));
    if (tmp == -1) {
      return false;
    } else {
      idx = tmp;
      return true;
    };
  });
  if (idx == -1) {
    return [];
  } else {
    var ret = [];
    json.forEach(function(j){
      var tmp = dep[0].findIndex(i => {
        return i.test(j['name'].toLowerCase());
      });
      if (tmp == -1 || tmp == idx) {
        return false;
      } else {
        ret.push({'name': j['name'],'id': j['id']});
        return true;
      }
    });
    return ret;
  }
};
  
function make_sug_table(item) {
  var title;
  var ps = [];
  var onclick = "make_new_data('"+item+"');";
  var deps = sug_dependency(json[data_idx]['name']);
  var depstr = '';
  deps.forEach(function(d){
    depstr += d['name'] + ', ';
  });
  depstr = depstr.substr(0,depstr.length-2);
  deps = deps.map(d => d['id']);
  if (item == 'custom') {
    title = 'Custom';
    var p = new_elem('p');
    p.textContent = 'Design your own custom type';
    ps.push(p);
  } else if (item == 'uniform') {
    title = 'Uniform';
    if (json[data_idx]['data_type'] == 'text') {
      var min = 3;
      var max = 11;
    } else if (json[data_idx]['data_type'] == 'int') {
      var min = 0;
      var max = 100;
    } else if (json[data_idx]['data_type'] == 'float') {
      var min = 50;
      var max = 190;
    } else if (json[data_idx]['data_type'] == 'date') {
      var min = '1945-01-01';
      var max = '2019-12-31';
    }
    if (json[data_idx]['data'].filter(function(x){return x!=undefined}).length >= 2) {
      if (json[data_idx]['data_type'] == 'date') {
        min = get_min(json[data_idx]['data'],json[data_idx]['data_type']);
        max = get_max(json[data_idx]['data'],json[data_idx]['data_type']);
      } else {
        min = get_min(json[data_idx]['data'],json[data_idx]['data_type']);
        max = get_max(json[data_idx]['data'],json[data_idx]['data_type']);
      }
    }
    var p = new_elem('p');
    p.textContent = ('Minimum: '+min).replace(/-/g,'/');
    ps.push(p);
    var p = new_elem('p');
    p.textContent = ('Maximun: '+max).replace(/-/g,'/');
    ps.push(p);
    var p = new_elem('p');
    p.textContent = 'Depends on: '+depstr;
    ps.push(p);
    new_data_args[item][0] = [min,max];
    new_data_args[item][1] = deps;
  } else if (item == 'gaussian') {
    title = 'Gaussian';
    if (json[data_idx]['data_type'] == 'text') {
      var mean = 5;
      var sd = 2;
    } else if (json[data_idx]['data_type'] == 'int') {
      var mean = 50;
      var sd = 30;
    } else if (json[data_idx]['data_type'] == 'float') {
      var mean = 140;
      var sd = 50;
    } else if (json[data_idx]['data_type'] == 'date') {
      var mean = '1982-07-01';
      var sd = 2500;
    }
    if (json[data_idx]['data'].filter(function(x){return x!=undefined}).length >= 2) {
      var min = get_min(json[data_idx]['data'],json[data_idx]['data_type']);
      var max = get_max(json[data_idx]['data'],json[data_idx]['data_type']);
      if (json[data_idx]['data_type'] == 'date') {
        mean = ymdMid(min,max);
        sd = ymdSd(min,max);
      } else {
        mean = (min+max)/2;
        sd = (max-min)/4;
      }
    }
    var p = new_elem('p');
    p.textContent = ('Mean: '+mean).replace(/-/g,'/');
    ps.push(p);
    var p = new_elem('p');
    p.textContent = 'Std Dev: '+sd;
    ps.push(p);
    var p = new_elem('p');
    p.textContent = 'Depends on: '+depstr;
    ps.push(p);
    new_data_args[item][0] = [mean,sd];
    new_data_args[item][1] = deps;
  }
  
  var div = new_elem('div');
  add_atts(div,[['style','float:left;']]);
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
  for (var i = 0; i < ps.length; i++) {
    app_child([ps[i],td]); 
  }
  app_child([td,tr,table]);
  var tr = new_elem('tr');
  var td = new_elem('td');
  add_atts(td,[['class','bg-gray']]);
  var button = new_elem('button');
  add_atts(button, [['type', 'button'],['class','btn btn-primary'],['onclick',onclick]]);
  button.textContent = 'Use';
  app_child([button,td,tr,table,div]);
  return div;
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
  app_child([td,tr]);
  
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
    add_atts(input,[['type','radio'],['name','describe-by'],['value',i],['onclick','change_descriptions('+i+')']]);
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
  add_atts(div,[['id','dom_items']]);
  var div1 = new_elem('div');
  div1.textContent = 'Domain:';
  app_child([div1,div]);
  var div1 = new_elem('div');
  add_atts(div1,[['class','btn-group-vertical btn-group-toggle'],['data-toggle','buttons']]);
  var items = ['Uniform','Gaussian','Gamma','Exponential','Custom'];
  for (var i=0; i<items.length; i++) {
    var label = new_elem('label');
    add_atts(label,[['id','domain'+i],['class','center btn btn-outline-primary domains']]);
    var input = new_elem('input');
    add_atts(input,[['type','radio'],['name','domain'],['value',i],['onclick','change_domains('+i+')']]);
    input.required = true;
    app_child([input,label]);
    var span = new_elem('span');
    span.textContent = items[i];
    app_child([span,label,div1]);
  }
  app_child([div1,div,td]);
  var div = new_elem('div');
  add_atts(div,[['class','dist_chart_container']]);
  var canvas = new_elem('canvas');
  add_atts(canvas,[['id','dist_chart'], ['onmouseover','onlayers();'], ['onmouseout','outlayers();']]);
  app_child([canvas,div,td]);
  
  var div = new_elem('div');
  add_atts(div,[['id','statistics']]);
  var stats = ['mean','sd','min','max'];
  for (var i = 0; i < stats.length; i++) {
    var div2 = new_elem('div');
    add_atts(div2,[['id','s_'+stats[i]]]);
    var label = new_elem('label');
    add_atts(label,[['for','input_'+stats[i]]]);
    if (i == 1) {
      label.textContent = "Std Dev";
    } else {
      label.textContent = stats[i];
    }
    app_child([label,div2]);
    var input = new_elem('input');
    add_atts(input,[['id','input_'+stats[i]],['onchange','update_stats();']]);
    if (i == 2) {
      add_atts(input,[['type','number'],['step',1]]);
    }
    app_child([input,div2,div]);
  }
  app_child([div,td,tr]);
  
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
  if (json[data_idx]['new_data']) {
    document.getElementById('description').style.display = 'none';
    document.getElementById('sug_custom').style.display = 'table-cell';
    document.getElementById('sugs').style.display = 'table-cell';
    var describeds = document.getElementsByClassName('describeds');
    for (var i = 0; i < describeds.length; i++) {
      document.getElementById('described'+i).style.display = 'none';
    }
    var elem = document.getElementById('sugs');
    var sugs = elem.cloneNode(false);
    elem.parentNode.replaceChild(sugs,elem);
    var table = make_sug_table('uniform');
    app_child([table,sugs]);
    var table = make_sug_table('gaussian');
    app_child([table,sugs]);
  } else {
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
      var domid = json[data_idx]['generator']['distribution'];
      if (domid == undefined) {
        domid = 0;
        json[data_idx]['generator']['distribution'] = 0;
      }
      var domains = document.getElementsByClassName('domains');
      for (var i = 0; i < domains.length; i++) {
        if (i == domid) {
          document.getElementById('domain'+i).classList.add('active');
        } else {
          document.getElementById('domain'+i).classList.remove('active');
        }
      }
      draw_dist_chart(data_idx);
      
      var stats = ['mean','min','max'];
      for (var i = 0; i < stats.length; i++) {
        if (json[data_idx]['data_type'] == 'int') {
          add_atts(document.getElementById('input_'+stats[i]),[['type','number'],['step',1]]);
        } else if (json[data_idx]['data_type'] == 'float') {
          add_atts(document.getElementById('input_'+stats[i]),[['type','number'],['step',0.1]]);
        } else {
          add_atts(document.getElementById('input_'+stats[i]),[['type',json[data_idx]['data_type']]]);
        }
      }
      
      var mean = json[data_idx]['generator']['mean'];
      var sd = json[data_idx]['generator']['sd'];
      var min = json[data_idx]['generator']['min'];
      var max = json[data_idx]['generator']['max'];
      if (json[data_idx]['generator']['distribution'] == 0) {
        document.getElementById('s_mean').style.display = 'none';
        document.getElementById('s_sd').style.display = 'none';
        document.getElementById('input_min').value = min;
        document.getElementById('input_max').value = max;
      } else if (json[data_idx]['generator']['distribution'] == 1) {
        document.getElementById('s_mean').style.display = 'block';
        document.getElementById('s_sd').style.display = 'block';
        document.getElementById('input_mean').value = mean;
        document.getElementById('input_sd').value = sd;
        if (min != undefined) {        
          document.getElementById('input_min').value = min;
        }
        if (max != undefined) {
          document.getElementById('input_max').value = max;
        }
      }
    } else if (did == 1) {
      var table_wrapper = document.getElementById('val_dist');
      var rmv_obj = document.getElementById('val_dist_table');
      if (rmv_obj != null) {
        table_wrapper.removeChild(rmv_obj);
      }
      
      if (json[data_idx]['generator']['value'] == undefined) {
        json[data_idx]['generator']['value'] = [];
        json[data_idx]['generator']['rate'] = [];
        var data = toCountDict(json[data_idx]['data'],json[data_idx]['data_type']);
        for (var i = 0; i < data[0].length; i++) {
          json[data_idx]['generator']['value'].push(data[0][i]);
          json[data_idx]['generator']['rate'].push(data[1][i]*100/data_number);
        }
      }
      
      var table = new_elem('table');
      add_atts(table,[['id','val_dist_table']]);
      for (var i = 0; i < json[data_idx]['generator']['value'].length; i++) {
        var tr1 = new_elem('tr');
        var td1 = new_elem('td');
        var input = new_elem('input');
        add_atts(input,[['type','text'],['class','size_fix'], ['id','value'+i],['value',json[data_idx]['generator']['value'][i]],['onchange','update_enum()']]);
        app_child([input,td1,tr1]);
        var td1 = new_elem('td');
        var input = new_elem('input');
        add_atts(input,[['type','text'],['class','size_fix'], ['id','rate'+i],['value',json[data_idx]['generator']['rate'][i]],['onchange','update_enum()']]);
        app_child([input,td1,tr1,table,table_wrapper]);
      }
    }
  }  
};

function add_field(type) {
  max_id++;
  json.push({"id": max_id, "name": 'column'+max_id, "new_data": true, 'dependency': [], 'data_type': type, 'data': [], 'description': 0});
  
  data_idx = json.length-1;
  add_title_col(data_idx);
  add_canvas_col(data_idx);
  replace_all_children('dependencies');
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
    if (json[i]['new_data']) {
      fill_data_detail_content();
    }
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
  if (json[i]['data_type'] == 'int' || json[i]['data_type'] == 'float') {
    json[i]['data'][j] = Number(document.getElementById('data'+i+'_'+j).value);
  } else {
    json[i]['data'][j] = document.getElementById('data'+i+'_'+j).value;
  }
  draw_chart(i);
  if (i = data_idx) {
    fill_data_detail_content();
  }
};

function change_descriptions(i) {
  if (i >= 2) {
    not_implemented();
  }
  json[data_idx]['description'] = i;
  fill_data_detail_content();
};

function change_domains(i) {
  if (i >= 2) {
    not_implemented();
  }
  json[data_idx]['generator']['distribution'] = i;
  json[data_idx]['data'] = data_generator(json[data_idx]['data_type'],json[data_idx]['generator']);
  replace_all_children('canvases');
  replace_all_children('datas');
  fill_items('charts');
  edit_selected();
  fill_data_detail_content();
};

function update_stats() {
  if (json[data_idx]['generator']['distribution'] == 0) {
    if (document.getElementById('input_min').value == "") {
      document.getElementById('input_min').value = json[data_idx]['generator']['min'];
    }
    if (document.getElementById('input_max').value == "") {
      document.getElementById('input_max').value = json[data_idx]['generator']['max'];
    }
  } else if (json[data_idx]['generator']['distribution'] == 1) {
    if (document.getElementById('input_mean').value == "") {
      document.getElementById('input_mean').value = json[data_idx]['generator']['mean'];
    }
    if (document.getElementById('input_sd').value == "") {
      document.getElementById('input_sd').value = json[data_idx]['generator']['sd'];
    }
  }
  var stats = ['mean','sd','min','max'];
  for (var i = 0; i < stats.length; i++) {
    if (document.getElementById('input_'+stats[i]).value == "") {
      json[data_idx]['generator'][stats[i]] = undefined;
    } else {
      json[data_idx]['generator'][stats[i]] = document.getElementById('input_'+stats[i]).value;
    }
    if (json[data_idx]['data_type'] == 'int' || json[data_idx]['data_type'] == 'float' || i == 1) {
      json[data_idx]['generator'][stats[i]] = Number(json[data_idx]['generator'][stats[i]]);
    }
  }
  if (json[data_idx]['generator']['min'] > json[data_idx]['generator']['max']) {
    document.getElementById('input_min').value = json[data_idx]['generator']['max'];
    document.getElementById('input_max').value = json[data_idx]['generator']['min'];
    json[data_idx]['generator']['max'] = document.getElementById('input_max').value;
    json[data_idx]['generator']['min'] = document.getElementById('input_min').value;
  }
  json[data_idx]['data'] = data_generator(json[data_idx]['data_type'],json[data_idx]['generator']);
  replace_all_children('canvases');
  replace_all_children('datas');
  fill_items('charts');
  edit_selected();
  fill_data_detail_content();
};

function update_enum() {
  var i = 0;
  while (document.getElementById('value'+i)) {
    json[data_idx]['generator']['value'][i] = document.getElementById('value'+i).value;
    json[data_idx]['generator']['rate'][i] = Number(document.getElementById('rate'+i).value);
    i++;
  }
  json[data_idx]['data'] = data_generator(json[data_idx]['data_type'],json[data_idx]['generator']);
  replace_all_children('datas');
  edit_selected();
  fill_items('charts');
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
      for (var j = 0; j < data_number; j++) {
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
};

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
    json[i]['data'] = data_generator(json[i]['data_type'],json[i]['generator']);
  }
  replace_all_children('datas');
  fill_items('charts');
  draw_dist_chart(data_idx);
};

function make_new_data(item) {
  json[data_idx]['new_data'] = false;
  json[data_idx]['dependency'] = new_data_args[item][1];
  if (item == 'custom') {
    if (json[data_idx]['data_type'] == 'text') {
      json[data_idx]['generator'] = {"text":'random', "min":3, "max":11};
    } else if (json[data_idx]['data_type'] == 'int') {
      json[data_idx]['generator'] = {"distribution": 1, "mean":50, "sd":30, "min": 0, "max": 100};
    } else if (json[data_idx]['data_type'] == 'float') {
      json[data_idx]['generator'] = {"distribution": 1, "mean":140, "sd":50, "min": 50, "max": 190};
    } else if (json[data_idx]['data_type'] == 'date') {
      json[data_idx]['generator'] = {"distribution": 0, "min":'1945-01-01', "max":'2019-12-31'};
    }
  } else if (item == 'uniform') {
    json[data_idx]['generator'] = {"distribution": 0, "min": new_data_args[item][0][0], "max": new_data_args[item][0][1]};
  } else if (item == 'gaussian') {
    json[data_idx]['generator'] = {"distribution": 1, "mean": new_data_args[item][0][0], "sd": new_data_args[item][0][1]};
  }
  
  json[data_idx]['data'] = data_generator(json[data_idx]['data_type'],json[data_idx]['generator']);
  for (var i = 0; i < data_number; i++) {
    document.getElementById('data'+data_idx+'_'+i).value = json[data_idx]['data'][i];
  }
  draw_chart(data_idx);
  fill_data_detail_content();
  replace_all_children('dependencies');
};

function normRand (m, s) {
  var a = 1 - Math.random();
  var b = 1 - Math.random();
  var c = Math.sqrt(-2 * Math.log(a));
  if(0.5 - Math.random() > 0) {
    return c * Math.sin(Math.PI * 2 * b) * s + m;
  }else{
    return c * Math.cos(Math.PI * 2 * b) * s + m;
  }
};

function normRandmm (m, s, min, max) {
  var val = Math.round(normRand(m,s));
  var c = 0;
  if (min != undefined && max != undefined) {
    while ((val < min || val > max) && c < 100) {
      val = Math.round(normRand(m,s));
      c++;
    }
  } else if (min != undefined) {
    while (val < min && c < 100) {
      val = Math.round(normRand(m,s));
      c++;
    }
  } else if (max != undefined) {
    while (val > max && c < 100) {
      val = Math.round(normRand(m,s));
      c++;
    }
  }
  return val;
};

function ymdMid(fromYmd, toYmd) {
  var d1 = new Date(fromYmd);
  var d2 = new Date(toYmd);
  
  var c = (d2 - d1) / 86400000; // fromYmd から toYmd までの日数
  d1.setDate(d1.getDate() + Math.round(c/2));
  
  //フォーマット整形
  var y = d1.getFullYear();
  var m = ("00" + (d1.getMonth()+1)).slice(-2);
  var d = ("00" + d1.getDate()).slice(-2);
 
  return y + "-" + m + "-" + d;
};

function ymdSd(fromYmd, toYmd) {
  var d1 = new Date(fromYmd);
  var d2 = new Date(toYmd);
  
  var c = (d2 - d1) / 86400000; // fromYmd から toYmd までの日数
  return c/10;
};

function ymdRand(info){
  var min;
  if (info['min'] != undefined) {
    min = new Date(info['min']);
  }
  var max;
  if (info['max'] != undefined) {
    max = new Date(info['max']);
  }
  var mean;
  if (info['mean'] != undefined) {
    mean = new Date(info['mean']);
  }
  
  var c = (max - min) / 86400000;
  if (info['distribution'] == 0) {
    var x = Math.floor(Math.random() * (c+1));
    var ans = min;
  } else if (info['distribution'] == 1) {
    var x = Math.floor(normRandmm(0,info['sd'],(min-mean) / 86400000,(max-mean) / 86400000));
    var ans = mean;
  }
  
  ans.setDate(ans.getDate() + x);
 
  //フォーマット整形
  var y = ans.getFullYear();
  var m = ("00" + (ans.getMonth()+1)).slice(-2);
  var d = ("00" + ans.getDate()).slice(-2);
 
  return y + "-" + m + "-" + d;
};

function data_generator(type, info) {
  var data = [];
  if (type == 'int') {
    var min = Math.ceil(info['min']);
    var max = Math.floor(info['max']);    
    if (info['distribution'] == 0) {
      if (info['min'] == undefined) {
        min = get_min(json[data_idx]['data'],type);
        info['min'] = min;
      }
      if (info['max'] == undefined) {
        max = get_max(json[data_idx]['data'],type);
        info['max'] = max;
      }
      for (var i = 0; i < data_number; i++) {  
        data.push(min + Math.floor(Math.random()*(max-min+1)));
      }
    } else if (info['distribution'] == 1) {
      if (info['mean'] == undefined) {
        info['mean'] = (min+max)/2;
      }
      if (info['sd'] == undefined) {
        info['sd'] = (max-min)/10;
      }
      for (var i = 0; i < data_number; i++) {
        data.push(Math.round(normRandmm(info['mean'],info['sd'],min,max)));
      }
    }
  } else if (type == 'float') {
    var min = info['min'];
    var max = info['max'];    
    if (info['distribution'] == 0) {
      if (info['min'] == undefined) {
        min = get_min(json[data_idx]['data'],type);
        info['min'] = min;
      }
      if (info['max'] == undefined) {
        max = get_max(json[data_idx]['data'],type);
        info['max'] = max;
      }
      for (var i = 0; i < data_number; i++) {  
        data.push(info['min'] + Math.random()*(info['max']-info['min']));
      }
    } else if (info['distribution'] == 1) {
      if (info['mean'] == undefined) {
        info['mean'] = (min+max)/2;
      }
      if (info['sd'] == undefined) {
        info['sd'] = (max-min)/10;
      }
      for (var i = 0; i < data_number; i++) {  
        data.push(normRandmm(info['mean'],info['sd'],info['min'],info['max']));
      }
    }
  } else if (type == 'date') {
    if (info['distribution'] == 0) {
      if (info['min'] == undefined) {
        info['min'] = get_min(json[data_idx]['data'],type);
      }
      if (info['max'] == undefined) {
        info['max'] = get_max(json[data_idx]['data'],type);
      }
    } else if (info['distribution'] == 1) {
      if (info['mean'] == undefined) {
        info['mean'] = ymdMid(info['min'],info['max']);
      }
      if (info['sd'] == undefined) {
        info['sd'] = ymdSd(info['min'],info['max']);
      }
    }
    for (var i = 0; i < data_number; i++) {  
      data.push(ymdRand(info));
    }
  } else if (info['text'] == 'choice') {
    var rate = info['rate'].slice(0,info['rate'].length);
    var value = info['value'].slice(0,info['value'].length);
    if (rate.length != value.length) {
      console.log('lengths of rate and value do not match');
      return;
    }
    for (var i = 1; i < rate.length; i++) {
      rate[i] += rate[i-1];      
    }
    var sum = rate[rate.length-1];
    var bp = rate.map(elm => {
      return elm / sum;
    });
    for (var i = 0; i < data_number; i++) {
      var r = Math.random();
      var idx = bp.findIndex(elm => {
        return elm > r;
      });
      data.push(value[idx]);
    }
  } else if (info['text'] == 'random') {
    var min = Math.ceil(info['min']);
    if (min > 11) {
      min = 11;
    }
    var max = Math.floor(info['max']);
    if (max > 11) {
      max = 11;
    }
    for (var i = 0; i < data_number; i++) {
      var str = Math.random().toString(32).substring(2);
      while (str.length < min) {
        str = Math.random().toString(32).substring(2);
      }
      data.push(str.substring(0,max));
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
  
  json = [
    { "id": 0,
      "name": "Name",
      "new_data": false,
      "dependency": [2],
      "generator": {"text":'random', "min":3, "max": 7},
      "data_type": 'text',
      "description": 1
    },
    { "id": 1,
      "name": "Surname",
      "new_data": false,
      "dependency": [],
      "generator": {"text":'random', "min":3, "max": 7},
      "data_type": 'text',
      "description": 1
    },
    { "id": 2,
      "name": "Sex",
      "new_data": false,
      "dependency": [],
      "generator": {"text": 'choice', "rate":[1,2], "value":['F','M']},
      "data_type": 'text',
      "description": 1
    },
    { "id": 3,
      "name": "Age",
      "new_data": false,
      "dependency": [],
      "generator": {"distribution": 0, "min":0, "max":100},
      "data_type": 'int',
      "description": 0
    },
    { "id": 4,
      "name": "Height",
      "new_data": false,
      "dependency": [2, 3],
      "generator": {"distribution": 1, "mean":140, "sd":50, "min": 50, "max": 190},
      "data_type": 'float',
      "description": 0
    },
  ];
  
  for (var i = 0; i < json.length; i++) {
    json[i]['data'] = data_generator(json[i]['data_type'],json[i]['generator']);
  }
  
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

function exportCSV() {
  if (window.confirm('Export as csv?')) {
    var formatCSV = '';
    for (var i = 0; i < json.length; i++) {
      formatCSV += json[i]['name'];
      if (i == json.length - 1) {
        formatCSV += '\n';
      } else {
        formatCSV += ',';
      }
    }
    for (var i = 0; i < data_number; i++) {
      for (var j = 0; j < json.length; j++) {
        formatCSV += json[j]['data'][i];
        if (j == json.length - 1) {
          formatCSV += '\n';
        } else {
          formatCSV += ',';
        } 
      }
    }
    let bom  = new Uint8Array([0xEF, 0xBB, 0xBF]);
    let blob = new Blob([bom, formatCSV], {type: 'text/csv'});
    let url = (window.URL || window.webkitURL).createObjectURL(blob);
    let link = document.createElement('a');
    link.download = 'synner_data.csv';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

function not_implemented() {
  alert("This function has not implemented yet.");
};