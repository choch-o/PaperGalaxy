var user = firebase.auth().currentUser;
var name, email, photoUrl, uid;

if (user != null) {
  name = user.displayName;
  uid = user.uid;
  console.log(name);
  console.log(uid);

  var database = firebase.database();
  var databaseRef = database.ref('/users');
  databaseRef.on('value', function (snapshot) {
    var data = snapshot.val();
    console.log(data);
  });
}