
const contactForm = document.querySelector('.contact-form');
let uname = document.getElementById('username');
let uemail = document.getElementById('useremail');
let usubject = document.getElementById('usersubject');
let umessage = document.getElementById('userdescription');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    let formData = {
      uname: uname.value,
      uemail: uemail.value,
      usubject: usubject.value,
      umessage: umessage.value
    }
  
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/contact');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function () {
      console.log(xhr.responseText);
      if(xhr.responseText == 'success') {
        alert('Email sent successfully');
        uname.value = '';
        uemail.value = '';
        usubject.value = '';
        umessage.value = '';
      } else {
        alert('Something went wrong');
      }
    }
  
    xhr.send(JSON.stringify(formData));
  
  });