// Neighbor Express Email Automation Script
//==========================================================

// This is a script that's intended to run in the Airtable Scripting Blocks environment.
// To set it up for a city:

// * Copy paste this into the Airtable Scripting Block environment for a city
// * Update configuration in a table called Email Configuration
// * Test it out by creating a test delivery and volunteer, and confirming that
// emails send as expected.

const configTable = base.getTable("Email Configuration");
const messagesTable = base.getTable("Messages");
const allConfig = (await base.getTable("Email Configuration").selectRecordsAsync()).records;

const globalConfig = allConfig.filter(c => c.getCellValue("type").name === "global");
const emailTypesConfig = allConfig.filter(c => c.getCellValue("type").name === "email-template");
const templateVarsConfig = allConfig.filter(c => c.getCellValue("type").name === "template-variable");
const allMessages = (await messagesTable.selectRecordsAsync()).records;
const allVolunteers = (await base.getTable("Volunteers").selectRecordsAsync()).records;
const allDeliveries = (await base.getTable("Deliveries").selectRecordsAsync()).records;

function globalValueFromKey(key) {
    return globalConfig.find(k => k.name === key).getCellValue("value");
}

function findById(table, id) {
    return table.find(r => r.id === id);
}

//==========================================================
// Global configuration -- insert global Nex sendgrid proxy credentials
//==========================================================
// This authenticates us to the Nex sendgrid proxy, a small Zeit function
// that forwards our request to the Sendgrid API.
// We need to keep this secret because anyone with this credential
// can send email on our behalf
const SENDGRID_PROXY_TOKEN = globalValueFromKey("SENDGRID_PROXY_TOKEN");

//==========================================================
// City-specific configuration: update to match the city
//==========================================================

// For each email type, point to the Sendgrid template ID
// Find the Sendgrid template IDs in Sendgrid UI.
const EMAIL_TYPES = {};
for (const emailType of emailTypesConfig) {
    EMAIL_TYPES[emailType.name] = {
        "sendgrid_template": emailType.getCellValue("sendgrid_template"),
        "audience": emailType.getCellValue("audience").name,
        "send_before_matching": Boolean(emailType.getCellValue("send_before_matching"))
    }
}
const allMessageTypes = Object.keys(EMAIL_TYPES);

const REPLY_TO = {
    name: globalValueFromKey("reply_to_name"),
    email: globalValueFromKey("reply_to_email")
}

// Customize what fields we pull in from a delivery for an email template.
async function getEmailInfoForDelivery(delivery) {
    let output = {
        delivery: {},
        volunteer: {}
    }
    
    // see if there's a volunteer assigned
    let volunteer;
    const volunteers = delivery.getCellValue("Assigned volunteer");
    if (volunteers && volunteers.length > 0) {
        volunteer = findById(allVolunteers, volunteers[0].id);
    }
    
    for (let r of templateVarsConfig) {
        if (r.getCellValue("Airtable table").name == "Deliveries") {
            output.delivery[r.getCellValue("sendgrid")] = delivery.getCellValue(r.getCellValue("Airtable Field Name"));
        } else if (r.getCellValue("Airtable table").name == "Volunteers") {
            if (volunteer) {
                output.volunteer[r.getCellValue("sendgrid")] = volunteer.getCellValue(r.getCellValue("Airtable Field Name"));
            }
        } else {
            console.log("Configuration error, make sure all template variables have either Deliveries or Volunteers as their Airtable table");
        }
    }

    return output;
}

async function formatSengridMessage(delivery, messageType) {
    const sendgridData = await getEmailInfoForDelivery(delivery);

    const audience = EMAIL_TYPES[messageType]["audience"];
    var toEmail;
    if (audience === "volunteer") {
        toEmail = sendgridData.volunteer?.email;
    } else if (audience === "recipient") {
        toEmail = sendgridData.delivery.email;
    } 

    if (toEmail) {
        const formattedMessage = {
            fields: {
                "Delivery": [{ "id": delivery.id }],
                "Email type": { "name": messageType },
                "Status": { name: "Queued" },
                "Recipient": toEmail,
                "Template Data": JSON.stringify(sendgridData)
            }
        }
        return formattedMessage;
    } else {
        output.markdown(`**Warning, Missing email address**: Couldn't create ${messageType} for delivery recipient ${sendgridData.delivery.name}.`);
    }
}

// Compute a list of new queued messages to create, and return it.
async function computeMessagesToCreate() {
    let messagesToCreate = [];

    for (const delivery of allDeliveries) {
        const isMatched = delivery.getCellValue("Errand Workflow Stage") &&
            delivery.getCellValue("Errand Workflow Stage").name === "Matched";

        // assemble a list of existing message types for this delivery
        let existingMessageTypes = [];
        const existingMessages = delivery.getCellValue("Messages");
        if (existingMessages) {
            existingMessageTypes = existingMessages.map(existingMessage =>
                findById(allMessages, existingMessage.id).getCellValue("Email type").name
            );
        } else {
            existingMessageTypes = [];
        }

        for (let messageType of allMessageTypes) {
            if (existingMessageTypes.includes(messageType)) {
                // We've already sent a message of this type for this delivery
                continue;
            }
            if (isMatched || EMAIL_TYPES[messageType].send_before_matching) {
                // we only send an email if the delivery is matched, OR if the email type
                // is specifically set up to "send before matching"
                const message = await formatSengridMessage(delivery, messageType);
                if (message) {
                    messagesToCreate.push(message);
                } 
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
        "template_id": EMAIL_TYPES[messageToSend.getCellValue("Email type").name]["sendgrid_template"]
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

let messagesToCreate = await computeMessagesToCreate();

if (messagesToCreate.length == 0) {
    output.markdown(`No new messages to enqueue.`);
} else {
    if (messagesToCreate.length > 50) {
        output.markdown(`You can only create 50 emails at once, but we found ${messagesToCreate.length} Doing the first 50 now... remember to do this again to get the rest!`)
        messagesToCreate = messagesToCreate.slice(0, 50);
    } 
    await messagesTable.createRecordsAsync(messagesToCreate);
    output.markdown(`**Success!** Enqueued ${messagesToCreate.length} new messages`)
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
