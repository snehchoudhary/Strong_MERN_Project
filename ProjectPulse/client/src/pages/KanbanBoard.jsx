import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

function KanbanBoard() {

  const [tasks, setTasks] = useState({
    pending: [],
    "in-progress": [],
    completed: []
  });

  useEffect(() => {

    fetchTasks();

  }, []);

  const fetchTasks = async () => {

    try {

      const res =
        await api.get("/tasks");

      const allTasks =
        res.data;

      const grouped = {

        pending:
          allTasks.filter(
            t => t.status === "pending"
          ),

        "in-progress":
          allTasks.filter(
            t => t.status === "in-progress"
          ),

        completed:
          allTasks.filter(
            t => t.status === "completed"
          )

      };

      setTasks(grouped);

    }

    catch (error) {

      console.error(error);

    }

  };

  // Handle Drag

  const handleDragEnd = async (result) => {

    const { source, destination } =
      result;

    if (!destination) return;

    const sourceCol =
      source.droppableId;

    const destCol =
      destination.droppableId;

    const sourceItems =
      [...tasks[sourceCol]];

    const destItems =
      [...tasks[destCol]];

    const [movedTask] =
      sourceItems.splice(
        source.index,
        1
      );

    movedTask.status =
      destCol;

    destItems.splice(
      destination.index,
      0,
      movedTask
    );

    setTasks({
      ...tasks,
      [sourceCol]: sourceItems,
      [destCol]: destItems
    });

    // Update in backend

    try {

      await api.put(
        `/tasks/${movedTask._id}`,
        {
          status: destCol
        }
      );

    }

    catch (error) {

      console.error(
        "Status update failed"
      );

    }

  };

  const columns = [
    "pending",
    "in-progress",
    "completed"
  ];

  return (

    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">

        Task Board

      </h2>

      <DragDropContext
        onDragEnd={handleDragEnd}
      >

        <div className="grid grid-cols-3 gap-4">

          {columns.map(col => (

            <Droppable
              key={col}
              droppableId={col}
            >

              {(provided) => (

                <div

                  ref={provided.innerRef}
                  {...provided.droppableProps}

                  className="bg-gray-100 p-4 rounded min-h-[400px]"

                >

                  <h3 className="font-bold capitalize mb-4">

                    {col}

                  </h3>

                  {tasks[col].map(
                    (task, index) => (

                      <Draggable

                        key={task._id}
                        draggableId={task._id}
                        index={index}

                      >

                        {(provided) => (

                          <div

                            ref={provided.innerRef}

                            {...provided.draggableProps}

                            {...provided.dragHandleProps}

                            className="bg-white p-3 mb-3 rounded shadow"

                          >

                            <p className="font-medium">

                              {task.title}

                            </p>

                            <p className="text-sm text-gray-500">

                              {task.description}

                            </p>

                          </div>

                        )}

                      </Draggable>

                    )
                  )}

                  {provided.placeholder}

                </div>

              )}

            </Droppable>

          ))}

        </div>

      </DragDropContext>

    </DashboardLayout>

  );

}

export default KanbanBoard;