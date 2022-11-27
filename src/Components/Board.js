import { useEffect } from "react";

const Board = () => {
    useEffect(() => {
        addSquares(8, 8, ".chess-board");
    }, []);

    const addSquares = (rows, columns, element) => {
        let chessBoard = document.querySelector(`${element}`);
        for (let i = 0; i < rows * columns; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.id = giveSquare(i);
            chessBoard.appendChild(square);
        }
    };
    const giveSquare = (iteration) => {
        let ASCII = 65; //ASCII code for A
        let ASCIIcount = Math.trunc(iteration / 8); //By taking the whole part of the result we can know if the letter needs to be changed
        let number = (iteration % 8) + 1; //Remainer is used to determine number
        let letter = String.fromCharCode(ASCII + ASCIIcount);
        return letter + number;
    };

    return <div className="chess-board"></div>;
};

export default Board;
