//Unique Firebase Object
eulap_firebase_database = {
  apiKey: "AIzaSyDvIeYbzsXrEVUG2rC3rLJz7TCHj4qoPnk",
  authDomain: "eulap-dtr.firebaseapp.com",
  projectId: "eulap-dtr",
  storageBucket: "eulap-dtr.appspot.com",
  messagingSenderId: "693947688025",
  appId: "1:693947688025:web:5942c49f474ff1fc3afd48",
  measurementId: "G-BYEEMVWVFP"
};
firebase.initializeApp(eulap_firebase_database);
const eulap_register_collection = firebase.firestore().collection('eulap_register');

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

    const currentDate = new Date(); 
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const formattedDate = `${month}-${day}-${year}`;

    
    const eulap_add_attendance_collection = firebase.firestore().collection('EULAP SUMMARY OF ATTENDANCES').doc(formattedDate);

    let tableRows = [];

    eulap_register_collection.onSnapshot((querySnapshot) => {
      
      tableRows = [];

      querySnapshot.forEach((doc) => {
        const tr = document.createElement("tr");
        const idNumberTd = document.createElement("td");
        const fullNameTd = document.createElement("td");
        const buttonTimeInTimeOutTd = document.createElement("td");
        fullNameTd.className = "text-capitalize";
        const idNumber = doc.id;
        const fullName = doc.data().firstname + " " + doc.data().middle_initial_name + " " + doc.data().lastname;
       
        let create_timeInTimeOut_button = document.createElement("button");

        buttonTimeInTimeOutTd.appendChild(create_timeInTimeOut_button);

        idNumberTd.textContent = idNumber;
        fullNameTd.textContent = fullName;

        // check the information of each of one
        eulap_register_collection.doc(idNumber).onSnapshot((findRegistered) => {
          const idNumber = findRegistered.data().id_number
          const firstName = findRegistered.data().firstname;
          const middleName = findRegistered.data().middle_initial_name;
          const lastName = findRegistered.data().lastname;
          const position = findRegistered.data().company_position;
          const age = findRegistered.data().age;
          const gender = findRegistered.data().gender;
          const address = findRegistered.data().address;
          const contact = findRegistered.data().contact;

          fullNameTd.addEventListener('click', function() {
            alert('ID Number: ' + idNumber + '\n'
                + 'Firstname: ' + firstName + '\n'
                + 'Middlename: ' + middleName + '\n'
                + 'Lastname: ' + lastName + '\n'
                + 'Company position: ' + position + '\n'
                + 'Age: ' + age + '\n'
                + 'Gender: ' + gender + '\n'
                + 'Address: ' + address + '\n'
                + 'Contact: ' + contact);
          });  
        });

        // check if already time in
        eulap_add_attendance_collection.collection('EMPLOYEE ID').doc(idNumber).onSnapshot((findTimeInOut) => {
          if (findTimeInOut.exists) {
            // check if already time out
            if (findTimeInOut.data().time_out != null) {
              // timeOut
              create_timeInTimeOut_button.className = "btn btn-warning m-1";
              create_timeInTimeOut_button.innerText = "Done!, TimeIn & TimeOut";
              create_timeInTimeOut_button.style.width = "100%";

              const timeOut = findTimeInOut.data().time_out;
              const timeOutToDate = timeOut.toDate();
              const time_out_formatted = new Date(timeOutToDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

              create_timeInTimeOut_button.addEventListener('click', function() {
                alert(fullName + '\n' + 'Already time Out, at ' + time_out_formatted);
              });

            } else {
              // timeOut
              create_timeInTimeOut_button.className = "btn btn-danger m-1";
              create_timeInTimeOut_button.innerText = "Time Out";
              create_timeInTimeOut_button.style.width = "100%";

              create_timeInTimeOut_button.addEventListener('click', function() {
                eulap_register_collection.doc(idNumber).onSnapshot((findQuery) => {

                  const idNumber = findQuery.data().id_number
                  const firstName = findQuery.data().firstname;
                  const middleName = findQuery.data().middle_initial_name;
                  const lastName = findQuery.data().lastname;

                  const wakeUpDocumentPurpose = {
                    wakeUpDocument:"waking up"
                  }
                  eulap_add_attendance_collection.set(wakeUpDocumentPurpose);

                  const data = {
                    time_out: currentDate
                  };
                    
                  // add alert to validate if need to time out the data
                  if (confirm("Do you want to Time Out? \n" + firstName + " " + lastName)) {
                    // add the time out to database
                    eulap_add_attendance_collection.collection('EMPLOYEE ID').doc(idNumber).update(data)
                    .then(() => {
                      const specificData = {
                      time_in: findTimeInOut.data().time_in,
                      time_out: currentDate,
                      date: findTimeInOut.data().time_in,
                      firstName: firstName,
                      middleName: middleName,
                      lastName: lastName
                    }
                    // the data will pass to other database collection or table fo the specific employee summary attendances
                    const specific_employee_summary_of_attendances = firebase.firestore().collection('SPECIFIC EMPLOYEE SUMMARY OF ATTENDANCE');

                    specific_employee_summary_of_attendances.doc(idNumber).set(wakeUpDocumentPurpose);
                    
                    specific_employee_summary_of_attendances.doc(idNumber).collection('LOG').doc(formattedDate).set(specificData)
                    .then(() => {
                        alert('Time out success');
                        window.location.replace("../html_modified/read_eulap_employee_attendance.html");
                      })
                      .catch((error) => {
                        console.error('Error adding document: ', error);
                      });
                    })
                    .catch((error) => {
                      console.error('Error adding document: ', error);
                    });
                  } else {
                    alert("Cancelled!");
                  }
                });
              });
            }
          } else {
            // timeIn
            create_timeInTimeOut_button.className = "btn btn-info m-1";
            create_timeInTimeOut_button.innerText = "Time In";
            create_timeInTimeOut_button.style.width = "100%";

            buttonTimeInTimeOutTd.addEventListener('click', function() {
              eulap_register_collection.doc(idNumber).onSnapshot((findQuery) => {

                const idNumber = findQuery.data().id_number
                const firstName = findQuery.data().firstname;
                const middleName = findQuery.data().middle_initial_name;
                const lastName = findQuery.data().lastname;

                const wakeUpDocumentPurpose = {
                  wakeUpDocument:"waking up"
                }
                eulap_add_attendance_collection.set(wakeUpDocumentPurpose);

                const data = {
                  id_number: idNumber,
                  firstname: firstName,
                  middle_initial_name: middleName,
                  lastname: lastName,
                  time_in: currentDate
                  };
                  
                  if (confirm("Do you want to Time In? \n" + firstName + " " + lastName) == true) {
                    eulap_add_attendance_collection.collection('EMPLOYEE ID').doc(idNumber).set(data)
                  .then(() => {
                    alert('Time in success');
                    window.location.replace("../html_modified/read_eulap_employee_attendance.html");
                  })
                  .catch((error) => {
                    console.error('Error adding document: ', error);
                  });
                  } else {
                    alert("Cancelled!");
                  }
              });
            });
          }
        });

        tr.appendChild(idNumberTd);
        tr.appendChild(fullNameTd);
        tr.appendChild(buttonTimeInTimeOutTd);

        tableRows.push(tr);
        
        });
        const table = document.getElementById("database-table");
        while(table.firstChild) {
          table.removeChild(table.firstChild);
        }
        tableRows.forEach((tr) => {
          table.appendChild(tr);
        });
    });
  