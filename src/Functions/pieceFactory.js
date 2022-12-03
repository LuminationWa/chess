const pieceFactory = (piece, color, position, captured) => {
    return { piece, color, position, captured };
};

export default pieceFactory;