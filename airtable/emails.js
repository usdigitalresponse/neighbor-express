// Neighbor Express Email Automation Script
//==========================================================

// This is a script that's intended to run in the Airtable Scripting Blocks environment.
// To set it up for a city:

// * Copy paste this into the Airtable Scripting Block environment for a city
// * Update the Global and City-Specific configuration sections below
// * Test it out by creating a test delivery and volunteer, and confirming that
// emails send as expected.

//==========================================================
// Global configuration -- insert global Nex sendgrid proxy credentials
//==========================================================
// This authenticates us to the Nex sendgrid proxy, a small Zeit function
// that forwards our request to the Sendgrid API.
// We need to keep this secret because anyone with this credential
// can send email on our behalf
const SENDGRID_PROXY_TOKEN= <insert credential here>

//==========================================================
// City-specific configuration: update to match the city
//==========================================================

// For each email type, point to the Sendgrid template ID
// Find the Sendgrid template IDs in Sendgrid UI.
const SENDGRID_TEMPLATES = {
    "Matched: to Volunteer": <insert template id>
    "Matched: to Recipient": <insert template id>
}

// todo: update paterson-specific
const REPLY_TO = {
    name: "Neighbor Express",
    email: "neighborexpress@gmail.com"
}

// Customize what fields we pull in from a delivery for an email template.
// If the city has adjusted field names, they need to be updated here too.
// This is an example for Paterson, but should be replaced with a city-specific
// version.
async function getEmailInfoForDelivery(delivery) {
    let volunteerData;
    if (delivery.getCellValue("Assigned volunteer") && delivery.getCellValue("Assigned volunteer").length > 0) {
        const volunteersTable = base.getTable("Volunteers");
        const allVolunteers = (await volunteersTable.selectRecordsAsync()).records;
        const volunteer = allVolunteers.find(v => v.id === delivery.getCellValue("Assigned volunteer")[0].id);
        volunteerData = {
            name: volunteer.getCellValue("Name"),
            phone: volunteer.getCellValue("Phone"),
            email: volunteer.getCellValue("Email")
        }
    } else {
        volunteerData = null;
    }

    return {
        delivery: {
            name: delivery.getCellValue("Recipient Name"),
            address: delivery.getCellValue("Address"),
            details: delivery.getCellValue("Delivery Request Details"),
            phone: delivery.getCellValue("Phone Number"),
            email: delivery.getCellValue("Email"),
            instructions: delivery.getCellValue("Delivery Instructions"),
            // we need to have a boolean value for each grocery store,
            // in order to branch conditionally on the store in the email
            grocery_store: {
                shoprite: delivery.getCellValue("Grocery Store Name").name === "ShopRite, Little Falls",
                golden_mango: delivery.getCellValue("Grocery Store Name").name === "Golden Mango, Paterson",
                pay_later: delivery.getCellValue("Payment Method").name !== "(Preferred) Call ahead to the store and pay over the phone."
            }
        },
        volunteer: volunteerData
    };
}

//==========================================================
//==========================================================
// Standard script begins here --
// You shouldn't need to change anything below this line.
//==========================================================

// Define helper functions
//==========================================================

const messagesTable = base.getTable("Messages")
const volunteersTable = base.getTable("Volunteers")
const deliveriesTable = base.getTable("Deliveries")
const allMessages = (await messagesTable.selectRecordsAsync()).records;
const allVolunteers = (await volunteersTable.selectRecordsAsync()).records;
const allDeliveries = (await deliveriesTable.selectRecordsAsync()).records;

