import  { useState, useEffect  } from 'react';
import {  loadModules  } from '@esri/react-arcgis';

const opts = {
    duration: 200
};

const template = {
   title: "Milepoint {mile}",
   actions:[],
  content: [
      {
        type: "fields",
        fieldInfos: [

          {
            fieldName: "lat",
            label: "Latitude",

          },
          {
            fieldName: "lon",
            label: "Longitude",

          },
	  {
            fieldName:"detections",
            label:"Detections"
          }
        ]
      }
    ]
};

const DetectionLayer = (props) => {
    const [layer, setLayer,] = useState(null)
    const [symbol, setSymbol,] = useState(null)
    const [curr,setCurr] = useState(null)

    useEffect(() => {

        const done = ()=>{ }
        if(layer != null)
        {

          let oldSelected = layer.graphics.items.find((x)=>{ return x.attributes.mile == props.data[curr] .mile } )
          oldSelected.set("symbol",symbol.blue)

          let newSelected = layer.graphics.items.find((x)=>{ return x.attributes.mile == props.data[props.curr].mile } )
          newSelected.set("symbol",symbol.red)
          setCurr(props.curr)
          props.view.goTo({target: newSelected, zoom: 17 }, opts)

          return done
        }

        loadModules(['esri/geometry/Point','esri/layers/GraphicsLayer', "esri/Graphic",
        "esri/symbols/SimpleMarkerSymbol","esri/widgets/BasemapGallery", "esri/widgets/DistanceMeasurement2D",
        "esri/widgets/AreaMeasurement2D"
         ])
          .then(([Point,GraphicLayer,Graphic,SimpleMarkerSymbol,BasemapGallery
                    ,DistanceMeasurement2D,AreaMeasurement2D  ]) => {
                    let activeWidget = null;
                    const  setActiveWidget =  (type)=> {
                    switch (type) {
                      case "distance":
                        activeWidget = new DistanceMeasurement2D({
                          view: props.view
                        });

                        // skip the initial 'new measurement' button
                        activeWidget.viewModel.newMeasurement();
                        document.getElementById("toprightbar").style.display = "none"
                        props.view.ui.add(activeWidget, "top-right");
                        setActiveButton(document.getElementById("distanceButton"));

                        break;
                      case "area":
                        activeWidget = new AreaMeasurement2D({
                          view: props.view
                        });

                        // skip the initial 'new measurement' button
                        activeWidget.viewModel.newMeasurement();
                        document.getElementById("toprightbar").style.display = "none"
                        props.view.ui.add(activeWidget, "top-right");
                        setActiveButton(document.getElementById("areaButton"));

                        break;
                      case null:
                        if (activeWidget) {
                          props.view.ui.remove(activeWidget);
                          activeWidget.destroy();
                          document.getElementById("toprightbar").style.display = "block"
                          activeWidget = null;
                        }
                        break;
                    }
                  }

                  const setActiveButton = (selectedButton) =>{
                    // focus the view to activate keyboard shortcuts for sketching
                    props.view.focus();
                    var elements = document.getElementsByClassName("active");
                    for (var i = 0; i < elements.length; i++) {
                      elements[i].classList.remove("active");
                    }
                    if (selectedButton) {
                      selectedButton.classList.add("active");
                    }
                  }
            props.view.ui.add("topbar", "bottom-left");
            props.view.ui.add("toprightbar", "top-right");
            const toggleGallery = ()=>{
              let state = basemapGallery.container.style.display

             basemapGallery.container.style.display = state == "none"?"block":"none"
             document.getElementById("toprightbar").style.display = state != "none"?"block":"none"
             setActiveWidget(null);

            }
            document.getElementById("basemap") .addEventListener("click", function() {
                    toggleGallery()
            })

            document.getElementById("distanceButton") .addEventListener("click", function() {
                    setActiveWidget(null);
                    if (!this.classList.contains("active")) {
                      setActiveWidget("distance");
                    } else {
                      setActiveButton(null);
                    } }
            );

            document .getElementById("areaButton") .addEventListener("click", function() {
                    setActiveWidget(null);
                    if (!this.classList.contains("active")) {
                      setActiveWidget("area");
                    } else {
                      setActiveButton(null);
                    }}
            );
            let basemapGallery = new BasemapGallery({
              view: props.view
             });

            props.view.ui.add(basemapGallery, {    position: "top-right"  });
            basemapGallery.container.style.display="none"
            basemapGallery.container.addEventListener("click",()=>{ toggleGallery()  })

            const dlayer = new GraphicLayer({

            });

            const rmark = new SimpleMarkerSymbol({
              color:   [255, 0, 0, 0.8] ,
              size: "8px",
              outline: {
                color: [ 255, 255, 255 ],
                width: 1
              }
            });
            const bmark = new SimpleMarkerSymbol({
              color: [0, 0, 255, 0.8],
              size: "8px",
              outline: {
                color: [ 255, 255, 255 ],
                width: 1
              }
            });
            setSymbol( { red:rmark,blue:bmark  })



            let current = null


            for(var t =0; t < props.data.length; t++)
            {
              let d = props.data[t]
              if(d.lat != -1 && d.lon != -1)
              {
                  let p = Point({latitude:d.lat,longitude:d.lon,spatialReference:{wkid: 3857}} )

                  // Create a graphic and add the geometry and symbol to it
                  let pointGraphic = new Graphic({
                    geometry: p,
                    symbol:  props.curr== t ? rmark : bmark,
                    popupTemplate: template,
                    attributes:d
                  });
                  if( props.curr== t) current = pointGraphic

                  dlayer.add(pointGraphic)
              }

            }

          props.map.add(dlayer);


          if(current != null)
          {

              props.view.goTo({target: current, zoom: 17 }, opts)
          }

          setLayer(   dlayer   )
          setCurr(props.curr)


        }).catch((err) => console.error(err));

        return  done
    }, [ props ])

    return null;
}
export default DetectionLayer;

