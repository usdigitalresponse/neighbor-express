import { Box, Button, Text } from "@airtable/blocks/ui";
import { base, globalConfig } from "@airtable/blocks";
import React, { useState } from "react";
import { Accordion } from "./util.js";

function findById(table, id) {
  return table.find((r) => r.id === id);
}

// Customize what fields we pull in from a delivery for an email template.
async function getEmailInfoForDelivery(delivery, volunteer) {
  let output = {
    delivery: {},
    volunteer: {},
  };
  const deliveryTemplateVars = globalConfig.get([
    "template_variables",
    "Deliveries",
  ]);
  for (let [f_id, sendgridValue] of Object.entries(deliveryTemplateVars)) {
    output.delivery[sendgridValue] = delivery.getCellValue(f_id);
  }
  if (volunteer) {
    // Only populate volunteer template variables if there is a volunteer assigned.
    const volunteerTemplateVars = globalConfig.get([
      "template_variables",
      "Volunteers",
    ]);
    for (let [f_id, sendgridValue] of Object.entries(volunteerTemplateVars)) {
      output.volunteer[sendgridValue] = volunteer.getCellValue(f_id);
    }
  }
  return output;
}

async function formatDeliveryMessageRecord(
  messageType,
  delivery,
  volunteer,
  audience
) {
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
        Delivery: [{ id: delivery.id }],
        "Email type": { name: messageType },
        Status: { name: "Queued" },
        Recipient: toEmail,
        "Template Data": JSON.stringify(sendgridData),
      },
    };
    return { message: formattedMessage, warning: undefined };
  } else {
    const warning = `Missing email address when sending ${messageType} for ${sendgridData.delivery.name}. You may want to contact them another way`;
    return { message: undefined, warning: warning };
  }
}

// Compute a list of new queued messages to create, and return it.
async function computeMessagesToCreate() {
  const deliveryMessages = await computeDeliveryMessages();
  const volunteerMessages = await computeVolunteerWelcomeMessages();

  return {
    messagesToCreate: [
      ...deliveryMessages.messagesToCreate,
      ...volunteerMessages.messagesToCreate,
    ],
    warnings: [...deliveryMessages.warnings, ...volunteerMessages.warnings],
  };
}

// compute a list of volunteer welcome messages to send
async function computeVolunteerWelcomeMessages() {
  const EMAIL_TYPE_NAME = "Initial Confirmation: Volunteer";

  const output = {
    messagesToCreate: [],
    warnings: [],
  };

  // if these emails aren't enabled in config, don't send them
  if (!globalConfig.get("enable_volunteer_welcome_email")) return output;

  const allMessages = (await base.getTable("Messages").selectRecordsAsync())
    .records;
  const allVolunteers = (await base.getTable("Volunteers").selectRecordsAsync())
    .records;

  for (const volunteer of allVolunteers) {
    // see if we've already sent or queued a welcome message for this volunteer;
    const existingMessage = allMessages.find(
      (m) =>
        m.getCellValue("Volunteer") &&
        m.getCellValue("Volunteer")[0].id === volunteer.id &&
        // todo: is there a way to do this by ID so we're not relying on name?
        m.getCellValue("Email type")?.name === EMAIL_TYPE_NAME
    );

    // If we've already sent or queued, no need to enqueue a new one
    if (existingMessage) {
      continue;
    }

    if (volunteer.getCellValue("Email")) {
      output.messagesToCreate.push({
        fields: {
          Volunteer: [{ id: volunteer.id }],
          "Email type": { name: EMAIL_TYPE_NAME },
          Status: { name: "Queued" },
          Recipient: volunteer.getCellValue("Email"),
          "Template Data": JSON.stringify({
            volunteer: {
              name: volunteer.getCellValue(
                globalConfig.get("volunteer_name_field")
              ),
            },
          }),
        },
      });
    } else {
      output.warnings.push(
        `Missing email for volunteer: ${volunteer.getCellValue(
          globalConfig.get("volunteer_name_field")
        )}`
      );
    }
  }

  return output;
}

// compute a list of messages to send, associated with delivery statuses
async function computeDeliveryMessages() {
  let output = {
    messagesToCreate: [],
    warnings: [],
  };

  const allDeliveries = (await base.getTable("Deliveries").selectRecordsAsync())
    .records;
  const allMessages = (await base.getTable("Messages").selectRecordsAsync())
    .records;
  const allVolunteers = (await base.getTable("Volunteers").selectRecordsAsync())
    .records;

  const EMAIL_TYPES = globalConfig.get("email_types");

  for (const delivery of allDeliveries) {
    const deliveryStageId = delivery.getCellValue(
      globalConfig.get("trigger_column")
    )?.id;

    // assemble a list of existing message types for this delivery
    let existingMessageTypes = [];
    const existingMessages = delivery.getCellValue("Messages");
    if (existingMessages) {
      existingMessageTypes = existingMessages.map(
        (existingMessage) =>
          findById(allMessages, existingMessage.id).getCellValue("Email type")
            .name
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
      if (EMAIL_TYPES[messageType].stage != deliveryStageId) {
        // The delivery is in the wrong stage for this type of email, skip
        continue;
      }

      const { message, warning } = await formatDeliveryMessageRecord(
        messageType,
        delivery,
        volunteer,
        EMAIL_TYPES[messageType]["audience"]
      );
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

async function batchedCreate(messages) {
  // Airtable only lets us createRecordsAsync for 50 at a time
  for (let index = 0; index < messages.length; index += 50) {
    await base
      .getTable("Messages")
      .createRecordsAsync(messages.slice(index, index + 50));
  }
}

function WarningAccordion({ warnings }) {
  if (warnings.length === 0) {
    return null;
  }
  return (
    <Accordion title={`${warnings.length} warnings`}>
      {warnings.map((warning, i) => {
        return <p key={`warning_${i}`}>{warning}</p>;
      })}
    </Accordion>
  );
}

export function RefreshQueueStep({ nextStep }) {
  const [result, setResult] = useState(undefined);
  const [warnings, setWarnings] = useState([]);

  function addWarning(newWarning) {
    if (newWarning) {
      setWarnings(warnings.concat(newWarning));
    }
  }

  async function refreshQueue() {
    // Clear out the warnings from any previous run
    setWarnings([]);
    let { messagesToCreate, warnings } = await computeMessagesToCreate();
    setWarnings(warnings);

    if (messagesToCreate.length == 0) {
      setResult(`No new messages to enqueue.`);
      return;
    }
    await batchedCreate(messagesToCreate);
    setResult(`Enqueued ${messagesToCreate.length} new messages`);
  }

  return (
    <Box>
      <h2> Step 1: Refresh Queue </h2>
      <Text>
        {" "}
        Open the Messages tab to get started. Click below to refresh queue
        (won't send emails yet).{" "}
      </Text>
      <Button variant="primary" margin={3} onClick={refreshQueue}>
        Refresh queue
      </Button>
      {result && (
        <Box>
          <Button
            style={{ float: "right" }}
            marginX={3}
            variant="primary"
            onClick={nextStep}
          >
            Continue
          </Button>
          <Text> {result} </Text>
          <WarningAccordion warnings={warnings} />
        </Box>
      )}
    </Box>
  );
}
