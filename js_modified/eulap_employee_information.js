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
    processData();
    }
    
    function processData() {  
      let tableRows = [];
  
      eulap_attendance_collection.onSnapshot((querySnapshot) => {
        // Clear the table rows array when changes happen
        tableRows = [];
        querySnapshot.forEach((doc) => {
        // For each document, create a <tr> element with three <td> elements and add it to the table
        const tr = document.createElement("tr");
        const idNumberTd = document.createElement("td");
        const fullNameTd = document.createElement("td");
        const summaryOfDTRTd = document.createElement("td");
        const informationTd = document.createElement("td");
        const deleteTd = document.createElement("td");
        let summaryOfDTR_button = document.createElement("button");
        let information_button = document.createElement("button");
        let delete_button = document.createElement("button");

        // set up the data from database
        const idNumber = doc.id;
        // Combine firstName, middleName, lastName into fullName
        const fullName = doc.data().firstname + " " + doc.data().middle_initial_name + " " + doc.data().lastname;
        // create style of button
        fullNameTd.className = "text-capitalize";
        information_button.className = "btn btn-info m-1";
        information_button.innerText = "Update Info...";
        information_button.style.width = "100%";
        delete_button.className = "btn btn-danger m-1";
        delete_button.innerText = "Delete Info...";
        delete_button.style.width = "100%";
        summaryOfDTR_button.className = "btn btn-warning m-1";
        summaryOfDTR_button.innerText = "DTR Summary";
        summaryOfDTR_button.style.width = "100%";
        
        // put a create dbutton inside the td
        summaryOfDTRTd.appendChild(summaryOfDTR_button);
        informationTd.appendChild(information_button);
        deleteTd.appendChild(delete_button);
        // convert to textcontext to display in the html
        idNumberTd.textContent = idNumber;
        fullNameTd.textContent = fullName;
        tr.appendChild(idNumberTd);
        tr.appendChild(fullNameTd);
        tr.appendChild(summaryOfDTRTd)
        tr.appendChild(informationTd);
        tr.appendChild(deleteTd);
        // Add the <tr> element to the tableRows array
        tableRows.push(tr);

        summaryOfDTR_button.addEventListener('click', function() {
          console.log(idNumber, fullName);
          // pass the data to other html or js
          sessionStorage.setItem("idNumber", idNumber);
          window.location.href = "../html_modified/specific_employee_attendances_LOG.html";
        });
        
        information_button.addEventListener("click", function() {
            console.log(idNumber);
            // pass the data to other html or js
            sessionStorage.setItem("idNumber", idNumber);
            window.location.href = "../html_modified/update_eulap_employee_information.html";
        });

        delete_button.addEventListener("click", function() {
          // validate if delete the data
          if (confirm("Do you want to delete?") == true) {
            eulap_attendance_collection.doc(idNumber).delete().then(() => {
            }).catch((error) => {
              console.error('Error removing document: ', error);
            });
          } else {
            alert('Cancelled!');
          }
        });

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