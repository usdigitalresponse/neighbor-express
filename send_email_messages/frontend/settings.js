import {
  Box,
  Button,
  Dialog,
  FieldPicker,
  FormField,
  Heading,
  Input,
  InputSynced,
  Label,
  SelectButtonsSynced,
  SelectSynced,
  Switch,
  Text,
  TextButton,
  useGlobalConfig,
  useBase,
} from "@airtable/blocks/ui";
import React, { useState } from "react";
import { FieldType } from "@airtable/blocks/models";
import { Accordion } from "./util.js";

// A UI component for setting a key in the global config.
// key can be a string (for a top level key) or a list of strings (for a nested value)
function InputSetter({ label, description, keyOrPath }) {
  const globalConfig = useGlobalConfig();

  return (
    <FormField label={label} description={description}>
      <InputSynced
        globalConfigKey={keyOrPath}
        disabled={!globalConfig.hasPermissionToSet(keyOrPath)}
      />
    </FormField>
  );
}

function FieldSetter({
  label,
  description,
  keyOrPath,
  tableName,
  ...setterProps
}) {
  const globalConfig = useGlobalConfig();
  const base = useBase();
  const table = base.getTableByNameIfExists(tableName);

  function setField(newField) {
    globalConfig.setAsync(keyOrPath, newField.id);
  }
  // If table is null or undefined, the FieldPicker will not render.
  return (
    <FormField label={label} description={description}>
      <FieldPicker
        table={table}
        field={table.getFieldIfExists(globalConfig.get(keyOrPath))}
        onChange={setField}
        disabled={!globalConfig.hasPermissionToSet(keyOrPath)}
        {...setterProps}
      />
    </FormField>
  );
}

function AddEmailTypeDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const globalConfig = useGlobalConfig();

  function save() {
    globalConfig.setAsync(["email_types", name], {});
    setIsDialogOpen(false);
  }
  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>Add new email type</Button>
      {isDialogOpen && (
        <Dialog onClose={() => setIsDialogOpen(false)} width="320px">
          <Dialog.CloseButton />
          <Heading>New Email Type</Heading>
          <FormField
            label="Name"
            description="A short descriptive name of the new type of email"
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <Button onClick={save}>Save</Button>
        </Dialog>
      )}
    </>
  );
}

function EmailTypeSettings({ emailType }) {
  const globalConfig = useGlobalConfig();

  const audienceOptions = [
    { value: "volunteer", label: "Volunteer" },
    { value: "recipient", label: "Delivery Recipient" },
  ];

  const deliveriesTable = useBase().getTableByNameIfExists("Deliveries");
  const triggerField = deliveriesTable.getFieldIfExists(
    globalConfig.get("trigger_column")
  );

  const stageOptions = triggerField?.options.choices.map((choice) => {
    return {
      value: choice.id,
      label: choice.name,
    };
  });

  function deleteMe() {
    globalConfig.setAsync(["email_types", emailType], undefined);
  }

  return (
    <Box padding={3}>
      <TextButton onClick={deleteMe} icon="trash" style={{ float: "right" }}>
        Delete
      </TextButton>
      <Accordion title={emailType}>
        <InputSetter
          label="Sendgrid Template ID"
          description="Find this in the Sendgrid UI. Looks like d-ea13bf1f408947829fa19779eade8250"
          keyOrPath={["email_types", emailType, "sendgrid_template"]}
        />
        <FormField
          label="Send to..."
          description="Who should this email be sent to?"
        >
          <SelectButtonsSynced
            globalConfigKey={["email_types", emailType, "audience"]}
            options={audienceOptions}
            width="320px"
          />
        </FormField>
        <FormField
          label="Send when..."
          description={`Email will be sent when ${triggerField.name} column is...`}
        >
          <SelectSynced
            globalConfigKey={["email_types", emailType, "stage"]}
            options={stageOptions}
            width="320px"
          />
        </FormField>
      </Accordion>
    </Box>
  );
}

function AddTemplateVariableDialog({ table }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [field, setField] = useState("");
  const [sendgrid, setSendgrid] = useState("");
  const globalConfig = useGlobalConfig();

  function save() {
    globalConfig.setAsync(
      ["template_variables", table.name, field.id],
      sendgrid
    );
    setField("");
    setSendgrid("");
    setIsDialogOpen(false);
  }

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        Add new template variable
      </Button>
      {isDialogOpen && (
        <Dialog onClose={() => setIsDialogOpen(false)} width="320px">
          <Dialog.CloseButton />
          <FormField
            label="Airtable field"
            description="What field contains the data you want to send to sendgrid?"
          >
            <FieldPicker
              table={table}
              field={field}
              onChange={(newField) => setField(newField)}
            />
          </FormField>
          <FormField
            label="Sendgrid reference"
            description="How does the sengrid template refer to this data?"
          >
            <Input
              value={sendgrid}
              onChange={(e) => setSendgrid(e.target.value)}
            />
          </FormField>
          <Button onClick={save}>Save</Button>
        </Dialog>
      )}
    </>
  );
}

