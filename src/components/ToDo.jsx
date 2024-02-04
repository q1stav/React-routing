import React, { useState } from 'react';
import styles from '../styles/ToDo.module.css'
import { Link } from 'react-router-dom';


export const ToDo=({id,title,onClickDelete,rerefrestToDoList})=>{
 

    return(
    <div className={styles.todo} >
      <Link to={`task/${id}`}>{title}</Link>
        </div>
        )
}