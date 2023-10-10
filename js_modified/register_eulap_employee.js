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
  
  const eulap_register_collection = firebase.firestore().collection('eulap_register');
  // html object htmlelements
  const submit_button_attendance = document.getElementById("btn-submit-attendance");
  const id_number_entered = document.getElementById("id-number-input");
  const company_position_selected = document.getElementById("position-select");
  const firstname_entered = document.getElementById("firstname-input");
  const middle_initial_name_entered = document.getElementById("middle-initial-input");
  const lastname_entered = document.getElementById("lastname-input");
  const age_entered = document.getElementById("age-input");
  const gender_selected = document.getElementById("gender-select");
  const address_entered = document.getElementById("address-input");
  const contact_entered = document.getElementById("contact-input");
  // Add an event listener to the button
  submit_button_attendance.addEventListener('click', function() {
  // Prepare the data to add
  const id_number_get_value = id_number_entered.value;
  const company_position_value = company_position_selected.value;
  const firstname_get_value = firstname_entered.value.toLowerCase();
  const middle_initial_name_get_value = middle_initial_name_entered.value.toLowerCase();
  const lastname_get_value = lastname_entered.value.toLowerCase();
  const age_get_value = age_entered.value;
  const gender_value = gender_selected.value;
  const address_get_value = address_entered.value;
  const contact_get_value = contact_entered.value;
  // another declaration for validation of lenght entered by user
  let id_number_length_validate = id_number_get_value.length;
  let contact_length_validate = contact_get_value.length;
  // validate if user are enter is some feild
  if (id_number_get_value == "") {
    id_number_entered.focus();
  }
  else if (id_number_length_validate < 7 || id_number_length_validate > 7) {
    id_number_entered.focus();
  }
  else if (company_position_value == "Select your position in eulap company...") {
    company_position_selected.focus();
  }
  else if (firstname_get_value == "") {
    firstname_entered.focus();
  }
  else if (middle_initial_name_get_value == "") {
    middle_initial_name_entered.focus();
  }
  else if (lastname_get_value == "") {
    lastname_entered.focus();
  }
  else if (age_get_value == "") {
    age_entered.focus();
  }
  else if (gender_value == "Select your Gender...") {
    gender_selected.focus();
  }
  else if (address_get_value == "") {
    address_entered.focus();
  }
  else if (contact_get_value == "") {
    contact_entered.focus();
  }
  else if (contact_length_validate < 11 || contact_length_validate > 11) {
    contact_entered.focus();
  }
  else {
    // prepare data before go to the database
    const data = {
      id_number: id_number_get_value,
      company_position: company_position_value,
      firstname: firstname_get_value,
      middle_initial_name: middle_initial_name_get_value,
      lastname: lastname_get_value,
      age: age_get_value,
      gender: gender_value,
      address: address_get_value,
      contact: contact_get_value
      };
      // Define your custom ID
      const customId = id_number_get_value;
      // Add a new document with your custom ID
      if (confirm("Do you want to register? " + firstname_get_value + " " + lastname_get_value) == true) {
        eulap_register_collection.doc(customId).set(data)
        .then(() => {
          alert('Registered succesfully! ' + firstname_get_value + " " + lastname_get_value);
          window.location.replace("../html_modified/add_eulap_employee_attendance.html");
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
      } else {
        alert("Cancelled!");
      }

    }
  });
  