// Compute a list of new queued messages to create, and return it.
async function computeMessagesToCreate() {
    let messagesToCreate = [];

    for (const delivery of allDeliveries) {
        const sendgridData = await getEmailInfoForDelivery(delivery);

        // assemble a list of existing message types for this delivery
        let existingMessageTypes = [];
        const existingMessages = delivery.getCellValue("Messages");
        if (existingMessages) {
            existingMessageTypes = existingMessages.map(existingMessage =>
                allMessages.find(m => m.id === existingMessage.id).getCellValue("Email type").name
            );
        } else {
            existingMessageTypes = [];
        }

        if (existingMessageTypes.indexOf("Initial Confirmation: Delivery Request") === -1) {
            const recipientEmail = sendgridData.delivery.email;
            if (recipientEmail) {
                messagesToCreate.push({
                    fields: {
                        "Delivery": [{ "id": delivery.id }],
                        "Email type": { "name": "Initial Confirmation: Delivery Request" },
                        "Status": { name: "Queued" },
                        "Recipient": recipientEmail,
                        "Template Data": JSON.stringify(sendgridData)
                    }
                })
            } else {
                output.markdown(`**Warning, Missing email address**: Couldn't create message for delivery recipient ${sendgridData.delivery.name}.`)
            }
        }

        // If the delivery is matched and we haven't emailed the volunteer yet,
        // queue up an email
        if (delivery.getCellValue("Errand Workflow Stage") &&
            delivery.getCellValue("Errand Workflow Stage").name === "Matched" &&
            existingMessageTypes.indexOf("Matched: to Volunteer") === -1) {
            const volunteerEmail = sendgridData.volunteer.email;
            if (volunteerEmail) {
                messagesToCreate.push({
                    fields: {
                        "Delivery": [{ "id": delivery.id }],
                        "Email type": { "name": "Matched: to Volunteer" },
                        "Status": { name: "Queued" },
                        "Recipient": volunteerEmail,
                        "Template Data": JSON.stringify(sendgridData)
                    }
                })
            } else {
                output.markdown(`**Warning, Missing email address**: couldn't create message for Volunteer ${sendgridData.volunteer.name}`)
            }
        }

        // If the delivery is matched and we haven't emailed the recipient yet,
        // queue up an email
        if (delivery.getCellValue("Errand Workflow Stage") &&
            delivery.getCellValue("Errand Workflow Stage").name === "Matched" &&
            existingMessageTypes.indexOf("Matched: to Recipient") === -1) {
            const recipientEmail = sendgridData.delivery.email;
            if (recipientEmail) {
                messagesToCreate.push({
                    fields: {
                        "Delivery": [{ "id": delivery.id }],
                        "Email type": { "name": "Matched: to Recipient" },
                        "Status": { name: "Queued" },
                        "Recipient": recipientEmail,
                        "Template Data": JSON.stringify(sendgridData)
                    }
                })
            } else {
                output.markdown(`**Warning, Missing email address**: Couldn't create message for delivery recipient ${sendgridData.delivery.name}.`)
            }
        }
    }

    return messagesToCreate;
}

// Given a Message Record from our Airtable, send it using Sendgrid
async function sendMessage(messageToSend) {
    const dynamicTemplateData = JSON.parse(messageToSend.getCellValue("Template Data"));
    const sendgridData = {
        "personalizations": [
            {
                "to": [
                    {
                    "email": messageToSend.getCellValue("Recipient")
                    }
                ],
                "dynamic_template_data": dynamicTemplateData
            }
        ],
        "from": {
            "name": "Neighbor Express",
            "email": "noreply@neighborexpress.org"
        },
        "reply_to": REPLY_TO,
        "template_id": SENDGRID_TEMPLATES[messageToSend.getCellValue("Email type").name]
    }

    const response = await fetch(`https://nex-sendgrid-proxy.geoffreylitt.now.sh/api/sendgrid-proxy?proxy_token=${SENDGRID_PROXY_TOKEN}`, {
        method: 'POST',
        body: JSON.stringify(sendgridData)
    });

    if (response.status === 202) {
        base.getTable("Messages").updateRecordAsync(messageToSend.id, {
            "Status": { name: "Sent" },
            "Sent Time": new Date()
        })
    } else {
        output.text(`Error: Couldn't send message ${messageToSend.id}. Contact neighborexpress@gmail.com for help.`)
    }
}

// Main UI flow
//==========================================================

output.markdown(`## Step 1: Refresh Queue`);

output.markdown(`Open the Messages tab to get started. Click below to refresh queue (won't send emails yet).`);

let enqueueButton = await input.buttonsAsync(
    'Refresh queue',
    [
        {label: `Refresh queue`, value: 'yes', variant: 'primary'},
    ],
);

const messagesToCreate = await computeMessagesToCreate();

if (messagesToCreate.length > 0) {
    messagesTable.createRecordsAsync(messagesToCreate);
    output.markdown(`**Success!** Enqueued ${messagesToCreate.length} new messages`)
} else {
    output.markdown(`No new messages to enqueue.`);
}

output.markdown(`## Step 2: Send emails`);

const messagesToSend = (await messagesTable.selectRecordsAsync()).records.filter(m => m.getCellValue("Status").name === "Queued");

if (messagesToSend.length === 0) {
    output.markdown(`No enqueued messages to send. **You're all done!**`)
    return;
}

output.markdown(`${messagesToSend.length} messages queued to send. Review the list in the Messages tab, then click below to send them.
`);

let sendButton = await input.buttonsAsync(
    'Send messages',
    [
        {label: `Cancel`, value: 'cancel', variant: 'secondary'},
        {label: `Send ${messagesToSend.length} messages`, value: 'yes', variant: 'primary'},
    ],
);

if (sendButton === 'cancel') {
    output.markdown(`**Canceled!** No messages sent.`)
    return;
}

for (const messageToSend of messagesToSend) {
    await sendMessage(messageToSend);
}

output.markdown(`**Done sending messages!**`)
