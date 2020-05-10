import { initializeBlock, Box, Button, useRecords, useBase } from '@airtable/blocks/ui';
import { base } from '@airtable/blocks';
import React, { useState } from 'react';
import { getConfigOfType, getGlobalValueFromKey, getEmailTypes } from './config.js';
import { SendMessagesStep } from './send-messages.js'

function findById(table, id) {
  return table.find(r => r.id === id);
}

// Customize what fields we pull in from a delivery for an email template.
async function getEmailInfoForDelivery(delivery, volunteer) {
  let output = {
    delivery: {},
    volunteer: {}
  }
  const templateVarsConfig = await getConfigOfType("template-variable");

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

async function formatMessageRecord(messageType, delivery, volunteer, audience) {
  const sendgridData = await getEmailInfoForDelivery(delivery, volunteer);

  var toEmail;
  if (audience === "volunteer") {
    toEmail = sendgridData.volunteer.email;
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
    return {message: formattedMessage, warning: undefined};
  } else {
    const warning = `Missing email address when sending ${messageType} for ${sendgridData.delivery.name}. You may want to contact them another way`
    return {message: undefined, warning: warning};
  }
}

// Compute a list of new queued messages to create, and return it.
async function computeMessagesToCreate(addWarning) {
  let output = {
    messagesToCreate: [],
    warnings: []
  }
  const allDeliveries = (await base.getTable("Deliveries").selectRecordsAsync()).records;
  const allMessages = (await base.getTable("Messages").selectRecordsAsync()).records;
  const allVolunteers = (await base.getTable("Volunteers").selectRecordsAsync()).records;

  const EMAIL_TYPES = await getEmailTypes();

  for (const delivery of allDeliveries) {
    const deliveryStage = delivery.getCellValue(await getGlobalValueFromKey("stage_column_name"))?.name;

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

    // get the assigned volunteer, if any
    let volunteer;
    const volunteers = delivery.getCellValue("Assigned volunteer");
    if (volunteers && volunteers.length > 0) {
      volunteer = findById(allVolunteers, volunteers[0].id);
    }

    for (let messageType of Object.keys(EMAIL_TYPES)) {
      if (existingMessageTypes.includes(messageType)) {
        // We've already sent a message of this type for this delivery
        continue;
      }
      if (!EMAIL_TYPES[messageType].stages.includes(deliveryStage)){
        // The delivery is in the wrong stage for this type of email, skip
        continue;
      }

      const {message, warning} = await formatMessageRecord(messageType, delivery, volunteer, EMAIL_TYPES[messageType]["audience"]);
      if (message) {
        output.messagesToCreate.push(message);
      }
      if (warning) {
        output.warnings.push(warning);
      }
    }
  }
  return output;
}

function WarningAccordion({warnings}) {
  const [isOpen, setIsOpen] = useState(false);

  if (warnings.length === 0) {
    return null;
  }
  return (
    <Box>
      <Button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide Warnings" : `Show ${warnings.length} warnings`}
      </Button>
      {isOpen && warnings.map((warning, i) => {
        return <p key={`warning_${i}`}>{warning}</p>
      })}
    </Box>
  )
}

function MainUIBlock() {
  const [step1result, setStep1result] = useState(undefined);
  const [warnings, setWarnings] = useState([]);

  function addWarning(newWarning) {
    if (newWarning) {
      setWarnings(warnings.concat(newWarning));
    }
  }

  async function refreshQueue() {
    console.log("hello");
    var result = ''

    // Clear out the warnings from any previous run
    setWarnings([]);
    let {messagesToCreate, warnings} = await computeMessagesToCreate();
    setWarnings(warnings);

    if (messagesToCreate.length == 0) {
      setStep1result(`No new messages to enqueue.`);
      return;
    }
    if (messagesToCreate.length > 50) {
      addWarning(`You can only create 50 emails at once, but we found ${messagesToCreate.length} Doing the first 50 now... remember to do this again to get the rest!`);
      messagesToCreate = messagesToCreate.slice(0, 50);
    } 
    await base.getTable("Messages").createRecordsAsync(messagesToCreate);
    setStep1result(`**Success!** Enqueued ${messagesToCreate.length} new messages`);
  }

  return (
    <Box padding={3}>
      <h2> Step 1: Refresh Queue </h2>
      <p> Open the Messages tab to get started. Click below to refresh queue (won't send emails yet). </p>
      <Button variant="primary" onClick={refreshQueue}>
        Refresh queue
      </Button>
      <WarningAccordion warnings={warnings}/>
      {step1result && <>
        <p> {step1result} </p>
        <SendMessagesStep/>
      </>}
    </Box>
  );
}


initializeBlock(() => <MainUIBlock />);
