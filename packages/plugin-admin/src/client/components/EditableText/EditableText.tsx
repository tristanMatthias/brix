import './editable-text.scss';

import React, { HTMLProps, useState } from 'react';


export interface EditableTextProps extends HTMLProps<HTMLInputElement> { }

export const EditableText: React.FunctionComponent<EditableTextProps> = ({
  value,
  ...props
}) => {
  const [editing, setEditing] = useState(false);

  return <div className="editable-text" onClick={() => setEditing(true)}>
    {editing
      ? <input autoFocus value={value} onBlur={() => setEditing(false)} {...props} />
      : value
    }
  </div>;
};
