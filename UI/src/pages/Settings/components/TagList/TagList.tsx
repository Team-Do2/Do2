import { useGetAllUserTags } from '../../../../services/TagService';
import { useAuthStore } from '../../../../stores/authStore';
import TagComponent from '../TagComponent/TagComponent';
import type { Tag } from '../../../../models/Tag';

function TagList() {
  const { userEmail } = useAuthStore();
  const { data: tags } = useGetAllUserTags(userEmail || '');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {tags?.map((tag: Tag) => (
        <TagComponent key={tag.id} tag={tag} />
      ))}
    </div>
  );
}

export default TagList;
