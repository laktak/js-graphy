
function Graph() {

  this.currInput=0;
  this.lineColors=["#FF0000", "#0000FF", "#00FF00", "#FF00FF", "#00FFFF1", "#000000", "#990000", "#000099", "#009900", "#999900", "#990099", "#009999"];
  this.currtool="pointer";
  this.currEq=0;
  this.gridlines="normal";
  this.settings={};

  this.setQuality=function(q) {
    $("#quality_select a").removeClass("option_selected");
    q2=String(q).replace(".", "");
    $("#quality_select_"+q2).addClass("option_selected");
    this.calc.quality=q;
    this.calc.draw();
  }

  this.setAngles=function(q) {
    $("#angle_select a").removeClass("option_selected");
    $("#angle_select_"+q).addClass("option_selected");
    Calc.angles=q;
    this.calc.draw();
  }

  this.setTool=function(t) {
    $("#tool_select a").removeClass("toolbar_selected");
    $("#tool_select_"+t).addClass("toolbar_selected");

    $(".toolbox").hide();
    $("#toolbox_"+t).show();
    $("#toolbox_"+t).css("top", $("#tool_select_"+t).offset().top - 23);
    $("#toolbox_"+t).css("right", $(document).width() - $("#tool_select_"+t).offset().left + 5);

    this.currtool=t;
    this.calc.draw();
  }

  this.doTrace=function(xval) {
    this.calc.draw();
    this.calc.drawTrace(this.calc.getEquation(this.currEq), "#000000", xval);
  }

  this.setGridlines=function(t) {
    $("#gridlines_select a").removeClass("option_selected");
    $("#gridlines_select_"+t).addClass("option_selected");

    this.gridlines=t;
    this.calc.draw();
  }

  this.updateValues=function() {
    $("input.jsgcalc_xmin").val(Math.round(this.calc.currCoord.x1*1000)/1000);
    $("input.jsgcalc_xmax").val(Math.round(this.calc.currCoord.x2*1000)/1000);
    $("input.jsgcalc_ymin").val(Math.round(this.calc.currCoord.y1*1000)/1000);
    $("input.jsgcalc_ymax").val(Math.round(this.calc.currCoord.y2*1000)/1000);
  }

  this.add=function(f, color) {
    this.calc.lines.push({equation: f, color: color||this.lineColors[this.calc.lines.length] });
    this.calc.draw();
  }

  this.reset=function() {
    this.calc.lines=[];
    this.calc.draw();
  }

  this.resize=function() {
    this.calc.resizeGraph($("#wrapper").width(), $("#wrapper").height());

  }

  this.calc=new JSgCalc(this, "graph");
  this.calc.initCanvas();
}

var graph, edit, scripts;

function setStatus(text) { $("#status-text").text(text||"// js-graphy playground by Christian Zangl"); }

function resize() {
  $("#vsplitter").css("height", window.innerHeight+"px");
  $("#edit").css("height", $("#code").outerHeight()-20+"px");
  edit.resize(true);
  graph.resize();
}

function dorun() {
  var text=edit.getSession().getValue();
  graph.reset();

  var load, find=/^\/\/\s*script="([^\s]*)"\s*$/gm;
  while ((load=find.exec(text))!==null) {
    var script=load[1];
    if (scripts.indexOf(script)===-1) {
      $.ajax({ url: script, dataType: "script",
        success: function() { scripts.push(script); dorun(); },
        error: function fail() { console.log("fail"); }
      });
      setStatus("loading "+script);
      return;
    }
  }

  try { eval(text); setStatus(); }
  catch (e) { console.log(e); setStatus(e.toString()); }
}

$(function() {

  graph=new Graph();
  edit=ace.edit("edit");
  scripts=[];

  $(".toolbox_close a").click(function() { $(".toolbox").hide(); })
  document.body.onselectstart=function () { return false; }

  window.addEventListener("resize", resize);
  resize();
  $("#vsplitter").split({orientation:'horizontal', position: "80%" });
  $("#vsplitter").bind("split.resize", resize);

  edit.setTheme("ace/theme/monokai");
  edit.session.setMode("ace/mode/javascript");
  edit.on("change", dorun);
  edit.on("paste", dorun);

  resize();

  if (window.location.hash.substr(1,5)==="gist=") {

    var gistid=window.location.hash.substr(6);
    $.ajax({ url: 'https://api.github.com/gists/'+gistid, type: 'GET', dataType: 'jsonp'})
    .success(function(gistdata) {
      var files=gistdata.data.files;
      var content=files[Object.keys(files)[0]].content;
        edit.getSession().setValue(content);
      })
    .error( function(e) {
      // ajax error
    });
  }
  else dorun();
});
