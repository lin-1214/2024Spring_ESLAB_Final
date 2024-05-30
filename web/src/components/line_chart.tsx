// LineChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register the required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
interface LineChartProps {
    data: number[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
    const chartData = {
        labels: data.map((_, index) => index), // Assuming data is a sequence of numbers
        datasets: [
            {
                label: "Data Sequence",
                data: data,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Sequence of Data",
            },
        },
        scales: {
            x: {
                ticks: {
                    maxTicksLimit: 3,
                    minTicksLimit: 0,
                },
            },
            y: {
                max: 360,
                min: 0,
                ticks: {
                    // maxTicksLimit: 360,
                    // minTicksLimit: 0,
                },
            },
        },
    };

    // options.plugins = options.plugins.legend

    return <Line data={chartData} options={options} />;
};

export default LineChart;
