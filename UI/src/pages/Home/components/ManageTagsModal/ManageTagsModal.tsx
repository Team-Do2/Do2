import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import {
  useGetAllUserTags,
  useAddTagToTask,
  useRemoveTagFromTask,
} from '../../../../services/TagService';
import { useAuthStore } from '../../../../auth/authStore';
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
      removeTagMutation.mutate({ tagId: tag.id, taskId });
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
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
        {allTags.length ? (
          allTags.map((tag) => (
            <div key={tag.id} className="tag-item">
              {isTagSelected(tag) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5rem"
                  height="1.5rem"
                  fill="currentColor"
                  className="bi bi-dash-square-fill remove-btn"
                  viewBox="0 0 16 16"
                  onClick={handleTagToggle.bind(null, tag)}
                >
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5rem"
                  height="1.5rem"
                  fill="currentColor"
                  className="bi bi-plus-square-fill add-btn"
                  viewBox="0 0 16 16"
                  onClick={handleTagToggle.bind(null, tag)}
                >
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
                </svg>
              )}
              <TagComponent tag={tag} />
            </div>
          ))
        ) : (
          <span className="missing-tags-text">
            <i>You currenlty have no tags. Feel free to add tags in the settings menu.</i>
          </span>
        )}
      </div>
      <button onClick={onRequestClose} className="close-btn">
        Close
      </button>
    </Modal>
  );
};

export default ManageTagsModal;
