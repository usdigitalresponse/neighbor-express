import { 
	Box,
	Button,
	FormField,
	InputSynced} from '@airtable/blocks/ui';
import React from 'react';
import { Accordion } from '../send_email_messages/util.js';

export function SettingsComponent({exit}) { 
  return (
    <Box padding={3}>
    	<Button variant="primary" onClick={exit} style={{float: 'right'}}>
        Exit settings
      </Button>
      <h1> Settings </h1>
      <p> You probably won't need to do anything here unless you're just starting out. </p>
      <Accordion title="Global">
	  <FormField label="Galaxy Digital API Key" >
	  	<InputSynced 
	  		globalConfigKey="GALAXY_DIGITAL_API_KEY"/>
	  </FormField>
	    </Accordion>
    </Box>
  )
}