import {initializeBlock, Box, Button, useRecords, useBase} from '@airtable/blocks/ui';
import {base} from '@airtable/blocks';
import React, {useState} from 'react';


function findById(table, id) {
    return table.find(r => r.id === id);
}

async function getConfigOfType(type) {
	const allConfig = (await base.getTable("Email Configuration").selectRecordsAsync()).records;
	return allConfig.filter(c => c.getCellValue("type").name === type)
}

async function getGlobalValueFromKey(key) {
    const globalConfig = await getConfigOfType("global");
    return globalConfig.find(k => k.name === key).getCellValue("value");
}

async function getSendgridConfig() {
	const globalConfig = await getConfigOfType("global");

	function globalValueFromKey(key) {
        return globalConfig.find(k => k.name === key).getCellValue("value");
	}

	return {
		SENDGRID_PROXY_TOKEN: globalValueFromKey("SENDGRID_PROXY_TOKEN"),
		REPLY_TO: {
    	    name: globalValueFromKey("reply_to_name"),
    	    email: globalValueFromKey("reply_to_email")
		},
		EMAIL_TYPES: await getEmailTypes()
	}
}

async function getEmailTypes() {
	const emailTypesConfig = await getConfigOfType("email-template");

	const EMAIL_TYPES = {};
	for (const emailType of emailTypesConfig) {
	    EMAIL_TYPES[emailType.name] = {
	        "sendgrid_template": emailType.getCellValue("sendgrid_template"),
	        "audience": emailType.getCellValue("audience").name,
            "stages": emailType.getCellValue("stages").map((s) => {return s.name}),
	    }
	}
	return EMAIL_TYPES;
}

// Customize what fields we pull in from a delivery for an email template.
async function getEmailInfoForDelivery(delivery) {
    let output = {
        delivery: {},
        volunteer: {}
    }
    
    // see if there's a volunteer assigned
    // TODO inefficient do not load this volunteers this many times!! do this in the outer function
   	const allVolunteers = (await base.getTable("Volunteers").selectRecordsAsync()).records;

    let volunteer;
    const volunteers = delivery.getCellValue("Assigned volunteer");
    if (volunteers && volunteers.length > 0) {
        volunteer = findById(allVolunteers, volunteers[0].id);
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

async function formatSengridMessage(delivery, messageType, audience) {
    const sendgridData = await getEmailInfoForDelivery(delivery);

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

        for (let messageType of Object.keys(EMAIL_TYPES)) {
            if (existingMessageTypes.includes(messageType)) {
                // We've already sent a message of this type for this delivery
                continue;
            }
            if (!EMAIL_TYPES[messageType].stages.includes(deliveryStage)){
                // The delivery is in the wrong stage for this type of email, skip
                continue;
            }

            const {message, warning} = await formatSengridMessage(delivery, messageType, EMAIL_TYPES[messageType]["audience"]);
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

    if (response.status === 202) {
        base.getTable("Messages").updateRecordAsync(messageToSend.id, {
            "Status": { name: "Sent" },
            "Sent Time": new Date()
        })
    } else {
        base.getTable("Messages").updateRecordAsync(messageToSend.id, {
            "Status": { name: "Errored" },
        })
    }
}


function StepSendMessages() {
	const [result, setResult] = useState(undefined);

	const messagesToSend = useRecords(useBase().getTable("Messages")).filter(m => m.getCellValue("Status").name === "Queued");

	function cancelButton() {
		// also disable all buttons!
		setResult('**Canceled!** No messages sent.');
	}

	async function sendMessages() {
		const cfg = await getSendgridConfig();
        for (const messageToSend of messagesToSend) {
            await sendMessage(messageToSend, cfg);
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
        setWarnings(warnings.concat(newWarning));
    }

    async function refreshQueue() {
    	var result = ''
        let {messagesToCreate, warnings} = await computeMessagesToCreate();
        addWarning(warnings)

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
                <StepSendMessages/>
            </>}
        </Box>
    );
}


initializeBlock(() => <MainUIBlock />);
