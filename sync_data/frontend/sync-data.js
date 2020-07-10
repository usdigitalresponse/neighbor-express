import { Box, Button, ProgressBar} from '@airtable/blocks/ui';
import React, { useState } from 'react';

import {syncVolunteerData} from '../airtable/sync_galaxy_digital_data'

export function SyncData() {
  const [completed, setCompleted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);

  async function syncData() {
    setCompleted(false);
    setSyncing(true);
    syncVolunteerData();
    // const total = messagesToSend.length;
    //   setProgress(i/total);
    setSyncing(false);
    setCompleted(true);
  }

  return (
    <Box>
      <h2> Sync Galaxy Digital Data </h2>
      {(syncing || completed) && <ProgressBar progress={progress}/> }
      {completed && <p>Successfully updated all volunteer data</p>}
      {
          <Box margin={2} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
            <Button marginX={2} variant="primary" onClick={syncData} disabled={syncing}>
              Sync
            </Button> 
          </Box>
      }
    </Box>
  )
}