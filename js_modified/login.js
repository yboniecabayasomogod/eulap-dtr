//Unique Firebase Object
var eulap_firebase_database = {
    apiKey: "AIzaSyDvIeYbzsXrEVUG2rC3rLJz7TCHj4qoPnk",
    authDomain: "eulap-dtr.firebaseapp.com",
    projectId: "eulap-dtr",
    storageBucket: "eulap-dtr.appspot.com",
    messagingSenderId: "693947688025",
    appId: "1:693947688025:web:5942c49f474ff1fc3afd48",
    measurementId: "G-BYEEMVWVFP"
  };
  // line of code below is to create a formatted date use as a collection or docreference in database
  const currentDate = new Date(); 
  const year = currentDate.getFullYear();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const day = ('0' + currentDate.getDate()).slice(-2);
  const formattedDate = `${month}-${day}-${year}`;
  //Initialize Firebase
  firebase.initializeApp(eulap_firebase_database);
  const eulap_admin_account_collection = firebase.firestore().collection('EULAP ADMIN ACCOUNT');
  
  function display_c(){
    var refresh=1000; // Refresh rate in milli seconds
    mytime=setTimeout('display_ct()',refresh);
    }
    
    function display_ct() {
    const currentTime = new Date().toLocaleTimeString([], {hour12: true}); 
    const currentDate = new Date(); 
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const formattedDate = `${month}-${day}-${year}`;
    const display_currentDate = document.getElementById('current-date');
    const display_currentTime = document.getElementById('current-time');
    display_currentDate.textContent = formattedDate;
    display_currentTime.textContent = currentTime;
    display_currentDate.style.fontWeight = "bold";
    display_currentTime.style.fontWeight = "bold";
    display_c();
    }

    const usernameElement = document.getElementById('username');
    const passwordEleement = document.getElementById('password');
    const login_button = document.getElementById('login-button');
    const forgot_password = document.getElementById('forgot-password');

    // passwordEleement.type = 'password';

    forgot_password.addEventListener('click', function () {
      alert('Contact the admin of database');
    });

    login_button.addEventListener('click', function() {
      const username_value = usernameElement.value;
      const password_value = passwordEleement.value;
      if (username_value == "") {
        usernameElement.focus();
        console.log('empty');
      } else if (password_value == "") {
        passwordEleement.focus();
        console.log('empty');
      } else {
        eulap_admin_account_collection.doc('ACCOUNT').onSnapshot((doc) => {
          const username = doc.data().username;
          const password = doc.data().password;
          
          if (password_value == password && username_value == username) {
            window.location.replace("../html_modified/read_eulap_employee_attendance.html");
          } else {
            alert('Invalid username');
          }
        });
      }
    });