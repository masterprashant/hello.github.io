import { useState,useEffect } from "react";
import { useStyles } from "./CategoryCss";
import { getData,serverURL } from "../services/FetchNodeService";
import MaterialTable from "@material-table/core";

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Avatar,IconButton,Grid,TextField,Button,FormControl,InputLabel,Select,MenuItem} from  "@mui/material"
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { postData } from "../services/FetchNodeService";
import Swal from "sweetalert2";

export default function DisplayAllCategory(){
 
    const[categorylist,setCategoryList]=useState([])
    const[open,setOpen]=useState(false)
    const[status,setStatus]=useState('')
    const[CategoryName,setCategoryName]=useState('')
    const[categoryid,setCategoryId]=useState('')
    const[icon,setIcon]=useState({file:'/Assets/shopping-cart.png',bytes:''})
    const[oldicon,setOldIcon]=useState('')
    const[error,setError]=useState('')
    const[btnstate,setButtonState]=useState(false)

    const handlePicture=(event)=>{
      setIcon({file:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
      setButtonState(true)
    }
    const handleError=(input,value)=>{
      setError((prev)=>({...prev,[input]:value}))
  
     }
    const validation=()=>{
      var isValid=true
      if(!CategoryName)
      {
      handleError('CategoryName','pls input category name')
       isValid=false
      }
      if(!status)
      {
          handleError('status','pls input status')
          isValid=false
      }
      /*if(!icon.bytes)
      {
          handleError('icon','pls select image')
          isValid=false
      }*/

  
      return isValid
  
     }
    const handleCancel=()=>{
      setIcon({file:`${serverURL}/images/${oldicon}`,bytes:''})
      setButtonState(false)
     }
     
    const handleIcon=async()=>{
      setButtonState(false)
      setOpen(false)
      var formData=new FormData()
      formData.append('categoryid',categoryid)
      formData.append('icon',icon.bytes)
      var result= await postData('category/category_edit_icon',formData)
      if(result.status)
      {
          Swal.fire({
              position: 'center',
              icon: 'success',
              title: result.message,
              showConfirmButton: true,
             
            })
            FetchCategoryList()
          }
         
      
     }
     const handleEdit=async()=>{
      setOpen(false)
      if(validation())
      { 
        var body={
        categoryid:categoryid,categoryname:CategoryName,status:status}
          var result=await postData('category/category_edit',body)     
      }
      if(result.status)
      {
          Swal.fire({
              position: 'center',
              icon: 'success',
              title: result.message,
              showConfirmButton: true,
             
            })
            FetchCategoryList()
      }
      
     }
     const handleDelete=async()=>{
       setOpen(false)
      if(validation())
      { 
        var body={
        categoryid:categoryid}
          var result=await postData('category/category_delete',body)     
      }
      if(result.status)
      {
          Swal.fire({
              position: 'center',
              icon: 'success',
              title: result.message,
              showConfirmButton: true,
             
            })
            FetchCategoryList()
      }
      
     }
     const DisplayCategoryForm=()=>{
      const classes=useStyles()

    return(
        <div className={classes.againbox}>
        <Grid container spacing={3}>
            <Grid item xs={6}>
             <div className={classes.heading}>
              Add New Category
             </div>
            </Grid>
            <Grid item xs={12}>
                <TextField error={error.CategoryName?true:false} helperText={error.CategoryName} onFocus={()=>handleError('CategoryName',null)} value={CategoryName} onChange={(event)=>{setCategoryName(event.target.value)}} fullWidth variant="outlined" label="Category name"/>
            </Grid>
            <Grid item xs={12}>
            <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Status</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={status}
    label="status"
    onChange={(event)=>{setStatus(event.target.value)}} error={error.status?true:false}
    onFocus={()=>handleError('status',null)}
  >
    <MenuItem value='Continue'>Countinue</MenuItem>
    <MenuItem value='Discountinue'>Discountinue</MenuItem>
    <MenuItem value='popular'>Popular</MenuItem>
  </Select>
</FormControl>
     <div className={classes.massage}>
    {error.status}
    </div>
            </Grid>
            <Grid item xs={6}>
            <IconButton color="primary" aria-label="upload picture" component="label">
             <input  onChange={handlePicture}  hidden accept="image/*" type="file" />
            <PhotoCamera />
           </IconButton>
           <div className={classes.massage}>
             {error.icon}
            </div>

            </Grid>
            <Grid item xs={6}>
        <Avatar
         alt="Icon "
        src={icon.file}
         style={{ width: 58, height: 58 }}
        />
            </Grid>
            <Grid item xs={4}>
              <Button onClick={handleEdit} variant="contained" fullWidth>Edit</Button>
            </Grid>
            <Grid item xs={4}>
            <Button onClick={handleDelete} variant="contained" fullWidth>Delete</Button>
           </Grid>
           <Grid item xs={4}>
            {btnstate?<>
            <Button onClick={handleIcon}>Save</Button>
            <Button onClick={handleCancel}>cancel</Button></>:<></>}

           </Grid>

        </Grid>
        </div>
    )
     }
    const FetchCategoryList=async()=>
    {
        var result=await getData('category/category_list')
        setCategoryList(result.data)
    }
    const handleClose=()=>{
      setOpen(false)
    }
    const handleOpen=(rowData)=>{
      
      setCategoryId(rowData.categoryid)
      setCategoryName(rowData.categoryname)
      setStatus(rowData.status)
      setIcon({file:`${serverURL}/images/${rowData.icon}`,bytes:''})
      setOldIcon(rowData.icon)
      setOpen(true)
    }

    useEffect(function(){
        FetchCategoryList()
    },[])
    
    const CategoryDialog=()=>{
      return(<div>
        <Dialog
        open={open}
        onClose={handleClose}
        >
          <DialogContent>
            {DisplayCategoryForm()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>close</Button>
          </DialogActions>

        </Dialog>

      </div>)
    }

    function ShowCategory() {
        return (
          <MaterialTable style={{margin:50}}
            title="Category table"
            columns={[
             {title:'Category ID',field:'categoryid'},
             {title:'Category Name',field:'categoryname'},
             {title:'Status',field:'status'},
             {title:'icon',field:'icon',
                render:rowData=><Avatar src={`${serverURL}/images/${rowData.icon}`} style={{width:50}} variant="rounded"/>}
         ]}
            data={categorylist}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Save User',
                onClick: (event, rowData) =>handleOpen(rowData)
              }
            ]}
          />
        )
      }

    const classes=useStyles()
    return(
    <div className={classes.displaybox}>

    {ShowCategory()}
    {CategoryDialog()}
    
    </div>)
}