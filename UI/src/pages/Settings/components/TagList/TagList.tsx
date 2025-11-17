import './TagList.css';
import { useGetAllUserTags, useUpdateTag, useDeleteTag } from '../../../../services/TagService';
import { useAuthStore } from '../../../../stores/authStore';
import TagComponent from '../TagComponent/TagComponent';
import AddEditTagModal from '../AddEditTagModal/AddEditTagModal';
import type { Tag } from '../../../../models/Tag';
import { useState } from 'react';
import DeleteButton from '../../../Home/components/TaskCard/Components/DeleteButton/DeleteButton';
import EditButton from '../../../Home/components/TaskCard/Components/EditButton/EditButton';

function TagList() {
  const { userEmail } = useAuthStore();
  const { data: tags } = useGetAllUserTags(userEmail || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  const handleEdit = (tag: Tag) => {
    setTagToEdit(tag);
    setIsModalOpen(true);
  };

  const handleSave = (tag: { id?: number; name: string; color: string; userEmail: string }) => {
    if (tag.id) {
      updateTagMutation.mutate(tag as Tag & { userEmail: string });
    }
  };

  const handleDelete = (tagId: number) => {
    deleteTagMutation.mutate({ tagId, userEmail: userEmail || '' });
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
              <div className="tag-item-buttons">
                <EditButton onClick={() => handleEdit(tag)} width="1.9rem" height="1.9rem" />
                <DeleteButton
                  onClick={() => handleDelete(tag.id)}
                  width="1.5rem"
                  height="2.25rem"
                />
              </div>
            </div>
          ))}
      </div>
      {tags && tags.length === 0 && (
        <p className="no-tags-text">No user tags configured, add them below.</p>
      )}
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
