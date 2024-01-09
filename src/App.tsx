//TODO:
// - Page design
// - Save results
// - Make timer accurate
// - Make first click always safe

import { useEffect, useState } from "react";

import Board from "./components/Board";
import { TileType, Statuses } from "./types";
import styled from "styled-components";

const AppContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
	min-height: 100vh;
	margin: auto;
	padding-top: 50px;
	background-color: #f2f2f2;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	width: 800px;
`;

const StyledButton = styled.button`
	background-color: #28252f;
	border: none;
	border-radius: 8px;
	color: white;
	padding: 15px 32px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 16px;
	margin: 4px 2px;
	cursor: pointer;
	&:hover {
		background-color: #040405;
	}
`;

const Heading = styled.h1`
	font-size: 2.5em;
	text-align: center;
	color: palevioletred;
`;

const Description = styled.p`
	font-size: 1em;
	text-align: center;
	color: palevioletred;
`;

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
	// When the status changes to something else reset and clear the timer
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

	const setTemplate = (template: string) => {
		if (template === "easy") {
			setRows(9);
			setColumns(9);
			setMines(10);
		} else if (template === "medium") {
			setRows(16);
			setColumns(16);
			setMines(40);
		} else if (template === "hard") {
			setRows(16);
			setColumns(30);
			setMines(99);
		}
	};

	return (
		<AppContainer>
			<Row>
				<Heading>Minesweeper</Heading>
			</Row>
			<Row>
				<Description>
					This Minesweeper project was created by{" "}
					<a href='https://www.dylancollar.com' target='_blank'>
						Dylan Collar
					</a>{" "}
					to practise using and explore the web technologies React, Typescript,
					Vite and Styled Components.
				</Description>
			</Row>
			<Row>
				<Description>
					To play Minesweeper, create a board using the options below. Then
					click on a tile to reveal what is underneath. If you reveal a mine,
					you lose. If you reveal a number, that number indicates the number of
					mines around that tile. If you reveal a blank tile, all adjacent tiles
					will be revealed. Right click on a tile to flag it as a mine. The goal
					is to reveal all tiles that are not mines. Good luck!
				</Description>
			</Row>

			<Row>
				<StyledButton onClick={() => setTemplate("easy")}>Easy</StyledButton>
				<StyledButton onClick={() => setTemplate("medium")}>
					Medium
				</StyledButton>
				<StyledButton onClick={() => setTemplate("hard")}>Hard</StyledButton>
			</Row>
			<Row>
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

				<StyledButton onClick={createBoard}>Create Board</StyledButton>
			</Row>
			<Board
				grid={grid}
				setGrid={setGrid}
				status={status}
				setStatus={setStatus}
				time={time}
			/>
		</AppContainer>
	);
}

export default App;
