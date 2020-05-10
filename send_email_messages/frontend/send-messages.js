import { Box, Button, useRecords, useBase } from '@airtable/blocks/ui';
import React, { useState } from 'react';
import { getSendgridConfig } from './config.js';


async function sendMessage(messageToSend, cfg) {
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
        "reply_to": cfg.REPLY_TO,
        "template_id": cfg.EMAIL_TYPES[messageToSend.getCellValue("Email type").name]["sendgrid_template"]
    }

    const response = await fetch(`https://nex-sendgrid-proxy.geoffreylitt.now.sh/api/sendgrid-proxy?proxy_token=${cfg.SENDGRID_PROXY_TOKEN}`, {
        method: 'POST',
        body: JSON.stringify(sendgridData)
    });

    return response;


}

export function SendMessagesStep() {
	const [result, setResult] = useState(undefined);
    const messagesTable = useBase().getTable("Messages");

	const messagesToSend = useRecords(messagesTable).filter(m => m.getCellValue("Status").name === "Queued");

	function cancelButton() {
		// also disable all buttons!
		setResult('**Canceled!** No messages sent.');
	}

	async function sendMessages() {
		const cfg = await getSendgridConfig();
        for (const messageToSend of messagesToSend) {
            const response = await sendMessage(messageToSend, cfg);

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
		setResult('**Done sending messages!**');
	}

	return (
		<Box>
			<h2> Step 2: Send emails </h2>
            {result ? <p> {result} </p> : <>
        	  	{
        	  		messagesToSend.length === 0 ?
        	  		<p> No enqueued messages to send. <strong> You're all done! </strong></p> :
        	  		<>
        	  			<p> {messagesToSend.length} messages queued to send. Review the list in the Messages tab, then click below to send them. </p>
        	  			<Button variant="secondary" onClick={cancelButton} disabled={result!=undefined}>
        			  		Cancel
        			  	</Button>
        	  			<Button variant="primary" onClick={sendMessages} disabled={result!=undefined}> 
        	  				Send {messagesToSend.length} Messages
        			  	</Button>
        	  		</>
        	  	}
            </>}
    	  	
        </Box>
	)
}