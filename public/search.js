var database = firebase.database();
var databaseRef = database.ref();

var searchInput = document.getElementById('searchbox');
var paperList = document.getElementById("paper-list");
// database에 변화가 생길 때마다(data가 새로 들어올 때마다) 불리는 함수
databaseRef.on('value', function (snapshot) {
  var nodes = [];
  var data = snapshot.val();
  data['nodes'].forEach(function (item, index, array) {
    nodes.push({
      'name': item,
      'author': data['authors'][index]
    });
  });

  data['nodes'].forEach(function(item) {
      // Create a new <option> element.
      var option = document.createElement('option');
      // Set the value using the item in the JSON array.
      option.value = item;
      // Add the <option> element to the <datalist>.
      paperList.appendChild(option);
  });
});

// TODO: Paper Search
// 주의: 위에 nodes에 data를 넣는 과정은 asynchronous해요. 그래서 이 곳에 바로 nodes를 쓰면 빈 array가 나올 수 있습니다.

// Declare variables
var searchButton = document.getElementById('search-button');
searchButton.onclick = function() {
  console.log(searchInput.value);
};
