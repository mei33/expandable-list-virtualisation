import React from 'react';

interface Props {
  className?: string;
  id: string;
  label: string;
}

export const ListItem: React.FC<Props> = ({ className, id, label }) => {
  return (
    <div id={id} className={className}>
      {label}
    </div>
  );
};
