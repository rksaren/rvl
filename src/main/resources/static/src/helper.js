import settings from "./settings";
import moment from "moment"

export  const compareUTCDate  = (a,b)=>{
  let adate = moment.utc(a,settings.dataformat)
  let bdate = moment.utc(b,settings.dataformat)

  return bdate.diff(adate)
}
export const SetByPath = (obj, path, value) =>{
  let parts = path.split('.');
  let o = obj;
  if (parts.length > 1) {
    for (let i = 0; i < parts.length - 1; i++) {
      if (!o[parts[i]])
        o[parts[i]] = {};
      o = o[parts[i]];
    }
  }

  o[parts[parts.length - 1]] = value;
}
export const LocalToUTC = (datestr) =>{
    let date = moment(datestr, settings.dataformat)
    let utcdate = date.utc()

   return utcdate.format(settings.dataformat);
}
export const UTCToLocal = (datestr)=>{

    let date = moment.utc(datestr,settings.dataformat)

    let localdate = date.local()

  return localdate.format(settings.dataformat)

}
export const getLocalNow = ()=>{
  let date = moment()
  return date.format(settings.dataformat)
}

export const getImage = (item) =>{
  let imgsrc = item.old.trim()
  if(item.type === "curr") {
    imgsrc = item.curr.trim()
    let needWork = imgsrc.indexOf("_proc") == -1
    if(needWork){
    let q = imgsrc.split(".")
    //q = q.splice(0,1)
    q.pop()
    imgsrc = q.join(".")+ "_proc.jpg"
    }
  }
  imgsrc = settings.images+"/"+ imgsrc
  return imgsrc
}
