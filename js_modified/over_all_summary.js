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

firebase.initializeApp(eulap_firebase_database);

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

    const tr = document.createElement('tr');
    const dateDataTd = document.createElement('td');

    // start initialized the destination
    const eulap_summary_attendance_collection = firebase.firestore().collection('EULAP SUMMARY OF ATTENDANCES');
    // strat query
    eulap_summary_attendance_collection.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const dateID = doc.id;
        const list_the_data = document.getElementById('list-the-data');
        const p = document.createElement('p');
        const button = document.createElement('a')
        p.textContent = dateID;
        p.style.fontWeight = 'bold';
        button.className = 'btn btn-outline-warning m-1';
        button.appendChild(p);
        list_the_data.appendChild(button);

        p.addEventListener('click', function() {
          const documentReferenceID = dateID;
          // pass the data to other html or js
          sessionStorage.setItem("documentReferenceID", documentReferenceID);
          window.location.href = "../html_modified/view_selected_day_from_summary.html";
        });
      });
    });

  const find_button = document.getElementById('find-btn');

  find_button.addEventListener('click', function() {
    var dateInput = document.getElementById("select-date");
    var selectedDate = dateInput.value;
  
    const formattedSelectedDate = new Date(selectedDate);
    const year = formattedSelectedDate.getFullYear();
    const month = ('0' + (formattedSelectedDate.getMonth() + 1)).slice(-2);
    const day = ('0' + formattedSelectedDate.getDate()).slice(-2);
    const findDate = `${month}-${day}-${year}`;

    if (findDate == 'aN-aN-NaN') {
      console.log('non');
    } else {
      eulap_summary_attendance_collection.doc(findDate).onSnapshot((checkDate) => {
        if (checkDate.exists) {
          const documentReferenceID = findDate;
          // pass the data to other html or js
          sessionStorage.setItem("documentReferenceID", documentReferenceID);
          window.location.href = "../html_modified/view_selected_day_from_summary.html";
        } else {
          alert('Date Selected are not found!');
        }
      });
    }
  });