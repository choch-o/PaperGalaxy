function PrejudiceViewer() {
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  //this.signInSnackbar = document.getElementById('must-signin-snackbar');

  this.signInButton.addEventListener('click', this.signIn.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));

  this.initFirebase();
}


PrejudiceViewer.prototype.initFirebase = function () {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();

  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
}

PrejudiceViewer.prototype.signIn = function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
}

PrejudiceViewer.prototype.signOut = function () {
  this.auth.signOut();
}

PrejudiceViewer.prototype.onAuthStateChanged = function (user) {
    if (user) {
      var profilePicUrl = user.photoURL;
      var userName = user.displayName;

      this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
      this.userName.textContent = userName;

      this.userName.classList.remove('dn');
      this.userPic.classList.remove('dn');
      this.signOutButton.classList.remove('dn');
      this.signInButton.classList.add('dn');
      this.userName.classList.add('dib');
      this.userPic.classList.add('dib');
      this.signOutButton.classList.add('dib');
      this.signInButton.classList.remove('dib');

      var name = user.displayName;
      var uid = user.uid;

      var database = firebase.database();
      var databaseRef = database.ref('/users');
      databaseRef.on('value', function (snapshot) {
        var data = snapshot.val();
        var score = data[uid];
        document.getElementById('dashboardName').innerText = name;
        document.getElementById('dashboardScore').innerText = score;
      });

    } else {
      this.userName.classList.add('dn');
      this.userPic.classList.add('dn');
      this.signOutButton.classList.add('dn');
      this.signInButton.classList.remove('dn');
      this.userName.classList.remove('dib');
      this.userPic.classList.remove('dib');
      this.signOutButton.classList.remove('dib');
      this.signInButton.classList.add('dib');

    }
  }
  /*
  PrejudiceViewer.prototype.checkSignedInWithMessage = function () {
    if (this.auth.currentUser) {
      return true;
    }

    var data = {
      message: 'You must sign-in first',
      timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
  }
  */
window.onload = function () {
  window.prejudiceViewer = new PrejudiceViewer();
}