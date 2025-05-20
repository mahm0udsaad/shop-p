"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { EditableCardProps } from "../types";

export function EditableCard<T>({
  item,
  index,
  onEdit,
  onDelete,
  renderPreview,
  renderEditor,
}: EditableCardProps<T>) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDone = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(index);
  };

  return (
    <Card className="p-4">
      {isEditing
        ? renderEditor(item, handleDone, handleDelete)
        : renderPreview(item, handleEdit)
      }
    </Card>
  );
} 