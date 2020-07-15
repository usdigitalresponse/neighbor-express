import { Box, TextButton } from "@airtable/blocks/ui";
import React, { useState } from "react";

export function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Box>
      <TextButton
        marginY={1}
        onClick={() => setIsOpen(!isOpen)}
        icon={isOpen ? "chevronDown" : "chevronRight"}
      >
        {title}
      </TextButton>
      {isOpen && children}
    </Box>
  );
}
