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

    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    this.signInButton.setAttribute('hidden', 'true');
  } else {
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    this.signInButton.removeAttribute('hidden');

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
window.onload = function() {
  window.prejudiceViewer = new PrejudiceViewer();
}