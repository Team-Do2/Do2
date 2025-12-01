import type { Tag } from '../../../../models/Tag';
import './TagComponent.css';

function getContrastColor(bgColor: string): string {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'var(--text-color-dark)' : 'var(--text-color-light)';
}

function getBorderColor(bgColor: string): string {
  const hex = bgColor.replace('#', '');
  const r = Math.floor(parseInt(hex.substring(0, 2), 16) * 0.25);
  const g = Math.floor(parseInt(hex.substring(2, 4), 16) * 0.25);
  const b = Math.floor(parseInt(hex.substring(4, 6), 16) * 0.25);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const TagComponent = ({ tag }: { tag: Tag }) => {
  const textColor = getContrastColor(tag.color);
  const borderColor = getBorderColor(tag.color);

  return (
    <span
      className="tag-component"
      style={{ color: textColor, backgroundColor: tag.color, border: `1px solid ${borderColor}` }}
    >
      {tag.name}
    </span>
  );
};

export default TagComponent;
