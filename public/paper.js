var buttonPlus = document.getElementById('fixed-button');
var buttonAddPaper = document.getElementById('fixed-button-top');
var buttonAddConnection = document.getElementById('fixed-button-bottom');
var buttonMoveToGraph = document.getElementById('moveToGraph');
var pageIndex = document.getElementById('index');
var pagePaper = document.getElementById('paper');
var modalAddPaper = document.getElementById('modal-add-paper');

buttonPlus.addEventListener('click', function () {
  document.getElementById('buttons').classList.toggle('dn');
});

buttonMoveToGraph.addEventListener('click', function() {
  pageIndex.classList.toggle('dn');
  pagePaper.classList.toggle('dn');
})

buttonAddPaper.addEventListener('click', function () {
  modalAddPaper.classList.toggle('dn');
})


/*
$('#modal-add-connection').modal({
  dismissible: true, // Modal can be dismissed by clicking outside of the modal
  opacity: .5, // Opacity of modal background
  complete: function () {
    var paper1 = document.getElementById('paper1');
    var paper2 = document.getElementById('paper2');
    var relationship = document.getElementById('relationship');
    var source = [];
    var target = [];
    var labels = [];
    var database = firebase.database();

    database.ref().once('value', function (snapshot) {
      var data = snapshot.val();
      data['labels'].forEach(function (item, index, array) {
        labels.push(item);
        source.push(data['source'][index]);
        target.push(data['target'][index]);
      });

      source.push(Number(paper1.value));
      target.push(Number(paper2.value));
      if (relationship.value == 1) {
        labels.push('similar motivation');
      }
      else if (relationship.value == 2) {
        labels.push('similar technique');
      }
      else {
        labels.push('similar workflow')
      }
      database.ref().update({
        source, target, labels
      });
    });

  }
});
*/

/*
$('#modal-add-paper').modal({
  dismissible: true, // Modal can be dismissed by clicking outside of the modal
  opacity: .5, // Opacity of modal background
  complete: function () {
    if (document.getElementById('paper-title').value != "") {
      var nodes = [];
      var authors = [];
      var database = firebase.database();

      database.ref().once('value', function (snapshot) {
        var data = snapshot.val();
        data['nodes'].forEach(function (item, index, array) {
          nodes.push(item);
        });
        data['authors'].forEach(function (item, index, array) {
          authors.push(item);
        })
        nodes.push(document.getElementById('paper-title').value);
        authors.push(document.getElementById('paper-author').value);
        database.ref().update({
          nodes, authors
        });
      });
    }
  }
});

*/