function TableTemplateVariables({ tableName }) {
  const globalConfig = useGlobalConfig();
  if (globalConfig.get(["template_variables", tableName]) === undefined) {
    globalConfig.setAsync(["template_variables", tableName], {});
  }
  const base = useBase();
  const table = base.getTableByNameIfExists(tableName);

  const tableNameToSendgrid = {
    Deliveries: "delivery",
    Volunteers: "volunteer",
  };

  return (
    <Box padding={3}>
      <Text>
        {" "}
        You can use these fields from the {table.name} table in sendgrid{" "}
      </Text>
      <ul>
        {Object.keys(globalConfig.get(["template_variables", table.name])).map(
          (f_id) => {
            const field = table.getFieldIfExists(f_id);
            // this should be deletable
            const sendgridValue = globalConfig.get([
              "template_variables",
              table.name,
              f_id,
            ]);
            const sendgridFormat = `{{${tableNameToSendgrid[tableName]}.${sendgridValue}}}`;
            const removeLink = (
              <TextButton
                onClick={() => {
                  globalConfig.setAsync(
                    ["template_variables", table.name, f_id],
                    undefined
                  );
                }}
              >
                (remove)
              </TextButton>
            );
            return (
              <li key={f_id}>
                {" "}
                {field.name} -> {sendgridFormat} {removeLink}
              </li>
            );
          }
        )}
      </ul>
      <AddTemplateVariableDialog table={table} />
    </Box>
  );
}

export function SettingsComponent({ exit }) {
  const globalConfig = useGlobalConfig();

  if (globalConfig.get("template_variables") === undefined) {
    globalConfig.setAsync("template_variables", {});
  }

  if (globalConfig.get("email_types") === undefined) {
    globalConfig.setAsync("email_types", {});
  }

  return (
    <Box padding={3}>
      <Button variant="primary" onClick={exit} style={{ float: "right" }}>
        Exit settings
      </Button>
      <h1> Settings </h1>
      <p>
        {" "}
        You probably won't need to do anything here unless you're just starting
        out.{" "}
      </p>
      <Accordion title="Global">
        <InputSetter
          label="Organization name"
          description="When people reply to your emails, what is the name they will see?"
          keyOrPath={["reply_to", "name"]}
        />
        <InputSetter
          label="Reply email"
          description="What email address should people use to reply to your emails?"
          keyOrPath={["reply_to", "email"]}
        />
        <InputSetter
          label="Sendgrid proxy token"
          description="This is a secret token that is used to authenticate sending the email"
          keyOrPath="SENDGRID_PROXY_TOKEN"
        />
        <FieldSetter
          label="Trigger column"
          description="Which column should be used to determine whether an email is sent?"
          keyOrPath="trigger_column"
          tableName="Deliveries"
          allowedTypes={[FieldType.SINGLE_SELECT]}
        />
      </Accordion>
      <Accordion title="Email Types">
        <h4>Delivery Emails</h4>
        <Text>
          Here you can configure emails to go out at various stages of a
          delivery. Emails can be set up for both the delivery recipient and the
          volunteer.
        </Text>
        {Object.keys(globalConfig.get("email_types")).map((emailType) => {
          return <EmailTypeSettings key={emailType} emailType={emailType} />;
        })}
        <AddEmailTypeDialog />
        <Box>
          <h4>Volunteer Emails</h4>
          <Text>
            Enable the setting below if you want to send volunteers a welcome
            email when they first sign up.
          </Text>
          <Switch
            value={!!globalConfig.get("enable_volunteer_welcome_email")}
            onChange={(newValue) =>
              globalConfig.setAsync("enable_volunteer_welcome_email", newValue)
            }
            label="Email volunteers on inital signup"
            width="320px"
          />
          {globalConfig.get("enable_volunteer_welcome_email") ? (
            <>
              <Label htmlFor="volunteer-welcome-template-id-input">
                Volunteer welcome email sendgrid template ID
              </Label>
              <Input
                id="volunteer-welcome-template-id-input"
                value={
                  globalConfig.get("volunteer_welcome_email_template_id") || ""
                }
                onChange={(e) =>
                  globalConfig.setAsync(
                    "volunteer_welcome_email_template_id",
                    e.target.value
                  )
                }
                placeholder="Enter Sendgrid Template ID here"
              />
              <FieldSetter
                label="Volunteer name field"
                description="The field containing volunteers names"
                keyOrPath="volunteer_name_field"
                tableName="Volunteers"
              />
            </>
          ) : null}
        </Box>
      </Accordion>
      <Accordion title="Template Variables">
        {["Deliveries", "Volunteers"].map((tableName) => {
          return (
            <TableTemplateVariables key={tableName} tableName={tableName} />
          );
        })}
      </Accordion>
    </Box>
  );
}
