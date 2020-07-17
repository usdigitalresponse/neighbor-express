import { initializeBlock, Box, useSettingsButton } from "@airtable/blocks/ui";
import React, { useState } from "react";

import { SettingsComponent } from "./settings.js";
import { SyncData } from "./sync-data.js";

function ComponentWithSettings() {
  const [showSettings, setShowSettings] = useState(false);
  useSettingsButton(function () {
    setShowSettings(!showSettings);
  });

  return (
    <>
      {showSettings && (
        <SettingsComponent exit={() => setShowSettings(false)} />
      )}
      {!showSettings && (
        <Box padding={3}>
          <SyncData />
        </Box>
      )}
    </>
  );
}

initializeBlock(() => <ComponentWithSettings />);
