import {
  Box,
  Button,
  FormField,
  InputSynced,
  useGlobalConfig,
} from "@airtable/blocks/ui";
import React from "react";

export function SettingsComponent({ exit }) {
  const globalConfig = useGlobalConfig();

  return (
    <Box padding={3}>
      <Button variant="primary" onClick={exit} style={{ float: "right" }}>
        Exit settings
      </Button>
      <h1> Settings </h1>
      <p>
        You probably won't need to do anything here unless you're just starting
        out.
      </p>
      <FormField label="Galaxy Digital API Key">
        <InputSynced globalConfigKey="GALAXY_DIGITAL_API_KEY" />
      </FormField>
    </Box>
  );
}
