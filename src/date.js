const padding = (digits, length) => {
  return `${'0'.repeat(length)}${digits}`.slice(-length)
}

export const formatDate = (date) => {
  const time = `${padding(date.getHours(), 2)}:${padding(date.getMinutes(), 2)}`
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${time}`
}
