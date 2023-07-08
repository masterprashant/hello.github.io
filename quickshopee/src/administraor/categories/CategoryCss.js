import { makeStyles } from "@mui/styles"


export const useStyles=makeStyles({
    container:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        width:'100vw',
        height:'100vh',
        background:'pink',


    },
    box:{
       width:'70%',
       height:'auto',
       background:'white',
       padding:10
    },
    heading:{
        fontSize:20,
        fontWeight:600,
        
    },
    displaybox:{
        margin:50
    },
    
});

