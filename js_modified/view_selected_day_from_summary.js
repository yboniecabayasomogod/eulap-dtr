// retireve the data that pass from eulap_employee_information.js
// set as the title of the page
var documentReferenceID = sessionStorage.getItem("documentReferenceID");
var pageTitle = document.getElementById("documentReferenceID");
pageTitle.innerHTML = "Summary day of " + documentReferenceID + "!";

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
  const eulap_summary_attendance_collection = firebase.firestore().collection('EULAP SUMMARY OF ATTENDANCES').doc(documentReferenceID).collection('EMPLOYEE ID');
  
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
    const display_selected_date = document.getElementById('date-day-selected');
    display_selected_date.textContent = documentReferenceID;
    display_currentDate.textContent = formattedDate;
    display_currentTime.textContent = currentTime;
    display_currentDate.style.fontWeight = "bold";
    display_currentTime.style.fontWeight = "bold";
    processData();
    display_c();
    }
  
    function processData() {    
          let tableRows = [];
      
          eulap_summary_attendance_collection.onSnapshot((querySnapshot) => {
            // Clear the table rows array when changes happen
            tableRows = [];
            querySnapshot.forEach((doc) => {
            // For each document, create a <tr> element with three <td> elements and add it to the table
            const tr = document.createElement("tr");
            const idNumberTd = document.createElement("td");
            const fullNameTd = document.createElement("td");
            const timeInTD = document.createElement("td");
            const timeOutTD = document.createElement("td");
            const totalWorkHoursTd = document.createElement("td");
            // digned the table in specific table data or td
            fullNameTd.className = "text-capitalize";
            timeInTD.style.textAlign = "center";
            timeOutTD.style.textAlign = "center";
            totalWorkHoursTd.style.textAlign = "center";
            timeInTD.style.fontWeight = "bold";
            timeOutTD.style.fontWeight = "bold";
            totalWorkHoursTd.style.fontWeight = "bold";
            // set up the data from database
            const idNumber = doc.id;
            //calling data from database and Combine firstName, middleName, lastName into fullName
            const fullName = doc.data().firstname + " " + doc.data().middle_initial_name + " " + doc.data().lastname;
            const timeIn = doc.data().time_in;
            const timeOut = doc.data().time_out;
            // time_out_validation if the database is null
            if (timeOut == null) {
              // formating the timeIn and timeOut from database
              const time_in_converted_to_time =  timeIn.toDate();
              const time_in_formatted = new Date(time_in_converted_to_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
              // convert to textcontext to display in the html
              idNumberTd.textContent = idNumber;
              fullNameTd.textContent = fullName;
              timeInTD.textContent = time_in_formatted;
              // calculate if late
              const validate_time_in_if_late = new Date(time_in_converted_to_time).getHours();
              // validate if the timein if late
              if (validate_time_in_if_late >= 9) {
                timeInTD.style.background = "#ff6666";
              }
              else{
                timeInTD.style.background = "#85e085";
              }
              // display the data to the table
              tr.appendChild(idNumberTd);
              tr.appendChild(fullNameTd);
              tr.appendChild(timeInTD);
              // Add the <tr> element to the tableRows array
              tableRows.push(tr);
                          // called another collection for display information
                          const eulap_attendance_collection = firebase.firestore().collection('eulap_register');
                          eulap_attendance_collection.doc(idNumber).onSnapshot((doc) => {
                            fullNameTd.addEventListener("click", function() {
                              const idNumber = doc.data().id_number
                              const firstName = doc.data().firstname;
                              const middleName = doc.data().middle_initial_name;
                              const lastName = doc.data().lastname;
                              const position = doc.data().company_position;
                              const age = doc.data().age;
                              const gender = doc.data().gender;
                              const address = doc.data().address;
                              const contact = doc.data().contact;
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
            } else {
              // calculate minutes between two dates
              const time_in_converted_to_time = timeIn.toDate();
              const time_out_converted_to_time = timeOut.toDate();
              const differenceInMilliseconds = time_out_converted_to_time.getTime() - time_in_converted_to_time.getTime();
              const totalMinutes = Math.floor(differenceInMilliseconds / 60000);
              const hours = Math.floor(totalMinutes / 60) - 1;
              const minutes = totalMinutes % 60;
              const displayTotalHours = hours+":"+minutes;
              if (hours < 8) {
                totalWorkHoursTd.style.backgroundColor = "#ff6666";
              } else {
                totalWorkHoursTd.style.backgroundColor = "#85e085";
              }
              // formating the timeIn and timeOut from database
              const time_in_formatted = new Date(time_in_converted_to_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
              const time_out_formatted = new Date(time_out_converted_to_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
              // convert to textcontext to display in the html
              idNumberTd.textContent = idNumber;
              fullNameTd.textContent = fullName;
              timeInTD.textContent = time_in_formatted;
              timeOutTD.textContent = time_out_formatted;
              totalWorkHoursTd.textContent = displayTotalHours;
              // calculate if late
              const validate_time_in_if_late = new Date(time_in_converted_to_time).getHours();
              // validate if the timein if late
              if (validate_time_in_if_late >= 9) {
                timeInTD.style.background = "#ff6666";
              }
              else{
                timeInTD.style.background = "#85e085";
              }
              // display the data to the table
              tr.appendChild(idNumberTd);
              tr.appendChild(fullNameTd);
              tr.appendChild(timeInTD);
              tr.appendChild(timeOutTD);
              tr.appendChild(totalWorkHoursTd);
              // Add the <tr> element to the tableRows array
              tableRows.push(tr);
                          // called another collection for display information
                          const eulap_attendance_collection = firebase.firestore().collection('eulap_register');
                          eulap_attendance_collection.doc(idNumber).onSnapshot((doc) => {
                            fullNameTd.addEventListener("click", function() {
                              const idNumber = doc.data().id_number
                              const firstName = doc.data().firstname;
                              const middleName = doc.data().middle_initial_name;
                              const lastName = doc.data().lastname;
                              const position = doc.data().company_position;
                              const age = doc.data().age;
                              const gender = doc.data().gender;
                              const address = doc.data().address;
                              const contact = doc.data().contact;
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
            }
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
  
            // // this line is use to create a html element
          // none_working_hours_page.innerHTML = '\
          //         <div colspane="4" class="row justify-content-center m-5">\
          //           <div class="col-md-10">\
          //             <div class="alert alert-danger text-center" role="alert">\
          //               <h1>Sorry, view of data were currently closed. Can view the data from 8AM to 7PM only.</h1>\
          //             </div>\
          //           </div>\
          //         </div>';