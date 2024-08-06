import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './Constants'; // Ensure this path is correct

function FieldItem({ field, index, handleRemoveField, moveField }) {
    const [{ isDragging }, dragRef] = useDrag({
        type: ItemTypes.FIELD,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.FIELD,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveField(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <li ref={(node) => {
            console.log(node);
            dragRef(drop(node))
            }} className="field-item" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <span>{field.label} ({field.type})</span>
            <button type="button" onClick={() => handleRemoveField(index)} className="remove-field-button">
                Remove
            </button>
        </li>
    );
}

export default FieldItem;