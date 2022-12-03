import { useEffect } from "react";
import useState from "react-usestateref";
import pieceFactory from "../Functions/pieceFactory";
import {
  pawn,
  knight,
  king,
  rook,
  bishop,
  queen,
} from "../Functions/pieceMovement";

const Board = () => {
  const [pieceArray, setPieceArray] = useState([]);
  const [positionsArray, setPositionsArray, positionsRef] = useState([]);

  //Initial useEffect
  useEffect(() => {
    addSquares(8, 8, ".chess-board");
    setPieceArray(createPieces());
  }, []);

  //Movement useEffect
  useEffect(() => {
    if (positionsArray.length === 2) {
      let originalPosition = document.getElementById(`${positionsArray[0]}`);
      let newPosition = document.getElementById(`${positionsArray[1]}`);
      if (
        checkMovement(
          pieceArray[originalPosition.children[0].id].piece,
          pieceArray[originalPosition.children[0].id].color,
          originalPosition,
          newPosition
        )
      )
        if (
          //If there's nothing in new square
          originalPosition.children[0] !== undefined &&
          newPosition.children[0] === undefined
        )
          newPosition.appendChild(originalPosition.children[0]);
        else if (
          //If piece is opposite color
          originalPosition.children[0] !== undefined &&
          pieceArray[originalPosition.children[0].id].color !==
            pieceArray[newPosition.children[0].id].color
        ) {
          newPosition.removeChild(newPosition.firstElementChild);
          newPosition.appendChild(originalPosition.children[0]);
        }
      originalPosition.classList.toggle("active");
      setPositionsArray([]);
    }
  }, [positionsArray]);

  useEffect(() => {
    assignImage(pieceArray);
    console.log(pieceArray);
  }, [pieceArray]);

  //Adds squares to the grid element
  const addSquares = (rows, columns, element) => {
    let chessBoard = document.querySelector(`${element}`);
    let count = 1; //Changes the coloring pattern every 8 squares;
    for (let i = 0; i < rows * columns; i++) {
      if (i % 8 === 0) count++;
      let square = document.createElement("div");
      square.classList.add("square");
      square.id = giveSquare(i);
      square.textContent = square.id;
      square.style.writingMode = "vertical-rl";
      if (count % 2 === 0)
        i % 2 === 0
          ? (square.style.backgroundColor = "brown")
          : (square.style.backgroundColor = "white");
      else if (count % 2 !== 0)
        i % 2 === 0
          ? (square.style.backgroundColor = "white")
          : (square.style.backgroundColor = "brown");
      square.addEventListener("click", () => {
        if (
          positionsRef.current.length === 0 &&
          square.children[0] !== undefined
        ) {
          //Will only change square color if there's a piece to move on the original square
          square.classList.toggle("active");
        }
        if (square.children[0] !== undefined || positionsRef.current.length > 0)
          //Necessary so there's no color confusion. Only pushes to the array if there's a
          //piece on the square (meaning it's the first position) or this is the square to move to
          setPositionsArray((prevArray) => [...prevArray, square.id]);
      });
      chessBoard.appendChild(square);
    }
  };

  //Gives the squares a position
  const giveSquare = (iteration) => {
    let ASCII = 65; //ASCII code for A
    let ASCIIcount = Math.trunc(iteration / 8); //By taking the whole part of the result we can know if the letter needs to be changed
    let number = (iteration % 8) + 1; //Remainer is used to determine number
    let letter = String.fromCharCode(ASCII + ASCIIcount);
    return letter + number;
  };

  const createPieces = () => {
    let tobePlaced = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ];
    let tempArray = [];
    //White pieces
    for (let i = 0; i < 16; i++) {
      if (i < 8) {
        tempArray.push(
          pieceFactory("pawn", "white", String.fromCharCode(65 + i) + 2)
        );
      } else if (8 <= i) {
        tempArray.push(
          pieceFactory(
            tobePlaced[0 + i - 8],
            "white",
            String.fromCharCode(65 + i - 8) + 1
          )
        );
      }
    }
    //Black pieces
    for (let i = 0; i < 16; i++) {
      if (i < 8) {
        tempArray.push(
          pieceFactory("pawn", "black", String.fromCharCode(65 + i) + 7)
        );
      } else if (8 <= i) {
        tempArray.push(
          pieceFactory(
            tobePlaced[0 + i - 8],
            "black",
            String.fromCharCode(65 + i - 8) + 8
          )
        );
      }
    }
    return tempArray;
  };

  const assignImage = (array) => {
    array.forEach((piece, index) => {
      let square = document.getElementById(`${piece.position}`);
      let img = document.createElement("img");
      img.id = index;
      img.src = `/Images/${piece.color}-${piece.piece}.svg`;
      square.appendChild(img);
    });
  };

  const checkMovement = (piece, color, originalSquare, newSquare) => {
    switch (piece) {
      case "pawn":
        return pawn(color, originalSquare, newSquare);
      case "knight":
        return knight(originalSquare, newSquare);
      case "king":
        return king(originalSquare, newSquare);
      case "rook":
        return rook(originalSquare, newSquare, pieceArray);
      case "bishop":
        return bishop(originalSquare, newSquare, pieceArray);
      case "queen":
        return queen(originalSquare, newSquare, pieceArray);
      default:
        return false;
    }
  };

  return <div className="chess-board"></div>;
};

export default Board;
