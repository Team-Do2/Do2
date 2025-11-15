import './TagList.css';
import { useGetAllUserTags, useUpdateTag } from '../../../../services/TagService';
import { useAuthStore } from '../../../../stores/authStore';
import TagComponent from '../TagComponent/TagComponent';
import AddEditTagModal from '../AddEditTagModal/AddEditTagModal';
import type { Tag } from '../../../../models/Tag';
import { useState } from 'react';

function TagList() {
  const { userEmail } = useAuthStore();
  const { data: tags } = useGetAllUserTags(userEmail || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const updateTagMutation = useUpdateTag();

  const handleEdit = (tag: Tag) => {
    setTagToEdit(tag);
    setIsModalOpen(true);
  };

  const handleSave = (tag: { id?: number; name: string; color: string; userEmail: string }) => {
    if (tag.id) {
      updateTagMutation.mutate(tag as Tag & { userEmail: string });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTagToEdit(null);
  };

  return (
    <>
      <div className="tag-list-container">
        {tags &&
          tags.map((tag: Tag) => (
            <div key={tag.id} className="tag-item">
              <TagComponent tag={tag} />
              <button onClick={() => handleEdit(tag)}>Edit</button>
            </div>
          ))}
      </div>
      <AddEditTagModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        tagToEdit={tagToEdit}
        userEmail={userEmail || ''}
        onSave={handleSave}
      />
    </>
  );
}

export default TagList;
