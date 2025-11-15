import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import {
  useGetAllUserTags,
  useAddTagToTask,
  useRemoveTagFromTask,
} from '../../../../services/TagService';
import { useAuthStore } from '../../../../stores/authStore';
import TagComponent from '../../../Settings/components/TagComponent/TagComponent';
import type { Tag } from '../../../../models/Tag';
import './ManageTagsModal.css';

Modal.setAppElement('#root');

interface ManageTagsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  taskId: number;
  currentTags: Tag[];
}

const ManageTagsModal: React.FC<ManageTagsModalProps> = ({
  isOpen,
  onRequestClose,
  taskId,
  currentTags,
}) => {
  const { userEmail } = useAuthStore();
  const { data: allTags } = useGetAllUserTags(userEmail || '');
  const addTagMutation = useAddTagToTask();
  const removeTagMutation = useRemoveTagFromTask();

  const [selectedTags, setSelectedTags] = useState<Tag[]>(currentTags);

  useEffect(() => {
    setSelectedTags(currentTags);
  }, [currentTags, isOpen]);

  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      // Remove tag
      removeTagMutation.mutate({ tagId: tag.id, taskId });
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      // Add tag
      addTagMutation.mutate({ tagId: tag.id, taskId });
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const isTagSelected = (tag: Tag) => selectedTags.some((t) => t.id === tag.id);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Manage Tags"
      className="popup-modal-content"
      overlayClassName="popup-modal-overlay"
    >
      <h2>Manage Tags for Task</h2>
      <div className="tags-list">
        {allTags &&
          allTags.map((tag) => (
            <div key={tag.id} className="tag-item">
              <TagComponent tag={tag} />
              <button
                onClick={() => handleTagToggle(tag)}
                className={isTagSelected(tag) ? 'remove-btn' : 'add-btn'}
              >
                {isTagSelected(tag) ? 'Remove' : 'Add'}
              </button>
            </div>
          ))}
      </div>
      <button onClick={onRequestClose} className="close-btn">
        Close
      </button>
    </Modal>
  );
};

export default ManageTagsModal;
