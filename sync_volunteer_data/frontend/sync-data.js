import { Box, Button, Loader, useRecords, useBase } from "@airtable/blocks/ui";
import React, { useState } from "react";

import { SyncVolunteerData } from "./sync-galaxy-digital-data";

const DESTINATION_TABLE = "Volunteers";

export function SyncData() {
  const messagesTable = useBase().getTable(DESTINATION_TABLE);
  const records = useRecords(messagesTable);
  const [completed, setCompleted] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [succesfulCount, setSuccesfulCount] = useState(0);
  const [syncError, setSyncError] = useState(null);

  async function syncData() {
    setCompleted(false);
    setSyncing(true);

    const { total, err } = await SyncVolunteerData(messagesTable, records);
    setSuccesfulCount(total);
    setSyncError(err);

    setSyncing(false);
    setCompleted(true);
  }

  return (
    <Box>
      <h2> Sync Galaxy Digital Data </h2>
      {syncing && !completed && <Loader />}
      {!syncing && (
        <>
          {completed && !syncError && (
            <p>Successfully updated all volunteer data</p>
          )}
          {completed && syncError && (
            <p>
              `Sync completed for ${succesfulCount} with error ${syncError}`
            </p>
          )}
          <Box
            margin={2}
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Button
              marginX={2}
              variant="primary"
              onClick={syncData}
              disabled={syncing}
            >
              Sync
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
