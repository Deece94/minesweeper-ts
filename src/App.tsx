//TODO:
// - Page design
// - Save results
// - Make timer accurate
// -

import { useEffect, useState } from "react";

import Board from "./components/Board";
import { TileType, Statuses } from "./types";

// App for creating a minesweeper grid
function App() {
	const [rows, setRows] = useState<number>(0);
	const [columns, setColumns] = useState<number>(0);
	const [mines, setMines] = useState<number>(0);

	const [grid, setGrid] = useState<TileType[][]>([]);
	const [status, setStatus] = useState<string>(Statuses.waiting);
	const [time, setTime] = useState<number>(0);
	const [timer, setTimer] = useState<number | null>(null);

	// When the status changes to playing start a timer from 0
	// When the status changes to somethign else reset and clear the timer
	useEffect(() => {
		if (status === Statuses.playing) {
			setTime(0);
			const newTimer = setInterval(() => {
				setTime((time) => time + 10);
			}, 10);
			setTimer(newTimer);
		} else if (status === Statuses.gameover || status === Statuses.waiting) {
			setTime(0);
			if (timer) {
				clearInterval(timer);
			}
		} else {
			if (timer) {
				clearInterval(timer);
			}
		}
	}, [status]);

	const countMines = (
		newGrid: TileType[][],
		rowIndex: number,
		columnIndex: number
	) => {
		let count = 0;
		// Check the row above
		if (rowIndex > 0) {
			if (columnIndex > 0 && newGrid[rowIndex - 1][columnIndex - 1].isMine) {
				count++;
			}
			if (newGrid[rowIndex - 1][columnIndex].isMine) {
				count++;
			}
			if (
				columnIndex < columns - 1 &&
				newGrid[rowIndex - 1][columnIndex + 1].isMine
			) {
				count++;
			}
		}

		// Check the same row
		if (columnIndex > 0 && newGrid[rowIndex][columnIndex - 1].isMine) {
			count++;
		}
		if (
			columnIndex < columns - 1 &&
			newGrid[rowIndex][columnIndex + 1].isMine
		) {
			count++;
		}

		// Check the row below
		if (rowIndex < rows - 1) {
			if (columnIndex > 0 && newGrid[rowIndex + 1][columnIndex - 1].isMine) {
				count++;
			}
			if (newGrid[rowIndex + 1][columnIndex].isMine) {
				count++;
			}
			if (
				columnIndex < columns - 1 &&
				newGrid[rowIndex + 1][columnIndex + 1].isMine
			) {
				count++;
			}
		}

		return count;
	};

	const createBoard = () => {
		console.log(
			`Creating a new board with ${rows} rows, ${columns} columns, and ${mines} mines.`
		);
		// Create a new grid with the specified number of rows and columns
		if (rows <= 0 || columns <= 0 || mines <= 0) {
			alert(`Invalid input. Rows, columns, and mines must be greater than 0.`);
			return;
		}

		const tileCount = rows * columns;
		if (mines >= tileCount) {
			alert(`Invalid input. There must be more tiles than mines.`);
			return;
		}

		setTime(0);

		// Create a new grid with mines randomly placed in it
		const newGrid: TileType[][] = [];
		for (let i = 0; i < rows; i++) {
			newGrid.push([]);
			for (let j = 0; j < columns; j++) {
				newGrid[i].push({
					isMine: false,
					isVisible: false,
					minesAround: 0,
					isFlagged: false,
				});
			}
		}

		// Place mines randomly in the grid
		let minesPlaced = 0;
		while (minesPlaced < mines) {
			const rowIndex = Math.floor(Math.random() * rows);
			const columnIndex = Math.floor(Math.random() * columns);

			if (newGrid[rowIndex][columnIndex].isMine === false) {
				newGrid[rowIndex][columnIndex].isMine = true;
				minesPlaced++;
			}
		}

		// Count the number of mines around each tile
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				newGrid[i][j].minesAround = countMines(newGrid, i, j);
			}
		}

		// Set the grid to the new grid
		setGrid(newGrid);
		setStatus(() => Statuses.playing);
	};

	return (
		<div className='App'>
			<input
				type='number'
				value={rows ?? ""}
				onChange={(e) => setRows(e.target.valueAsNumber)}
			/>
			<input
				type='number'
				value={columns ?? ""}
				onChange={(e) => setColumns(e.target.valueAsNumber)}
			/>
			<input
				type='number'
				value={mines ?? ""}
				onChange={(e) => setMines(e.target.valueAsNumber)}
			/>

			<button onClick={createBoard}>Create Board</button>

			<Board
				grid={grid}
				setGrid={setGrid}
				status={status}
				setStatus={setStatus}
				time={time}
			/>
		</div>
	);
}

export default App;
