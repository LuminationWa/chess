let colorDirection;
let letterDiff;
let numberDiff;

//Recursive function
const checkRookValidity = (
  pieceArray,
  direction,
  position1,
  position2,
  diff,
  originalSquare,
  newSquare,
  recursiveSquare
) => {
  if (Math.abs(diff) === 1) {
    //Stops at diff === 1 cause this iteration would reduce the diff to 0 and tempSquare 'll become newSquare
    return newSquare.children[0] === undefined
      ? true
      : !(
          pieceArray[originalSquare.children[0].id].color ===
          pieceArray[newSquare.children[0].id].color
        );
  }
  if (direction === "y axis") {
    let tempSquare;
    let multiplier;
    position1 < position2 ? (multiplier = 1) : (multiplier = -1);
    tempSquare = document.getElementById(
      recursiveSquare.id.charAt(0) +
        (parseInt(recursiveSquare.id.charAt(1)) + 1 * multiplier)
    );
    return tempSquare.children[0] === undefined
      ? checkRookValidity(
          pieceArray,
          direction,
          position1,
          position2,
          diff - 1,
          originalSquare,
          newSquare,
          tempSquare
        )
      : false;
  } else if (direction === "x axis") {
    let tempSquare;
    let multiplier;
    position1 < position2 ? (multiplier = 1) : (multiplier = -1);
    tempSquare = document.getElementById(
      String.fromCharCode(recursiveSquare.id.charCodeAt(0) + 1 * multiplier) +
        recursiveSquare.id.charAt(1)
    );
    return tempSquare.children[0] === undefined
      ? checkRookValidity(
          pieceArray,
          direction,
          position1,
          position2,
          diff - 1,
          originalSquare,
          newSquare,
          tempSquare
        )
      : false;
  }
};

//Recursive function
const checkBishopValidity = (
  pieceArray,
  originalSquare,
  newSquare,
  xDiff,
  yDiff,
  recursiveSquare
) => {
  if (Math.abs(xDiff) === 1 && Math.abs(yDiff) === 1) {
    console.log(newSquare);
    return newSquare.children[0] === undefined
      ? true
      : !(
          pieceArray[originalSquare.children[0].id].color ===
          pieceArray[newSquare.children[0].id].color
        );
  } else {
    let tempValue = "";
    let xMultiplier;
    let yMultiplier;
    xDiff > 0 ? (xMultiplier = -1) : (xMultiplier = 1);
    yDiff > 0 ? (yMultiplier = -1) : (yMultiplier = 1);
    xDiff > 0
      ? (tempValue = String.fromCharCode(recursiveSquare.id.charCodeAt(0) + 1))
      : (tempValue = String.fromCharCode(recursiveSquare.id.charCodeAt(0) - 1));
    yDiff > 0
      ? (tempValue += parseInt(recursiveSquare.id.charAt(1)) + 1)
      : (tempValue += parseInt(recursiveSquare.id.charAt(1)) - 1);
    let tempSquare = document.getElementById(tempValue);
    return tempSquare.children[0] === undefined
      ? checkBishopValidity(
          pieceArray,
          originalSquare,
          newSquare,
          xDiff + 1 * xMultiplier,
          yDiff + 1 * yMultiplier,
          tempSquare
        )
      : false;
  }
};

const pawn = (color, originalSquare, newSquare) => {
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
      newSquare.id.charCodeAt(0) === originalSquare.id.charCodeAt(0) - 1) &&
    newSquare.id.charAt(1) ==
      parseInt(originalSquare.id.charAt(1)) + 1 * colorDirection
  )
    return true;
};
const knight = (originalSquare, newSquare) => {
  //Knight always moves three squares and either the letter or the number should change by two and the other one by one
  letterDiff = Math.abs(
    parseInt(originalSquare.id.charCodeAt(0)) -
      parseInt(newSquare.id.charCodeAt(0))
  );
  numberDiff = Math.abs(
    parseInt(originalSquare.id.charAt(1)) - parseInt(newSquare.id.charAt(1))
  );
  return (
    (letterDiff === 1 && numberDiff === 2) ||
    (letterDiff === 2 && numberDiff === 1)
  );
};
const king = (originalSquare, newSquare) => {
  letterDiff = Math.abs(
    parseInt(originalSquare.id.charCodeAt(0)) -
      parseInt(newSquare.id.charCodeAt(0))
  );
  numberDiff = Math.abs(
    parseInt(originalSquare.id.charAt(1)) - parseInt(newSquare.id.charAt(1))
  );
  return letterDiff <= 1 && numberDiff <= 1;
};
const rook = (originalSquare, newSquare, pieceArray) => {
  let direction;
  let position1;
  let position2;
  if (originalSquare.id.charAt(0) === newSquare.id.charAt(0)) {
    direction = "y axis";
    position1 = parseInt(originalSquare.id.charAt(1));
    position2 = parseInt(newSquare.id.charAt(1));
  } else if (originalSquare.id.charAt(1) === newSquare.id.charAt(1)) {
    direction = "x axis";
    position1 = parseInt(originalSquare.id.charCodeAt(0));
    position2 = parseInt(newSquare.id.charCodeAt(0));
  }
  let diff = Math.abs(position2 - position1);
  return checkRookValidity(
    pieceArray,
    direction,
    position1,
    position2,
    diff,
    originalSquare,
    newSquare,
    originalSquare
  );
};

const bishop = (originalSquare, newSquare, pieceArray) => {
  //Making sure it can't go horizontally or vertically
  if (
    originalSquare.id.charAt(0) !== newSquare.id.charAt(0) &&
    originalSquare.id.charAt(1) !== newSquare.id.charAt(1)
  ) {
    let xDiff = newSquare.id.charCodeAt(0) - originalSquare.id.charCodeAt(0);
    let yDiff =
      parseInt(newSquare.id.charAt(1)) - parseInt(originalSquare.id.charAt(1));
    return Math.abs(xDiff) === Math.abs(yDiff)
      ? checkBishopValidity(
          pieceArray,
          originalSquare,
          newSquare,
          xDiff,
          yDiff,
          originalSquare
        )
      : false;
  } else return false;
};

const queen = (originalSquare, newSquare, pieceArray) => {
  return (
    king(originalSquare, newSquare) ||
    rook(originalSquare, newSquare, pieceArray) ||
    bishop(originalSquare, newSquare, pieceArray)
  );
};

export { pawn, knight, king, rook, bishop, queen };
