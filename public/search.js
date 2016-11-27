var database = firebase.database();
var databaseRef = database.ref();

// database에 변화가 생길 때마다(data가 새로 들어올 때마다) 불리는 함수
databaseRef.on('value', function (snapshot) {
  var nodes = [];
  data['nodes'].forEach(function (item, index, array) {
    nodes.push({
      'name': item,
      'author': data['authors'][index]
    });
  });
});

// TODO: Paper Search
// 주의: 위에 nodes에 data를 넣는 과정은 asynchronous해요. 그래서 이 곳에 바로 nodes를 쓰면 빈 array가 나올 수 있습니다.
