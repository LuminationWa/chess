import { useEffect } from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import useState from "react-usestateref";
import pieceFactory from "../pieceFactory";

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
    console.log(piece, color, originalSquare, newSquare);
    let colorDirection;
    let letterDiff;
    let numberDiff;
    switch (piece) {
      case "pawn":
        color === "white" ? (colorDirection = 1) : (colorDirection = -1);
        //Moving to an empty square
        if (
          newSquare.children[0] === undefined &&
          newSquare.id.charAt(0) === originalSquare.id.charAt(0) &&
          newSquare.id.charAt(1) ==
            parseInt(originalSquare.id.charAt(1)) + 1 * colorDirection
        )
          return true;
        //Moving to an occupied square
        else if (
          newSquare.children[0] !== undefined &&
          (newSquare.id.charCodeAt(0) === originalSquare.id.charCodeAt(0) + 1 ||
            newSquare.id.charCodeAt(0) ===
              originalSquare.id.charCodeAt(0) - 1) &&
          newSquare.id.charAt(1) ==
            parseInt(originalSquare.id.charAt(1)) + 1 * colorDirection
        )
          return true;
        break;
      case "knight":
        //Knight always moves three squares and either the letter or the number should change by two and the other one by one
        letterDiff = Math.abs(
          parseInt(originalSquare.id.charCodeAt(0)) -
            parseInt(newSquare.id.charCodeAt(0))
        );
        numberDiff = Math.abs(
          parseInt(originalSquare.id.charAt(1)) -
            parseInt(newSquare.id.charAt(1))
        );
        return (
          (letterDiff === 1 && numberDiff === 2) ||
          (letterDiff === 2 && numberDiff === 1)
        );
      case "king":
        letterDiff = Math.abs(
          parseInt(originalSquare.id.charCodeAt(0)) -
            parseInt(newSquare.id.charCodeAt(0))
        );
        numberDiff = Math.abs(
          parseInt(originalSquare.id.charAt(1)) -
            parseInt(newSquare.id.charAt(1))
        );
        return letterDiff <= 1 && numberDiff <= 1;
      case "rook":
        let direction;
        let diff;
        if (originalSquare.id.charAt(0) === newSquare.id.charAt(0)) {
          direction = "vertical";
          diff =
            parseInt(originalSquare.id.charAt(1)) -
            parseInt(newSquare.id.charAt(1));
        } else if (originalSquare.id.charAt(1) === newSquare.id.charAt(1)) {
          direction = "horizontal";
          diff =
            parseInt(originalSquare.id.charCodeAt(0)) -
            parseInt(newSquare.id.charCodeAt(0));
        }
        //Needs fixing, too tired to figure it out rn
        for (let i = 0; i <= Math.abs(diff); i++) {
          if (direction === "vertical") {
            console.log(
              originalSquare.id.charAt(0) +
                (parseInt(originalSquare.id.charAt(1)) + i * Math.sign(diff))
            );
            let nextSquare = document.getElementById(
              originalSquare.id.charAt(0) +
                (parseInt(originalSquare.id.charAt(1)) + i * Math.sign(diff) + 1)
            );
            if (nextSquare.children[0] === undefined) continue;
            else {
              console.log("break");
              break;
            }
          }
        }
        break;
      default:
        return false;
    }
  };

  return <div className="chess-board"></div>;
};

export default Board;
