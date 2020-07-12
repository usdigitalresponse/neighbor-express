import { 
	Box,
	Button,
	FormField,
	InputSynced
} from '@airtable/blocks/ui';
import React from 'react';

// TODO Move to shared directory
function Accordion({title, children}) {
  const [isOpen, setIsOpen] = useState(false);
  return (<Box>
    <TextButton 
      marginY={1}
      onClick={() => setIsOpen(!isOpen)} 
      icon={isOpen ? "chevronDown" : "chevronRight"}>
      {title}
    </TextButton>
    {isOpen && children}
  </Box>)
}

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