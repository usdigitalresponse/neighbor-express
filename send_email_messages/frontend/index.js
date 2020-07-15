import { initializeBlock, Box, useSettingsButton } from "@airtable/blocks/ui";
import React, { useState } from "react";
import StepWizard from "react-step-wizard";

import { SettingsComponent } from "./settings.js";
import { RefreshQueueStep } from "./refresh-queue.js";
import { SendMessagesStep } from "./send-messages.js";

function MainUIComponent() {
  return (
    <Box padding={3}>
      <StepWizard>
        <RefreshQueueStep />
        <SendMessagesStep />
      </StepWizard>
    </Box>
  );
}

function ComponentWithSettings() {
  const [isShowingSettings, setIsShowingSettings] = useState(false);
  useSettingsButton(function () {
    setIsShowingSettings(!isShowingSettings);
  });

  if (isShowingSettings) {
    return <SettingsComponent exit={() => setIsShowingSettings(false)} />;
  }
  return <MainUIComponent />;
}

initializeBlock(() => <ComponentWithSettings />);
