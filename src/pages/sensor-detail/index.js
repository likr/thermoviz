import React from 'react'
import * as d3 from 'd3'
import firebase from 'firebase'
import {config} from '../../firebase-init'
import {formatDate} from '../../date'
import styles from './sensor-detail.css'

const commandString = (userId, sensorId) => {
  const postUrl = `${config.databaseURL}/${userId}/values/${sensorId}.json`
  const sampleValue = {
    v: 42,
    t: {
      '.sv': 'timestamp'
    }
  }
  return `$ curl -X POST -d '${JSON.stringify(sampleValue)}' '${postUrl}'`
}

const range = (start, stop, step) => {
  const result = []
  if (step <= 0) {
    if (start === stop) {
      return [start]
    } else {
      return [start, stop]
    }
  }
  for (let i = start; i <= stop; i += step) {
    result.push(i)
  }
  return result
}

const Chart = ({values, svgWidth}) => {
  const svgHeight = 600
  const svgMargin = 20
  const xAxisHeight = 100
  const yAxisWidth = 60
  const contentWidth = svgWidth - svgMargin * 2 - yAxisWidth
  const contentHeight = svgHeight - svgMargin * 2 - xAxisHeight

  const timeScale = d3.scaleTime()
    .domain(d3.extent(values, (d) => +d.t))
    .range([0, contentWidth])
    .nice()
  const valueScale = d3.scaleLinear()
    .domain([0, 30])
    .range([contentHeight, 0])
    .nice()
  const colorScale = d3.scaleThreshold()
    .domain([10, 15, 20, 25, 30])
    .range([240, 192, 144, 96, 48, 0].map((v) => d3.hsl(v, 1, 0.5)))
  const xDomain = timeScale.domain()
  const xAxis = range(+xDomain[0], +xDomain[1], (+xDomain[1] - +xDomain[0]) / 10)
  const yDomain = valueScale.domain()
  const yAxis = range(yDomain[0], yDomain[1], 1)

  const line = d3.line()
    .x((d) => timeScale(d.t))
    .y((d) => valueScale(d.v))

  return <svg width={svgWidth} height={svgHeight}>
    <g transform={`translate(${svgMargin},${svgMargin})`}>
      <g transform={`translate(${yAxisWidth},0)`}>
        <line x1='0' y1='0' x2='0' y2={contentHeight} stroke='black' />
        <g>{
          yAxis.map((v) => {
            return <g key={v} transform={`translate(0,${valueScale(v)})`}>
              <line x1='-5' y1='0' x2='5' y2='0' stroke='black' />
              <text textAnchor='end' x='-8' y='5'>{v}</text>
            </g>
          })
        }</g>
      </g>
      <g transform={`translate(${yAxisWidth},${contentHeight})`}>
        <line x1='0' y1='0' x2={contentWidth} y2='0' stroke='black' />
        <g>{
          xAxis.map((v) => {
            return <g key={v} transform={`translate(${timeScale(v)},0)`}>
              <line x1='0' y1='-5' x2='0' y2='5' stroke='black' />
              <text textAnchor='end' x='-5' y='10' transform='rotate(-45)'>{formatDate(new Date(v))}</text>
            </g>
          })
        }</g>
      </g>
      <g transform={`translate(${yAxisWidth},0)`}>
        <g>{
          xAxis.map((v) => {
            const x = timeScale(v)
            return <line key={v} x1={x} y1='0' x2={x} y2={contentHeight} stroke='black' />
          })
        }</g>
        <g>{
          yAxis.map((v) => {
            const y = valueScale(v)
            return <line key={v} x1='0' y1={y} x2={contentWidth} y2={y} stroke='black' />
          })
        }</g>
        <path d={line(values)} fill='none' stroke='silver' strokeWidth='3' />
        <g>{
          values.map(({t, v}, i) => {
            return <circle key={i} r='5' cx={timeScale(t)} cy={valueScale(v)} fill={colorScale(v)} />
          })
        }</g>
      </g>
    </g>
  </svg>
}

export class SensorDetail extends React.Component {
  constructor () {
    super()

    this.state = {
      svgWidth: 0,
      sensor: {},
      sensorValues: {}
    }
  }

  componentDidMount () {
    const {user} = this.props
    const {sensorId} = this.props.params

    this.sensorRef = firebase.database().ref(`${user.uid}/sensors/${sensorId}`)
    this.sensorHandler = (snapshot) => {
      this.setState({
        sensor: snapshot.val()
      })
    }
    this.sensorRef
      .on('value', this.sensorHandler)

    this.sensorValuesRef = firebase.database().ref(`${user.uid}/values/${sensorId}`)
    this.sensorValuesHandler = (snapshot) => {
      this.setState({
        sensorValues: snapshot.val()
      })
    }
    this.sensorValuesRef
      .orderByChild('created')
      .limitToLast(500)
      .on('value', this.sensorValuesHandler)

    this.setState({
      svgWidth: this.refs.svgWrapper.clientWidth
    })

    this.resizeHandler = () => {
      this.setState({
        svgWidth: this.refs.svgWrapper.clientWidth
      })
    }
    window.addEventListener('resize', this.resizeHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeHandler)
    this.sensorRef.off('value', this.sensorHandler)
    this.sensorValuesRef.off('value', this.sensorValuesHandler)
  }

  render () {
    const {user} = this.props
    const {svgWidth, sensorValues} = this.state
    const values = Object.keys(sensorValues).map((key) => {
      return sensorValues[key]
    })
    values.sort((a, b) => a.t - b.t)

    return <div>
      <div>
        <h2>Usage</h2>
        <div className={`ui segment ${styles.command}`}>
          {commandString(user.uid, this.props.params.sensorId)}
        </div>
      </div>
      <div className='ui divider' />
      <div>
        <h2>Chart</h2>
        <div ref='svgWrapper'>
          <Chart values={values} svgWidth={svgWidth} />
        </div>
      </div>
    </div>
  }
}
