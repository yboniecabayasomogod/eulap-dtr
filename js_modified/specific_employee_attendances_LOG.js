// retireve the data that pass from eulap_employee_information.js
// set as the title of the page
var idNumber = sessionStorage.getItem("idNumber");
var pageTitle = document.getElementById("idNumber");
pageTitle.innerHTML = "eulap Employee Id " + idNumber;

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
  
  function display_c(){
    var refresh=1000; // Refresh rate in milli seconds
    mytime=setTimeout('display_ct()',refresh)
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

    const eulap_employee_attendance_log = firebase.firestore().collection('SPECIFIC EMPLOYEE SUMMARY OF ATTENDANCE');
    const eulap_display_collection = firebase.firestore().collection('eulap_register');

    eulap_display_collection.doc(idNumber).onSnapshot((doc) => {
        // display the fullname first
        const fullnameElement = document.getElementById('who-is-it');
        // get to database
        const fullName = doc.data().firstname + " " + doc.data().lastname;
        // displayed
        fullnameElement.textContent = fullName;
    });

    eulap_employee_attendance_log.doc(idNumber).collection('LOG').onSnapshot((querySnapshot) => {
        let tableRows = [];
        querySnapshot.forEach((doc) => {
             // For each document, create a <tr> element with three <td> elements and add it to the table
            const tr = document.createElement("tr");
            const dateTd = document.createElement("td");
            const timeInTD = document.createElement("td");
            const timeOutTD = document.createElement("td");
            const totalWorkHoursTd = document.createElement("td");
            // digned the table in specific table data or td
            dateTd.style.textAlign = "center";
            timeInTD.style.textAlign = "center";
            timeOutTD.style.textAlign = "center";
            totalWorkHoursTd.style.textAlign = "center";
            dateTd.style.fontWeight = "bold";
            timeInTD.style.fontWeight = "bold";
            timeOutTD.style.fontWeight = "bold";
            totalWorkHoursTd.style.fontWeight = "bold";

            //calling data from database and Combine firstName, middleName, lastName into fullName
            const time_in = doc.data().time_in;
            const time_out = doc.data().time_out;
            const date = doc.data().date;

            // convert to date
            const date_converted_to_date = date.toDate();
            const year = date_converted_to_date.getFullYear();
            const month = ('0' + (date_converted_to_date.getMonth() + 1)).slice(-2);
            const day = ('0' + date_converted_to_date.getDate()).slice(-2);
            const formattedDate = `${month}-${day}-${year}`;
            // convert to time
            const time_in_converted_to_time = time_in.toDate();
            const time_in_formatted = new Date(time_in_converted_to_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            // convert to time
            const time_out_converted_to_time = time_out.toDate();
            const time_out_formatted = new Date(time_out_converted_to_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

            // calculate if late
            const validate_time_in_if_late = new Date(time_in_converted_to_time).getHours();
            // validate if the timein if late
            if (validate_time_in_if_late >= 9) {
              timeInTD.style.background = "#ff6666";
            }
            else{
              timeInTD.style.background = "#85e085";
            }
            // calculate minutes between two dates
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
            // set the text
            dateTd.textContent = formattedDate;
            timeInTD.textContent = time_in_formatted;
            timeOutTD.textContent = time_out_formatted;
            totalWorkHoursTd.textContent = displayTotalHours;
            // display now
            tr.appendChild(dateTd);
            tr.appendChild(timeInTD);
            tr.appendChild(timeOutTD);
            tr.appendChild(totalWorkHoursTd);

            tableRows.push(tr);
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
    })

    