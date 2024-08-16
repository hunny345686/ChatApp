import React from "react";
import "./bg.css";
import {
  GiAbstract007,
  GiAbstract019,
  GiAbstract069,
  GiPencil,
} from "react-icons/gi";
import {
  FaAngular,
  FaApple,
  FaBaseballBall,
  FaBootstrap,
  FaCode,
  FaReact,
} from "react-icons/fa";
import { IoBookSharp, IoFootballOutline } from "react-icons/io5";
import { MdLibraryBooks } from "react-icons/md";
import { FiCodesandbox } from "react-icons/fi";
import { SiCodeigniter, SiCodesignal } from "react-icons/si";
import { PiMonitor } from "react-icons/pi";
function Bg() {
  function generateRandomArray(length, min, max) {
    return Array.from({ length }, () =>
      Math.floor(Math.random() * (max - min) + min)
    );
  }

  const randomArray = generateRandomArray(12, 4, 10);
  return (
    <div className="animated-background">
      {randomArray.map((item, indx) => (
        <>
          <GiPencil
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <FaReact className="icon" style={{ animationDuration: `${item}s` }} />
          <IoBookSharp
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <MdLibraryBooks
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <IoFootballOutline
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <FaCode className="icon" style={{ animationDuration: `${item}s` }} />
          <FiCodesandbox
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <SiCodeigniter
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <SiCodesignal
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <PiMonitor
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <GiAbstract007
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <GiAbstract019
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <GiAbstract069
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <FaAngular
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <FaApple className="icon" style={{ animationDuration: `${item}s` }} />
          <FaBaseballBall
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
          <FaBootstrap
            className="icon"
            style={{ animationDuration: `${item}s` }}
          />
        </>
      ))}
    </div>
  );
}

export default Bg;
