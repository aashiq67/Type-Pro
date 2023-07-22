import React from 'react'
import { Typography } from '@mui/material'

const Logo = () => {
  return (
    <Typography sx={logoStyle}>TypeNinja</Typography>
  )
}

const logoStyle = {
    fontFamily: 'Helvetica, Arial, sans - serif',
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#af1f1f',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    textShadow: '2px 2px 2px rgba(0, 0, 0, 0.3)',
}

export default Logo