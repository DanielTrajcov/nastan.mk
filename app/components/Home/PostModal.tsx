import React, { useEffect, useRef } from "react";
import { Post } from "../../types/Post";
import PostItem from "./PostItem";

interface PostModalProps {
  post: Post;
  closeModal: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, closeModal }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, [post]);

  const handleClose = () => {
    closeModal();
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  return (
    <div>
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box w-full max-w-xs sm:max-w-md">
          <div className="flex justify-center">
            <form method="dialog" className="flex flex-col w-full">
              <PostItem post={post} showModal={true} />
              <button
                type="button"
                onClick={handleClose}
                className="btn bg-gray-200 mt-5 text-xl text-black font-normal"
              >
                Затвори
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PostModal;
