import React from 'react';
import type { Tag } from '../../../../models/Tag';

interface TagComponentProps {
  tag: Tag;
}

const TagComponent: React.FC<TagComponentProps> = ({ tag }) => {
  return (
    <span
      style={{
        background: tag.color,
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '16px',
        fontWeight: 'bold',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      {tag.name}
    </span>
  );
};

export default TagComponent;
