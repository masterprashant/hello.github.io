import { useState } from "react"
import { useStyles } from "./CategoryCss";
import { Avatar,IconButton,Grid,TextField,Button,FormControl,InputLabel,Select,MenuItem} from  "@mui/material"
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { postData } from "../services/FetchNodeService";
import Swal from "sweetalert2";



export default function CategoryInterface()
{  const[status,setStatus]=useState('')
   const[CategoryName,setCategoryName]=useState('')
   const[icon,setIcon]=useState({file:'/Assets/shopping-cart.png',bytes:''})
   const[error,setError]=useState('')
   const handlePicture=(event)=>{
    setIcon({file:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
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
    if(!icon.bytes)
    {
        handleError('icon','pls select image')
        isValid=false
    }

    return isValid

   }
   const handleClick=async()=>{
    if(validation())
    { var formData=new FormData()
        formData.append('category',CategoryName)
        formData.append('status',status)
        formData.append('icon',icon.bytes)
        var result=await postData('category/categorysubmit',formData)
          
    }
    if(result.status)
    {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: result.message,
            showConfirmButton: true,
           
          })
    }
    
   }
    const classes=useStyles()

    return(
    <div className={classes.container}>
        <div className={classes.box}>
        <Grid container spacing={3}>
            <Grid item xs={6}>
             <div className={classes.heading}>
              Add New Category
             </div>
            </Grid>
            <Grid item xs={12}>
                <TextField error={error.CategoryName?true:false} helperText={error.CategoryName} onFocus={()=>handleError('CategoryName',null)} onChange={(event)=>{setCategoryName(event.target.value)}} fullWidth variant="outlined" label="Category name"/>
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
             <input onFocus={()=>handleError('icon',null)} onChange={handlePicture} hidden accept="image/*" type="file" />
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
            <Grid item xs={6}>
              <Button onClick={handleClick} variant="contained" fullWidth>Submit</Button>
            </Grid>
            <Grid item xs={6}>
            <Button variant="contained" fullWidth>Reset</Button>
           </Grid>

        </Grid>
        </div>

    </div>
    )
}
