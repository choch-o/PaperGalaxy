var w = 1000;
var h = 600;
var radius = 10;
var linkDistance = 200;
var colors = d3.scale.category10();
var database = firebase.database();
var databaseRef = database.ref();
var svg = d3.select("#graph").append("svg").attr({
  "width": w,
  "height": h
});
var not_first = false;

databaseRef.on('value', function (snapshot) {
  if (not_first) {
    d3.select("svg").remove();
    svg = d3.select("#graph").append("svg").attr({
      "width": w,
      "height": h
    });
  }
  var nodes = [];
  var edges = [];
  var data = snapshot.val();
  data['nodes'].forEach(function (item, index, array) {
    nodes.push({
      'name': item,
      'author': data['authors'][index]
    });
  });
  for (var key in data['connections']) {
    var inserted = false;
    var item = data['connections'][key];

    edges.forEach(function (value, index, array) {
      if (value.source == item['paper1'] && value.target == item['paper2']) {
        inserted = true;
        value.info.push({
          'label': item['relationship'],
          'description': item['description'],
          'name': item['name'],
          'uid': item['uid'],
          'plus': item['plus'],
          'minus': item['minus'],
          'key': key
        });
      }
      if (value.source == item['paper2'] && value.target == item['paper1']) {
        inserted = true;
        value.info.push({
          'label': item['relationship'],
          'description': item['description'],
          'name': item['name'],
          'uid': item['uid'],
          'plus': item['plus'],
          'minus': item['minus'],
          'key': key
        });
      }
    });

    if (!inserted) {
      edges.push({
        'source': item['paper1'],
        'target': item['paper2'],
        'info': [{
          'label': item['relationship'],
          'description': item['description'],
          'name': item['name'],
          'uid': item['uid'],
          'plus': item['plus'],
          'minus': item['minus'],
          'key': key

        }],
      });
    }
  }
  var filteredNodes = [];
  var filteredEdges = [];
  var searchResult = document.getElementById('search-result');
  var result = getJsonFromUrl();

  filteredNodes.push({
    'orig_idx': Number(result.pid),
    'name': nodes[Number(result.pid)].name,
    'author': nodes[Number(result.pid)].author,
  });

  var i = 1;
  edges.forEach(function (value) {
    if (value['source'] == result.pid) {
      filteredEdges.push({
        source: 0,
        target: i,
        info: value.info
      });
      filteredNodes.push({
        'orig_idx': value.target,
        'name': nodes[Number(value['target'])].name,
        'author': nodes[Number(value['target'])].author
      });
      i++;
    } else if (value['target'] == result.pid) {
      filteredEdges.push({
        source: i,
        target: 0,
        info: value.info
      });
      filteredNodes.push({
        'orig_idx': value.source,
        'name': nodes[Number(value['source'])].name,
        'author': nodes[Number(value['source'])].author
      });
      i++;
    }
  });

  var dataset = {
    'nodes': filteredNodes,
    'edges': filteredEdges
  };

  var paper1 = document.getElementById('paper1');
  var paper2 = document.getElementById('paper2');

  for (var i = 0; i < nodes.length; i++) {
    paper1.insertAdjacentHTML('beforeend', '<option value="' + i + '">' + nodes[i].name + '</option>');
    paper2.insertAdjacentHTML('beforeend', '<option value="' + i + '">' + nodes[i].name + '</option>');
  }

  var force = d3.layout.force()
    .size([w, h])
    .linkDistance([linkDistance])
    .charge([-700]);
  var edges = svg.selectAll("line")
    .data(dataset.edges)
    .enter()
    .append("line")
    .attr("class", "dim")
    .attr("id", function (d, i) {
      return 'edge' + i
    })
    .style("stroke", "#ccc")
    .on('mouseenter', function (d) {
      document.body.style.cursor = 'pointer';
    })
    .on('mouseleave', function (d) {
      document.body.style.cursor = 'default';
    })
    .on('click', function (d, i) {

      if (document.getElementById('tableContent') != null) {

        document.getElementById('tableConnection').removeChild(document.getElementById('tableContent'));
      }
      var random = Math.random().toString().replace('.', 'a');
      tableContent = '';
      d.info.forEach(function (value, index, array) {
        tableContent += '<tr class="striped--light-gray">';
        if (value.label == 0) {
          tableContent += '<td class="pv2 ph3">No Response</td>';
        } else if (value.label == 1) {
          tableContent += '<td class="pv2 ph3">Similar Motivation</td>';
        } else if (value.label == 2) {
          tableContent += '<td class="pv2 ph3">Similar Technique</td>';
        } else if (value.label == 3) {
          tableContent += '<td class="pv2 ph3">Similar Workflow</td>';
        }
        tableContent +=
          '<td class="pv2 ph3">' + value.description + '</td>' +
          '<td id="plus' + random + index + '" class="pv2 ph3 green grow">+' + value.plus + '</td>' +
          '<td id="minus' + random + index + '" class="pv2 ph3 dark-red grow">-' + value.minus + '</td>' +
          '</tr>';
      });
      document.getElementById('tableConnection').insertAdjacentHTML('beforeend',
        '<table id="tableContent" class="collapse ba br2 b--black-10 pv2 ph3">' +
        '<tbody>' +
        '<tr class="striped--light-gray">' +
        '<th class="pv2 ph3 tl f6 fw6 ttu">Relation</th>' +
        '<th class="pv2 ph3 tl f6 fw6 ttu">Description</th>' +
        '<th class="pv2 ph3 tl f6 fw6 ttu">Plus</th>' +
        '<th class="pv2 ph3 tl f6 fw6 ttu">Minus</th>' +
        '</tr>' +
        tableContent +
        '</tbody>' +
        '</table>'
      );
      d.info.forEach(function (value, index, array) {
        document.getElementById('plus' + random + index).addEventListener('click', function () {
          var updates = {};
          updates['/connections/' + value.key + '/plus'] = value.plus + 1;
          database.ref().update(updates);
          document.getElementById('plus' + random + index).innerText = '+' + (value.plus + 1);
          var score;
          database.ref('users/' + value.uid + '/score').once('value', function (snapshot) {
            if (snapshot.val() == undefined) {
              score = 0;
            } else {
              score = snapshot.val();
            }
          });
          updates = {};
          updates['users/' + value.uid + '/score'] = score + 10;
          database.ref().update(updates);
        });
        document.getElementById('minus' + random + index).addEventListener('click', function () {
          var updates = {};
          updates['/connections/' + value.key + '/minus'] = value.minus + 1;
          database.ref().update(updates);
          document.getElementById('minus' + random + index).innerText = '-' + (value.minus + 1);
          var score;
          database.ref('users/' + value.uid + '/score').once('value', function (snapshot) {
            if (snapshot.val() == undefined) {
              score = 0;
            } else {
              score = snapshot.val();
            }
          });
          updates = {};
          updates['users/' + value.uid + '/score'] = score - 10;
          database.ref().update(updates);
        });
      })
      document.getElementById("modal-show-connection").classList.remove('dn');
    });

  var nodes = svg.selectAll("circle")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr("r", function (d) {
      if (d.orig_idx == result.pid) {
        return 15;
      } else {
        return radius - .75;
      }
    })
    .attr("class", "dim")
    .on('mouseover', function (d) {
      document.body.style.cursor = 'pointer';
      d3.select(d3.selectAll("text")[0][d.index]).style("visibility", "visible");
    })
    .on('mouseout', function (d) {
      document.body.style.cursor = 'default';
      if (d.orig_idx != result.pid) {
        d3.select(d3.selectAll("text")[0][d.index]).style("visibility", "hidden");
      }
    })
    .on('click', function (d, i) {
      if (document.getElementById('paperTitle') != null) {
        document.getElementById('modal-show-paper-content').removeChild(document.getElementById('paperTitle'));
      }
      if (document.getElementById('paperAuthor') != null) {
        document.getElementById('modal-show-paper-content').removeChild(document.getElementById('paperAuthor'));
      }
      document.getElementById("paperInfoTitle").insertAdjacentHTML('afterend', '<p id="paperTitle">' + d.name + '</p>');
      document.getElementById("paperInfoAuthor").insertAdjacentHTML('afterend', '<p id="paperAuthor">' + d.author + '</p>');
      document.getElementById("modal-show-paper").classList.remove('dn');
    })
    .style("fill", function (d, i) {
      return colors(i);
    })
    .call(force.drag)

  var nodelabels = svg.selectAll(".nodelabel")
    .data(dataset.nodes)
    .enter()
    .append("text")
    .text(function (d) {
      return d.name;
    })
    .style("text-anchor", "middle")
    .style("font-size", 12)
    .attr({
      'visibility': function (d) {
        if (d.orig_idx == result.pid) {
          return "visible"
        } else {
          return "hidden"
        }
      }
    });



  var edgelabels = svg.selectAll(".edgelabel")
    .data(dataset.edges)
    .enter()
    .append('text')
    .style("pointer-events", "none")
    .attr({
      'class': 'edgelabel',
      'id': function (d, i) {
        return 'edgelabel' + i
      },
      'dx': 80,
      'dy': 0,
      'font-size': 10,
      'fill': '#aaa'
    });

  edgelabels.append('textPath')
    .attr('xlink:href', function (d, i) {
      return '#edgepath' + i
    })
    .style("pointer-events", "none")
    .text(function (d) {
      return d.label
    });
  /*
    var edgepaths = svg.selectAll(".edgepath")
      .data(dataset.edges)
      .enter()
      .append('path')
      .attr({
        'd': function (d) {
          return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
        },
        'class': 'edgepath',
        'fill-opacity': 0,
        'stroke-opacity': 0,
        'fill': 'blue',
        'stroke': 'red',
        'id': function (d, i) {
          return 'edgepath' + i
        }
      })
      .style("pointer-events", "none");
  */
  force
    .nodes(dataset.nodes)
    .links(dataset.edges)
    .on("tick", tick)
    .start();


  svg.append('defs').append('marker')
    .attr({
      'id': 'arrowhead',
      'viewBox': '-0 -5 10 10',
      'refX': 25,
      'refY': 0,
      //'markerUnits':'strokeWidth',
      'orient': 'auto',
      'markerWidth': 10,
      'markerHeight': 10,
      'xoverflow': 'visible'
    })
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#ccc')
    .attr('stroke', '#ccc');


  function tick() {
    nodes.attr("cx", function (d) {
        if (d.orig_idx == result.pid) {
          return d.x = w / 2;
        } else {
          return d.x = Math.max(radius + 200, Math.min(w - radius - 200, d.x));
        }
      })
      .attr("cy", function (d) {
        if (d.orig_idx == result.pid) {
          return d.y = h / 2;
        } else {
          return d.y = Math.max(radius + 10, Math.min(h - radius, d.y));
        }
      });


    edges.attr({
      "x1": function (d) {
        return d.source.x;
      },
      "y1": function (d) {
        return d.source.y;
      },
      "x2": function (d) {
        return d.target.x;
      },
      "y2": function (d) {
        return d.target.y;
      }
    });


    nodelabels.attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        if (d.orig_idx == result.pid) {
          return d.y - 20;
        } else {
          return d.y - 10;
        }
      });
    /*
        edgepaths.attr('d', function (d) {
          var path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
          return path
        });
    */
    edgelabels.attr('transform', function (d, i) {
      if (d.target.x < d.source.x) {
        bbox = this.getBBox();
        rx = bbox.x + bbox.width / 2;
        ry = bbox.y + bbox.height / 2;
        return 'rotate(180 ' + rx + ' ' + ry + ')';
      } else {
        return 'rotate(0)';
      }
    });

  }

  not_first = true;

});



function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function (part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}