import styled from "styled-components";
import { TimerStateContext } from "../TimerProvider";
import { StatusType } from "../../../types";
import { useContext } from "react";

const StatusBarStyle = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 50px;
`;

const StatusBar = ({ status }: { status: StatusType }) => {
	const { timer } = useContext(TimerStateContext);

	console.log("statusbar");

	return (
		<StatusBarStyle>
			{status === "playing" || status === "waiting" ? (
				<p>
					Timer: {timer > 60 && `${Math.floor(timer / 60)}m `}
					{timer % 60}s
				</p>
			) : status === "gameover" ? (
				<p>Game over</p>
			) : status === "win" ? (
				<p>You Win!!! Time: {timer}s</p>
			) : null}
		</StatusBarStyle>
	);
};

export default StatusBar;
