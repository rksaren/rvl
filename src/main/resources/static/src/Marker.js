import { Grid, GridColumn as Column,GridCell,GridToolbar   } from '@progress/kendo-react-grid'
import { DropDownList } from '@progress/kendo-react-dropdowns';
import React, {Fragment, PureComponent,Component } from "react";
import PropTypes from "prop-types";
import settings from "./settings"
import update, { extend } from 'immutability-helper';
const uuidv1 = require('uuid/v1');
const DropdownCell = (features,onchange)=>{
    return class DropCell extends Component {
     handleChange = (e) => {
        let propname = this.props.field
        let newval = update(this.props.dataItem,{[propname]:{$set: e.target.value.value }})
        onchange(newval);
     }
     render() {
        const { dataItem, field } = this.props;
        const dataValue = !dataItem[field]  ? '' : dataItem[field];

        return (
            <td>
                {
                  dataItem.inEdit ? 
                   (
                    <DropDownList
                        style={{ width: "100px" }}
                        onChange={this.handleChange.bind(this)}
                        value={features.find(c => c.id === dataValue)}
                        data={features}
                        textField={"name"}
                        dataField={"id"}
                    />
                   ) : (
                    dataValue.toString()
                   )
                }
            </td>
        );
     }

    }


}
const CommandCell = (remove)=>{

    return class CustomCell extends Component {
    render() {
        const value = this.props.dataItem[this.props.field];
        return (
            <td> <button className="k-button k-grid-remove-command"  onClick={()=> remove(this.props.dataItem)} ><span className="fa fa-trash"></span></button> </td>
        )
    }
}




}
    
class Marker extends PureComponent{

