export type TileType = {
	isMine: boolean;
	isVisible: boolean;
	minesAround: number;
	isFlagged: boolean;
};

export enum Statuses {
	waiting = "waiting",
	playing = "playing",
	gameover = "gameover",
	win = "win",
}
