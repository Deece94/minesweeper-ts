import Tile from "../Tile";
import styled from "styled-components";
import { TileType, StatusType } from "../../types";
import { TimerApiContext } from "./TimerProvider";
import StatusBar from "./Statusbar";
import { useContext } from "react";

const BoardContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
`;

const Board = ({
	grid,
	setGrid,
	status,
	setStatus,
	placeMines,
}: {
	grid: TileType[][];
	setGrid: (grid: TileType[][]) => void;
	status: StatusType;
	setStatus: (status: StatusType) => void;
	placeMines: Function;
}) => {
	const { resetTimer, stopTimer } = useContext(TimerApiContext);
	console.log("board");

	const triggerTile = (rowIndex: number, columnIndex: number) => {
		// Check if out of bounds
		if (rowIndex < 0 || rowIndex >= grid.length) {
			return;
		}
		if (columnIndex < 0 || columnIndex >= grid[0].length) {
			return;
		}

		// if aready visible, return
		if (grid[rowIndex][columnIndex].isVisible) {
			return;
		}

		// Left click
		// Check if flagged
		if (grid[rowIndex][columnIndex].isFlagged) {
			return;
		}
		// Change the tiles visible state
		const newGrid = [...grid];
		newGrid[rowIndex][columnIndex].isVisible = true;

		// Check if mine
		if (newGrid[rowIndex][columnIndex].isMine) {
			// Game over
			setStatus("gameover");
			return;
		}

		// Check if no mines around before triggering surrounding tiles
		if (newGrid[rowIndex][columnIndex].minesAround === 0) {
			// trigger all surrounding tiles
			triggerTile(rowIndex - 1, columnIndex - 1);
			triggerTile(rowIndex - 1, columnIndex);
			triggerTile(rowIndex - 1, columnIndex + 1);
			triggerTile(rowIndex, columnIndex - 1);
			triggerTile(rowIndex, columnIndex + 1);
			triggerTile(rowIndex + 1, columnIndex - 1);
			triggerTile(rowIndex + 1, columnIndex);
			triggerTile(rowIndex + 1, columnIndex + 1);
		}
	};

	// Game is in win state if all non-mine tiles are visible
	const isInWinState = (newGrid: TileType[][]) => {
		// CHeck each tile and if a non-mine tile is not visible, return false
		for (let i = 0; i < newGrid.length; i++) {
			for (let j = 0; j < newGrid[0].length; j++) {
				if (!newGrid[i][j].isMine && !newGrid[i][j].isVisible) {
					return false;
				}
			}
		}
		return true;
	};

	const handleClick = (
		e: React.MouseEvent,
		rowIndex: number,
		columnIndex: number
	) => {
		if (status === "gameover" || status === "win") {
			return;
		}

		// If first click, place mines
		let newGrid; // If the first click then the actual grid will be being updated by the setstate still, use the returned on instead
		if (status === "waiting") {
			newGrid = placeMines(rowIndex, columnIndex);
			resetTimer();
		} else {
			newGrid = [...grid];
		}

		// Check if right or left click
		if (e.button === 2) {
			// Right click
			newGrid[rowIndex][columnIndex].isFlagged =
				!newGrid[rowIndex][columnIndex].isFlagged;
		} else {
			triggerTile(rowIndex, columnIndex);
		}

		// Check if win state
		if (isInWinState(newGrid)) {
			setStatus("win");
			stopTimer();
		}

		setGrid(newGrid);
	};

	return (
		<BoardContainer className='board'>
			<StatusBar status={status} />
			{grid.map((row, rowIndex) => (
				<Row className='row' key={rowIndex}>
					{row.map((tile, columnIndex) => (
						<Tile
							key={columnIndex}
							handleClick={handleClick}
							rowIndex={rowIndex}
							columnIndex={columnIndex}
							status={status}
							{...tile}
						/>
					))}
				</Row>
			))}
		</BoardContainer>
	);
};

export default Board;
