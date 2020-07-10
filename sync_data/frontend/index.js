import { initializeBlock, Box, useSettingsButton } from '@airtable/blocks/ui';
import React, { useState } from 'react';

import { SettingsComponent } from './settings.js'
import { SyncData } from './sync-data.js'

function MainUIComponent() {
  return (
    <Box padding={3}>
      <SyncData />
    </Box>
  );
}

function ComponentWithSettings() {
  const [isShowingSettings, setIsShowingSettings] = useState(false);
  useSettingsButton(function() {
    setIsShowingSettings(!isShowingSettings);
  });
  
  if (isShowingSettings) {
    return <SettingsComponent exit={() => setIsShowingSettings(false)}/>
  }
  return <MainUIComponent />
}


initializeBlock(() => <ComponentWithSettings />);
