import {
  Box,
  Button,
  ChoiceToken,
  ProgressBar,
  RecordCardList,
  Text,
  useRecords,
  useBase,
} from "@airtable/blocks/ui";
import React, { useState } from "react";
import { globalConfig } from "@airtable/blocks";

async function sendMessage(messageToSend) {
  const dynamicTemplateData = JSON.parse(
    messageToSend.getCellValue("Template Data")
  );
  const EMAIL_TYPES = globalConfig.get("email_types");

  let templateId;
  const emailType = messageToSend.getCellValue("Email type").name;
  if (emailType !== "Initial Confirmation: Volunteer") {
    templateId = EMAIL_TYPES[emailType]["sendgrid_template"];
  } else {
    templateId = globalConfig.get("volunteer_welcome_email_template_id");
  }

  const sendgridData = {
    personalizations: [
      {
        to: [
          {
            email: messageToSend.getCellValue("Recipient"),
          },
        ],
        dynamic_template_data: dynamicTemplateData,
      },
    ],
    from: {
      name: "Neighbor Express",
      email: "noreply@neighborexpress.org",
    },
    reply_to: globalConfig.get("reply_to"),
    template_id: templateId,
  };
  const token = globalConfig.get("SENDGRID_PROXY_TOKEN");
  const response = await fetch(
    `https://nex-sendgrid-proxy.geoffreylitt.now.sh/api/sendgrid-proxy?proxy_token=${token}`,
    {
      method: "POST",
      body: JSON.stringify(sendgridData),
    }
  );

  return response;
}

export function SendMessagesStep({ previousStep }) {
  const [completed, setCompleted] = useState(false);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);

  const messagesTable = useBase().getTable("Messages");
  const statusField = messagesTable.getFieldByName("Status");
  const queuedOption = statusField.options.choices.find(
    (c) => c.name == "Queued"
  );

  const messagesToSend = useRecords(messagesTable).filter(
    (m) => m.getCellValue("Status").name === "Queued"
  );

  async function sendMessages() {
    setCompleted(false);
    setSending(true);
    const total = messagesToSend.length;
    let i = 0;
    for (const messageToSend of messagesToSend) {
      const response = await sendMessage(messageToSend);

      if (response.status === 202) {
        messagesTable.updateRecordAsync(messageToSend.id, {
          Status: { name: "Sent" },
          "Sent Time": new Date(),
        });
      } else {
        messagesTable.updateRecordAsync(messageToSend.id, {
          Status: { name: "Errored" },
        });
      }
      i += 1;
      setProgress(i / total);
    }
    setSending(false);
    setCompleted(true);
  }

  async function goBack() {
    // Clear any non-persistent data before leaving
    setCompleted(false);
    setSending(false);
    setProgress(0);
    previousStep();
  }

  return (
    <Box>
      <h2> Step 2: Send emails </h2>
      {(sending || completed) && <ProgressBar progress={progress} />}
      {completed && <p> Successfully sent all messages </p>}
      {messagesToSend.length === 0 ? (
        <p>
          {" "}
          There are no messages with status{" "}
          <ChoiceToken choice={queuedOption} marginRight={1} />{" "}
        </p>
      ) : (
        <>
          <Box
            margin={2}
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Text>
              {" "}
              The following {messagesToSend.length} messages will be sent:
            </Text>
            <Button
              marginX={2}
              variant="primary"
              onClick={sendMessages}
              disabled={sending}
            >
              Send All Messages
            </Button>
          </Box>
          <Box height="300px" border="thick" backgroundColor="lightGray1">
            <RecordCardList
              records={messagesToSend}
              fields={["Email type", "Recipient", "Delivery"].map((f) =>
                messagesTable.getFieldByName(f)
              )}
            />
          </Box>
        </>
      )}
      <Button onClick={goBack}> Go Back </Button>
    </Box>
  );
}
