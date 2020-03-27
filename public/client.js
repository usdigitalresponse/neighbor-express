window.addEventListener('load', (event) => {


  $.getJSON("/api/get-cms", function (data) {
    if (data.error) {
      return;
    }

    var template = document.getElementById('template').innerHTML;
    // var rendered = Mustache.render(template, { brand: 'Neighbor Express' });
    let target = document.getElementById('target');
    target.innerHTML = template;

    Formio.createForm(target.querySelector('#formio'), {
      "components": [
        {
          "label": "Columns",
          "columns": [
            {
              "components": [
                {
                  "label": "First Name",
                  "spellcheck": true,
                  "tableView": true,
                  "calculateServer": false,
                  "validate": {
                    "required": true
                  },
                  "key": "firstName",
                  "type": "textfield",
                  "input": true,
                  "hideOnChildrenHidden": false
                }
              ],
              "width": 6,
              "offset": 0,
              "push": 0,
              "pull": 0,
              "size": "md"
            },
            {
              "components": [
                {
                  "label": "Last Name",
                  "spellcheck": true,
                  "tableView": true,
                  "calculateServer": false,
                  "validate": {
                    "required": true
                  },
                  "key": "lastName",
                  "type": "textfield",
                  "input": true,
                  "hideOnChildrenHidden": false
                }
              ],
              "width": 6,
              "offset": 0,
              "push": 0,
              "pull": 0,
              "size": "md"
            }
          ],
          "tableView": false,
          "key": "columns",
          "type": "columns",
          "input": false
        },
        {
          "label": "Email",
          "spellcheck": true,
          "tableView": true,
          "calculateServer": false,
          "validate": {
            "required": true
          },
          "key": "email",
          "type": "email",
          "input": true
        },
        {
          "label": "Phone Number",
          "spellcheck": true,
          "tableView": true,
          "calculateServer": false,
          "validate": {
            "required": true
          },
          "key": "phoneNumber",
          "type": "phoneNumber",
          "input": true
        },
        {
          "label": "Address",
          "tableView": false,
          "calculateServer": false,
          "provider": "nominatim",
          "key": "address",
          "type": "address",
          "input": true,
          "components": [
            {
              "label": "Address 1",
              "tableView": false,
              "key": "address1",
              "type": "textfield",
              "input": true,
              "customConditional": "show = _.get(instance, 'parent.manualMode', false);"
            },
            {
              "label": "Address 2",
              "tableView": false,
              "key": "address2",
              "type": "textfield",
              "input": true,
              "customConditional": "show = _.get(instance, 'parent.manualMode', false);"
            },
            {
              "label": "City",
              "tableView": false,
              "key": "city",
              "type": "textfield",
              "input": true,
              "customConditional": "show = _.get(instance, 'parent.manualMode', false);"
            },
            {
              "label": "State",
              "tableView": false,
              "key": "state",
              "type": "textfield",
              "input": true,
              "customConditional": "show = _.get(instance, 'parent.manualMode', false);"
            },
            {
              "label": "Country",
              "tableView": false,
              "key": "country",
              "type": "textfield",
              "input": true,
              "customConditional": "show = _.get(instance, 'parent.manualMode', false);"
            },
            {
              "label": "Zip Code",
              "tableView": false,
              "key": "zip",
              "type": "textfield",
              "input": true,
              "customConditional": "show = _.get(instance, 'parent.manualMode', false);"
            }
          ]
        },
        {
          "label": "Do you have a car you would be willing to drive?",
          "optionsLabelPosition": "right",
          "inline": false,
          "tableView": false,
          "values": [
            {
              "label": "Yes",
              "value": "yes",
              "shortcut": ""
            },
            {
              "label": "No",
              "value": "no",
              "shortcut": ""
            }
          ],
          "calculateServer": false,
          "key": "doYouHaveACar",
          "type": "radio",
          "input": true
        },
        {
          "label": "If you have one, please post a link to LinkedIn/Facebook/Twitter/Instagram profile, so we can verify your identity ",
          "spellcheck": true,
          "tableView": true,
          "calculateServer": false,
          "key": "social",
          "type": "textfield",
          "input": true
        },
        {
          "label": "Do you have any other volunteer experience in Concord? If so, where was it?",
          "spellcheck": true,
          "tableView": true,
          "calculateServer": false,
          "key": "otherVolunteerExperience",
          "type": "textfield",
          "input": true
        },
        {
          "label": "Health",
          "optionsLabelPosition": "right",
          "description": "Reminder: you must be healthy to be a volunteer. If you have any questions, please do not take the pledge and email us instead so we can talk it through. Please check the following boxes to complete the Volunteer Pledge.",
          "tableView": false,
          "values": [
            {
              "label": "I am not exhibiting any symptoms of COVID-19 (cough, fever, etc.)",
              "value": "1",
              "shortcut": ""
            },
            {
              "label": "I have not traveled out-of-country in the past 14 days",
              "value": "2",
              "shortcut": ""
            },
            {
              "label": " I have not come in contact with a sick person in the past 14 days",
              "value": "3",
              "shortcut": ""
            },
            {
              "label": "I have been practicing social distancing",
              "value": "4",
              "shortcut": ""
            }
          ],
          "calculateServer": false,
          "key": "health",
          "type": "selectboxes",
          "input": true,
          "inputType": "checkbox",
          "defaultValue": {
            "": false
          }
        },
        {
          "label": "How many days a week do you anticipate being available for at least one delivery? ",
          "mask": false,
          "spellcheck": true,
          "tableView": false,
          "delimiter": false,
          "requireDecimal": false,
          "inputFormat": "plain",
          "calculateServer": false,
          "key": "howManyDaysAWeekDoYouAnticipateBeingAvailableForAtLeastOneDelivery",
          "type": "number",
          "input": true,
          "defaultValue": 1
        },
        {
          "label": "Any additional notes for us? ",
          "description": "E.g. Are there any volunteer tasks you would or would not feel comfortable performing?",
          "autoExpand": false,
          "spellcheck": true,
          "tableView": true,
          "calculateServer": false,
          "key": "anyAdditionalNotesForUs",
          "type": "textarea",
          "input": true
        },
        {
          "label": "Yes, please add me",
          "description": "Check here if you would like to be added to a mailing list to learn about future volunteer opportunities",
          "tableView": false,
          "calculateServer": false,
          "key": "yesPleaseAddMe",
          "type": "checkbox",
          "input": true,
          "defaultValue": false
        },
        {
          "label": "I certify I am over the age of 18 (sorry, that's our current cut-off for volunteers! We'd love to see younger folks help in other ways)",
          "tableView": false,
          "calculateServer": false,
          "key": "iCertifyIAmOverTheAgeOf18SorryThatsOurCurrentCutOffForVolunteersWedLoveToSeeYoungerFolksHelpInOtherWays",
          "type": "checkbox",
          "input": true,
          "defaultValue": false
        },
        {
          "label": "Submit",
          "showValidations": false,
          "tableView": false,
          "key": "submit1",
          "type": "button",
          "input": true
        }
      ]
    }).then(function (form) {
      form.on('submit', (submission) => {
        console.log('The form was just submitted!!!', submission);
        const data = {
          firstName: submission.data.firstName,
          lastName: submission.data.lastName,
        }

        $.post("/api/post-cms", data, res => {
          document.getElementById(`formio`).classList.add('hidden');
        });
        return;
      });
      form.on('error', (errors) => {
        console.log('We have errors!');
      })
    });

    data.records.forEach(function (record) {
      // const article = document.getElementById(record.key);
      const article = target.querySelector(`#${record.key}`);
      // First, lets check for a title
      if (article) {
        let render = Mustache.render(article.innerHTML, { ...record, image: record.picture.length > 0 && record.picture[0].url });
        article.innerHTML = render;
        body.classList.remove('hidden');
      }
    });
  });

  /*
* Capturing our form submission, and then sending the elements to the backend.
* Right now we're relying on html5 input validation, but that doesn't work in all
* browsers, so we'd probably do validation here
*/
  // const form = document.getElementById("name_form");
  // form.addEventListener("submit", event => {
  //   event.preventDefault();

  //   const data = {
  //     title: form.elements["title"].value,
  //     firstName: form.elements["firstName"].value,
  //     middleName: form.elements["middleName"].value,
  //     lastName: form.elements["lastName"].value
  //   };

  //   $.post("/api/post-cms", data, res => {
  //     document.getElementById(`name_submit`).disabled = true;
  //     document.getElementById(`name_submit`).value = "Submitted!";
  //   });
  // });
});