import React, { useEffect, useRef } from "react";
import { Post } from "../../types/Post";
import PostItem from "./PostItem";
import { HiXMark } from "react-icons/hi2";

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
    <div onClick={handleClose}>
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box w-full sm:max-w-md">
          <div className="flex justify-end p-1 sm:hidden">
            <button
              type="button"
              onClick={handleClose}
              className="text-4xl text-gray-900 outline-none"
            >
              <HiXMark />
            </button>
          </div>
          <div className="flex justify-center">
            <form method="dialog" className="flex flex-col w-full">
              <PostItem post={post} showModal={true} />
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PostModal;
