import { Gauge, gaugeClasses } from "@mui/x-charts";

function StatGuage({ statValue, statMax, statText, tierColor }) {
	const cappedValue = Math.min(statValue, statMax);
	return (
		<Gauge
			width={175}
			height={100}
			value={cappedValue}
			valueMin={0}
			valueMax={statMax}
			startAngle={-90}
			endAngle={90}
			sx={{
				[`& .${gaugeClasses.valueArc}`]: {
					fill: tierColor,
				},
			}}
			text={() => (statText === "$" ? `${statText}${statValue} ` : `${statValue}${statText} `)}
		/>
	);
}

export default StatGuage;
