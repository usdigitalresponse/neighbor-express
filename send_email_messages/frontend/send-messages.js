import { Box, Button, useRecords, useBase } from '@airtable/blocks/ui';
import React, { useState } from 'react';
import { globalConfig } from '@airtable/blocks';

async function sendMessage(messageToSend) {
  const dynamicTemplateData = JSON.parse(messageToSend.getCellValue("Template Data"));
  const EMAIL_TYPES = globalConfig.get('email_types');
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
    "reply_to": globalConfig.get('reply_to'),
    "template_id": EMAIL_TYPES[messageToSend.getCellValue("Email type").name]["sendgrid_template"]
  }
  const token = globalConfig.get("SENDGRID_PROXY_TOKEN");
  const response = await fetch(`https://nex-sendgrid-proxy.geoffreylitt.now.sh/api/sendgrid-proxy?proxy_token=${token}`, {
    method: 'POST',
    body: JSON.stringify(sendgridData)
  });

  return response;
}

export function SendMessagesStep() {
  const [result, setResult] = useState(undefined);
  const [sending, setSending] = useState(false);
  const messagesTable = useBase().getTable("Messages");

  const messagesToSend = useRecords(messagesTable).filter(m => m.getCellValue("Status").name === "Queued");

  function cancelButton() {
    // also disable all buttons!
    setResult('**Canceled!** No messages sent.');
  }

  async function sendMessages() {
    setSending(true);
    for (const messageToSend of messagesToSend) {
      const response = await sendMessage(messageToSend);

      if (response.status === 202) {
        messagesTable.updateRecordAsync(messageToSend.id, {
          "Status": { name: "Sent" },
          "Sent Time": new Date()
        })
      } else {
        messagesTable.updateRecordAsync(messageToSend.id, {
          "Status": { name: "Errored" },
        })
      }
    }
    setSending(false);
    setResult('**Done sending messages!**');
  }

  return (
    <Box>
      <h2> Step 2: Send emails </h2>
      {result ? <p> {result} </p> : <>
        {
          messagesToSend.length === 0 ?
          <p> No enqueued messages to send. <strong> All done! </strong></p> :
          <>
            <p> {messagesToSend.length} messages queued to send. Review the list in the Messages tab, then click below to send them. </p>
            <Button variant="secondary" onClick={cancelButton} disabled={sending}>
              Cancel
            </Button>
            <Button variant="primary" onClick={sendMessages} disabled={sending}>
              Send {messagesToSend.length} Messages
            </Button>
          </>
        }
      </>}
    </Box>
  )
}