/*
var database = firebase.database();
var databaseRef = database.ref();
var data;


databaseRef.on('value', function (snapshot) {
  var nodes = [];
  data = snapshot.val();
  data['nodes'].forEach(function (item, index, array) {
    nodes.push({
      'name': item,
      'author': data['authors'][index]
    });
  });

  console.log(data['nodes'][result]);
}
function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
*/

var buttonPlus = document.getElementById('fixed-button');
var buttonAddPaper = document.getElementById('fixed-button-top');
var buttonAddConnection = document.getElementById('fixed-button-bottom');
var modalAddPaper = document.getElementById('modal-add-paper');
var modalAddConnection = document.getElementById('modal-add-connection');
var modalPaper = document.getElementById('modal-show-paper');
var modalConnection = document.getElementById('modal-show-connection');
var buttonSendNewPaper = document.getElementById('sendNewPaper');
var buttonSendNewConnection = document.getElementById('sendNewConnection');
var buttonCloseModalPaper = document.getElementById('closeModalPaper');


buttonPlus.addEventListener('click', function () {
  document.getElementById('buttons').classList.toggle('dn');
});

buttonAddPaper.addEventListener('click', function () {
  modalAddPaper.classList.toggle('dn');
});

buttonAddConnection.addEventListener('click', function () {
  modalAddConnection.classList.toggle('dn');
});

buttonCloseModalPaper.addEventListener('click', function () {
  modalPaper.classList.add('dn');
})

buttonSendNewPaper.addEventListener('click', function () {
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
        nodes,
        authors
      });
    });
    var user = firebase.auth().currentUser;
    var name, uid;
    if (user != null) {
      name = user.displayName;
      uid = user.uid;
    } else {
      name = "annonymous";
      uid = 0;
    }
    if (user) {
      firebase.database().ref('users/' + uid + '/papers').push().set({
        'name': document.getElementById('paper-title').value,
        'author': document.getElementById('paper-author').value
      });
    }
    modalAddPaper.classList.add('dn');

  }
});

buttonSendNewConnection.addEventListener('click', function () {
  var paper1 = document.getElementById('paper1');
  var paper2 = document.getElementById('paper2');
  var relationship = document.getElementById('relationship');
  var description = document.getElementById('connection-description');

  var user = firebase.auth().currentUser;
  var name, uid;
  if (user != null) {
    name = user.displayName;
    uid = user.uid;
  } else {
    name = "annonymous";
    uid = 0;
  }
  var newPostRef = firebase.database().ref('connections').push();
  newPostRef.set({
    'paper1': Number(paper1.value),
    'paper2': Number(paper2.value),
    'relationship': Number(relationship.value),
    'description': description.value,
    'name': name,
    'uid': uid,
    'plus': 0,
    'minus': 0
  });
  if (user) {
    firebase.database().ref('users/' + uid + '/connections').push().set({
      'paper1': Number(paper1.value),
      'paper2': Number(paper2.value),
      'relationship': Number(relationship.value),
      'description': description.value,
    });
  }
  modalAddConnection.classList.add('dn');
});

window.onclick = function (event) {
  if (event.target == modalAddPaper) {
    modalAddPaper.classList.add('dn');
  }
  if (event.target == modalAddConnection) {
    modalAddConnection.classList.add('dn');
  }
  if (event.target == modalConnection) {
    modalConnection.classList.add('dn');
  }
  if (event.target == modalPaper) {
    modalPaper.classList.add('dn');
  }
}