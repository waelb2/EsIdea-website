// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Bar } from 'react-chartjs-2'
import {Chart,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend} from 'chart.js'
import propTypes from 'prop-types'
Chart.register(
  CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend
)
const BarChart = ({options,data}) => {
  return (
    <Bar options={options} data={data}></Bar>
  )
}
BarChart.propTypes={
    options:propTypes.object.isRequired,
    data:propTypes.object.isRequired
}
export default BarChart