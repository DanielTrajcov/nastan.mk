import React from "react";
import { HiOutlineLocationMarker, HiOutlineCalendar } from "react-icons/hi";
import { Post } from "../../types/Post";
import { HiOutlineClock, HiOutlineTrash } from "react-icons/hi2";
import Image from "next/image";

interface PostItemProps {
  post: Post;
  showModal?: boolean;
}

const ModalDesktop = ({ post, showModal }: PostItemProps) => {
  return <div>ModalDesktop</div>;
};

export default ModalDesktop;
