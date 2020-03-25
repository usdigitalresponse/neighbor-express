/*
  * VERY BASIC templating system, that pulls from airtable.
  * Would want to move to ejs/handlebars/vue for a production version of this
  */
$.getJSON("/api/get-cms", function (data) {
  if (data.error) {
    return;
  }
  data.records.forEach(function (record) {
    const article = document.getElementById(record.key);
    // First, lets check for a title
    if (article) {
      nunjucks.configure({ autoescape: false });
      const replacement = nunjucks.renderString(article.innerHTML, record);
      article.innerHTML = replacement;
    }
  });
});


/*
* Capturing our form submission, and then sending the elements to the backend.
* Right now we're relying on html5 input validation, but that doesn't work in all
* browsers, so we'd probably do validation here
*/
const form = document.getElementById("name_form");
form.addEventListener("submit", event => {
  event.preventDefault();

  const data = {
    title: form.elements["title"].value,
    firstName: form.elements["firstName"].value,
    middleName: form.elements["middleName"].value,
    lastName: form.elements["lastName"].value
  };

  $.post("/api/post-cms", data, res => {
    document.getElementById(`name_submit`).disabled = true;
    document.getElementById(`name_submit`).value = "Submitted!";
  });
});