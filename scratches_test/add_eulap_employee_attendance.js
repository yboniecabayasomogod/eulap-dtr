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
const eulap_attendance_collection = firebase.firestore().collection('eulap_register');

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
  processData(currentDate, formattedDate);
  }

  function processData(currentDate, formattedDate) {

    let tableRows = [];

    eulap_attendance_collection.onSnapshot((querySnapshot) => {
      // Clear the table rows array when changes happen
      tableRows = [];
      querySnapshot.forEach((doc) => {
      // For each document, create a <tr> element with three <td> elements and add it to the table
      const tr = document.createElement("tr");
      const aidNumberTd = document.createElement("td");
      const fullNameTd = document.createElement("td");
      const buttonTimeInTd = document.createElement("td");
      const buttonTimeOutTd = document.createElement("td");
      // set up the data from database
      const attendanceTracker = doc.id;
      // Combine firstName, middleName, lastName into fullName
      const fullName = doc.data().firstname + " " + doc.data().middle_initial_name + " " + doc.data().lastname;
      let create_timeIn_button = document.createElement("button");
      let create_timeOut_button = document.createElement("button");
      // create style of button
      create_timeIn_button.className = "btn btn-info m-1";
      create_timeIn_button.innerText = "Time In";
      create_timeIn_button.style.width = "100%";
      create_timeOut_button.className = "btn btn-danger m-1";
      create_timeOut_button.innerText = "Time Out";
      create_timeOut_button.style.width = "100%";
      // put a create dbutton inside the td
      buttonTimeInTd.appendChild(create_timeIn_button);
      buttonTimeOutTd.appendChild(create_timeOut_button);
      // convert to textcontext to display in the html
      aidNumberTd.textContent = attendanceTracker;
      fullNameTd.textContent = fullName;
      tr.appendChild(aidNumberTd);
      tr.appendChild(fullNameTd);
      tr.appendChild(buttonTimeInTd);
      tr.appendChild(buttonTimeOutTd);    
      // Add the <tr> element to the tableRows array
      tableRows.push(tr);

      // display full information when click the full name
      fullNameTd.addEventListener("click", function() {
        const company_position = doc.data().company_position
        const age = doc.data().age;
        const gender = doc.data().gender;
        const address = doc.data().address;
        const contact = doc.data().contact;
        alert("Selected Employee Information \n\n"
        +"Name: "+fullName+"\n"
        +"Company Position: "+company_position+"\n"
        +"Age:  "+age+"\n"
        +"Gender:  "+gender+"\n"
        +"Address:  "+address+"\n"
        +"Contact:  "+contact);
    });

      const eulap_add_attendance_collection = firebase.firestore().collection('EULAP SUMMARY OF ATTENDANCES').doc(formattedDate);

      create_timeIn_button.addEventListener("click", function() {
        const idNumber = doc.data().id_number
        const firstName = doc.data().firstname;
        const middleName = doc.data().middle_initial_name;
        const lastName = doc.data().lastname;

        // add data for waking up the documents that having a subcollection
        const wakeUpDocumentPurpose = {
          wakeUpDocument:"waking up"
        }
        eulap_add_attendance_collection.set(wakeUpDocumentPurpose);
        // prepare data before go to the database
        const data = {
        id_number: idNumber,
        firstname: firstName,
        middle_initial_name: middleName,
        lastname: lastName,
        time_in: currentDate
        };
        // Define your custom ID
        const customId = idNumber;
        // Add a new document with your custom ID
        if (confirm("Do you want to Time In? \n" + firstName + " " + lastName) == true) {
          eulap_add_attendance_collection.collection('EMPLOYEE ID').doc(customId).set(data)
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
      
      create_timeOut_button.addEventListener("click", function() {
        // reading the data if already log in
        const idNumber = doc.data().id_number;
        const firstName = doc.data().firstname;
        const middleName = doc.data().middle_initial_name;
        const lastName = doc.data().lastname;
        // Define your custom ID
        const customId = idNumber;
        // validate if user already time in becuase its already created id
        eulap_add_attendance_collection.collection('EMPLOYEE ID').doc(customId).onSnapshot((doc) =>{
          if (doc.exists) {
            const data = {
              time_out: currentDate
            }
            // add alert to validate if need to time out the data
            if (confirm("Do you want to Time Out? \n" + firstName + " " + lastName)) {
              // add the time out to database
              eulap_add_attendance_collection.collection('EMPLOYEE ID').doc(customId).update(data)
              .then(() => {
                // the data will pass to other database collection or table fo the specific employee summary attendances
                const specific_employee_summary_of_attendances = firebase.firestore().collection('SPECIFIC EMPLOYEE SUMMARY OF ATTENDANCE');
                const specificData = {
                time_in: doc.data().time_in,
                time_out: currentDate,
                date: doc.data().time_in,
                firstName: firstName,
                middleName: middleName,
                lastName: lastName
              }
              // start add the data
              // add varibale to waking up
              const wakingUp = {
                wakingUP: 'wakingUp'
              }
              specific_employee_summary_of_attendances.doc(customId).set(wakingUp);
              
              specific_employee_summary_of_attendances.doc(customId).collection('LOG').doc().set(specificData)
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
          } else {
            alert('Not already Time in')
          }
        });
      });
    });
      // Clear the contents of the table before adding new rows
      const table = document.getElementById("database-table");
      while (table.firstChild) {
        table.removeChild(table.firstChild);
      }
      // Add the new rows to the table
      tableRows.forEach((tr) => {
        table.appendChild(tr);
      });
    });
  }
  