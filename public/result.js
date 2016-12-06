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
var board1stName = document.getElementById('1stName');
var board1stScore = document.getElementById('1stScore');
var board2stName = document.getElementById('2ndName');
var board2stScore = document.getElementById('2ndScore');
var board3stName = document.getElementById('3rdName');
var board3stScore = document.getElementById('3rdScore');
var boardupName = document.getElementById('upName');
var boardupScore = document.getElementById('upScore');
var boardmyName = document.getElementById('myName');
var boardmyScore = document.getElementById('myScore');
var boarddownName = document.getElementById('downName');
var boarddownScore = document.getElementById('downScore');



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
      var score;
      database.ref('users/' + uid + '/score').once('value', function (snapshot) {
        if (snapshot.val() == undefined) {
          score = 0;
        } else {
          score = snapshot.val();
        }
      });
      updates = {};
      updates['users/' + uid + '/score'] = score + 30;
      updates['/users/' + uid + '/name'] = name;
      database.ref().update(updates);
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
    var score;
    database.ref('users/' + uid + '/score').once('value', function (snapshot) {
      if (snapshot.val() == undefined) {
        score = 0;
      } else {
        score = snapshot.val();
      }
    });
    updates = {};
    updates['users/' + uid + '/score'] = score + 50;
    updates['/users/' + uid + '/name'] = name;
    database.ref().update(updates);
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

firebase.database().ref('users').on('value', function (snapshot) {
  var scores = [];

  var data = snapshot.val();
  for (var key in data) {
    scores.push({
      score: data[key]['score'],
      name: data[key]['name']
    })
  }
  scores.sort(compare);
  console.log(scores);

  board1stScore.innerText = scores[0].score;
  board1stName.innerText = scores[0].name;
  board2stName.innerHTML = scores[1].name;
  board2stScore.innerHTML = scores[1].score;
  board3stName.innerText = scores[2].name;
  board3stScore.innerText = scores[2].score;
});

function compare(a, b) {
  if (a.score > b.score) {
    return -1;
  } else {
    return 1;
  }
}