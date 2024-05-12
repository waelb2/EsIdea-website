// eslint-disable-next-line no-unused-vars
import React from 'react'
import {Doughnut } from 'react-chartjs-2'
import {Chart,ArcElement,Tooltip,Legend} from 'chart.js'
import propTypes from 'prop-types'
Chart.register(
Tooltip,Legend,ArcElement
)
const PieChart = ({options,data}) => {
  return (
    <Doughnut options={options} data={data}></Doughnut>
  )
}
PieChart.propTypes={
    options:propTypes.object.isRequired,
    data:propTypes.object.isRequired
}
export default PieChart