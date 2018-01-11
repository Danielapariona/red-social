var config = {
  apiKey: "AIzaSyAcd1Itu9p6IF_xmRRVLo7Ro79Ek_YXGew",
  authDomain: "iread-47442.firebaseapp.com",
  databaseURL: "https://iread-47442.firebaseio.com",
  projectId: "iread-47442",
  storageBucket: "iread-47442.appspot.com",
  messagingSenderId: "816960626052"
};
firebase.initializeApp(config);

getUsers();

function getUsers() {
  firebase.database().ref('users').on('value', function (snapshot) {
    snapshot.forEach(function (e) {
      var element = e.val();
      console.log(element);
      var username = element.username;      
      var email = element.email;
      var profile_picture = element.profile_picture;
      $('#users-js').append('<div><a href='+'#'+'>'+username +'</a>'+'<img src="' + profile_picture+'"'+'</img></div>');
    })
  })
}