    constructor(props){
        super(props)
        this.state = {
            selected:null,inEdit:null,
            detections:this.props.image.markings || []       
        }
        this.canvas =React.createRef()
        //this.CommandCell = CommandCell(this.remove.bind(this))
    }
    save(){
        //let image = update(this.props.image,{markings:{$set:this.state.detections}})
        this.props.saveMarkings(this.state.detections)
    }    
    render(){
       // let done = ()=>{ return this.props.done(null)}
        let detections = this.getDetections()      
        return (
        <Fragment>
        <div style={{ float:"left", height:"600px",width:"800px)",position:"relative"} } > 
            <span className="fa fa-times" style={ {top:40,left:40,position:"absolute",fontSize:25,cursor:"pointer",color:"GREEN",zIndex:1 }}  onClick={this.props.done} ></span>
            <canvas width="800"  ref={this.canvas}></canvas>
         </div>
        <div style={{float:"left",width:"350px",height:"600px"}}>
            <Grid   data={detections} scrollable={"scrollable"} onRowClick={this.select.bind(this)}
               style={{height:"400px",width:"400px"}} selectedField="selected"  editField="inEdit"  >
                <GridToolbar>
                    <button
                        title="Save"
                        className="k-button k-primary"
                        onClick={this.save.bind(this)}
                    >Save
                        
                    </button>
                  </GridToolbar>  
                <Column width={"200px"} title={"Feature name"} field={"name"} cell={DropdownCell(this.props.features,this.add.bind(this)) } />
                <Column width={"100px"} title={"Action"} cell={CommandCell(this.remove.bind(this)) } />
            </Grid>

        </div>
        </Fragment>
        )   
    //

    }
    init(canvas){
        canvas.remove(...canvas.getObjects())
        let  width = this.width
        let  height = this.height
        let  fabric = window.fabric
        let selected = this.state.selected
        this.state.detections.forEach( (d)=>{

              let  rect = new fabric.Rect({
                left: d.centerx*width- d.width*width/2,
                top: d.centery*height- d.height*height/2,
                originX: 'left',
                originY: 'top',
                width: d.width*width,
                height: d.height*height,
                angle: 0,
                fill: 'rgba(255,0,0,0.5)',
                fillOpacity:0.2,
                selectable:true,
                transparentCorners: false,
                id:d.id
            });
            canvas.add(rect)  
            if(d.id === selected)
                canvas.setActiveObject(rect)
        })

    }    
    start(canvas){
        let  width = this.width
        let  height = this.height
        let  fabric = window.fabric
        this.playground = canvas
        let rect, isDown,isDrawn, origX, origY,count=0;
        canvas.on('mouse:down', (o)=>{
	        isDrawn = o.target
	        if(!isDrawn){
    	    var pointer = canvas.getPointer(o.e);
     
            isDown = true;
			origX = pointer.x;
            origY = pointer.y;
      
            rect = new fabric.Rect({
                left: origX,
                top: origY,
                originX: 'left',
                originY: 'top',
                width: 0,
                height: 0,
                angle: 0,
                fill: 'rgba(255,0,0,0.5)',
                fillOpacity:0.2,
                selectable:true,
                transparentCorners: false,
                id:uuidv1()
            });
        
            canvas.add(rect);
    		// isDrawn = canvas.getObjects().find((x)=>{ return x.width >2  && 	rect.isContainedWithinObject(x,true,true)     })
            }
            else //if(isDrawn)
            {
    	        console.log(isDrawn)
                //canvas.remove(rect)
                rect = undefined
                isDown = false
                //canvas.setActiveObject(isDrawn);
               // this.select({dataItem:{id:isDrawn.id}} )
            } 
        });
        canvas.on('mouse:move', (o)=>{
            if (isDrawn ) 
            {
    	        /*var pointer = canvas.getPointer(o.e);
        
      
                isDrawn.set({ left: (o.e.clientX - isDrawn.width / 2) });
       
       
                isDrawn.set({ top:(o.e.clientY - isDrawn.height / 2) });
      
                isDrawn.setCoords()
                canvas.renderAll();*/
    	        return;
            } 
            if (!isDown ) return;
    
            var pointer = canvas.getPointer(o.e);
    
            if(origX>pointer.x){
                rect.set({ left: Math.abs(pointer.x) });
            }
            if(origY>pointer.y){
                rect.set({ top: Math.abs(pointer.y) });
            }
    
            rect.set({ width: Math.abs(origX - pointer.x) });
            rect.set({ height: Math.abs(origY - pointer.y) });
    
    
            canvas.renderAll();
        });

        canvas.on('mouse:up', (o)=>{
            let curr = isDrawn || rect
            if(!curr)  return;
              
            if(curr.width > 2)
            {
                //curr.setCoords()
               // canvas.setActiveObject(curr);
                let center = curr.getCenterPoint()
                let obj = {id:curr.id,centerx:center.x/width,centery:center.y/height,
                        width:curr.width/width,height:curr.height/height}
                this.add(obj)
                
            }
            else  canvas.remove(curr);
            isDown = false;
            isDrawn = undefined;
            rect = undefined;

        });
        canvas.renderAll();
    }
    componentDidUpdate(){
        if(this.playground)
        this.init(this.playground)    
    }    
    componentDidMount(){
        this.width = 800
        const width = this.width
        const fabric = window.fabric
        const im = this.props.image       
        const canvas = new fabric.Canvas(this.canvas.current)
        const url =  settings.images+"/"+im.path
        fabric.Image.fromURL(url, (img)=> {
            let realwidth = img.naturalWidth || img.width;
            let realheight = img.naturalHeight || img.height;
            this.height= (realheight*width)/realwidth
            //let y = realheight/height
            img.scaleToWidth(width,false)
            canvas.setHeight(this.height)
            //img.set({scaleX:x,scaleY:y,width:width,height:height}) 
            canvas.setBackgroundImage(img)
            this.start(canvas)
            this.init(canvas)
        })
    }    
    remove(item){
        let idx = this.state.detections.indexOf(item)

        let newstate = update(this.state, { detections: { $splice: [[idx, 1]] } });
        this.setState(newstate)
        //this.playground
    }    
    getDetections(){
        return this.state.detections.map(
                        (item) => ({ ...item, 
                                    selected: item.id === this.state.selected,
                                    inEdit:item.id == this.state.inEdit }))

    }
    select(e){
        this.setState(update(this.state,{ selected: {$set:e.dataItem.id} ,inEdit:{$set:e.dataItem.id}}));
    }    
    add(obj){
        let newstate = null
        let present = this.state.detections.findIndex( (x) => { return x.id == obj.id})
        if(present != -1 )
        {
            //let updatedobj = update(this.state.detections[present],{$merge ,obj})
            newstate =  update(this.state, {                    
            detections: { [present]: { $merge: obj} } ,selected:{$set:obj.id},inEdit:{$set:obj.id}  });
        } 
        else
            newstate = update(this.state,{selected:{$set:obj.id},inEdit:{$set:obj.id},detections:{$push:[obj]}}) 
        this.setState(newstate)
        
   }  
}

export default Marker
