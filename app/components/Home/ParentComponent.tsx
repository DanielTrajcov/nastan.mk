"use client";
import React, { useState } from "react";
import { Post } from "../../types/Post";
import SearchBox from "./SearchBox";
import Posts from "./Posts";

const ParentComponent = () => {
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [zipCode, setZipCode] = useState<string>("");

  return (
    <div>
      <SearchBox setSearchResults={setSearchResults} setZipCode={setZipCode} />
      <Posts
        searchResults={searchResults}
        zipCode={zipCode}
        allPosts={allPosts}
      />
    </div>
  );
};

export default ParentComponent;
