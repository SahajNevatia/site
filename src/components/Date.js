"use client"
import React from 'react'
import { format, parseISO } from "date-fns";


export default function Date({date}) {
  return (
    <>{format(parseISO(date), "dd MMM yyyy")}</>
  )
}
