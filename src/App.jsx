import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FieldItem from './FieldItem';

function App() {

  /**
   * benefits of useref
   * 1. Accessing DOM Elements: When you need to perform operations on a DOM element directly, such as focusing an input field or measuring its size.
   * 2. Storing Mutable Values: useRef can also be used to store mutable values that persist across renders without causing re-renders. For example:  
   */

  const labelRef = useRef(null);
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ type: 'text', label: '', isRequired: false });
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    labelRef.current.focus()
  }, [])

  const handleAddField = () => {
    if (newField.label === '') {
      toast.error('Label Field requried. Please enter label.');
      return;
    }
    if (newField.type === 'select') {
      setFields([...fields, { ...newField, options: [...options] }]);
    } else {
      setFields([...fields, { ...newField }]);
    }
    setNewField({ type: 'text', label: '', isRequired: false });
    setOptions([]);
    setNewOption('');
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const moveField = (fromIndex, toIndex) => {
    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedField);
    setFields(updatedFields);
};

  const handleAddOption = () => {
    if (newOption) {
      setOptions([...options, newOption]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const generateCode = () => {
    if (fields.length === 0) {
      toast.error('No fields selected. Please add at least one field.');
      return;
    }

    let htmlCode = '<form>\n';

    fields.forEach((field, index) => {
      let requiredAttr = field.isRequired ? 'required' : '';
      if (field.type === 'select') {
        htmlCode += `  <label for="field-${index}">${field.label}:</label>\n`;
        htmlCode += `  <select id="field-${index}" name="field-${index}" ${requiredAttr}>\n`;
        field.options.forEach((option, optIndex) => {
          htmlCode += `    <option value="option${optIndex + 1}">${option}</option>\n`;
        });
        htmlCode += `  </select>\n`;
      } else {
        htmlCode += `  <label for="field-${index}">${field.label}:</label>\n`;
        htmlCode += `  <input type="${field.type}" id="field-${index}" name="field-${index}" ${requiredAttr}>\n`;
      }
    });

    htmlCode += '</form>\n';

    // Set the generated code
    setGeneratedCode(`HTML Code:\n${htmlCode}`);
  };

  return (
    <div className="form-generator">
      <h2>Form Field Generator</h2>
      <form>
        <div className="form-group">
          <label>
            Field Type:
            <select value={newField.type} onChange={(e) => setNewField({ ...newField, type: e.target.value })}>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="select">Select</option>
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Label:
            <input
                       ref={labelRef}
              type="text"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Is Required ?
            <input
   
              type="checkbox"
              checked={newField.isRequired}
              onChange={(e) => setNewField({ ...newField, isRequired: e.target.checked })}
            />
          </label>
        </div>
        {newField.type === 'select' && (
          <div className="form-group">
            <label>Options:</label>
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="New option"
            />
            <button type="button" onClick={handleAddOption} className="add-option-button">
              Add Option
            </button>
            <ul className="option-list">
              {options.map((option, index) => (
                <li key={index} className="option-item  ">
                  <span>{option}</span>
                  <button type="button" onClick={() => handleRemoveOption(index)} className="remove-option-button">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="button" onClick={handleAddField} className="add-field-button">
          Add Field
        </button>
      </form>
      <h2>Form Fields</h2>
      <ul className="field-list">
      {fields.map((field, index) => (
        <FieldItem key={index} field={field} moveField={moveField} index={index} handleRemoveField={handleRemoveField}/>
      ))}
      </ul>
      <button type="button" onClick={generateCode} className="generate-button">
        Generate Code
      </button>
      {generatedCode && (
        <>
          <h2>Generated Code</h2>
          <pre className="generated-code">{generatedCode}</pre>
        </>
      )}
      <ToastContainer /> {/* Add ToastContainer to the render */}
    </div>
  );
}

export default App
