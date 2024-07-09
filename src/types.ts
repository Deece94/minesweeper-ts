export type TileType = {
	isMine: boolean;
	isVisible: boolean;
	minesAround: number;
	isFlagged: boolean;
};

export type StatusType =
	| "unGenerated" // The game is not generated yet
	| "waiting" // Waiting for the first click
	| "playing" // The game is in progress
	| "gameover" // The game is lost
	| "win"; // The game is won

export type InputTypes = {
	rows: number;
	columns: number;
	mines: number;
};
