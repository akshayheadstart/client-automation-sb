import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  Cancel,
  CancelOutlined,
  Close,
  ReorderOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

function ReorderTabDialog({ open, setOpen, tabs, handleTabDragEnd }) {
  return (
    <Dialog
      fullWidth
      PaperProps={{ sx: { borderRadius: 2.5 } }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogContent>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
          <Typography variant="h6">Reorder Tabs</Typography>
          <Close
            onClick={() => setOpen(false)}
            sx={{ cursor: "pointer" }}
            color="info"
          />
        </Box>
        <DragDropContext onDragEnd={handleTabDragEnd}>
          <Droppable droppableId="tab-drag">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ mt: 2 }}
              >
                {tabs.map((tab, index) => (
                  <Draggable
                    key={index}
                    draggableId={`tab-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <Box
                        className="reorder-tab-content"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <IconButton>
                          <ReorderOutlined />
                        </IconButton>
                        <Typography>{tab.step_name}</Typography>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </DialogContent>
    </Dialog>
  );
}

export default ReorderTabDialog;
