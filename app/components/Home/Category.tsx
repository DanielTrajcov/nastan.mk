"use client";
import React, { useEffect, useState } from "react";
import Data from "../../shared/Data";
import Image from "next/image";

interface Game {
  id: number;
  name: string;
  image: string;
}

const Category = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    setGames(Data.Category);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6 mt-4">
        {games.map((item) => (
          <div
            className="flex flex-col items-center cursor-pointer"
            key={item.id}
          >
            <Image src={item.image} alt={item.name} width={65} height={65} />
            <h2 className="text-[14px] text-center">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
