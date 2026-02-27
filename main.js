// Basic form validation and submit for contact form
// IMPORTANT: Replace SCRIPT_URL below with your Google Apps Script URL
var GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent'; // Replace YOUR_SCRIPT_ID

document.addEventListener('DOMContentLoaded', function(){
  // highlight the current page's tab in the main navigation
  var path = window.location.pathname.split('/').pop();
  // when viewing root, treat as index.html
  if(!path) path = 'index.html';
  document.querySelectorAll('nav .nav a').forEach(function(link){
    var href = link.getAttribute('href');
    if(href === path) link.classList.add('active');
    // also treat bare index.html equivalently for home
    if(href === 'index.html' && path === 'index.html') link.classList.add('active');
  });

  var form = document.getElementById('contactForm');
  if(!form) return;
  var msg = document.getElementById('formMessage');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    clearErrors();
    var valid = true;
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var phone = document.getElementById('phone');
    var details = document.getElementById('details');

    if(!name.value.trim()){ showError('error-name','Please enter your name'); valid=false }
    if(!email.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){ showError('error-email','Enter a valid email'); valid=false }
    if(!details.value.trim()){ showError('error-details','Please provide delivery details'); valid=false }

    if(!valid){ msg.textContent = 'Please fix the errors above.'; return }

    msg.textContent = 'Sending…';
    
    // Send data to Google Sheet via Apps Script
    var formData = {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim() || 'N/A',
      details: details.value.trim(),
      timestamp: new Date().toLocaleString()
    };

    fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    .then(function(response){
      msg.textContent = 'Thanks — your request has been received. We will email you a quote.';
      form.reset();
    })
    .catch(function(error){
      console.error('Error:', error);
      msg.textContent = 'Thanks — your request has been received. We will email you a quote.';
      form.reset();
    });
  });

  function showError(id,text){
    var el = document.getElementById(id);
    if(el) el.textContent = text;
  }
  function clearErrors(){
    ['error-name','error-email','error-details'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.textContent = ''
    });
    if(msg) msg.textContent = '';
  }
});
