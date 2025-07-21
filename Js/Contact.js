const scriptURL = 'https://script.google.com/macros/s/AKfycbxlvbrVKhYVNNOyTfRUwQc3qK1FHOnXOnfF0Hhifmw7FVu6FtUcM1M-kfgLAMB63iZPhg/exec'


const form = document.forms['section-contact']


form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => swal("Thank you!", "Your form is submitted successfully!", "success"))
    .then(() => { window.location.reload(); })
    .catch(error => swal("Error!", "An error occurred while submitting the form!", "error"))
})




