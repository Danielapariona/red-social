var config = {
  apiKey: "AIzaSyAcd1Itu9p6IF_xmRRVLo7Ro79Ek_YXGew",
  authDomain: "iread-47442.firebaseapp.com",
  databaseURL: "https://iread-47442.firebaseio.com",
  projectId: "iread-47442",
  storageBucket: "iread-47442.appspot.com",
  messagingSenderId: "816960626052"
};
firebase.initializeApp(config);

$('#start-login-js').on('click', googleLogin);


function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/plus.login')

  firebase.auth().signInWithPopup(provider)
    .then(function (result) {
      console.log(`${result.user.email} ha iniciado sesión`);
      var user = result.user;
      location.href = "views/newsfeed.html";
      // location.href = "iRead/views/newsfeed.html";
    })
    .catch(function (error) {
      console.log(`Error ${error.code}: ${error.message}`)
    })
}

active();

function active() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('sesion activa del index');
      location.href = "../views/newsfeed.html";
      // location.href = "../iRead/views/newsfeed.html";
    } else {
      console.log('sesion cerrada del index');
    }
  });
}