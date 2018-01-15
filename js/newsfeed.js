var config = {
  apiKey: "AIzaSyAcd1Itu9p6IF_xmRRVLo7Ro79Ek_YXGew",
  authDomain: "iread-47442.firebaseapp.com",
  databaseURL: "https://iread-47442.firebaseio.com",
  projectId: "iread-47442",
  storageBucket: "iread-47442.appspot.com",
  messagingSenderId: "816960626052"
};

firebase.initializeApp(config);

//eventos
$('#submit-js').on('click', post);
$('#href-js').on('click', post);
$('#logout-js').on('click', logout);

// uploader-js
// fileButton-js

// vigilar

var image;
var downloadURL;




function sessionActive() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('sesion activa de newsfeed');
      name = user.displayName;
      photoUrl = user.photoURL;
      $('#name-js').text(name);
      $('#photoUrl-js').attr("src", photoUrl);
      console.log(user);
      writeUserData(user.uid, name, user.email, photoUrl)
    } else {
      location.href = "../";
    }
  });
}

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture: imageUrl
  });
}

$('#fileButton-js').on('change', function (e) {
  //obtenet el archivo
  image = e.target.files[0];
  console.log(image);
})


function post(event) {
  event.preventDefault();
  var $today = getToday();
  var $time = getTime();
  var $content = $('#content-post-js').val();

  firebase.auth().onAuthStateChanged(function (user) {
    var stateImage;

    if (user) {
      if ($('#fileButton-js').val() == '') {
        writeUserPost(user.uid, user.displayName, $content, downloadURL = '', $time, $today);
        $('#content-post-js').val('');
        $('#content-post-js').focus();
      } else if ($('#fileButton-js').val() !== '') {
        //crear un storage ref
        var storageRef = firebase.storage().ref('images/' + image.name);
        // subir archivo
        console.log(storageRef);
        var uploadTask = storageRef.put(image);
        uploadTask.on('state_changed',
          function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            $('#uploader-js').val(percentage);
          },
          function error(err) {

          },
          function complete() {
            $('#uploader-js').val(0);
            downloadURL = uploadTask.snapshot.downloadURL;
            writeUserPost(user.uid, user.displayName, $content, downloadURL, $time, $today);
            $('#content-post-js').val('');
            $('#content-post-js').focus();
            location.reload(true);
          })
      }
    }
  });
  //
}

function writeUserPost(userId, name, content, urlImage, time, today) {
  firebase.database().ref('posts').push({
    uid: userId,
    author: name,
    content: content,
    url: urlImage,
    time: time,
    today: today
  });
}

sessionActive();
recoverUserPost();

function recoverUserPost() {
  firebase.database().ref('posts').on('value', function (snapshot) {
    snapshot.forEach(function (e) {
      var element = e.val();
      var uidAuthor = element.uid;
      var starCountRef = firebase.database().ref('users/' + uidAuthor + '/profile_picture');
      starCountRef.on('value', function (snapshot) {
        var photoAuthor = snapshot.val();
        var author = element.author;
        var content = element.content;
        var urlImage = element.url;
        var time = element.time;
        var todayPost = element.today;
        $('#all-post-js').prepend("<div>" + "<img src='" + photoAuthor + "'/>" + '<p>' + author + '</p>' + '<p>' + content + '</p>' + '<p class="time">Hora: ' + time + ' ' + todayPost + '<img src=' + urlImage + '>' + '</img>');
      });
    })
  })
}

function logout() {
  firebase.auth().signOut()
    .then(function (result) {
      console.log('Te has desconectado correctamente');
      location.href = "../";
    })
    .catch(function (error) {
      console.log(`Error ${error.code}: ${error.message}`)
    })
}

function getTime() {
  var f = new Date();
  var time = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
  return time;
}

function getToday() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var today = dd + '/' + mm + '/' + yyyy;
  return today;
}

